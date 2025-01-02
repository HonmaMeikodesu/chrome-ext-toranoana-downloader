import { I18nConfig } from "./types.js";

const zh_CN: I18nConfig = {
  UI: {
    popup: {
      taskList: {
        title: "任务列表",
        resetHistory: "清空历史",
        retryTask: "重试",
        taskFatalPrompt: "系统异常，请重试",
        taskErrorPrompt: "以下页码下载失败：",
        noTaskPrompt: "暂无任务"
      },
      configForm: {
        title: "选项",
        multiThreadFetchLabel: "线程数",
        multiThreadFetchTooltip: "下载线程数，默认为1，即单线程下载，多线程下载会占用更多的系统资源。",
        localeLabel: "语言",
        saveAndApply: "保存并应用"
      }
    },
    content: {
      download: "下载",
      disclaimer: `在使用该功能之前，您是否同意以下免责声明？

Toranoana Downloader（以下简称“本软件”）由本人（以下简称“作者”）开发，本软件基于 MIT 协议开源，您可以在 Github 上获取源代码。本软件仅供学习交流使用，不得用于任何个人或企业的商业用途。

1. 本软件仅用于学习交流目的。禁止利用本软件从事任何违反中华人民共和国法律法规的行为，包括但不限于访问被中国大陆地区封锁的内容、非法浏览或传播违法信息、侵犯他人隐私权或其他合法权益等活动

2. 本软件不提供任何形式的担保，包括但不限于对数据的正确性、可用性和适用性的担保。

3. 作者不对因使用本软件而导致的任何损失或损害承担任何责任。

4. 作者保留随时修改本声明的权利。对本声明所做的任何更改将在本软件发新版本后立即生效。继续使用本软件即表示您同意接受此类更新后的条款约束。

5. 作者保留随时终止本软件的服务的权利。`
    }
  }
}

export default zh_CN;