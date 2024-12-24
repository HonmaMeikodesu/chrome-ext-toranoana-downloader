export async function convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data as string);
        };
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