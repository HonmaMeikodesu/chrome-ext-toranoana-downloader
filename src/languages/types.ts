export type I18nConfig = {
    UI: {
        popup: {
            taskList: {
                title: string;
                resetHistory: string;
                retryTask: string;
                taskFatalPrompt: string;
                taskErrorPrompt: string;
                noTaskPrompt: string;
            },
            configForm: {
                title: string;
                saveAndApply: string;
                // form item
                multiThreadFetchLabel: string;
                multiThreadFetchTooltip: string;
                localeLabel: string
            }
        },
        content: {
            download: string,
            disclaimer: string
        }
    },
}