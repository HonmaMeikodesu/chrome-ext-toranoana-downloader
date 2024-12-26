import { useCallback, useEffect, useState } from "react";
import TaskList from "./taskList";
import { EventMessage, EventMessageTypeGuard, EventType } from "../utils/evt";
import { Task } from "../types";
import "./root.css";
import { Divider } from "antd";
export default function Root() {
    const [ tasks, setTasks  ] = useState<Task[]>([]);
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
    useEffect(() => {
        chrome.runtime.onMessage.addListener((message: EventMessage<any>) => {
            if (EventMessageTypeGuard<EventType.SYNC_TASK_LIST>(message, EventType.SYNC_TASK_LIST)) {
                refreshTaskList();
            }
        });
        refreshTaskList();
    }, []);
    return (
        <div className="popup-container">
            <div className="popup-header">
                <span>任务列表</span>
            </div>
            <Divider style={{ margin: "6px 0"}} />
            <div className="popup-body">
                <TaskList tasks={tasks} />
            </div>
        </div>
    );
}