import { File } from "./types"
import { usePromisifyCb } from "./utils/common";
import { EventMessage, EventMessageResponse, EventType } from "./utils/evt";
export async function parseAndSave(fileInfo: File, tab: chrome.tabs.Tab) {

    const { accessDirective: dir, fileName } = fileInfo || {};

    const { x } = dir;

    const img = await fetch(dir.image);

    const normImageMsg: EventMessage<EventType.NORM_IMAGE> = {
        type: EventType.NORM_IMAGE,
        payload: {
            imageBuffer: await img.arrayBuffer(),
            x
        }
    }

    let imgBlob: Blob = new Blob();

    await usePromisifyCb((params, cb) => {
        chrome.tabs.sendMessage(tab.id!, params, {}, cb)
    }, {
        params: normImageMsg,
        cb: (res: EventMessageResponse<EventType.NORM_IMAGE>) => {
            if (res?.byteLength)  {
                imgBlob = new Blob([res]);
            }
            return Promise.resolve(imgBlob);
        }
    })

    if (!imgBlob) { throw new Error("Receive Empty Image Blob!")};
    
    
    const targetBlobUrl = URL.createObjectURL(imgBlob);

    const ext = "jpg";

    await chrome.downloads.download({
        url: targetBlobUrl,
        filename: `${fileName}.${ext}`,
        conflictAction: "overwrite"
    });

    URL.revokeObjectURL(targetBlobUrl);
}