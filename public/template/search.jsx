import React, { useEffect, useState } from 'react';
import { Button, Table, DatePicker, Select, Radio, Input, Pagination, Modal, message, BackTop, Row, Col } from 'antd';
import { connect } from "react-redux";


import './demoSearch.scss';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const mapStateToProps = ({ language }) => ({
    language: language.language,
    lang: language.lang,
});

const dateFormat = 'YYYY/MM/DD';

function demoSearch({ language, lang, filterSearch }) {
    const [searchForm, setSearchForm] = useState({ {{each }}{{each $value.tableData}}
        {{$value.key}}: '', {{ /each}}{{/each}}
    })

    function toSearch() {
        filterSearch(searchForm)
    }

    return (
        <div className="searchForm">
            {{each}}{{ set length = $value.tableData.length  }}
            <Row gutter={[24, 16]}>
                <%for (var i = 0;i<length && i<3;i++) {%>
                <Col span={6} className="searchCol">
                    <label>{{$value.tableData[i].title}}</label>
                    {{if $value.tableData[i].type == 'input'}}<Input value={ searchForm.{{$value.tableData[i].key}} } onChange={(e)=>setSearchForm({...searchForm,{{$value.tableData[i].key}}: e.target.value})} /> {{/if}}
                    {{if $value.tableData[i].type == 'select'}}<Select
                        showSearch
                        style={ { width: '100%' } }
                        optionFilterProp="children"
                        allowClear
                        onChange={value=>{setSearchForm({...searchForm,{{$value.tableData[i].key}}: value})} }
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={searchForm.{{$value.tableData[i].key}}  }
                        >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                        </Select> {{/if}}
                    </Col>
                <%}%>
                 <Col span={6} className="searchCol" style={ {justifyContent: 'flex-end'} }>
                     <Button type="primary" onClick={()=>toSearch()}>查 询</Button>
                     <Button type="defalut">重 置</Button>
                 </Col>
            </Row>
            <%for (var i=1;i<length/4+1;i++) {%>
            <Row gutter={[24, 16]}>
                <%for (var j=i*4-1;j<length && j<(i+1)*4-1;j++) {%>
                <Col span={6} className="searchCol">
                    <label>{{$value.tableData[j].title}}</label>
                    {{if $value.tableData[j].type == 'input'}}<Input value={ searchForm.{{$value.tableData[j].key}} } onChange={(e)=>setSearchForm({...searchForm,{{$value.tableData[j].key}}: e.target.value})} /> {{/if}}
                    {{if $value.tableData[j].type == 'select'}}<Select
                        showSearch
                        style={ { width: '100%' } }
                        optionFilterProp="children"
                        allowClear
                        onChange={value=>{setSearchForm({...searchForm,{{$value.tableData[j].key}}: value})} }
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={searchForm.{{$value.tableData[j].key}}  }
                        >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                    </Select> {{/if}}
                </Col>
                <%}%>
            </Row>
            <%}%> {{/each}}
        </div>
    )
}

export default connect(mapStateToProps)(demoSearch);

