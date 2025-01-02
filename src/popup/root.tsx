import { useCallback, useEffect, useState } from "react";
import { Button, Divider } from "antd";
import TaskList from "./taskList/index.jsx";
import { EventMessage, EventMessageResponse, EventMessageTypeGuard, EventType } from "../utils/evt.js";
import { AppConfig, Task } from "../types.js";
import Config from "./config/index.jsx";
import { useI18n } from "./hooks/useI18n.js";

import "./root.css";
export default function Root() {
    const [ tasks, setTasks  ] = useState<Task[]>([]);
    const [appConfig, setAppConfig] = useState<AppConfig>({ multiThreadFetch: undefined });
    const refreshTaskList = useCallback(() => {
        const getTaskListPayload: EventMessage<EventType.REDUCE_TASK_LIST> = {
            type: EventType.REDUCE_TASK_LIST,
            payload: {
                action: "get",
                payload: {}
            }
        };
        chrome.runtime.sendMessage(getTaskListPayload, (response: Task[]) => {
            setTasks(response);
        })
    }, [ setTasks ]);

    const refreshAppConfig = useCallback(() => {
        const getAppConfigPayload: EventMessage<EventType.READ_APP_CONFIG> = {
            type: EventType.READ_APP_CONFIG,
            payload: null
        };
        chrome.runtime.sendMessage(getAppConfigPayload, (response: EventMessageResponse<EventType.READ_APP_CONFIG>) => {
            setAppConfig(response);
        })
    }, []);

    const removeTaskHistory = useCallback((tasksToRemove: Task[]) => {
        const removeTasksPayload: EventMessage<EventType.REDUCE_TASK_LIST> = {
            type: EventType.REDUCE_TASK_LIST,
            payload: {
                action: "remove",
                payload: {
                    taskList: tasksToRemove
                }
            }
        };
        chrome.runtime.sendMessage(removeTasksPayload);
    }, []);

    const persistAppConfig = useCallback((appConfig: AppConfig) => {
        const setAppConfigPayload: EventMessage<EventType.SET_APP_CONFIG> = {
            type: EventType.SET_APP_CONFIG,
            payload: appConfig
        };
        chrome.runtime.sendMessage(setAppConfigPayload);
    }, [])

    useEffect(() => {
        chrome.runtime.onMessage.addListener((message: EventMessage<any>) => {
            if (EventMessageTypeGuard<EventType.SYNC_TASK_LIST>(message, EventType.SYNC_TASK_LIST)) {
                refreshTaskList();
            }
        });
        refreshTaskList();
        refreshAppConfig();
    }, []);

    const [title, resetHistory] = useI18n(["UI.popup.taskList.title", "UI.popup.taskList.resetHistory"]);

    return (
        <div className="popup-container">
            <div className="popup-header">
                <span>{title}</span>
                <div className="popup-header-ext">
                    <span className="popup-header-clear-setting"><Config appConfig={appConfig} onAppConfigChange={persistAppConfig} /></span>
                    <span className="popup-header-clear-history"><Button type="text" onClick={() => removeTaskHistory(tasks)}>{resetHistory}</Button></span>
                </div>
            </div>
            <Divider style={{ margin: "6px 0"}} />
            <div className="popup-body">
                <TaskList tasks={tasks} onDeleteTask={(task) => removeTaskHistory([task])} />
            </div>
        </div>
    );
}