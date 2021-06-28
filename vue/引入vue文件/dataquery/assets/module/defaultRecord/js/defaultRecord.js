var columnsData = [
        [
            { field: 'backContact', title: '客户联系人', align: 'center', width: 100, fixed: true },
            { field: 'backTel', title: '客户联系电话', align: 'center', width: 100, fixed: true },
            { field: 'backEMail', title: '客户电子邮件', align: 'center', width: 100, fixed: true },
            { field: 'backIndustryIDName', title: '客户行业', align: 'center', width: 100, fixed: true },
            { field: 'backProvinceName', title: '单位所在省', align: 'center', width: 100, fixed: true },
            { field: 'backCityName', title: '单位所在市', align: 'center', width: 100, fixed: true },
            { field: 'backCountyName', title: '单位所在县', align: 'center', width: 100, fixed: true },
            { field: 'backGatewayIP', title: '网关IP地址', align: 'center', width: 100, fixed: true },
            { field: 'backGatewayLocation', title: '网关所在地址', align: 'center', width: 100, fixed: true },
            { field: 'backWgShengIdName', title: '网关所在省', align: 'center', width: 100, fixed: true },
            { field: 'backWgShiIdName', title: '网关所在市', align: 'center', width: 100, fixed: true },
            { field: 'backWgXianName', title: '网关所在县', align: 'center', width: 100, fixed: true },
            { field: 'backAddress', title: '单位详细地址', align: 'center', width: 100, fixed: true },
            { field: 'backUnit', title: '单位名称', align: 'center', width: 100, fixed: true },
            { field: 'backClassName', title: '单位所属分类', align: 'center', width: 100, fixed: true },
            { field: 'backUnitLevelName', title: '使用单位行政级别', align: 'center', width: 100, fixed: true },
            { field: 'backLicenseCode', title: '经营许可证编号', align: 'center', width: 100, fixed: true },
            { field: 'backUnitFlagName', title: '使用单位性质', align: 'center', width: 100, fixed: true },
            { field: 'backSydwzjlxName', title: '使用单位证件类型', align: 'center', width: 100, fixed: true },
            { field: 'backSydwzjhm', title: '使用单位证件号码', align: 'center', width: 100, fixed: true },
            { field: 'backYyfwlxName', title: '应用服务类型', align: 'center', width: 100, fixed: true },
            {
                field: 'backSyqyX',
                title: '使用区域',
                align: 'center',
                width: 100,
                fixed: true,
                formatter(val, row, index) {
                    var s = ''
                    if (row.backSyqy == '1') {
                        s = '境内'
                    } else {
                        s = '境外'
                    }
                    return s
                }
            },
            {
                field: 'ifReAllocationX',
                title: '是否报备再分配',
                align: 'center',
                width: 100,
                fixed: true,
                formatter(val, row, index) {
                    var s = ''
                    if (row.ifReAllocation == '1') {
                        s = '是'
                    } else {
                        s = '否'
                    }
                    return s
                }
            },
            { field: 'reAllocateUnitIDName', title: '再分配单位', align: 'center', width: 100, fixed: true },
            { field: 'aPnetname', title: 'netname', align: 'center', width: 100, fixed: true },
            { field: 'aPdescr', title: 'descr', align: 'center', width: 100, fixed: true },
            { field: 'aPadmin_c', title: 'admin-c', align: 'center', width: 100, fixed: true },
            { field: 'aPtech_c', title: 'tech-c', align: 'center', width: 100, fixed: true },
            { field: 'aPmnt_by', title: 'mnt-by', align: 'center', width: 100, fixed: true },
            { field: 'aPmnt_lower', title: 'mnt-lower', align: 'center', width: 100, fixed: true },
            { field: 'aPmnt_routes', title: 'mnt-routes', align: 'center', width: 100, fixed: true },
            { field: 'aPchanged', title: 'changed', align: 'center', width: 100, fixed: true },
            { field: 'aPmnt_irt', title: 'mnt-irt', align: 'center', width: 100, fixed: true },
            { field: 'aPrev_srv', title: 'rev_srv', align: 'center', width: 100, fixed: true },
            { field: 'aPnotify', title: 'notify', align: 'center', width: 100, fixed: true },
            { field: 'aPcountry', title: 'country', align: 'center', width: 100, fixed: true },
            { field: 'aPstatus', title: 'status', align: 'center', width: 100, fixed: true },
            { field: 'aPsource', title: 'source', align: 'center', width: 100, fixed: true },
            { field: 'space', title: '', align: 'center', width: 20, fixed: true },
        ]
    ],
    frozenColumns = [
        [{ field: 'checked', checkbox: true },
            {
                field: 'caozuo',
                title: '操作',
                align: 'center',
                width: 100,
                formatter(value, rowData, rowIndex) {
                    var c = "<a name='mm' href='#' data-rowindex='" + rowIndex + "' >修改</a></span>";
                    return c
                }
            }, { field: 'nodeName', title: '节点', align: 'center', width: 100 },
            { field: 'ipTypeName', title: '地址类型', align: 'center', width: 100 },
            { field: 'ipVersion', title: 'IP版本', align: 'center', width: 100 }
        ]
    ]
    //定义基础URL
