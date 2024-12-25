import { EventMessage, EventMessageTypeGuard, EventType } from "./utils/evt";
import { processBook } from "./utils/process";
import { getTaskList, setTaskList, insertToTaskList, removeFromTaskList, initTaskDB } from "./utils/storageManage";

chrome.runtime.onInstalled.addListener(async () => {
    await initTaskDB();
})

chrome.runtime.onMessage.addListener(async (message: EventMessage<any>, sender, sendResponse) => {

    const { bookUrl, bookTitle } = (message?.payload || {}) as unknown as EventMessage<EventType.START_DOWNLOAD>["payload"] || {};

    if (EventMessageTypeGuard<EventType.REDUCE_TASK_LIST>(message, EventType.REDUCE_TASK_LIST)) {
        const { action, payload } = message.payload;
        const { task, taskList } = payload;
        let emitSyncTaskFlag = false;
        switch (action) {
            case "set":
                taskList && await setTaskList(taskList);
                emitSyncTaskFlag = true;
                break;
            case "get":
                sendResponse(await getTaskList());
                return true;
            case "insert":
                task && await insertToTaskList(task);
                emitSyncTaskFlag = true;
                break;
            case "remove":
                task && await removeFromTaskList(task);
                emitSyncTaskFlag = true;
                break;
        }

        if (emitSyncTaskFlag) {
            chrome.runtime.sendMessage({ type: EventType.SYNC_TASK_LIST });
        }
    }

    if (EventMessageTypeGuard<EventType.PARSE_BOOK>(message, EventType.PARSE_BOOK)) {
        const taskList = await getTaskList();
        const book = taskList.find(item => item.bookUrl === bookUrl);
        if (book) {
            book.status = "pending";
            delete book.errorPageList;
        } else {
            taskList.push({ bookUrl, bookTitle, status: "pending" });
        }
        setTaskList(taskList);
        await processBook(bookUrl, sender.tab!, { pageNums: message.payload.pageList });
    }

    if (EventMessageTypeGuard<EventType.START_DOWNLOAD>(message, EventType.START_DOWNLOAD)) {
        const taskList = await getTaskList();
        const book = taskList.find(item => item.bookUrl === bookUrl);
        if (book) {
            book.status = "downloading";
            book.bookTitle = bookTitle;
        } else {
            taskList.push({ bookUrl, bookTitle, status: "downloading" });
        }
        setTaskList(taskList);
    }

    if (EventMessageTypeGuard<EventType.DOWNLOAD_COMPLETE>(message, EventType.DOWNLOAD_COMPLETE)) {
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
    }

    if (EventMessageTypeGuard<EventType.DOWNLOAD_ERROR>(message, EventType.DOWNLOAD_ERROR)) {
        const taskList = await getTaskList();
        const book = taskList.find(item => item.bookUrl === bookUrl);
        if (book) {
            book.status = "error";
            book.bookTitle = bookTitle;
            book.errorPageList = message.payload.errorPageList;
        } else {
            console.warn("download complete but not found in task list");
            taskList.push({ bookUrl, bookTitle, status: "done" })
        }
        setTaskList(taskList);
    }
})