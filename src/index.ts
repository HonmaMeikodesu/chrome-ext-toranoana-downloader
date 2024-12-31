import { EventMessage, EventMessageResponse, EventType } from "./utils/evt";

const DOWNLOAD_BTN_CLS = "toranana-content-script-download-btn";

const bookList =  document.querySelectorAll<HTMLAnchorElement>("#book_container .link-list > li > a");

[...bookList].forEach((ele) => {
    const download = document.createElement("button");

    download.setAttribute("style", "background-color: #4CAF50; color: white; padding: 0 8px; text-align: center; text-decoration: none; display: block; font-size: 16px; cursor: pointer");

    download.classList.add(DOWNLOAD_BTN_CLS);

    ele.insertAdjacentElement("afterend", download);

    const bookUrl = ele.parentNode!.querySelector<HTMLAnchorElement>("#read_btn a")!.href;

    const bookTitle = ele.querySelector("em")?.textContent?.trim()?.replace(/\n\s*/g, "");

    download.onclick = () => disclaimerGuard().then(() => requestParseBook(bookUrl, bookTitle ?? ""));

    return () => download.remove();
})

async function disclaimerGuard() {
    const msg: EventMessage<EventType.GET_DISCLAIMER_AGREED> = {
        type: EventType.GET_DISCLAIMER_AGREED,
        payload: null
    };

    const isDisclaimerAgreed: boolean = await chrome.runtime.sendMessage(msg);

    const disclaimerTxt = await getI18nText("UI.content.disclaimer");

    if (!isDisclaimerAgreed) {
        const res = confirm(disclaimerTxt);
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

async function getI18nText(key: string) {
    const getI18nMsg: EventMessage<EventType.I18N> = {
        type: EventType.I18N,
        payload: key
    };

    const res: EventMessageResponse<EventType.I18N> = await chrome.runtime.sendMessage(getI18nMsg);
    
    return res;
}

async function modifyI18nContent() {
    const downloadBtns = document.querySelectorAll<HTMLButtonElement>(`.${DOWNLOAD_BTN_CLS}`);

    const downloadTxt = await getI18nText("UI.content.download")

    downloadBtns.forEach((btn) => {
        btn.textContent = downloadTxt;
    })
}

chrome.runtime.onMessage.addListener((message: EventMessage<EventType>) => {
    if (message.type == EventType.SYNC_I18N) {
        modifyI18nContent();
    }
})

modifyI18nContent();
