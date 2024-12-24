import { isEmpty } from "lodash";
import { parseAndSave } from "../download";
import { __urlInfo, HeaderInfo } from "./_internal";
import { EventMessage, EventMessageResponse, EventType } from "./evt";
import moment from "moment";
import { usePromisifyCb } from "./common";

const MULTI_WORKER_THREAD = 6;

const EXPIRE_MINS = 5;


export async function requestBookAccess(bookUrl: string, tab: chrome.tabs.Tab) {
    const response = await fetch(bookUrl, { credentials: "include", redirect: "follow" });
    const viewerHtml = await response.text();

    const parseBookMetaMsg: EventMessage<EventType.PARSE_BOOK_META> = {
        type: EventType.PARSE_BOOK_META,
        payload: {
            viewerHtml
        }
    };

    let p1: string = "";
    let p2: string = "";
    let p5: string = "";
    let title: string = "";
    let author: string = "";

    await usePromisifyCb((params: string, cb) => {
        chrome.tabs.sendMessage(tab.id!, params, {}, cb);
    }, {
        params: parseBookMetaMsg,
        cb: (res: EventMessageResponse<EventType.PARSE_BOOK_META>) => {
            p1 = res.p1;
            p2 = res.p2;
            p5 = res.p5;
            title = res.title;
            author = res.author;
            return Promise.resolve(res)
        }
    })

    const { imageUrl, headerInfo } = await __urlInfo({ p1, p2, p5 });

    return {
        p1,
        p2,
        p5,
        title,
        author,
        imageUrl,
        headerInfo
    }
}

export async function processBook(bookUrl: string, tab: chrome.tabs.Tab, options?: { pageNums?: number[] }) {

    const { imageUrl, headerInfo, title, author } = await requestBookAccess(bookUrl, tab);

    const parentDirectory = `${title}${author ? `(${author})` : ""}`;

    const errorPageList: number[] = [];

    const worker = async (params: HeaderInfo["pgs"]["pg"][number]) => {
        const { img, x, id, n } = params;
        try {
            const idUrl = imageUrl(img, x);
            const res = await fetch(idUrl);
            const xc = res.headers.get('X-Error-Code');
            if (xc != "0") {
                const xdef = res.headers.get("X-Error-def");
                throw new Error(`Unexpected error code: ${xc}, error message: ${xdef}`);
            }
            const resJson = await res.json();

            const rimgsrc = resJson["image"];

            const rjsonx = resJson["x"];

            await parseAndSave({
                fileName: `${parentDirectory}/${id}.jpg`,
                accessDirective: {
                    image: rimgsrc,
                    x: rjsonx
                }
            }, tab)

        } catch (e) {
            console.error(e);
            errorPageList.push(n) 
        }
    };

    const pageNumList = headerInfo.pgs.pg.map(item => item.n);

    const targetPages = options?.pageNums ? options.pageNums.filter(pageNum => pageNumList.includes(pageNum)) : pageNumList;

    const startDownloadMsg: EventMessage<EventType.START_DOWNLOAD> = {
        type: EventType.START_DOWNLOAD,
        payload: {
            bookUrl,
            bookTitle: title,
            pageList: targetPages 
        }
    };
    chrome.runtime.sendMessage(startDownloadMsg);

    let now = moment();
    let remnantPages = targetPages;
    for(let i = 0; i < targetPages.length; i+=MULTI_WORKER_THREAD) {
        const targetBatch = targetPages.slice(i, i + MULTI_WORKER_THREAD);
        await Promise.all(targetBatch.map(async (pageNum) => {
            await worker(headerInfo.pgs.pg.find(item => item.n === pageNum)!);
            remnantPages = remnantPages.filter(item => item !== pageNum);
        }));
        const elapsed = moment().diff(now, "minutes");
        if (elapsed > EXPIRE_MINS) {
            const { headerInfo: nextHeaderInfo } = await requestBookAccess(bookUrl, tab);
            headerInfo.pgs = nextHeaderInfo.pgs;
            now = moment();
        }
    }

    if (!isEmpty(errorPageList)) {
        const downloadFailMsg: EventMessage<EventType.DOWNLOAD_ERROR> = {
            type: EventType.DOWNLOAD_ERROR,
            payload: {
                bookUrl,
                bookTitle: title,
                errorPageList
            }
        };

        chrome.runtime.sendMessage(downloadFailMsg);
        return;
    }
    
    const downloadCompleteMsg: EventMessage<EventType.DOWNLOAD_COMPLETE> = {
        type: EventType.DOWNLOAD_COMPLETE,
        payload: {
            bookUrl,
            bookTitle: title,
            pageList: targetPages
        }
    };

    chrome.runtime.sendMessage(downloadCompleteMsg);
}


