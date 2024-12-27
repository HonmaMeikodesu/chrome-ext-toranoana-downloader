import { EventMessage, EventType } from "./utils/evt";

const bookList =  document.querySelectorAll<HTMLAnchorElement>("#book_container .link-list > li > a");

[ ...bookList ].forEach((ele) => {
    const download = document.createElement("button");

    download.setAttribute("style",  "background-color: #4CAF50; color: white; padding: 0 8px; text-align: center; text-decoration: none; display: block; font-size: 16px; cursor: pointer");

    download.innerText = "下载";

    ele.insertAdjacentElement("afterend", download);

    const bookUrl = ele.parentNode!.querySelector<HTMLAnchorElement>("#read_btn a")!.href;

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
