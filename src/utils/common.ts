export async function convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== "string") {
                reject(new Error("Could not convert the page image to a data URL."));
                return;
            }
            resolve(reader.result);
        };
        reader.onerror = () => reject(reader.error ?? new Error("Could not read the page image blob."));
        reader.onabort = () => reject(new Error("Reading the page image blob was aborted."));
        reader.readAsDataURL(blob);
    })
}
 
export function usePromisifyCb(func: (params: any, cb: any, errCb?: any) => void, data: { params: any, cb: (...args: any[]) => Promise<any>, errCb?: (...args: any[]) => Promise<any> }) {
    return new Promise((resolve, reject) => {
        const { cb, errCb, params } = data;
        const wrappedCb = (...args: any[]) => {
            cb(...args).then(resolve).catch(reject)
        }
        const wrappedErrCb = (...args: any[]) => {
            errCb?.(...args).then(reject).catch(reject)
        };

        try {
            func(params, wrappedCb, wrappedErrCb);
        } catch(e) {
            reject(e);
        }
    })
}

export function getIdFromBookUrl(bookUrl: string): string {
    const url = new URL(bookUrl);
    return url.searchParams.get("title_id") as string;
}
