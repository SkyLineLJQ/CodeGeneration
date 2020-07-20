import React, {useEffect, useState} from 'react';
import {Button, Table, Divider, Tag, Radio, Input, Pagination, Modal, message, BackTop, Card} from 'antd';
import useReactRouter from 'use-react-router';
import {connect} from "react-redux";

import {
    getTaskList,
    getTaskDetailById
} from '../../service/commondata'

import './demoList.scss';

const {Search} = Input;

const mapStateToProps = ({language}) => ({
    language: language.language,
    lang: language.lang,
});

function demoList({language, lang}) {
    const {history, location, match} = useReactRouter();
    const [searchText, setSearchText] = useState("")
    const [seletRows, setSelectRows] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [tableData, setTableData] = useState([])
    const [taskListParams, setTaskListParams] = useState({
        "appName": "",
        "pageSize": 20,
        "current": 1,
    })
    const [pageInfo, setPageInfo] = useState({
        currentPage: 0,
        pageSize: 0,
        totalRows: 0
    })
    const [taskTableLoading, setTaskTableLoading] = useState(false)

    const columns =  [
        {{each }} {{ each $value.tableData }}
         {
             title: '{{$value.title}}',
             dataIndex: '{{$value.key}}',
             key: '{{$value.key}}',
             ellipsis: true,
             sorter: true,
         },
        {{ /each}} {{ /each }}
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
            <Button type='link' style={ {paddingLeft: 0} }
                    onClick={() => handleUpdate(record)}>修改</Button>
            ),
        },
    ]


    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectRows(selectedRows)
            setSelectedRowKeys(selectedRowKeys)
        },
    };

    useEffect(() => {
        setTaskTableLoading(true)
        getTaskList(taskListParams, res => {
            let resArray = []
            for (let i = 0; i < res.data.data.length; i++) {
                resArray.push({
                    ...res.data.data[i],
                    key: res.data.data[i].taskId + Math.random()
                })
            }
            setTableData(resArray)
            setPageInfo({
                ...pageInfo,
                currentPage: res.data.curPage,
                pageSize: res.data.rows,
                totalRows: res.data.totalRecords
            })
            setTaskTableLoading(false)
        }, err => {
            console.error(err)
            setTaskTableLoading(false)
        })
    }, [taskListParams])

    /**
     * 设置 Status 字段过滤
     * @param value
     */
    function handleChangeStatusSearch(value) {
        console.log(value)
    }

    /**
     * 过滤字段显示
     * @param {*} value
     */
    function handleChangeFilterSearch(value) {
        setSearchText(value)
    }

    /**
     * 过滤字段回车响应
     * @param {*} value
     */
    function handleEnterFilterSearch(value) {
        console.log(value)
    }

    /**
     * 修改
     * @param {*} row
     */
    function handleUpdate(row) {
        let updateScheduledTaskInfo = ''
        let parms = {
            taskId: row.taskId
        }
        getTaskDetailById(parms, res => {
            if (res.data.code == 0) {
                updateScheduledTaskInfo = res.data.data
            }
        })
    }


    /**
     * 分页 标题排序 过滤
     * @param {*} pagination
     * @param {*} filters
     * @param {*} sorter
     */
    function handleTableChangeSort(pagination, filters, sorter) {
        let tempTaskListParams = JSON.parse(JSON.stringify(taskListParams))
        tempTaskListParams.current = pagination.current
        tempTaskListParams.pageSize = pagination.pageSize
        setTaskListParams(tempTaskListParams)
    }

    return (
        <React.Fragment>
            <div className="taskManager">
                <div className="modeButtonRow">
                    <Button type="primary">新建</Button>
                    <Button type="danger">删除</Button>
                    <Radio.Group onChange={(e) => handleChangeStatusSearch(e.target.value)} defaultValue=""
                                 className="modeRadio">
                        <Radio.Button value="">全部</Radio.Button>
                        <Radio.Button
                            value="ON">启用</Radio.Button>
                        <Radio.Button
                            value="OFF">停用</Radio.Button>
                    </Radio.Group>
                    <Search
                        onSearch={value => handleEnterFilterSearch(value)}
                        onChange={(e => handleChangeFilterSearch(e.target.value))}
                        value={searchText}
                        allowClear
                        style={ {width: 300} }
                    />
                </div>
                <div className="mainTable">
                    <Table columns={columns} dataSource={tableData} rowSelection={rowSelection}
                           scroll={ {y: '100%'} }
                           loading={taskTableLoading}
                           style={ {padding: '0 15px 0 15px'} }
                           onChange={handleTableChangeSort}
                           size="small"
                           pagination={
                               {
                                   pageSize: pageInfo.pageSize,
                                   current: pageInfo.currentPage,
                                   showQuickJumper: true,
                                   showSizeChanger: true,
                                   showTotal: () => (
                                       lang === 'en' ?
                                           `Total: ${pageInfo.totalRows} `
                                           :
                                           `共 ${pageInfo.totalRows} 条`
                                   )
                               }
                           }/>
                </div>

            </div>
            <BackTop style={ {right: '50px', bottom: '20px'} }/>
        </React.Fragment>
    )
}

export default connect(mapStateToProps)(demoList);

