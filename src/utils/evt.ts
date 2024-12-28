import { Task } from "../types";

export const EventMessageTypeGuard = <T extends EventType>(message: EventMessage<T>, type: T): message is EventMessage<T> => {
    return message?.type == type;
};

export const enum EventType {
    PARSE_BOOK = "parseBook",

    REDUCE_TASK_LIST = "reduceTaskList",
    SYNC_TASK_LIST = "syncTaskList",

    OPEN_POPUP = "openPopup"
}

export type EventMessage<T extends EventType> = {
    type: T,
    payload: T extends EventType.PARSE_BOOK ? {
        bookUrl: string
        bookTitle: string
        pageList?: number[]
    } : T extends EventType.REDUCE_TASK_LIST ? {
        action: "set" | "get" | "insert" | "remove"
        payload: {
            taskList?: Task[],
        }
    } : null
}