// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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