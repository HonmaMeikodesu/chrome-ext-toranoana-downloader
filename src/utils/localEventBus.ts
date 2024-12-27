import { EventEmitter } from "events";

export const enum LocalEventType {
    START_DOWNLOAD = "startDownload",
    DOWNLOAD_COMPLETE = "downloadComplete",
    DOWNLOAD_ERROR = "downloadError",
    DOWNLOAD_FATAL = "downloadFatal",
}

export const localEventBus = new EventEmitter();

export type LocalEventMessage<T extends LocalEventType> = {
    payload: T extends LocalEventType.START_DOWNLOAD ? {
        bookUrl: string
        bookTitle: string
        pageList?: number[]
    } :  T extends LocalEventType.DOWNLOAD_COMPLETE ? {
        bookUrl: string,
        bookTitle: string
        pageList: number[]
    } : T extends LocalEventType.DOWNLOAD_ERROR ? {
        bookUrl: string,
        bookTitle: string
        errorPageList?: number[]
    } : T extends LocalEventType.DOWNLOAD_FATAL ? {
        bookUrl: string,
        bookTitle: string
    } : never
}