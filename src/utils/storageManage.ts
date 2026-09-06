// don't know how to implement reader and writer locks here, so let's just ask IndexedDB to do this favor
import { AppConfig, Task } from "../types.js";
import { openDB, IDBPDatabase } from "idb";
import { EventType } from "./evt.js";

const DB_NAME = "toranoana-db";
const TASK_STORE_NAME = "taskStore";
const DB_VERSION = 2;

export async function initTaskDB() {
    await getDbHandle();
}

let dbHandlePromise: Promise<IDBPDatabase<any>> | undefined;

const getDbHandle = async () => {
    if (!dbHandlePromise) {
        dbHandlePromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(TASK_STORE_NAME)) {
                    db.createObjectStore(TASK_STORE_NAME, { keyPath: "id" });
                }
            }
        });
    }
    return dbHandlePromise;
}

function notifyTaskListChanged() {
    void chrome.runtime.sendMessage({ type: EventType.SYNC_TASK_LIST }).catch(() => undefined);
}

export async function getTaskList(): Promise<Task[]> {
    const db = await getDbHandle();
    const tasks = await db.transaction(TASK_STORE_NAME, "readonly").store.getAll();
    return tasks || [];
}

export async function setTaskList(taskList: Task[]) {
    const db = await getDbHandle();
    const transaction = db.transaction(TASK_STORE_NAME, "readwrite");
    await transaction.store.clear();
    for (const task of taskList) {
        await transaction.store.put(task);
    }
    await transaction.done;
    notifyTaskListChanged();
}

export async function insertToTaskList(tasks: Task[]) {
    const db = await getDbHandle();
    const transaction = db.transaction(TASK_STORE_NAME, "readwrite");
    for (const task of tasks) {
        await transaction.store.put(task);
    }
    await transaction.done;
    notifyTaskListChanged();
}

export async function removeFromTaskList(tasks: Task[]) {
    const db = await getDbHandle();
    const transaction = db.transaction(TASK_STORE_NAME, "readwrite");
    for (const task of tasks) {
        await transaction.store.delete(task.id);
    }
    await transaction.done;
    notifyTaskListChanged();
}

export async function updateTask(id: string, updater: (currentTask: Task | undefined) => Task | undefined) {
    const db = await getDbHandle();
    const transaction = db.transaction(TASK_STORE_NAME, "readwrite");
    const currentTask: Task | undefined = await transaction.store.get(id);
    const nextTask = updater(currentTask);

    if (nextTask) {
        await transaction.store.put(nextTask);
    } else {
        await transaction.store.delete(id);
    }

    await transaction.done;
    notifyTaskListChanged();
    return nextTask;
}


/** -------------------------Local Storage------------------------------- */

type LocalStorageItems = {
    appConfig: string;
    disclaimerAgreed: boolean;
};

export async function getLocalStorageItem<T extends keyof LocalStorageItems>(item: T): Promise<T extends "appConfig" ? AppConfig : boolean> {
    switch (item) {
        case "appConfig":
            try {
                return JSON.parse((await chrome.storage.local.get<LocalStorageItems>(["appConfig"])).appConfig || "{}");
            } catch (e) {
                console.error(e);
                return {} as any
            }
        case "disclaimerAgreed":
            return (await chrome.storage.local.get<LocalStorageItems>(["disclaimerAgreed"])).disclaimerAgreed as any
        default:
            throw new Error("Unknown item");
    }
}

export async function setLocalStorageItem<T extends keyof LocalStorageItems>(key: T, value: T extends "appConfig" ? AppConfig : boolean) {
    switch (key) {
        case "appConfig":
            {
                const appConfig = value as AppConfig;
                return await chrome.storage.local.set<LocalStorageItems>({ appConfig: JSON.stringify(appConfig) })
            }
        case "disclaimerAgreed":
            {
                const disclaimerAgreed = value as boolean;
                return await chrome.storage.local.set<LocalStorageItems>({ disclaimerAgreed })
            }
        default:
            throw new Error("Unknown item");
    }
}
