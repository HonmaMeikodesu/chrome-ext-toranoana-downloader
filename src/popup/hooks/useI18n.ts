import { useCallback, useEffect, useState } from "react";
import { EventMessage, EventMessageResponse, EventType } from "../../utils/evt.js";

export function useI18n(keys: string[]): string[] {

    const [i18nTxts, setI18nTxts] = useState<string[]>([]);

    const refreshI18nTxts = useCallback(async () => {
        const i18nTxts = await Promise.all(keys.map(async (key) => {
            const msg: EventMessage<EventType.I18N> = { type: EventType.I18N, payload: key };
            const res: EventMessageResponse<EventType.I18N> = await chrome.runtime.sendMessage(msg);
            return res;
        }));
        setI18nTxts(i18nTxts);
    }, [setI18nTxts]);

    useEffect(() => {
        const cb = (message: EventMessage<EventType>) => {
            if (message.type === EventType.SYNC_I18N) {
                refreshI18nTxts();
            }
        };
        chrome.runtime.onMessage.addListener(cb);
        refreshI18nTxts();
        return () => {
            chrome.runtime.onMessage.removeListener(cb);
        }
    }, [refreshI18nTxts]);

    return i18nTxts;
}