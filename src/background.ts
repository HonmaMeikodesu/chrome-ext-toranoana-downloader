import { AppConfig, Task } from "./types.js";
import { getIdFromBookUrl } from "./utils/common.js";
import { EventMessage, EventMessageTypeGuard, EventType } from "./utils/evt.js";
import i18n from "./utils/i18n.js";
import { processBook } from "./utils/process.js";
import {
    getTaskList,
    setTaskList,
    insertToTaskList,
    removeFromTaskList,
    initTaskDB,
    getLocalStorageItem,
    setLocalStorageItem,
    updateTask
} from "./utils/storageManage.js";

const KEEP_ALIVE_INTERVAL_MS = 25_000;
const activeBookJobs = new Map<string, Promise<void>>();
let keepAliveTimer: ReturnType<typeof setInterval> | undefined;

const workerReady = recoverInterruptedTasks().catch((error) => {
    console.error("[Toranoana Downloader] Could not recover interrupted tasks.", error);
});

chrome.runtime.onInstalled.addListener(() => {
    void initTaskDB().catch((error) => {
        console.error("[Toranoana Downloader] Could not initialize the task database.", error);
    });
});

chrome.runtime.onMessage.addListener((message: EventMessage<any>, sender, sendResponse) => {
    if (EventMessageTypeGuard<EventType.REDUCE_TASK_LIST>(message, EventType.REDUCE_TASK_LIST)) {
        const { action, payload } = message.payload;
        const { taskList } = payload;

        void workerReady.then(async () => {
            switch (action) {
                case "get":
                    sendResponse(await getTaskList());
                    break;
                case "set":
                    if (taskList) await setTaskList(taskList);
                    break;
                case "insert":
                    if (taskList) await insertToTaskList(taskList);
                    break;
                case "remove":
                    if (taskList) await removeFromTaskList(taskList);
                    break;
            }
        }).catch((error) => {
            console.error("[Toranoana Downloader] Task-list operation failed.", error);
            if (action === "get") sendResponse([]);
        });

        return action === "get";
    }

    if (EventMessageTypeGuard<EventType.READ_APP_CONFIG>(message, EventType.READ_APP_CONFIG)) {
        void getLocalStorageItem("appConfig").then(sendResponse);
        return true;
    }

    if (EventMessageTypeGuard<EventType.GET_DISCLAIMER_AGREED>(message, EventType.GET_DISCLAIMER_AGREED)) {
        void getLocalStorageItem("disclaimerAgreed").then(sendResponse);
        return true;
    }

    if (EventMessageTypeGuard<EventType.I18N>(message, EventType.I18N)) {
        sendResponse(i18n.t(message.payload));
        return;
    }

    if (EventMessageTypeGuard<EventType.PARSE_BOOK>(message, EventType.PARSE_BOOK)) {
        void workerReady
            .then(() => queueBookDownload(message.payload))
            .catch((error) => console.error("[Toranoana Downloader] Could not queue the book.", error));
        return;
    }

    if (EventMessageTypeGuard<EventType.OPEN_POPUP>(message, EventType.OPEN_POPUP)) {
        void chrome.action.openPopup().catch((error) => {
            console.error("[Toranoana Downloader] Could not open the popup.", error);
        });
        return;
    }

    if (EventMessageTypeGuard<EventType.SET_APP_CONFIG>(message, EventType.SET_APP_CONFIG)) {
        void setLocalStorageItem("appConfig", message.payload).then(() => {
            onSetAppConfig(message.payload);
        });
        return;
    }

    if (EventMessageTypeGuard<EventType.DISCLAIMER_AGREED>(message, EventType.DISCLAIMER_AGREED)) {
        void setLocalStorageItem("disclaimerAgreed", true);
    }
});