var curlPath = window.document.location.href;
var pathName = window.document.location.pathname;
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var tempName = "/ipaddrmodule"; //当前文件的跟目录
var bathPath = "";
if (projectName == tempName) {
    projectName = "";
} else {
    bathPath = curlPath.substring(0, pathName.indexOf('/')) + projectName;
}
var jcObj = {
    userId: jQuery.ITE.getLoginName('loginName'),
    nodeCode: '',
    state: ''
}
var comboboxdata = [{
    label: 'IPV4',
    value: 'IPV4',
}, {
    label: 'IPV6',
    value: 'IPV6'
}]
var backSyqyData = [{
    label: '境内',
    value: '1',
}, {
    label: '境外',
    value: '2'
}]
$(function() {
    jcObj.nodeCode = getQueryString('nodecode')
    IpBackAreaCode('', 1)
    CustIndustry()
        // IpBacksydwzjlx()
    getCodeBook('inetnum', 'BackClass')
    getCodeBook('inetnum', 'UseUnitLevel')
    getCodeBook('inetnum', 'UseUnitFlag')
    getCodeBook('inetnum', 'Yyfwlx')
    IpBackIsp()
    $('#backSyqy').combobox({
        textField: 'label',
        valueField: 'value',
        data: [{
            label: '境内',
            value: '1',
        }, {
            label: '境外',
            value: '2'
        }],
        onLoadSuccess: function() {
            $('#backSyqy').combobox('setValue', '1')
        },
        onSelect: function(record) {}
    })
    $('#ipVersionX').combobox({
        textField: 'label',
        valueField: 'value',
        data: comboboxdata,
        onLoadSuccess: function() {
            $('#ipVersionX').combobox('setValue', 'IPV4')
            GetIPTypeV4List('#ipTypeCode')
        },
        onSelect: function(record) {
            // console.log(record)
            if (record.value == 'IPV4') {
                $('.v4Show').show()
                GetIPTypeV4List('#ipTypeCode')
            } else {
                $('.v4Show').hide()
                GetIPTypeV6List('#ipTypeCode')
            }
        }
    })
    $('#radio2').prop('checked', true)
    queryFiling()
    $(window).resize(function() {
        $('#tb').datagrid({
            width: getWidth(0.96),
            height: getHeight()
        });

    });
    $('#detailsPanel').window({
        onClose: function() {
            window.parent.noClickNode(true)
        }
    })
    IpBackAreaCodeWG('', 1)
    initClearBtnEvent()
});

/*表格宽度自适应*/
function getWidth(percent) {
    return $(window).width() * percent;
}

function getHeight() {
    return $(window).height() - 120;
}
$('#ipVersion').combobox({
    textField: 'label',
    valueField: 'value',
    data: comboboxdata,
    onLoadSuccess: function() {
        $('#ipVersion').combobox('setValue', 'IPV4')
        GetIPTypeV4List('#ipTypeList')
    },
    onSelect: function(record) {
        // console.log(record)
        if (record.value == 'IPV4') {
            GetIPTypeV4List('#ipTypeList')
        } else {
            GetIPTypeV6List('#ipTypeList')
        }
    }
})


