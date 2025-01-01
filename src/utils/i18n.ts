import { I18n } from "i18n-js";
import zh_CN from "../languages/zh-CN";
import en from "../languages/en";
import { getLocalStorageItem } from "./storageManage";
import { EventType } from "./evt";

const i18n = new I18n({
    "zh-CN": zh_CN,
    en,
});

i18n.onChange(async () => {
    chrome.runtime.sendMessage({ type: EventType.SYNC_I18N });
    const tabsOfInterest = await chrome.tabs.query({
        url: "*://books.toraebook.com/toraebook/*"
        // url: "http://localhost:8080/*"
    });
    ( tabsOfInterest || [] ).forEach(tab => {
        tab.id && chrome.tabs.sendMessage(tab.id, { type: EventType.SYNC_I18N })
    })
})

getLocalStorageItem("appConfig").then(appConfig => {
    if (appConfig?.locale) {
        i18n.locale = appConfig.locale;
    }
})

export default i18n;