function queueBookDownload(payload: EventMessage<EventType.PARSE_BOOK>["payload"]) {
    const { bookTitle, bookUrl, pageList } = payload;
    const id = getIdFromBookUrl(bookUrl);

    if (activeBookJobs.has(id)) {
        console.info(`[Toranoana Downloader] Ignored a duplicate task for book ${id}.`);
        return;
    }

    const job = runBookDownload(id, bookUrl, bookTitle, pageList);
    activeBookJobs.set(id, job);
    updateKeepAliveTimer();

    void job.finally(() => {
        if (activeBookJobs.get(id) === job) {
            activeBookJobs.delete(id);
        }
        updateKeepAliveTimer();
    });
}

async function runBookDownload(id: string, bookUrl: string, initialBookTitle: string, requestedPages?: number[]) {
    try {
        await updateTask(id, (currentTask) => ({
            id,
            bookUrl,
            bookTitle: initialBookTitle || currentTask?.bookTitle || "",
            status: "pending",
            pageList: requestedPages,
            completedPageList: []
        }));

        const result = await processBook(bookUrl, {
            pageNums: requestedPages,
            onStart: async ({ bookTitle, pageList }) => {
                await updateTask(id, (currentTask) => ({
                    ...(currentTask ?? { id, bookUrl, bookTitle }),
                    bookUrl,
                    bookTitle,
                    status: "downloading",
                    pageList,
                    completedPageList: [],
                    errorPageList: undefined
                }));
            },
            onPageComplete: async (pageNum) => {
                await updateTask(id, (currentTask) => {
                    const completedPages = new Set(currentTask?.completedPageList ?? []);
                    completedPages.add(pageNum);

                    return {
                        ...(currentTask ?? { id, bookUrl, bookTitle: initialBookTitle }),
                        status: "downloading",
                        completedPageList: [...completedPages].sort((a, b) => a - b)
                    };
                });
            }
        });

        await updateTask(id, (currentTask) => {
            const baseTask: Task = {
                ...(currentTask ?? { id, bookUrl, bookTitle: result.bookTitle }),
                bookUrl,
                bookTitle: result.bookTitle,
                status: result.errorPageList.length ? "error" : "done"
            };

            if (result.errorPageList.length) {
                baseTask.errorPageList = result.errorPageList;
                baseTask.pageList = result.pageList;
                return baseTask;
            }

            delete baseTask.errorPageList;
            delete baseTask.pageList;
            delete baseTask.completedPageList;
            return baseTask;
        });
    } catch (error) {
        console.error("[Toranoana Downloader] Book download failed.", error);

        try {
            await updateTask(id, (currentTask) => recoverTaskAfterInterruption(currentTask ?? {
                id,
                bookUrl,
                bookTitle: initialBookTitle,
                status: "pending",
                pageList: requestedPages,
                completedPageList: []
            }));
        } catch (storageError) {
            console.error("[Toranoana Downloader] Could not persist the failed task.", storageError);
        }
    }
}

async function recoverInterruptedTasks() {
    await initTaskDB();
    const taskList = await getTaskList();

    for (const task of taskList) {
        if (task.status !== "pending" && task.status !== "downloading") {
            continue;
        }
        await updateTask(task.id, (currentTask) => recoverTaskAfterInterruption(currentTask ?? task));
    }
}

function recoverTaskAfterInterruption(task: Task): Task {
    if (!task.pageList) {
        return { ...task, status: "fatal" };
    }

    const completedPages = new Set(task.completedPageList ?? []);
    const remainingPages = task.pageList.filter((pageNum) => !completedPages.has(pageNum));

    if (remainingPages.length) {
        return {
            ...task,
            status: "error",
            errorPageList: remainingPages
        };
    }

    const completedTask = { ...task, status: "done" as const };
    delete completedTask.errorPageList;
    delete completedTask.pageList;
    delete completedTask.completedPageList;
    return completedTask;
}

function updateKeepAliveTimer() {
    if (activeBookJobs.size && !keepAliveTimer) {
        keepAliveTimer = setInterval(() => {
            void chrome.runtime.getPlatformInfo().catch(() => undefined);
        }, KEEP_ALIVE_INTERVAL_MS);
    } else if (!activeBookJobs.size && keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = undefined;
    }
}

function onSetAppConfig(appConfig: AppConfig) {
    const { locale } = appConfig || {};
    locale && (i18n.locale = locale);
}
