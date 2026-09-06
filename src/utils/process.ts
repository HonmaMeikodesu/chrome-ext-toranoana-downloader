import { parseAndSave } from "../download.js";
import { __urlInfo, HeaderInfo } from "./_internal.js";
import moment from "moment";
import { parseHTML } from "linkedom";
import { getLocalStorageItem } from "./storageManage.js";
import { readJavaScriptStringConstant, sanitizeDownloadPathSegment } from "./text.js";

const EXPIRE_MINS = 5;

function parseBookMeta(viewerHtml: string) {

    const fakeWin = parseHTML(viewerHtml)

    const viewerHtmlDom = fakeWin.document;

    const scriptSource = [...viewerHtmlDom.querySelectorAll("script[type='text/javascript']")]
        .map(script => script.textContent ?? "")
        .join("\n");

    const p1 = readJavaScriptStringConstant(scriptSource, "p1");
    const p2 = readJavaScriptStringConstant(scriptSource, "p2");
    const p5 = readJavaScriptStringConstant(scriptSource, "p5");
    const title = readJavaScriptStringConstant(scriptSource, "p7") || viewerHtmlDom?.title || "";
    const author = readJavaScriptStringConstant(scriptSource, "p8");

    return {
        p1,
        p2,
        p5,
        title,
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

type ProcessBookOptions = {
    pageNums?: number[];
    onStart?: (details: { bookTitle: string; pageList: number[] }) => void | Promise<void>;
    onPageComplete?: (pageNum: number) => void | Promise<void>;
};

export type ProcessBookResult = {
    bookTitle: string;
    pageList: number[];
    errorPageList: number[];
};

export async function processBook(bookUrl: string, options?: ProcessBookOptions): Promise<ProcessBookResult> {

    let { multiThreadFetch } = await getLocalStorageItem("appConfig");

    const configuredThreadCount = Number(multiThreadFetch ?? 1);
    const threadCount = Number.isFinite(configuredThreadCount) && configuredThreadCount > 0
        ? Math.floor(configuredThreadCount)
        : 1;

    const access = await requestBookAccess(bookUrl);
    let { imageUrl, headerInfo } = access;
    const { title, author } = access;

    const parentDirectory = sanitizeDownloadPathSegment(`${title}${author ? `(${author})` : ""}`);

    const errorPageList: number[] = [];

    const worker = async (params: HeaderInfo["pgs"]["pg"][number]) => {
        const { img, x, id, n } = params;
        let stage = "requesting the page access directive";
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

            stage = "decoding and saving the page";
            await parseAndSave({
                fileName: `${parentDirectory}/${id}.jpg`,
                accessDirective: {
                    image: rimgsrc,
                    x: rjsonx
                }
            });

            stage = "recording the completed page";
            await options?.onPageComplete?.(n);

        } catch (e) {
            console.error(`[Toranoana Downloader] Page ${n} failed while ${stage}.`, e);
            errorPageList.push(n) 
        }
    };

    const pageNumList = headerInfo.pgs.pg.map(item => item.n);

    const targetPages = options?.pageNums ? options.pageNums.filter(pageNum => pageNumList.includes(pageNum)) : pageNumList;

    await options?.onStart?.({ bookTitle: title, pageList: targetPages });

    let now = moment();
    for(let i = 0; i < targetPages.length; i += threadCount) {
        const targetBatch = targetPages.slice(i, i + threadCount);
        await Promise.all(targetBatch.map((pageNum) => worker(headerInfo.pgs.pg.find(item => item.n === pageNum)!)));
        const elapsed = moment().diff(now, "minutes");
        if (elapsed >= EXPIRE_MINS && i + threadCount < targetPages.length) {
            const nextAccess = await requestBookAccess(bookUrl);
            imageUrl = nextAccess.imageUrl;
            headerInfo = nextAccess.headerInfo;
            now = moment();
        }
    }

    return {
        bookTitle: title,
        pageList: targetPages,
        errorPageList: errorPageList.sort((a, b) => a - b)
    };
}


