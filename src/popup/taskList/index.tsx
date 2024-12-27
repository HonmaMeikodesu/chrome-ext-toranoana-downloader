import { useCallback } from "react";
import { Task } from "../../types";
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, BugOutlined } from "@ant-design/icons";
import { Button, Collapse, CollapseProps } from "antd";
import { EventMessage, EventType } from "../../utils/evt";
import cx from "classnames";

import "./index.scss";

type ComponentProps = {
    tasks: Task[]
}

export default function TaskList(props: ComponentProps) {
    const { tasks } = props;

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

    const buildCollapseItems = useCallback(() => {
        const taskHeaderCls = "task-item-header";
        const taskBodyCls = "task-item-body";
        const ret: CollapseProps["items"] = (tasks || []).map((task) => {
            const { status, bookTitle, bookUrl, errorPageList } = task;
            const isExceptional = status === "error" || status === "fatal";
            return {
                label: (
                    <div className={taskHeaderCls}>
                        <div className={ `${taskHeaderCls}-title` } title={bookTitle}>
                            {bookTitle}
                        </div>
                        <div className={cx(`${taskHeaderCls}-status-${status}`, `${taskHeaderCls}-status`)}>{
                                status === "pending" ? <ClockCircleOutlined  />:
                                status === "downloading" ? <LoadingOutlined spin={true} />:
                                    status === "done" ? <CheckCircleOutlined /> :
                                status === "error" ? <CloseCircleOutlined /> :
                                status === "fatal" ? <BugOutlined /> : ""
                        }</div>
                        {isExceptional && <Button className={`${taskHeaderCls}-retry`} type="link" onClick={() => retry({ bookUrl, bookTitle, errorPageList: status === "error" ? errorPageList : undefined })}>重试</Button>}
                    </div>
                ),
                showArrow: isExceptional,
                collapsible: !isExceptional ? "disabled" : "header", 
                children: (
                    <div className={taskBodyCls}>
                        {
                            status === "error" && errorPageList?.length && (
                                <>
                                    <span>以下页码下载失败: </span>
                                    {
                                        errorPageList.map((pageNum, idx) => (
                                            <>
                                                <span className={`${taskBodyCls}-error-page`}>{pageNum}</span>
                                                {idx < errorPageList.length - 1 && <span>, </span>}
                                            </>

                                        ))
                                    }
                                </>

                            )
                        }
                        {
                            status === "fatal" && <div className={`${taskBodyCls}-fatal`}>系统异常，请重试</div>
                        }
                    </div>
                )
            }
        });
        return ret;
    }, [ tasks ]);

    return (
        <div className="task-list-container">
            {
                tasks.length ? (
                    <Collapse ghost={true} items={buildCollapseItems()} />
                ) : (
                    <div className="task-list-empty">
                        暂无任务
                    </div>
                )
            }
        </div>
    )
}