function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
// V4地址类型查询
function GetIPTypeV4List(ID, val) {
    let params = {
        userName: jcObj.userId,
        nodeCode: jcObj.nodeCode,
        ipType: '',
        authType: '',
    }
    $.ajax({
        type: "post",
        url: encodeURI(bathPath + '/ipaddrmodule/IpAddrType/GetIPTypeV4List'),
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(params),
        success: function(res) {
            if (res.code == '0000') {
                var ipTypeList = res.data;
                // ipTypeList.unshift({ id: '', text: '' })
                $(ID).combotree({
                    idField: 'id',
                    textField: 'text',
                    data: ipTypeList,
                    width: 220,
                    panelHeight: 'auto', //高度自适应
                    multiple: false,
                    editable: false, //定义用户是否可以直接往文本域中输入文字
                    //直接过滤，数据太多时不行，太卡了，放弃
                    onLoadSuccess: function() {
                        if (val) {
                            $(ID).combotree('setValue', val)
                        } else {
                            $(ID).combotree('setValue', '')
                            $(ID).combotree('tree').tree("collapseAll");
                        }
                    },
                    filter: function(q, row) {
                        var opts = $(this).combobox('options');
                        return row[opts.textField].indexOf(q) == 0;
                        // return row.textField.indexOf(q) >= 0;
                    },
                    //本地过滤，根据输入关键字的值调用tree的过滤方法
                    keyHandler: {
                        query: function(q, e) {
                            $('#ipTypeList').combotree('tree').tree('doFilter', q)
                        }
                    },
                    onBeforeSelect: function(row) { //节点被选中前触发，返回 false 则取消选择动作(但是返回false，下拉选项依旧会关闭)
                        if (ID == '#ipTypeCode') {
                            if (row.click == "N") { //标签不可选
                                return false;
                            } else {
                                $('.clearBtnX').css('display', 'block');
                                return true;
                            }
                        } else {
                            if (row.click == "N") { //标签不可选
                                return false;
                            } else {
                                $('.clearBtn').css('display', 'block');
                                return true;
                            }
                        }
                    },
                });
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        },
        error: function() {
            jQuery.messager.alert('提示:', "获取节点加载数据失败!", 'warning');
        }
    })
}
//V6地址类型查询
function GetIPTypeV6List(ID, val) {
    let params = {
        userName: jcObj.userId,
        nodeCode: jcObj.nodeCode,
        ipType: '',
        authType: '',
    }
    $.ajax({
        type: "post",
        url: encodeURI(bathPath + '/ipaddrmodule/IPV6/IpAddrType/GetIPTypeV6List'),
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(params),
        success: function(res) {
            if (res.code == '0000') {
                var ipTypeList = res.data;
                // ipTypeList.unshift({ ipTypeId: '', ipTypeName: '' })
                $(ID).combotree({
                    idField: 'ipTypeId',
                    textField: 'ipTypeName',
                    data: ipTypeList,
                    width: 220,
                    panelHeight: 'auto', //高度自适应
                    multiple: false,
                    editable: false, //定义用户是否可以直接往文本域中输入文字
                    //直接过滤，数据太多时不行，太卡了，放弃
                    onLoadSuccess: function() {
                        if (val) {
                            $(ID).combotree('setValue', val)
                        } else {
                            $(ID).combotree('setValue', '')
                            $(ID).combotree('tree').tree("collapseAll");
                        }
                    },
                    filter: function(q, row) {
                        var opts = $(this).combobox('options');
                        return row[opts.textField].indexOf(q) == 0;
                        // return row.textField.indexOf(q) >= 0;
                    },
                    //本地过滤，根据输入关键字的值调用tree的过滤方法
                    keyHandler: {
                        query: function(q, e) {
                            $('#ipTypeList').combotree('tree').tree('doFilter', q)
                        }
                    },
                    onBeforeSelect: function(row) { //节点被选中前触发，返回 false 则取消选择动作(但是返回false，下拉选项依旧会关闭)
                        if (ID == '#ipTypeCode') {
                            if (row.click == "N") { //标签不可选
                                return false;
                            } else {
                                $('.clearBtnX').css('display', 'block');
                                return true;
                            }
                        } else {
                            if (row.click == "N") { //标签不可选
                                return false;
                            } else {
                                $('.clearBtn').css('display', 'block');
                                return true;
                            }
                        }

                    },
                });
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        },
        error: function() {
            jQuery.messager.alert('提示:', "获取节点加载数据失败!", 'warning');
        }
    })
}
//初始化地址类型清空按钮事件
function initClearBtnEvent() {
    $(".clearBtn").click(function() {
        $('#ipTypeList').combotree("clear")
        if ($("#ipTypeList").combotree('getValue') == "") {
            $('.clearBtn').css('display', 'none')
        } else {
            $('.clearBtn').css('display', 'block')
        }
    })
    $(".clearBtnX").click(function() {
        $('#ipTypeCode').combotree("clear")
        if ($("#ipTypeCode").combotree('getValue') == "") {
            $('.clearBtnX').css('display', 'none')
        } else {
            $('.clearBtnX').css('display', 'block')
        }
    })
}
// 默认备案信息查询接口
function queryFiling() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/DefaultFiling/queryFiling'),
        type: 'get',
        cache: false,
        data: { ipVersion: $('#ipVersion').combobox('getValue'), ipTypeCode: $('#ipTypeList').combotree('getValue'), nodeCode: jcObj.nodeCode },
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                $('.tablecon').show()
                var opt = {
                    columnsData: columnsData,
                    data: res.data,
                    widthW: getWidth(0.96),
                    tableH: getHeight(),
                    NofilterRow: false,
                    ipVersion:$('#ipVersion').combobox('getValue'),
                    tableOpt: {
                        frozenColumns: frozenColumns,
                        pagination: false,
                        singleSelect: false //为true时只允许选一行
                    }
                };
                relatedTable('tb', opt);
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}
// 获取地市信息接口--单位
function IpBackAreaCode(fatherareacode, levelflag) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/IpBackAreaCode'),
        type: 'get',
        cache: false,
        data: {
            fatherareacode: fatherareacode,
            levelflag: levelflag
        },
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                res.data.unshift({ AREANAME: '', AREACODE: '' })
                switch (levelflag) {
                    case 1:
                        $('#backProvince').combobox({
                            textField: 'AREANAME',
                            valueField: 'AREACODE',
                            data: res.data,
                            onLoadSuccess: function() {
                                $('#backProvince').combobox('setValue', '')
                                    // $('#backWgShengId').combobox('setValue', '')
                                $('#backWgShengId').combobox({
                                    textField: 'AREANAME',
                                    valueField: 'AREACODE',
                                    data: res.data,
                                    onLoadSuccess: function() {
                                        $('#backWgShengId').combobox('setValue', '')
                                    },
                                    onSelect: function(record) {}
                                })
                            },
                            onSelect: function(record) {
                                // console.log(record)
                                if (record.AREACODE == '') {
                                    $('#backCity').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backCity').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                    $('#backCounty').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backCounty').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                    $('#backWgShengId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: res.data,
                                        onLoadSuccess: function() {
                                            $('#backWgShengId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {
                                            IpBackAreaCodeWG(record.AREACODE, 2)
                                        }
                                    })
                                    $('#backWgShiId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backWgShiId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {
                                            // IpBackAreaCodeWG(record.AREACODE, 3)
                                        }
                                    })
                                    $('#backWgXianId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backWgXianId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                } else {
                                    IpBackAreaCode(record.AREACODE, 2)
                                    $('#backCounty').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backCounty').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                    $('#backWgShengId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: res.data,
                                        onLoadSuccess: function() {
                                            $('#backWgShengId').combobox('setValue', record.AREACODE)
                                        },
                                        onSelect: function(record) {
                                            IpBackAreaCodeWG(record.AREACODE, 2)
                                        }
                                    })
                                    $('#backWgShiId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backWgShiId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                    $('#backWgXianId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backWgXianId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                }


                            }
                        })

                        break;

                    case 2:
                        $('#backCity').combobox({
                            textField: 'AREANAME',
                            valueField: 'AREACODE',
                            data: res.data,
                            onLoadSuccess: function() {
                                $('#backCity').combobox('setValue', '')
                                    // $('#backWgShiId').combobox('setValue', '')
                                $('#backWgShiId').combobox({
                                    textField: 'AREANAME',
                                    valueField: 'AREACODE',
                                    data: res.data,
                                    onLoadSuccess: function() {
                                        $('#backWgShiId').combobox('setValue', '')
                                    },
                                    onSelect: function(record) {}
                                })
                            },
                            onSelect: function(record) {
                                // console.log(record)
                                if (record.AREACODE == '') {
                                    $('#backCounty').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backCounty').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                    $('#backWgShiId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: res.data,
                                        onLoadSuccess: function() {
                                            $('#backWgShiId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {
                                            IpBackAreaCodeWG(record.AREACODE, 3)
                                        }
                                    })
                                    $('#backWgXianId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backWgXianId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                } else {
                                    IpBackAreaCode(record.AREACODE, 3)
                                    $('#backWgShiId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: res.data,
                                        onLoadSuccess: function() {
                                            $('#backWgShiId').combobox('setValue', record.AREACODE)
                                        },
                                        onSelect: function(record) {
                                            IpBackAreaCodeWG(record.AREACODE, 3)
                                        }
                                    })
                                    $('#backWgXianId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backWgXianId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                }


                            }
                        })
                        break;

                    case 3:
                        $('#backCounty').combobox({
                            textField: 'AREANAME',
                            valueField: 'AREACODE',
                            data: res.data,
                            onLoadSuccess: function() {
                                $('#backCounty').combobox('setValue', '')
                                    // $('#backWgXianId').combobox('setValue', '')
                                $('#backWgXianId').combobox({
                                    textField: 'AREANAME',
                                    valueField: 'AREACODE',
                                    data: res.data,
                                    onLoadSuccess: function() {
                                        $('#backWgXianId').combobox('setValue', '')
                                    },
                                    onSelect: function(record) {}
                                })
                            },
                            onSelect: function(record) {
                                $('#backWgXianId').combobox({
                                    textField: 'AREANAME',
                                    valueField: 'AREACODE',
                                    data: res.data,
                                    onLoadSuccess: function() {
                                        $('#backWgXianId').combobox('setValue', record.AREACODE)
                                    },
                                    onSelect: function(record) {
                                        if (record.AREACODE == '') {
                                            $('#backWgXianId').combobox({
                                                textField: 'AREANAME',
                                                valueField: 'AREACODE',
                                                data: res.data,
                                                onLoadSuccess: function() {
                                                    $('#backWgXianId').combobox('setValue', '')
                                                },
                                                onSelect: function(record) {}
                                            })
                                        } else {
                                            $('#backWgXianId').combobox({
                                                textField: 'AREANAME',
                                                valueField: 'AREACODE',
                                                data: res.data,
                                                onLoadSuccess: function() {
                                                    $('#backWgXianId').combobox('setValue', record.AREACODE)
                                                },
                                                onSelect: function(record) {}
                                            })
                                        }
                                    }
                                })
                            }
                        })
                        break;

                    default:
                        break;
                }
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}
// 获取地市信息接口--网关
function IpBackAreaCodeWG(fatherareacode, levelflag) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/IpBackAreaCode'),
        type: 'get',
        cache: false,
        data: {
            fatherareacode: fatherareacode,
            levelflag: levelflag
        },
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                res.data.unshift({ AREANAME: '', AREACODE: '' })
                switch (levelflag) {
                    case 1:
                        $('#backWgShengId').combobox({
                            textField: 'AREANAME',
                            valueField: 'AREACODE',
                            data: res.data,
                            onLoadSuccess: function() {
                                $('#backWgShengId').combobox('setValue', '')
                            },
                            onSelect: function(record) {
                                // console.log(record)
                                if (record.AREACODE == '') {
                                    $('#backWgShiId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backWgShiId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {
                                            IpBackAreaCodeWG(record.AREACODE, 3)
                                        }
                                    })
                                    $('#backWgXianId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backWgXianId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })

                                } else {
                                    IpBackAreaCodeWG(record.AREACODE, 2)
                                    $('#backWgXianId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backWgXianId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                }

                            }
                        })

                        break;

                    case 2:
                        $('#backWgShiId').combobox({
                            textField: 'AREANAME',
                            valueField: 'AREACODE',
                            data: res.data,
                            onLoadSuccess: function() {
                                $('#backWgShiId').combobox('setValue', '')
                            },
                            onSelect: function(record) {
                                // console.log(record)
                                if (record.AREACODE == '') {
                                    $('#backWgXianId').combobox({
                                        textField: 'AREANAME',
                                        valueField: 'AREACODE',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backWgXianId').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                } else {
                                    IpBackAreaCodeWG(record.AREACODE, 3)
                                }

                            }
                        })
                        break;

                    case 3:
                        $('#backWgXianId').combobox({
                            textField: 'AREANAME',
                            valueField: 'AREACODE',
                            data: res.data,
                            onLoadSuccess: function() {
                                $('#backWgXianId').combobox('setValue', '')
                            },
                            onSelect: function(record) {}
                        })
                        break;

                    default:
                        break;
                }
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}
// 获取所属行业信息
function CustIndustry() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/CustIndustry'),
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                res.data.unshift({ INDUSTRYNAME: '', INDUSTRYID: '' })
                $('#backIndustryID').combobox({
                    textField: 'INDUSTRYNAME',
                    valueField: 'INDUSTRYID',
                    data: res.data,
                    onLoadSuccess: function() {
                        $('#backIndustryID').combobox('setValue', '')
                    },
                    onSelect: function(record) {}
                })
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}
// 单位证件类型接口
function IpBacksydwzjlx(dwflid, code) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/IpBacksydwzjlx'),
        data: {
            dwflid: dwflid
        },
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                res.data.unshift({ ZJLXMC: '', ZJLXID: '' })
                $('#backSydwzjlx').combobox({
                    textField: 'ZJLXMC',
                    valueField: 'ZJLXID',
                    data: res.data,
                    onLoadSuccess: function() {
                        if (code) {
                            $('#backSydwzjlx').combobox('setValue', code)
                        } else {
                            $('#backSydwzjlx').combobox('setValue', '')
                        }

                    },
                    onSelect: function(record) {}
                })
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}
// 系统配置信息接口
function getCodeBook(tablename, columnname) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/SysCommon/getCodeBook'),
        type: 'get',
        cache: false,
        data: {
            tablename: tablename,
            columnname: columnname
        },
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                res.data.unshift({ VALUE: '', CODE: '' })
                switch (columnname) {
                    case 'BackClass':
                        $('#backClass').combobox({
                            textField: 'VALUE',
                            valueField: 'CODE',
                            data: res.data,
                            onLoadSuccess: function() {
                                $('#backClass').combobox('setValue', '')
                            },
                            onSelect: function(record) {}
                        })
                        break;
                    case 'UseUnitLevel':
                        $('#backUnitLevel').combobox({
                            textField: 'VALUE',
                            valueField: 'CODE',
                            data: res.data,
                            onLoadSuccess: function() {
                                $('#backUnitLevel').combobox('setValue', '')
                            },
                            onSelect: function(record) {}
                        })
                        break;
                    case 'UseUnitFlag':
                        $('#backUnitFlag').combobox({
                            textField: 'VALUE',
                            valueField: 'CODE',
                            data: res.data,
                            onLoadSuccess: function() {
                                $('#backUnitFlag').combobox('setValue', '')
                            },
                            onSelect: function(record) {
                                if (record.CODE == '') {
                                    $('#backSydwzjlx').combobox({
                                        textField: 'ZJLXMC',
                                        valueField: 'ZJLXID',
                                        data: [],
                                        onLoadSuccess: function() {
                                            $('#backSydwzjlx').combobox('setValue', '')
                                        },
                                        onSelect: function(record) {}
                                    })
                                } else {
                                    IpBacksydwzjlx(record.CODE)
                                }
                            }
                        })
                        break;
                    case 'Yyfwlx':
                        $('#backYyfwlx').combobox({
                            textField: 'VALUE',
                            valueField: 'CODE',
                            multiple: true,
                            data: res.data,
                            onLoadSuccess: function() {
                                $('#backYyfwlx').combobox('setValues', [])
                            },
                            onSelect: function(record) {}
                        })
                        break;

                    default:
                        break;
                }
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}

