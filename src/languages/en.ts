import { I18nConfig } from "./types.js";

const en: I18nConfig = {
  UI: {
        popup: {
            taskList: {
                title: "Task List",
                resetHistory: "Clear History",
                retryTask: "Retry",
                taskFatalPrompt: "System error, please retry",
                taskErrorPrompt: "The following pages failed to download:",
                noTaskPrompt: "No task"
            },
            configForm: {
                title: "Config",
                multiThreadFetchLabel: "Threads",
                multiThreadFetchTooltip: "Number of download threads, default to 1",
                localeLabel: "Language",
                saveAndApply: "Apply"
            }
        },
        content: {
            download: "Download",
            disclaimer: `Before using this function, do you agree to the following disclaimer?

Toranoana Downloader (hereinafter referred to as "this software") is released under the MIT license.

1. This software does not provide any warranty, including but not limited to warranty of correctness, availability and suitability for use.

2. The author shall not be liable for any explict or potential losses or damages caused by the use of this software.

3. The author reserves the right to modify this disclaimer at any time. Any changes made to this disclaimer will take effect immediately upon publication of a new version of this software. By continuing to use this software, you agree to abide by these updated terms.

4. The author reserves the right to terminate the service of this software at any time.`
        }
    }
}

export default en;