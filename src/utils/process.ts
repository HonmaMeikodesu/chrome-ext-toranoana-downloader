import { isEmpty } from "lodash";
import { parseAndSave } from "../download.js";
import { __urlInfo, HeaderInfo } from "./_internal.js";
import moment from "moment";
import { localEventBus, LocalEventMessage, LocalEventType } from "./localEventBus.js";
import { parseHTML } from "linkedom";
import { getLocalStorageItem } from "./storageManage.js";

const EXPIRE_MINS = 5;

function parseBookMeta(viewerHtml: string) {

    const fakeWin = parseHTML(viewerHtml)

    const viewerHtmlDom = fakeWin.document;

    const inlineScripts = viewerHtmlDom.querySelectorAll("script[type='text/javascript']");

    const regex = {
        p1: /const\s+p1\s*=\s*"([^"]+)";/,
        p2: /const\s+p2\s*=\s*"([^"]+)";/,
        p5: /const\s+p5\s*=\s*"([^"]+)";/,
        p7: /const\s+p7\s*=\s*"([^"]+)";/,
        p8: /const\s+p8\s*=\s*"([^"]+)";/
    };

    let p1: string = "";
    let p2: string = "";
    let p5: string = "";
    let title: string = "";
    let author: string = "";

    [...inlineScripts].forEach(script => {
        if (p1 || p2 || p5) return;
        p1 = script.textContent?.match(regex.p1)?.[1] ?? "";
        p2 = script.textContent?.match(regex.p2)?.[1] ?? "";
        p5 = script.textContent?.match(regex.p5)?.[1] ?? "";
        title = script.textContent?.match(regex.p7)?.[1] ?? "";
        author = script.textContent?.match(regex.p8)?.[1] ?? "";
    });

    return {
        p1,
        p2,
        p5,
        title: title ?? viewerHtmlDom?.title,
        author
    }
}

export async function requestBookAccess(bookUrl: string) {
    const response = await fetch(bookUrl, { credentials: "include", redirect: "follow" });
    const viewerHtml = await response.text();

    const { p1, p2, p5, title, author } = parseBookMeta(viewerHtml);

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

export async function processBook(bookUrl: string, options?: { pageNums?: number[] }) {

    let { multiThreadFetch } = await getLocalStorageItem("appConfig");

    multiThreadFetch = multiThreadFetch ?? 1;

    const { imageUrl, headerInfo, title, author } = await requestBookAccess(bookUrl);

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
            })

        } catch (e) {
            console.error(e);
            errorPageList.push(n) 
        }
    };

    const pageNumList = headerInfo.pgs.pg.map(item => item.n);

    const targetPages = options?.pageNums ? options.pageNums.filter(pageNum => pageNumList.includes(pageNum)) : pageNumList;

    const startDownloadMsg: LocalEventMessage<LocalEventType.START_DOWNLOAD> = {
        payload: {
            bookUrl,
            bookTitle: title,
            pageList: targetPages 
        }
    };
    localEventBus.emit(LocalEventType.START_DOWNLOAD, startDownloadMsg);

    let now = moment();
    for(let i = 0; i < targetPages.length; i+=multiThreadFetch) {
        const targetBatch = targetPages.slice(i, i + multiThreadFetch);
        await Promise.all(targetBatch.map((pageNum) => worker(headerInfo.pgs.pg.find(item => item.n === pageNum)!)));
        const elapsed = moment().diff(now, "minutes");
        if (elapsed > EXPIRE_MINS) {
            const { headerInfo: nextHeaderInfo } = await requestBookAccess(bookUrl);
            headerInfo.pgs = nextHeaderInfo.pgs;
            now = moment();
        }
    }

    if (!isEmpty(errorPageList)) {
        const downloadFailMsg: LocalEventMessage<LocalEventType.DOWNLOAD_ERROR> = {
            payload: {
                bookUrl,
                bookTitle: title,
                errorPageList
            }
        };

        localEventBus.emit(LocalEventType.DOWNLOAD_ERROR, downloadFailMsg);
        return;
    }
    
    const downloadCompleteMsg: LocalEventMessage<LocalEventType.DOWNLOAD_COMPLETE> = {
        payload: {
            bookUrl,
            bookTitle: title,
            pageList: targetPages
        }
    };

    localEventBus.emit(LocalEventType.DOWNLOAD_COMPLETE, downloadCompleteMsg);
}


