import { useCallback } from "react";
import { Task } from "../../types";
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Collapse, CollapseProps } from "antd";
import { EventMessage, EventType } from "../../utils/evt";
import cx from "classnames";

import "./index.scss";

type ComponentProps = {
    tasks: Task[]
}

export default function TaskList(props: ComponentProps) {
    const { tasks } = props;

    const retry = useCallback((params: { bookUrl: string, bookTitle: string, errorPageList: number[] }) => {
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
            return {
                label: (
                    <div className={taskHeaderCls}>
                        <div className={ `${taskHeaderCls}-title` }>
                            {bookTitle}
                        </div>
                        <div className={cx(`${taskHeaderCls}-status-${status}`, `${taskHeaderCls}-status`)}>{
                                status === "pending" ? <ClockCircleOutlined />:
                                status === "downloading" ? <LoadingOutlined spin={true} />:
                                status === "done" ? <CheckCircleOutlined />:
                                status === "error" ? <CloseCircleOutlined />: ""
                        }</div>
                    </div>
                ),
                showArrow: !errorPageList?.length,
                collapsible: !errorPageList?.length ? "disabled" : "header", 
                children: (
                    <div className={taskBodyCls}>
                        {
                            errorPageList?.length && (
                                <>
                                    <span>Download Fail for pages: </span>
                                    {
                                        errorPageList.map((pageNum) => (
                                            <>
                                                <span className={`${taskBodyCls}-error-page`}>{pageNum}</span>
                                                <span>,</span>
                                            </>

                                        ))
                                    }
                                    <Button type="text" onClick={() => retry({ bookUrl, bookTitle, errorPageList })}>Click to retry</Button>
                                </>

                            )
                        }
                        
                    </div>
                )
            }
        });
        return ret;
    }, [ tasks ]);

    return (
        <div className="task-list-container">
            <Collapse items={buildCollapseItems()} />
        </div>
    )
}