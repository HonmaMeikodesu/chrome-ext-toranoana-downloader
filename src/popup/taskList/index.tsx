import { useCallback } from "react";
import { Task } from "../../types";
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, BugOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Collapse, CollapseProps } from "antd";
import { EventMessage, EventType } from "../../utils/evt";
import cx from "classnames";

import "./index.scss";
import { cloneDeep } from "lodash";
import { useI18n } from "../hooks/useI18n";

type ComponentProps = {
    tasks: Task[];
    onDeleteTask: (task: Task) => void;
}

export default function TaskList(props: ComponentProps) {
    const { tasks, onDeleteTask } = props;

    const [retryTask, taskError, taskFatal, noTask] = useI18n(["UI.popup.taskList.retryTask", "UI.popup.taskList.taskErrorPrompt", "UI.popup.taskList.taskFatalPrompt", "UI.popup.taskList.noTaskPrompt"])

    const retry = useCallback((params: { bookUrl: string, bookTitle: string, errorPageList?: number[] }) => {
        const { bookTitle, bookUrl, errorPageList } = params;
        const retryMsg: EventMessage<EventType.PARSE_BOOK> = {
            type: EventType.PARSE_BOOK,
            payload: {
                bookUrl,
                bookTitle,
                pageList: errorPageList
            }
        }
        chrome.runtime.sendMessage(retryMsg);
    }, [ tasks ]);

    const buildCollapseItems = () => {
        const taskHeaderCls = "task-item-header";
        const taskBodyCls = "task-item-body";
        const ret: CollapseProps["items"] = (tasks || []).map((task) => {
            const { status, bookTitle, bookUrl, errorPageList } = task;
            const isExceptional = status === "error" || status === "fatal";
            const isResolved = status !== "pending" && status !== "downloading";
            return {
                label: (
                    <div className={taskHeaderCls}>
                        <div className={`${taskHeaderCls}-title`} title={bookTitle}>
                            {bookTitle}
                        </div>
                        <div className={cx(`${taskHeaderCls}-status-${status}`, `${taskHeaderCls}-status`)}>{
                            status === "pending" ? <ClockCircleOutlined /> :
                                status === "downloading" ? <LoadingOutlined spin={true} /> :
                                    status === "done" ? <CheckCircleOutlined /> :
                                        status === "error" ? <CloseCircleOutlined /> :
                                            status === "fatal" ? <BugOutlined /> : ""
                        }</div>
                        {isExceptional && <Button className={`${taskHeaderCls}-retry`} type="link" onClick={() => retry({ bookUrl, bookTitle, errorPageList: status === "error" ? errorPageList : undefined })}>{retryTask}</Button>}
                        {isResolved && <CloseOutlined className={`${taskHeaderCls}-remove`} onClick={() => onDeleteTask?.(task)} />}
                    </div>
                ),
                showArrow: isExceptional,
                collapsible: !isExceptional ? "disabled" : "header",
                children: (
                    <div className={taskBodyCls}>
                        {
                            status === "error" && errorPageList?.length && (
                                <>
                                    <span>{taskError}</span>
                                    {
                                        cloneDeep(errorPageList).sort().map((pageNum, idx) => (
                                            <>
                                                <span className={`${taskBodyCls}-error-page`}>{pageNum}</span>
                                                {idx < errorPageList.length - 1 && <span>,&nbsp;</span>}
                                            </>

                                        ))
                                    }
                                </>

                            )
                        }
                        {
                            status === "fatal" && <div className={`${taskBodyCls}-fatal`}>{taskFatal}</div>
                        }
                    </div>
                )
            }
        });
        return ret;
    };

    return (
        <div className="task-list-container">
            {
                tasks.length ? (
                    <Collapse ghost={true} items={buildCollapseItems()} />
                ) : (
                    <div className="task-list-empty">
                        {noTask}
                    </div>
                )
            }
        </div>
    )
}