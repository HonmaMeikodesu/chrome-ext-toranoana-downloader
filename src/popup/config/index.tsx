import { Button, Form, InputNumber, Popover } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { AppConfig } from "../../types";
import { useEffect, useState } from "react";

import "./index.scss";

type ComponentProps = {
    appConfig: AppConfig;
    onAppConfigChange: (appConfig: AppConfig) => void;
};

export default function Config(props: ComponentProps) {

    const { appConfig, onAppConfigChange } = props;

    const [form] = Form.useForm<AppConfig>();

    const [formValue, setFormValue] = useState<AppConfig>(appConfig);

    const [isFormDirty, setFormDirty] = useState(false);

    useEffect(() => {
        setFormValue(appConfig);
    }, [appConfig]);

    useEffect(() => {
        form.setFieldsValue(appConfig);
    }, [formValue])

    const popupContent = (
        <div className="app-config-container">
            <Form className="app-config-container-form" form={form} onFieldsChange={() => setFormDirty(true)}>
                <Form.Item name="multiThreadFetch" label="线程数" tooltip="下载线程数，默认为1，即单线程下载" >
                    <InputNumber min={1} step={1} precision={0} />
                </Form.Item>
            </Form>
            <Button disabled={!isFormDirty} type="primary" onClick={() => { onAppConfigChange?.(form.getFieldsValue()); setFormDirty(false); }}>保存</Button>
        </div>
    );

    return (
        <Popover content={popupContent} destroyTooltipOnHide trigger="click" placement="bottomLeft">
            <Button icon={<SettingOutlined />} className="app-config-btn">选项</Button>
        </Popover>
    )
}