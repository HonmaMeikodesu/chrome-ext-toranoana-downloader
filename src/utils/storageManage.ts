// don't know how to implement reader and writer locks here, so let's just ask IndexedDB to do this favor
import { AppConfig, Task } from "../types.js";
// @ts-expect-error ignore this ts error, this module INDEED has a CJS entry, checkout out its main field in package.json
import { openDB, IDBPDatabase } from "idb";
import { EventType } from "./evt.js";

const DB_NAME = "toranoana-db";
const TASK_STORE_NAME = "taskStore";
const DB_VERSION = 1;

export async function initTaskDB() {
    const exports = await import("idb");
    await exports.openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            db.createObjectStore(TASK_STORE_NAME, { keyPath: "id" });
        }
    });
}

let dbHandle: IDBPDatabase<any>;

const getDbHandle = async () => {
    if (!dbHandle) {
        dbHandle = await openDB(DB_NAME);
    }
    return dbHandle
}

export async function getTaskList(): Promise<Task[]> {
    const db = await getDbHandle();
    const tasks = await db.transaction(TASK_STORE_NAME, "readonly").store.getAll();
    return tasks || [];
}

export async function setTaskList(taskList: Task[]) {
    const db = await getDbHandle();
    const store = db.transaction(TASK_STORE_NAME, "readwrite").store;
    await store.clear();
    for (const task of taskList) {
        await store.add(task);
    }
    chrome.runtime.sendMessage({ type: EventType.SYNC_TASK_LIST });
}

export async function insertToTaskList(tasks: Task[]) {
    const db = await getDbHandle();
    const store = db.transaction(TASK_STORE_NAME, "readwrite").store;
    for (const task of tasks) {
        await store.put(task);
    }

    chrome.runtime.sendMessage({ type: EventType.SYNC_TASK_LIST });
}

export async function removeFromTaskList(tasks: Task[]) {
    const db = await getDbHandle();
    const store = db.transaction(TASK_STORE_NAME, "readwrite").store;
    for (const task of tasks) {
        await store.delete(task.id);
    }
    chrome.runtime.sendMessage({ type: EventType.SYNC_TASK_LIST });
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