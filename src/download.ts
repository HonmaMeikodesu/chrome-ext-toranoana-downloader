import { File } from "./types"
import { convertBlobToBase64, usePromisifyCb } from "./utils/common";
import { EventMessage, EventMessageResponse, EventType } from "./utils/evt";

export async function parseAndSave(fileInfo: File, tab: chrome.tabs.Tab) {

    const { accessDirective: dir, fileName } = fileInfo || {};

    const { x } = dir;

    const img = await fetch(dir.image);

    const resImgBlob = await img.blob();

    const imgBase64Str = await convertBlobToBase64(resImgBlob);

    const normImageMsg: EventMessage<EventType.NORM_IMAGE> = {
        type: EventType.NORM_IMAGE,
        payload: {
            imageBase64Str: imgBase64Str,
            x
        }
    }

    let imgDownloadUrl: string = "";

    await usePromisifyCb((params, cb) => {
        chrome.tabs.sendMessage(tab.id!, params, {}, cb)
    }, {
        params: normImageMsg,
        cb: (res: EventMessageResponse<EventType.NORM_IMAGE>) => {
            if (res?.length) {
                imgDownloadUrl = res;
            }
            return Promise.resolve(imgDownloadUrl);
        }
    })

    if (!imgDownloadUrl.length) { throw new Error("Receive Empty Image Blob!") };

    await chrome.downloads.download({
        url: imgDownloadUrl,
        filename: fileName,
        conflictAction: "overwrite"
    });

}