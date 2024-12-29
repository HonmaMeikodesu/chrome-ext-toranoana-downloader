import { getIdFromBookUrl } from "./utils/common";
import { EventMessage, EventMessageTypeGuard, EventType } from "./utils/evt";
import { localEventBus, LocalEventMessage, LocalEventType } from "./utils/localEventBus";
import { processBook } from "./utils/process";
import { getTaskList, setTaskList, insertToTaskList, removeFromTaskList, initTaskDB } from "./utils/storageManage";

chrome.runtime.onInstalled.addListener(async () => {
    await initTaskDB();
})

chrome.runtime.onMessage.addListener((message: EventMessage<any>, sender, sendResponse) => {

    if (EventMessageTypeGuard<EventType.REDUCE_TASK_LIST>(message, EventType.REDUCE_TASK_LIST)) {
        const { action, payload } = message.payload;
        const { taskList } = payload;

        switch (action) {
            case "get":
                getTaskList().then((taskList) => {
                    sendResponse(taskList);
                });
                return true;
            case "set":
                taskList && setTaskList(taskList);
                break;
            case "insert":
                taskList && insertToTaskList(taskList);
                break;
            case "remove":
                taskList && removeFromTaskList(taskList);
                break;
        }
    }

    (async () => {
        if (EventMessageTypeGuard<EventType.PARSE_BOOK>(message, EventType.PARSE_BOOK)) {
            const { bookTitle, bookUrl } = message.payload;
            const taskList = await getTaskList();
            const id = getIdFromBookUrl(bookUrl);
            const book = taskList.find(item => item.id === id);
            if (book) {
                book.status = "pending";
                delete book.errorPageList;
            } else {
                taskList.push({ id, bookUrl, bookTitle, status: "pending" });
            }
            setTaskList(taskList);
            try {
                await processBook(bookUrl, { pageNums: message.payload.pageList });
            } catch (e) {
                console.error(e);
                const downloadFatalMsg: LocalEventMessage<LocalEventType.DOWNLOAD_FATAL> = {
                    payload: {
                        bookUrl,
                        bookTitle
                    }
                };
                localEventBus.emit(LocalEventType.DOWNLOAD_FATAL, downloadFatalMsg);
            }
        }

        if (EventMessageTypeGuard<EventType.OPEN_POPUP>(message, EventType.OPEN_POPUP)) {
            chrome.action.openPopup();
        }
    })()
})

localEventBus.on(LocalEventType.START_DOWNLOAD, async (message: LocalEventMessage<LocalEventType.START_DOWNLOAD>) => {
    const { bookUrl, bookTitle } =  message.payload
    const id = getIdFromBookUrl(bookUrl);
    const taskList = await getTaskList();
    const book = taskList.find(item => item.id === id);
    if (book) {
        book.status = "downloading";
        book.bookTitle = bookTitle;
    } else {
        taskList.push({ id, bookUrl, bookTitle, status: "downloading" });
    }
    setTaskList(taskList);
})

localEventBus.on(LocalEventType.DOWNLOAD_COMPLETE, async (message: LocalEventMessage<LocalEventType.DOWNLOAD_COMPLETE>) => {
    const { bookUrl, bookTitle } = message.payload;
    const id = getIdFromBookUrl(bookUrl);
    const taskList = await getTaskList();
    const book = taskList.find(item => item.id === id);
    if (book) {
        book.status = "done"
        book.bookTitle = bookTitle;
    } else {
        taskList.push({ id, bookUrl, bookTitle, status: "done" })
    }
    setTaskList(taskList);
})

localEventBus.on(LocalEventType.DOWNLOAD_ERROR, async (message: LocalEventMessage<LocalEventType.DOWNLOAD_ERROR>) => {
    const { bookTitle, bookUrl, errorPageList } = message.payload;
    const id = getIdFromBookUrl(bookUrl);
    const taskList = await getTaskList();
    const book = taskList.find(item => item.id === id);
    if (book) {
        book.status = "error";
        book.bookTitle = bookTitle;
        book.errorPageList = errorPageList;
    } else {
        taskList.push({ id, bookUrl, bookTitle, status: "error", errorPageList })
    }
    setTaskList(taskList);
})

localEventBus.on(LocalEventType.DOWNLOAD_FATAL, async (message: LocalEventMessage<LocalEventType.DOWNLOAD_FATAL>) => {
    const { bookTitle, bookUrl } = message.payload;
    const id = getIdFromBookUrl(bookUrl);
    const taskList = await getTaskList();
    const book = taskList.find(item => item.id === id);
    if (book) {
        book.status = "fatal";
        book.bookTitle = bookTitle;
    } else {
        taskList.push({ id, bookUrl, bookTitle, status: "fatal" })
    }
    setTaskList(taskList);
})