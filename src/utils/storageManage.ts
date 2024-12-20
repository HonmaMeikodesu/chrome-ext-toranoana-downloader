// don't know how to implement reader and writer locks here, so let's just ask IndexedDB to do this favor
import { Task } from "../types.js";
// @ts-expect-error ignore this ts error, this module INDEED has a CJS entry, checkout out its main field in package.json
import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "toranoana-db";
const TASK_STORE_NAME = "taskStore";
const DB_VERSION = 1;

export async function initTaskDB() {
    const exports = await import("idb");
    await exports.openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            db.createObjectStore(TASK_STORE_NAME, { keyPath: "bookUrl" });
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
}

export async function insertToTaskList(task: Task) {
    const db = await getDbHandle();
    const store = db.transaction(TASK_STORE_NAME, "readwrite").store;
    await store.put(task);
}

export async function removeFromTaskList(task: Task) {
    const db = await getDbHandle();
    const store = db.transaction(TASK_STORE_NAME, "readwrite").store;
    await store.delete(task.bookUrl);
}
