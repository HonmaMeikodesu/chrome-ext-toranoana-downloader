import { AppConfig, Task } from "../types.js";

export const EventMessageTypeGuard = <T extends EventType>(message: EventMessage<T>, type: T): message is EventMessage<T> => {
    return message?.type == type;
};

export const enum EventType {
    // content scripts
    PARSE_BOOK = "parseBook",
    OPEN_POPUP = "openPopup",
    GET_DISCLAIMER_AGREED = "getDisclaimerAgreed",
    DISCLAIMER_AGREED = "disclaimerAgreed",

    // popup
    REDUCE_TASK_LIST = "reduceTaskList",
    SYNC_TASK_LIST = "syncTaskList",
    READ_APP_CONFIG = "readAppConfig",
    SET_APP_CONFIG = "setAppConfig",

    // i18n
    I18N = "i18n",
    SYNC_I18N = "syncI18n"
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
    } : T extends EventType.SET_APP_CONFIG ? AppConfig
    : T extends EventType.I18N ? string
    : null
};

export type EventMessageResponse<T extends EventType> = T extends EventType.READ_APP_CONFIG ? AppConfig : T extends EventType.GET_DISCLAIMER_AGREED ? boolean : T extends EventType.I18N ? string : null;