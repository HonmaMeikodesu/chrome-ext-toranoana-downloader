import { File } from "./types"
import { convertBlobToBase64 } from "./utils/common";

export async function parseAndSave(fileInfo: File) {

    const { accessDirective: dir, fileName } = fileInfo || {};

    const { x } = dir;

    const img = await fetch(dir.image);

    const imgBlob = await img.blob();

    const imgFile = await createImageBitmap(imgBlob);

    const canvas = new OffscreenCanvas(imgFile.width, imgFile.height);

    const ctx = canvas.getContext("2d");

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

    const imgDownloadUrl = await convertBlobToBase64(await canvas.convertToBlob()) 

    if (!imgDownloadUrl.length) { throw new Error("Receive Empty Image Blob!") };

    await chrome.downloads.download({
        url: imgDownloadUrl,
        filename: fileName,
        conflictAction: "overwrite"
    });

}