//再分配对象单位
function IpYyfwlx() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/IpYyfwlx'),
        type: 'get',
        cache: false,
        // data: {
        //     nodecode: jcObj.nodeCode
        // },
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                res.data.unshift({ APPSERVID: '', APPSERVNAME: '' });
                $('#backYyfwlx').combobox({
                	  textField: 'APPSERVNAME',
                      valueField: 'APPSERVID',
                    multiple: true,
                    data: res.data,
                    onLoadSuccess: function() {
                        $('#backYyfwlx').combobox('setValues', [])
                    },
                    onSelect: function(record) {}
                })
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}

// 再分配对象单位
function IpBackIsp() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/IpBackIsp'),
        type: 'get',
        cache: false,
        // data: {
        //     nodecode: jcObj.nodeCode
        // },
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                res.data.unshift({ ISPNAME: '', ISPID: '' })
                $('#reAllocateUnitID').combobox({
                    textField: 'ISPNAME',
                    valueField: 'ISPID',
                    data: res.data,
                    onLoadSuccess: function() {
                        $('#reAllocateUnitID').combobox('setValue', '')
                    },
                    filter: function(q, row) {
                        var opts = $(this).combobox('options');
                        return (row[opts.textField].indexOf(q) >= 0 || row[opts.valueField].indexOf(q) >= 0);
                    },
                    onSelect: function(record) {}
                })
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}
// 2.3.8.默认备案信息批量新增接口
function FilingAddBath(obj) {
    var _arr = []
    _arr.push(obj)
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/DefaultFiling/FilingAddBath'),
        type: 'post',
        cache: false,
        data: JSON.stringify({ filingList: _arr }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000' && res.data[0].errorCode == '0000') {
                jQuery.messager.alert('提示:', '添加成功', 'success');
                $('#detailsPanel').window('close')
                queryFiling()
                window.parent.noClickNode(true);
            } else {
                jQuery.messager.alert('提示:', res.data[0].errormsg, 'warning');
            }
        }
    });
}
$('#query').click(function() { queryFiling() })
$('#newPanel').click(function() {
    window.parent.noClickNode(false);
    jcObj.state = 'add'
    $('#savePanel').show()
    $('#detailsPanel').window('open')
    $('#detailsPanel').css('opacity', 1)
    $('#detailsPanel').window('resize', {
        width: '820px',
        height: $(window).height() * 0.96,
        opacity: 1
    })
    $('#detailsPanel').window('center')
    $('#detailsPanel .layui-form .layui-inline').css('pointer-events', 'initial')
    $('#detailsPanel').window('center')
    $('#ipVersionX').combobox('setValue', 'IPV4')
    $('.v4Show').show()
    GetIPTypeV4List('#ipTypeCode')
        // $('#ipTypeCode').combotree('setValue', '')

    $('.itemipVersionX').css('pointer-events', 'initial')
    $('.itemipTypeCode').css('pointer-events', 'initial')

    $('#backContact').textbox('setValue', '')
    $('#backTel').textbox('setValue', '')
    $('#backEMail').textbox('setValue', '')
    $('#backIndustryID').combobox('setValue', '')
    $('#backProvince').combobox('setValue', '')
    $('#backCity').combobox('setValue', '')
    $('#backCounty').combobox('setValue', '')
    $('#backGatewayIP').textbox('setValue', '')
    $('#backGatewayLocation').textbox('setValue', '')
    $('#backWgShengId').combobox('setValue', '')
    $('#backWgShiId').combobox('setValue', '')
    $('#backWgXianId').combobox('setValue', '')
    $('#backAddress').textbox('setValue', '')
    $('#backUnit').textbox('setValue', '')
    $('#backClass').combobox('setValue', '')
    $('#backUnitLevel').combobox('setValue', '')
    $('#backLicenseCode').textbox('setValue', '')
    $('#backUnitFlag').combobox('setValue', '')
    $('#backSydwzjlx').combobox('setValue', '')
    $('#backSydwzjhm').textbox('setValue', '')
    $('#backYyfwlx').combobox('setValues', [])
    $('#backSyqy').combobox('setValue', '1')
    $('#radio2').prop('checked', true)
    $('#reAllocateUnitID').combobox('setValue', '')
    $('#aPnetname').textbox('setValue', '')
    $('#aPdescr').textbox('setValue', '')
    $('#aPadmin_c').textbox('setValue', '')
    $('#aPtech_c').textbox('setValue', '')
    $('#aPmnt_by').textbox('setValue', '')
    $('#aPmnt_lower').textbox('setValue', '')
    $('#aPmnt_routes').textbox('setValue', '')
    $('#aPchanged').textbox('setValue', '')
    $('#aPmnt_irt').textbox('setValue', '')
    $('#aPrev_srv').textbox('setValue', '')
    $('#aPnotify').textbox('setValue', '')
    $('#aPcountry').textbox('setValue', '')
    $('#aPstatus').textbox('setValue', '')
    $('#aPsource').textbox('setValue', '')
})

