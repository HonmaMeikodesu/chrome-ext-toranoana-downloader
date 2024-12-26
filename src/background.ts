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
        const { task, taskList } = payload;

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
                task && insertToTaskList(task);
                break;
            case "remove":
                task && removeFromTaskList(task);
                break;
        }
    }

    (async () => {
        if (EventMessageTypeGuard<EventType.PARSE_BOOK>(message, EventType.PARSE_BOOK)) {
            const { bookTitle, bookUrl } = message.payload;
            const taskList = await getTaskList();
            const book = taskList.find(item => item.bookUrl === bookUrl);
            if (book) {
                book.status = "pending";
                delete book.errorPageList;
            } else {
                taskList.push({ bookUrl, bookTitle, status: "pending" });
            }
            setTaskList(taskList);
            // FIXME retry scenario
            await processBook(bookUrl, sender.tab!, { pageNums: message.payload.pageList });
        }
    })()
})

localEventBus.on(LocalEventType.START_DOWNLOAD, async (message: LocalEventMessage<LocalEventType.START_DOWNLOAD>) => {
    const { bookUrl, bookTitle } =  message.payload
    const taskList = await getTaskList();
    const book = taskList.find(item => item.bookUrl === bookUrl);
    if (book) {
        book.status = "downloading";
        book.bookTitle = bookTitle;
    } else {
        taskList.push({ bookUrl, bookTitle, status: "downloading" });
    }
    setTaskList(taskList);
})

localEventBus.on(LocalEventType.DOWNLOAD_COMPLETE, async (message: LocalEventMessage<LocalEventType.DOWNLOAD_COMPLETE>) => {
    const { bookUrl, bookTitle } = message.payload;
    const taskList = await getTaskList();
    const book = taskList.find(item => item.bookUrl === bookUrl);
    if (book) {
        book.status = "done"
        book.bookTitle = bookTitle;
    } else {
        console.warn("download complete but not found in task list");
        taskList.push({ bookUrl, bookTitle, status: "done" })
    }
    setTaskList(taskList);
})

localEventBus.on(LocalEventType.DOWNLOAD_ERROR, async (message: LocalEventMessage<LocalEventType.DOWNLOAD_ERROR>) => {
    const { bookTitle, bookUrl, errorPageList } = message.payload;
    const taskList = await getTaskList();
    const book = taskList.find(item => item.bookUrl === bookUrl);
    if (book) {
        book.status = "error";
        book.bookTitle = bookTitle;
        book.errorPageList = errorPageList;
    } else {
        console.warn("download complete but not found in task list");
        taskList.push({ bookUrl, bookTitle, status: "done" })
    }
    setTaskList(taskList);
})