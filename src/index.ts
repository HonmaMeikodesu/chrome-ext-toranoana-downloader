import { EventMessage, EventType } from "./utils/evt";
import { DISCLAIMER } from "./disclaimer";

const bookList =  document.querySelectorAll<HTMLAnchorElement>("#book_container .link-list > li > a");

[ ...bookList ].forEach((ele) => {
    const download = document.createElement("button");

    download.setAttribute("style",  "background-color: #4CAF50; color: white; padding: 0 8px; text-align: center; text-decoration: none; display: block; font-size: 16px; cursor: pointer");

    download.innerText = "下载";

    ele.insertAdjacentElement("afterend", download);

    const bookUrl = ele.parentNode!.querySelector<HTMLAnchorElement>("#read_btn a")!.href;

    const bookTitle = ele.querySelector("em")?.textContent?.trim()?.replace(/\n\s*/g, "");

    download.onclick = () => disclaimerGuard().then(() => requestParseBook(bookUrl, bookTitle ?? ""));
})

async function disclaimerGuard() {
    const msg: EventMessage<EventType.GET_DISCLAIMER_AGREED> = {
        type: EventType.GET_DISCLAIMER_AGREED,
        payload: null
    };

    const isDisclaimerAgreed: boolean = await chrome.runtime.sendMessage(msg);

    if (!isDisclaimerAgreed) {
        const res = confirm(DISCLAIMER);
        if (res) {
            const msg: EventMessage<EventType.DISCLAIMER_AGREED> = {
                type: EventType.DISCLAIMER_AGREED,
                payload: null
            }
            chrome.runtime.sendMessage(msg);
            return;
        }
        throw new Error();
    }
}

function requestParseBook(bookUrl: string, initBookTitle: string) {
    const msg: EventMessage<EventType.PARSE_BOOK> = {
        type: EventType.PARSE_BOOK,
        payload: {
            bookUrl,
            bookTitle: initBookTitle,
        }
    }
    chrome.runtime.sendMessage(msg);
    const openPopup: EventMessage<EventType.OPEN_POPUP> = {
        type: EventType.OPEN_POPUP,
        payload: null 
    }
    chrome.runtime.sendMessage(openPopup)
}
