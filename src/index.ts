import { usePromisifyCb } from "./utils/common";
import { EventMessage, EventType } from "./utils/evt";

const bookList =  document.querySelectorAll<HTMLAnchorElement>("#book_container .link-list > li > a");

[ ...bookList ].forEach((ele) => {
    const download = document.createElement("button");

    download.setAttribute("style",  "background-color: #4CAF50; color: white; padding: 0 8px; text-align: center; text-decoration: none; display: block; font-size: 16px; cursor: pointer");

    download.innerText = "下载";

    ele.insertAdjacentElement("afterend", download);

    const bookUrl = ele.href;

    const bookTitle = ele.querySelector("em")?.textContent?.trim()?.replace(/\n\s*/g, "");

    download.onclick =  () => requestParseBook(bookUrl, bookTitle ?? "");
})

function requestParseBook(bookUrl: string, initBookTitle: string) {
    const msg: EventMessage<EventType.PARSE_BOOK> = {
        type: EventType.PARSE_BOOK,
        payload: {
            bookUrl,
            bookTitle: initBookTitle,
        }
    }
    chrome.runtime.sendMessage(msg);
}

async function normImage(msg: EventMessage<EventType.NORM_IMAGE>) {
    const { imageBuffer, x } = msg.payload;
    const canvas = document.createElement("canvas");

    const imgBlob = new Blob([imageBuffer]);

    const ctx = canvas.getContext("2d");

    const imgFile = await createImageBitmap(imgBlob);

    canvas.width = imgFile.width;

    canvas.height = imgFile.height;

    const blocksw = x[0][0];
    const blocksh = x[0][1];

    for (let cnt = 1; cnt <= blocksw * blocksh; cnt++) {
        const sx = parseInt(x[cnt][2]);
        const sy = parseInt(x[cnt][3]);
        const sw = parseInt(x[cnt][4]);
        const sh = parseInt(x[cnt][5]);
        const dx = parseInt(x[cnt][0]);
        const dy = parseInt(x[cnt][1]);
        const dw = sw;
        const dh = sh;

        ctx!.drawImage(imgFile,
            sx, sy, sw, sh, dx, dy, dw, dh
        );
    }

    let ret: ArrayBuffer = new ArrayBuffer(0);

    await usePromisifyCb((__, cb: BlobCallback) => {
        canvas.toBlob(cb);
    }, { params: null, cb: async (blob: Blob | null) => {
        if (!blob) throw new Error("Empty canvas data!");
        ret = await blob.arrayBuffer();
    } })

    canvas.remove();
    
    return ret;   
}

function parseBookMeta(viewerHtml: string) {
    const viewerHtmlDom = (new DOMParser()).parseFromString(viewerHtml, "text/html");

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

function eventMsgTypeGuard<T extends EventType>(msg: EventMessage<EventType>, type: T): msg is EventMessage<T> {
    return msg?.type === type;
}

chrome.runtime.onMessage.addListener((msg: EventMessage<EventType.NORM_IMAGE | EventType.PARSE_BOOK_META>, sender, sendResponse) => {
    if (eventMsgTypeGuard<EventType.NORM_IMAGE>(msg, EventType.NORM_IMAGE)) {
        normImage(msg).then(sendResponse);
    }

    if (eventMsgTypeGuard<EventType.PARSE_BOOK_META>(msg, EventType.PARSE_BOOK_META)) {
        sendResponse(parseBookMeta(msg.payload.viewerHtml));
    }
})