function saveClick() {
    if ($('#backClass').combobox('getValue') == '11' && $('#backLicenseCode').textbox('getValue') == '') return $.messager.alert('提示信息', '当单位所属分类为：电信业务经营者，经营许可证编号为必填项，请输入！', 'error')
    if ($('#radio1').prop('checked') && $('#reAllocateUnitID').combobox('getValue') == '') return $.messager.alert('提示信息', '再分配对象单位不能为空,请输入！', 'error')
    if ($('#backTel').textbox('getValue').length > 12 || ($('#backTel').textbox('getValue') != '' && !(checkMobile($('#backTel').textbox('getValue'))))) return $.messager.alert('提示信息', '客户联系电话错误,请输入！', 'error')
    if ($('#backEMail').textbox('getValue') != '' && !(checkEmail($('#backEMail').textbox('getValue')))) return $.messager.alert('提示信息', '客户电子邮件错误,请输入！', 'error')
    if ($('#ipVersionX').combobox('getValue') == 'IPV4') {
        if ($('#backGatewayIP').textbox('getValue') != '' && !(checkIPV4($('#backGatewayIP').textbox('getValue')))) return $.messager.alert('提示信息', '网关IP地址错误,请输入！', 'error')
    } else {
        if ($('#backGatewayIP').textbox('getValue') != '' && !(checkIPV6($('#backGatewayIP').textbox('getValue')))) return $.messager.alert('提示信息', '网关IP地址错误,请输入！', 'error')
    }
    var obj = {
        nodeCode: jcObj.nodeCode,
        ipVersion: $('#ipVersionX').combobox('getValue'),

        ipTypeCode: $('#ipTypeCode').combotree('getValue'),
        backContact: $('#backContact').textbox('getValue'),
        backTel: $('#backTel').textbox('getValue'),
        backEMail: $('#backEMail').textbox('getValue'),
        backIndustryID: $('#backIndustryID').combobox('getValue'),
        backProvince: $('#backProvince').combobox('getValue'),
        backCity: $('#backCity').combobox('getValue'),
        backCounty: $('#backCounty').combobox('getValue'),
        backGatewayIP: $('#backGatewayIP').textbox('getValue'),
        backGatewayLocation: $('#backGatewayLocation').textbox('getValue'),
        backWgShengId: $('#backWgShengId').combobox('getValue'),
        backWgShiId: $('#backWgShiId').combobox('getValue'),
        backWgXianId: $('#backWgXianId').combobox('getValue'),
        backAddress: $('#backAddress').textbox('getValue'),
        backUnit: $('#backUnit').textbox('getValue'),
        backClass: $('#backClass').combobox('getValue'),
        backUnitLevel: $('#backUnitLevel').combobox('getValue'),
        backLicenseCode: $('#backLicenseCode').textbox('getValue'),
        backUnitFlag: $('#backUnitFlag').combobox('getValue'),
        backSydwzjlx: $('#backSydwzjlx').combobox('getValue'),
        backSydwzjhm: $('#backSydwzjhm').textbox('getValue'),
        backYyfwlx: $('#backYyfwlx').combobox('getValues').join(','),
        backSyqy: $('#backSyqy').combobox('getValue'),
        ifReAllocation: $('#radio1').prop('checked') ? '1' : '0',
        reAllocateUnitID: $('#reAllocateUnitID').combobox('getValue'),
        aPnetname: $('#ipVersionX').combobox('getValue')=='IPV6'?'':$('#aPnetname').textbox('getValue'),
        aPdescr: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPdescr').textbox('getValue'),
        aPadmin_c: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPadmin_c').textbox('getValue'),
        aPtech_c: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPtech_c').textbox('getValue'),
        aPmnt_by: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPmnt_by').textbox('getValue'),
        aPmnt_lower: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPmnt_lower').textbox('getValue'),
        aPmnt_routes: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPmnt_routes').textbox('getValue'),
        aPchanged: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPchanged').textbox('getValue'),
        aPmnt_irt: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPmnt_irt').textbox('getValue'),
        aPrev_srv: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPrev_srv').textbox('getValue'),
        aPnotify: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPnotify').textbox('getValue'),
        aPcountry: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPcountry').textbox('getValue'),
        aPstatus: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPstatus').textbox('getValue'),
        aPsource: $('#ipVersionX').combobox('getValue')=='IPV6'?'': $('#aPsource').textbox('getValue'),

    }
    if (jcObj.state == 'add') {
        FilingAddBath(obj)
    } else {
        FilingUpdateBath(obj)
    }
}

