import { Task } from "../types";

export const EventMessageTypeGuard = <T extends EventType>(message: EventMessage<T>, type: T): message is EventMessage<T> => {
    return message?.type == type;
};

export const enum EventType {
    PARSE_BOOK = "parseBook",

    REDUCE_TASK_LIST = "reduceTaskList",
    SYNC_TASK_LIST = "syncTaskList",

    NORM_IMAGE = "normImage",

    PARSE_BOOK_META = "parseBookMeta"
}

export type EventMessageResponse<T extends EventType> = T extends EventType.NORM_IMAGE ? string : T extends EventType.PARSE_BOOK_META ? {
        p1: string,
        p2: string,
        p5: string,
        title: string,
        author: string
} : never;

export type EventMessage<T extends EventType> = {
    type: T,
    payload: T extends EventType.PARSE_BOOK ? {
        bookUrl: string
        bookTitle: string
        pageList?: number[]
    } : T extends EventType.REDUCE_TASK_LIST ? {
        action: "set" | "get" | "insert" | "remove"
        payload: {
            // taskList and task are mutually exclusive
            taskList?: Task[],
            task?: Task
        }
    } : T extends EventType.NORM_IMAGE ? {
        imageBase64Str: string,
        x: Array<string | number>
    } : T extends EventType.PARSE_BOOK_META ? {
        viewerHtml: string
    } : never
}