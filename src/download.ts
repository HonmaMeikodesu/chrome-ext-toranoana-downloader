import { File } from "./types.js"
import { convertBlobToBase64 } from "./utils/common.js";

export async function parseAndSave(fileInfo: File) {

    const { accessDirective: dir, fileName } = fileInfo || {};

    const { x } = dir;

    const img = await fetch(dir.image);

    if (!img.ok) {
        throw new Error(`Image request failed with HTTP ${img.status}.`);
    }

    const imgBlob = await img.blob();

    const imgFile = await createImageBitmap(imgBlob);

    try {
        const canvas = new OffscreenCanvas(imgFile.width, imgFile.height);

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Could not create the page canvas context.");
        }

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

            ctx.drawImage(imgFile,
                sx, sy, sw, sh, dx, dy, dw, dh
            );
        }

        const imgDownloadUrl = await convertBlobToBase64(await canvas.convertToBlob());

        if (!imgDownloadUrl.length) {
            throw new Error("Receive Empty Image Blob!");
        }

        try {
            const downloadId = await chrome.downloads.download({
                url: imgDownloadUrl,
                filename: fileName,
                conflictAction: "overwrite",
                saveAs: false
            });

            await waitForDownloadCompletion(downloadId);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Page download failed (filename length: ${fileName.length}): ${message}`);
        }
    } finally {
        imgFile.close();
    }
}

async function waitForDownloadCompletion(downloadId: number) {
    return new Promise<void>((resolve, reject) => {
        let settled = false;

        const finish = (error?: Error) => {
            if (settled) {
                return;
            }
            settled = true;
            chrome.downloads.onChanged.removeListener(onChanged);
            error ? reject(error) : resolve();
        };

        const onChanged = (delta: chrome.downloads.DownloadDelta) => {
            if (delta.id !== downloadId) {
                return;
            }
            if (delta.state?.current === "complete") {
                finish();
            } else if (delta.state?.current === "interrupted") {
                finish(new Error(`Chrome interrupted the download: ${delta.error?.current ?? "unknown reason"}`));
            }
        };

        chrome.downloads.onChanged.addListener(onChanged);

        void chrome.downloads.search({ id: downloadId }).then(([item]) => {
            if (!item) {
                finish(new Error(`Chrome download ${downloadId} could not be found.`));
            } else if (item.state === "complete") {
                finish();
            } else if (item.state === "interrupted") {
                finish(new Error(`Chrome interrupted the download: ${item.error ?? "unknown reason"}`));
            }
        }).catch((error) => {
            const message = error instanceof Error ? error.message : String(error);
            finish(new Error(`Could not inspect Chrome download ${downloadId}: ${message}`));
        });
    });
}
