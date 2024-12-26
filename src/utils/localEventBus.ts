import { EventEmitter } from "events";

export const enum LocalEventType {
    START_DOWNLOAD = "startDownload",
    DOWNLOAD_COMPLETE = "downloadComplete",
    DOWNLOAD_ERROR = "downloadError",
}

export const localEventBus = new EventEmitter();

export type LocalEventMessage<T extends LocalEventType> = {
    type: T,
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
        errorPageList: number[]
    } : never
}