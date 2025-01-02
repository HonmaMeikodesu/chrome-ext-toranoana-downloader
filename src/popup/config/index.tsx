import { Button, Form, InputNumber, Popover, Select } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useI18n } from "../hooks/useI18n.js";
import { AppConfig } from "../../types.js";

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

    const [title, save, multiThreadFetchLabel, multiThreadFetchTooltip, localeLabel] = useI18n(["UI.popup.configForm.title", "UI.popup.configForm.saveAndApply", "UI.popup.configForm.multiThreadFetchLabel", "UI.popup.configForm.multiThreadFetchTooltip", "UI.popup.configForm.localeLabel"])

    const localeOptions: Array<{ label: string, value: AppConfig["locale"] }> = [
        // { label: "简体中文", value: "zh-CN" }, 
        { label: "English", value: "en" }
    ];

    const popupContent = (
        <div className="app-config-container">
            <Form className="app-config-container-form" form={form} onFieldsChange={() => setFormDirty(true)}>
                <Form.Item name="multiThreadFetch" label={multiThreadFetchLabel} tooltip={multiThreadFetchTooltip}>
                    <InputNumber min={1} step={1} precision={0} />
                </Form.Item>
                <Form.Item name="locale" label={localeLabel}>
                    <Select options={localeOptions}></Select>
                </Form.Item>
            </Form>
            <Button disabled={!isFormDirty} type="primary" onClick={() => { onAppConfigChange?.(form.getFieldsValue()); setFormDirty(false); }}>{save}</Button>
        </div>
    );

    return (
        <Popover content={popupContent} destroyTooltipOnHide trigger="click" placement="bottomLeft">
            <Button icon={<SettingOutlined />} className="app-config-btn">{title}</Button>
        </Popover>
    )
}