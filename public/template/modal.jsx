import React, { useEffect, useState, createContext, useContext } from "react";
import {
    Button,
    Table,
    DatePicker,
    Select,
    Radio,
    Input,
    Pagination,
    Modal,
    message,
    BackTop,
    Row,
    Col,
    Checkbox,
    Form
} from "antd";
import { connect } from "react-redux";


import "./demoModal.scss";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const mapStateToProps = ({ language }) => ({
    language: language.language,
    lang: language.lang
});

const dateFormat = "YYYY/MM/DD";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
    }
};

function demoModal({ language, lang ,modalData,closeFormModal,submitFormData}) {
    const [form] = Form.useForm();

    function closeModal() {
        form.resetFields();
        closeFormModal()
    }

    function hanldeSubmitForm() {
        form.validateFields().then(value => {
            console.log(value);
            submitFormData(value)
            closeModal()
        })
            .catch(e => {
                console.log(e);
            });
    }

    useEffect(()=>{
        form.setFieldsValue(modalData.formData)
    },[])

    return (
        <div className="modalForm">
            <Modal
                title="Basic Modal"
                maskClosable={false}
                visible={modalData.visible}
                onCancel={() => closeModal()}
                onOk={() => hanldeSubmitForm()}
            >
                <Form form={form} {...formItemLayout}>
                    {{each}}{{ set length = $value.tableData.length  }}
                    {{each $value.tableData}}
                    <Form.Item
                        label="{{$value.title}}"
                        name="{{$value.key}}"
                    >
                {{if $value.type == 'input'}}<Input /> {{/if}}
                {{if $value.type == 'select'}}<Select allowClear>
                        <Select.Option value="demo">Demo</Select.Option>
                        <Select.Option value="omed">Omed</Select.Option>
                    </Select>{{/if}}
                    </Form.Item>
                    {{/each}}
                    {{/each}}
                </Form>
            </Modal>
        </div>
    );
}

export default connect(mapStateToProps)(demoModal);