function modClick(row) {
    window.parent.noClickNode(false);
    jcObj.state = 'mod'

    $('#savePanel').show()
    $('#detailsPanel').window('open')
    $('#detailsPanel').css('opacity', 1)
    $('#detailsPanel').window('resize', {
        width: '820px',
        height: $(window).height() * 0.96,
        opacity: 1
    })
    $('#detailsPanel .layui-form').attr('filingID', row.filingID)
    $('#detailsPanel .layui-form .layui-inline').css('pointer-events', 'initial')
    $('#detailsPanel').window('center')
    $('#ipVersionX').combobox('setValue', row.ipVersion)

    // $('#ipTypeCode').combotree('setValue', row.ipTypeCode)
    if (row.ipVersion == 'IPV4') {
        GetIPTypeV4List('#ipTypeCode', row.ipTypeCode)
        $('.v4Show').show()
    } else {
        GetIPTypeV6List('#ipTypeCode', row.ipTypeCode)
        $('.v4Show').hide()
    }

    $('.itemipVersionX').css('pointer-events', 'none')
    $('.itemipTypeCode').css('pointer-events', 'none')
    $('#backContact').textbox('setValue', row.backContact)
    $('#backTel').textbox('setValue', row.backTel)
    $('#backEMail').textbox('setValue', row.backEMail)
    $('#backIndustryID').combobox('setValue', row.backIndustryID)
        // $('#backProvince').combobox('setValue', row.backProvince)
        // $('#backCity').combobox('setValue', row.backCity)
        // $('#backCounty').combobox('setValue', row.backCounty)

    IpBackAreaCodeWGMod('', 1, '#backProvince', row.backProvince)
    IpBackAreaCodeWGMod(row.backProvince, 2, '#backCity', row.backCity)
    IpBackAreaCodeWGMod(row.backCity, 3, '#backCounty', row.backCounty)

    $('#backGatewayIP').textbox('setValue', row.backGatewayIP)
    $('#backGatewayLocation').textbox('setValue', row.backGatewayLocation)
        // $('#backWgShengId').combobox('setValue', row.backWgShengId)
        // $('#backWgShiId').combobox('setValue', row.backWgShiId)
        // $('#backWgXianId').combobox('setValue', row.backWgXianId)

    IpBackAreaCodeWGMod('', 1, '#backWgShengId', row.backWgShengId)
    IpBackAreaCodeWGMod(row.backWgShengId, 2, '#backWgShiId', row.backWgShiId)
    IpBackAreaCodeWGMod(row.backWgShiId, 3, '#backWgXianId', row.backWgXianId)

    $('#backAddress').textbox('setValue', row.backAddress)
    $('#backUnit').textbox('setValue', row.backUnit)
    $('#backClass').combobox('setValue', row.backClass)
    $('#backUnitLevel').combobox('setValue', row.backUnitLevel)
    $('#backLicenseCode').textbox('setValue', row.backLicenseCode)
    $('#backUnitFlag').combobox('setValue', row.backUnitFlag)

    IpBacksydwzjlx(row.backUnitFlag, row.backSydwzjlx)
        // $('#backSydwzjlx').combobox('setValue', row.backSydwzjlx)
    $('#backSydwzjhm').textbox('setValue', row.backSydwzjhm)
    $('#backYyfwlx').combobox('setValues', row.backYyfwlx.split(','))
    $('#backSyqy').combobox('setValue', row.backSyqy)
    if (row.ifReAllocation == '1') {
        $('#radio1').prop('checked', true)
    } else {
        $('#radio2').prop('checked', true)
    }
    $('#reAllocateUnitID').combobox('setValue', row.reAllocateUnitID)
    $('#aPnetname').textbox('setValue', row.aPnetname)
    $('#aPdescr').textbox('setValue', row.aPdescr)
    $('#aPadmin_c').textbox('setValue', row.aPadmin_c)
    $('#aPtech_c').textbox('setValue', row.aPtech_c)
    $('#aPmnt_by').textbox('setValue', row.aPmnt_by)
    $('#aPmnt_lower').textbox('setValue', row.aPmnt_lower)
    $('#aPmnt_routes').textbox('setValue', row.aPmnt_routes)
    $('#aPchanged').textbox('setValue', row.aPchanged)
    $('#aPmnt_irt').textbox('setValue', row.aPmnt_irt)
    $('#aPrev_srv').textbox('setValue', row.aPrev_srv)
    $('#aPnotify').textbox('setValue', row.aPnotify)
    $('#aPcountry').textbox('setValue', row.aPcountry)
    $('#aPstatus').textbox('setValue', row.aPstatus)
    $('#aPsource').textbox('setValue', row.aPsource)
    console.log(row)
}
// 批量修改 默认备案信息
function FilingUpdateBath(obj) {
    obj.filingID = $('#detailsPanel .layui-form').attr('filingID')
    obj.num = 1
    var _arr = []
    _arr.push(obj)
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/DefaultFiling/FilingUpdateBath'),
        type: 'post',
        cache: false,
        data: JSON.stringify({ filingList: _arr }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000' && res.data[0].errorCode == '0000') {
                jQuery.messager.alert('提示:', '修改成功', 'success');
                $('#detailsPanel').window('close')
                queryFiling()
                window.parent.noClickNode(true);
            } else {
                jQuery.messager.alert('提示:', res.data[0].errormsg, 'warning');
            }
        }
    });
}
// 默认备案信息删除接口
function FilingDelBath(filingID) {
    var _arr = []
    if (filingID.length == 1) {
        _arr.push({
            filingID: filingID.join(),
            num: 1
        })
    } else {
        filingID.forEach(function(val, list, index) {
            _arr.push({
                filingID: val
            })
        })
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/DefaultFiling/FilingDelBath'),
        type: 'post',
        cache: false,
        data: JSON.stringify({ filingList: _arr }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                jQuery.messager.alert('提示:', '删除成功', 'success');
                queryFiling()
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}

function toView(row) {
    window.parent.noClickNode(false);
    $('#savePanel').hide()
    $('#detailsPanel').window('open')
    $('#detailsPanel').css('opacity', 1)
    $('#detailsPanel').window('resize', {
        width: '820px',
        height: $(window).height() * 0.96,
        opacity: 1
    })
    $('#detailsPanel').window('center')
    $('#detailsPanel .layui-form').attr('filingID', row.filingID)
    $('#detailsPanel .layui-form .layui-inline').css('pointer-events', 'initial')
    $('#detailsPanel').window('center')
    $('#ipVersionX').combobox('setValue', row.ipVersion)

    $('#ipTypeCode').combotree('setValue', row.ipTypeName)
    if (row.ipVersion == 'IPV4') {
        $('.v4Show').show()
    } else {
        $('.v4Show').hide()
    }
    $('#backContact').textbox('setValue', row.backContact)
    $('#backTel').textbox('setValue', row.backTel)
    $('#backEMail').textbox('setValue', row.backEMail)
    $('#backIndustryID').combobox('setValue', row.backIndustryIDName)
    $('#backProvince').combobox('setValue', row.backProvinceName)
    $('#backCity').combobox('setValue', row.backCityName)
    $('#backCounty').combobox('setValue', row.backCountyName)
    $('#backGatewayIP').textbox('setValue', row.backGatewayIP)
    $('#backGatewayLocation').textbox('setValue', row.backGatewayLocation)
    $('#backWgShengId').combobox('setValue', row.backWgShengIdName)
    $('#backWgShiId').combobox('setValue', row.backWgShiIdName)
    $('#backWgXianId').combobox('setValue', row.backWgXianName)
    $('#backAddress').textbox('setValue', row.backAddress)
    $('#backUnit').textbox('setValue', row.backUnit)
    $('#backClass').combobox('setValue', row.backClass)
    $('#backUnitLevel').combobox('setValue', row.backUnitLevel)
    $('#backLicenseCode').textbox('setValue', row.backLicenseCode)
    $('#backUnitFlag').combobox('setValue', row.backUnitFlag)
    $('#backSydwzjlx').combobox('setValue', row.backSydwzjlx)

    IpBacksydwzjlx(row.backUnitFlag, row.backSydwzjlx)
        // $('#backSydwzjhm').textbox('setValue', row.backSydwzjhm)

    $('#backYyfwlx').combobox('setValues', row.backYyfwlx.split(','))
    $('#backSyqy').combobox('setValue', row.backSyqy)
    if (row.ifReAllocation == '1') {
        $('#radio1').prop('checked', true)
    } else {
        $('#radio2').prop('checked', true)
    }
    $('#reAllocateUnitID').combobox('setValue', row.reAllocateUnitID)
    $('#aPnetname').textbox('setValue', row.aPnetname)
    $('#aPdescr').textbox('setValue', row.aPdescr)
    $('#aPadmin_c').textbox('setValue', row.aPadmin_c)
    $('#aPtech_c').textbox('setValue', row.aPtech_c)
    $('#aPmnt_by').textbox('setValue', row.aPmnt_by)
    $('#aPmnt_lower').textbox('setValue', row.aPmnt_lower)
    $('#aPmnt_routes').textbox('setValue', row.aPmnt_routes)
    $('#aPchanged').textbox('setValue', row.aPchanged)
    $('#aPmnt_irt').textbox('setValue', row.aPmnt_irt)
    $('#aPrev_srv').textbox('setValue', row.aPrev_srv)
    $('#aPnotify').textbox('setValue', row.aPnotify)
    $('#aPcountry').textbox('setValue', row.aPcountry)
    $('#aPstatus').textbox('setValue', row.aPstatus)
    $('#aPsource').textbox('setValue', row.aPsource)
    $('#detailsPanel .layui-form .layui-inline').css('pointer-events', 'none')
}

$('#closePanel').click(function() {
    closePanel()
})

function closePanel() {
    window.parent.noClickNode(true);
    $('#detailsPanel').window('close')
}

function checkIPV4(str) {
    var f = true
    var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (re.test(str)) {
        f = true
    } else {
        f = false
    }
    return f
}

function checkIPV6(str) {
    var f = true
    var re = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
    if (re.test(str)) {
        f = true
    } else {
        f = false
    }
    return f
}
//检查IPv6地址/段的地址是否正确
function checkInetnum(ipaddr) {
    var f = true
    var result = "";
    var ipv6addr = ipaddr.trim();
    var prefix = "";
    var loc = ipv6addr.indexOf("/");
    if (loc != -1) {
        //截取IPv6地址
        ipv6addr = ipv6addr.substr(0, loc);
        prefix = ipv6addr.substring(loc + 1, ipv6addr.length);
    }
    //校验IPv6地址
    if (IPV6Formatting(ipv6addr) == "Error") {
        $.messager.alert('提示信息', ipaddr + '地址格式非法，请重新填写!', 'error')
            // alert(ipaddr+"地址格式非法，请重新填写!");   
        f = false
    }
    //校验地址前缀
    if (prefix != "") {
        if (!isNumber(prefix, "int")) {
            $.messager.alert('提示信息', ipaddr + 'prefix+"地址前缀应填写数字!', 'error')
                // alert(prefix+"地址前缀应填写数字!");   
            f = false
        }
        //地址前缀应为1-128的数字
        if (parseInt(prefix) > 128 || parseInt(prefix) < 1) {
            $.messager.alert('提示信息', '地址前缀应为1-128间的数字!', 'error')
                // alert("地址前缀应为1-128间的数字!");   
            f = false
        }
    }
    return f;
}

function IPV6Formatting(IPstr) {
    if (IPstr == null) {
        return "Error";
    }
    if (IPstr == "") {
        return "Error";
    }
    var i = 0;
    var marknum = 0;
    var mark1 = IPstr.indexOf("::");
    var mark2 = IPstr.lastIndexOf("::");
    if (mark1 != mark2) {
        return "Error";
    }
    var tmpstr = IPstr;
    if (tmpstr.indexOf(".") >= 0) {
        var v4tmp = tmpstr.substring(tmpstr.lastIndexOf(":") + 1, tmpstr.length);
        if (IPFormatting(v4tmp).indexOf("Error") >= 0) {
            return "Error";
        }
        marknum = marknum + 2;
        tmpstr = tmpstr.substring(0, tmpstr.lastIndexOf(":"));
    }
    var strlen = tmpstr.length;
    for (i = 0; i < strlen; i++) {
        var tmpchar = tmpstr.charAt(i);
        if (tmpchar != ':' && (tmpchar < '0' || tmpchar > '9') && (tmpchar < 'a' || tmpchar > 'f') && (tmpchar < 'A' || tmpchar > 'F')) {
            return "Error";
        }
    }
    tmpstr = tmpstr + ":";
    while (tmpstr.indexOf(":") != -1) {
        var substr = tmpstr.substring(0, tmpstr.indexOf(":"));
        var tmplen = tmpstr.length;
        if (tmplen != tmpstr.indexOf(":") + 1) {
            tmpstr = tmpstr.substring(tmpstr.indexOf(":") + 1, tmpstr.length);
        } else {
            tmpstr = "";
        }
        if (substr != "") {
            if (substr.length > 4) {
                return "Error";
            }
        }
        marknum = marknum + 1;
        if (marknum > 8) {
            return "Error";
        }
    }
    if (marknum < 3) {
        return "Error";
    }
    if (mark1 == -1 && marknum < 8) {
        return "Error";
    }
    return IPstr;
}

function IPFormatting(IPstr) {
    if (IPstr == null) {
        return "Error";
    }
    if (IPstr == "") {
        return "Error";
    }
    IPstr = IPstr + ".";
    var i = 1;
    var j;
    var temp = "";
    var ReturnIP = "";
    while (IPstr.indexOf(".") != -1) {
        if (i > 4) {
            return "Error";
        }
        temp = IPstr.substring(0, IPstr.indexOf("."));
        while ((j = temp.indexOf(" ")) != -1) {
            temp = temp.substring(0, j) + temp.substring(j + 1, temp.length);
        }
        if (temp.length > 3) {
            return "Error";
        }
        j = 0;
        while (temp.length > 1) {
            if (temp.charAt(j) == 0) {
                temp = temp.substring(1, temp.length);
            } else {
                break;
            }
        }
        if (!isNumber(temp, "int")) {
            return "Error";
        }
        if (parseInt(temp) > 255 || parseInt(temp) < 0 || (parseInt(temp) == 0 && i == 1)) {
            return "Error";
        }
        ReturnIP = ReturnIP + parseInt(temp) + ".";
        IPstr = IPstr.substring(IPstr.indexOf(".") + 1, IPstr.length);
        i++;
    }
    if (i != 5) {
        return "Error";
    }
    return ReturnIP.substring(0, ReturnIP.length - 1);
}

function checkMobile(str) {
    var f = true
    var re = /^1\d{10}$/,
        re2 = /^([0-9]{3,4}-)?[0-9]{7,8}$/
    if (str.indexOf('-') > -1) {
        if (re2.test(str)) {
            f = true
        } else {
            f = false
        }
    } else {
        if (re.test(str)) {
            f = true
        } else {
            f = false
        }
    }

    return f
}

function checkEmail(str) {
    var f = true
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (re.test(str)) {
        f = true
    } else {
        f = false
    }
    return f
}

// 获取地市信息接口--修改
function IpBackAreaCodeWGMod(fatherareacode, levelflag, ID, _d) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/IpBackAreaCode'),
        type: 'get',
        cache: false,
        data: {
            fatherareacode: fatherareacode,
            levelflag: levelflag
        },
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                res.data.unshift({ AREANAME: '', AREACODE: '' })
                $(ID).combobox({
                    textField: 'AREANAME',
                    valueField: 'AREACODE',
                    data: res.data,
                    onLoadSuccess: function() {
                        $(ID).combobox('setValue', _d)
                    },

                })
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}
$('#del').click(function() {
    var _delList = $('#tb').datagrid('getChecked');
    if (_delList.length < 1) return $.messager.alert('提示信息', '请选择要删除的数据', "info");
    var filingIDList = []
    _delList.forEach(function(val, row, index) {
        filingIDList.push(val.filingID)
    })
    $.messager.confirm('操作提示', '是否确认删除?', function(data) {
        if (data) {
            FilingDelBath(filingIDList)
        }
    })
})