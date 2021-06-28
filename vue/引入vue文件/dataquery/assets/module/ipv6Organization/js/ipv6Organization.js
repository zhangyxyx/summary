var curlPath = window.document.location.href; 
var pathName = window.document.location.pathname;
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var tempName = "/ipaddrmodule"; //当前文件的跟目录
var bathPath = "";
var _ratio = ''
var userName = jQuery.ITE.getLoginName('loginName'); //登录用户
if (projectName == tempName) {
    projectName = "";
} else {
    bathPath = curlPath.substring(0, pathName.indexOf('/')) + projectName;
}
var columnsData = [
    [{
            field: 'nodeName',
            title: '管理组织',
            align: 'center',
            width: 100,
            formatter: function(value, row, index) {
                var _t = `<span class="nodecodeclick" nodecode="${row.nodeCode}">${value}</span>`
                return _t;
            }
        },
        { field: 'total', title: '地址总数', align: 'center' },
        {
            field: 'planNum',
            title: '往下级规划地址总数',
            align: 'center',
            width: 90,
            formatter: function(value, row, index) {
                var _t = ''
                if (value != '') {
                    _t = `<span class="plannum" nodecode="${row.nodeCode}">${value}</span>`
                } else {
                    _t = value
                }
                return _t;
            }
        },
        {
            field: 'allocNum',
            title: '往下级分配地址总数',
            align: 'center',
            width: 90,
            formatter: function(value, row, index) {
                var _t = ''
                if (value != '') {
                    _t = `<span class="allocnum" nodecode="${row.nodeCode}">${value}</span>`
                } else {
                    _t = value
                }
                return _t;
            }
        },
        {
            field: 'allocRate',
            title: '往下级分配率',
            align: 'center',
            width: 60,
            formatter: function(value, row, index) {
                var _t = ''
                if (value != '') {
                    _t = `<span class="allocnum" nodecode="${row.nodeCode}">${value}</span>`
                } else {
                    _t = value
                }
                return _t;
            }
        },
        {
            field: 'assignedNum',
            title: '已注册地址数',
            align: 'center',
            width: 90,
            formatter: function(value, row, index) {
                var _t = ''
                if (value != '') {
                    _t = `<span class="assignednum" nodecode="${row.nodeCode}">${value}</span>`
                } else {
                    _t = value
                }
                return _t;
            }
        },
        {
            field: 'assignedRate',
            title: '注册率',
            align: 'center',
            width: 50,
            formatter: function(value, row, index) {
                var _t = ''
                var _c = parseFloat(_ratio) > parseFloat(value) ? '#000000' : '#ff0000'
                if (value != '') {
                    _t = `<span class="assignednum" style="color:${_c};" nodecode="${row.nodeCode}">${value}</span>`
                } else {
                    _t = value
                }
                return _t;
            }
        },
        {
            field: 'reportRate',
            title: '上报率',
            align: 'center',
            width: 50,
            formatter: function(value, row, index) {
                var _t = ''
                if (value != '') {
                    _t = `<span class="reportrate" nodecode="${row.nodeCode}">${value}</span>`
                } else {
                    _t = value
                }
                return _t;
            }
        },
        {
            field: 'backSynRate',
            title: '备案率',
            align: 'center',
            width: 50,
            formatter: function(value, row, index) {
                var _t = ''
                if (value != '') {
                    _t = `<span class="backsynrate" nodecode="${row.nodeCode}">${value}</span>`
                } else {
                    _t = value
                }
                return _t;
            }
        },
        {
            field: 'op',
            title: '操作',
            align: 'center',
            width: 80,
            formatter: function(value, row, index) {
                var _t = `<span class="op" nodecode="${row.nodeCode}">本组织使用情况</span>`
                return _t;
            }
        },

    ]
];
var columnsDataDialog = [
    [{
            field: 'nodeName',
            title: '管理组织',
            align: 'center',
            width: 60,
        },
        {
            field: 'total',
            title: '地址总数',
            align: 'center',
            width: 60,
        },
        {
            field: 'assignedNum',
            title: '已注册地址数',
            align: 'center',
            width: 60,
        },
        {
            field: 'assignedRate',
            title: '注册率',
            align: 'center',
            width: 60,
            formatter: function(value, row, index) {
                var _t = ''
                var _c = parseFloat(_ratio) > parseFloat(value) ? '#000000' : '#ff0000'
                if (value != '') {
                    _t = `<span style="color:${_c};">${value}</span>`
                } else {
                    _t = value
                }
                return _t;
            }
        },
        {
            field: 'reportRate',
            title: '上报率',
            align: 'center',
            width: 60,
        },
        {
            field: 'backSynRate',
            title: '备案率',
            align: 'center',
            width: 60,
        },
    ]
]
$(function() {
    getNodeList();
    $('#dialog').dialog({
        title: '本组织使用情况',
        width: 800,
        height: 260,
        closed: true,
        modal: true,
    })
});
//获取节点信息
function getNodeList() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/NodeManage/GetNodeList'),
        type: 'post',
        cache: false,
        data: JSON.stringify({ userName: userName, nodeCode: $("#nodeCode").val() }),
        dataType: 'json',
        contentType: "application/json",
        success: function(obj) {
            let nodeList = obj.data;
            $("#nodeList").combotree({
                idField: 'nodeCode',
                textField: 'nodeName',
                data: nodeList,
                width: 220,
                panelHeight: 'auto', //高度自适应
                multiple: false,
                editable: false, //定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function() {
                    $("#nodeList").combotree('tree').tree("collapseAll");
                },
                filter: function(q, row) {
                    return row.text.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function(q, e) {
                        $('#nodeList').combotree('tree').tree('doFilter', q)
                    }
                },
            });
            //初始化显示权限节点
            $('#nodeList').combotree('setValue', nodeList[0].nodeCode);
            $("#queryAll").click();
        }
    });
}

function ExpAddrByNodeV6(nodecode) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/statistics/ExpAddrByNodeV6?nodeCode=' + nodecode),
        type: 'get',
        cache: false,
        dataType: 'json',
        contentType: "application/json",
        success: function(obj) {
            if (obj.code != '0000') return $.messager.alert('提示', obj.tip, 'error');
            var _u = '/ipmanage' + obj.data
            let downloadElement = document.createElement('a')
            downloadElement.href = _u
            document.body.appendChild(downloadElement)
            downloadElement.click() //点击下载
            document.body.removeChild(downloadElement) //下载完成移除元素
        },
        error: function(error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
    });
}

function SumAddrByNodeV6(nodecode) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/statistics/SumAddrByNodeV6?nodeCode=' + nodecode),
        type: 'get',
        cache: false,
        dataType: 'json',
        contentType: "application/json",
        success: function(obj) {
            $('.ratio').text(obj.data.ratio)
            _ratio = obj.data.ratio == '' ? 100 : obj.data.ratio
            let tableData = obj.data.sumdatalist;
            loadLabelTable(tableData);
        },
        error: function(error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
    });
}

function SumAddrByLocalNodeV6(nodecode) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/statistics/SumAddrByLocalNodeV6?nodeCode=' + nodecode),
        type: 'get',
        cache: false,
        dataType: 'json',
        contentType: "application/json",
        success: function(obj) {
            let tableData = [obj.data];
            var tableId = "dataListDialog";
            var tableH = 160;
            var opt = {
                columnsData: columnsDataDialog,
                data: tableData,
                tableH: tableH,
                NofilterRow: true,
                tableOpt: {
                    pagination: false //分页
                }
            };
            relatedTable(tableId, opt);
            $('#dialog').dialog('open')
        },
        error: function(error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
    });
}
//加载标识表格数据
function loadLabelTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    var tableId = "dataList";
    var tableH = $(".tablePanel").height();
    var opt = {
        columnsData: columnsData,
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false //分页
        }
    };
    relatedTable(tableId, opt);
}

$('#queryAll').click(function() {
    SumAddrByNodeV6($("#nodeList").combotree('getValue'))
});
$('#excel').click(function() {
    ExpAddrByNodeV6($("#nodeList").combotree('getValue'))
});
// 组织管理下钻
$(document).on('click', '.nodecodeclick', function() {
    var _nodecode = $(this).attr('nodecode')
    $("#nodeList").combotree('setValue', _nodecode)
    SumAddrByNodeV6($("#nodeList").combotree('getValue'))
});
// 往下级规划地址总数
$(document).on('click', '.plannum', function() {
    var _nodecode = $(this).attr('nodecode')
    window.top.$vm.$openTab({
            name: '地址规划',
            path: bathPath + '/ipaddrmodule/views/jsp/ipv6Plan/ipv6SecondPlan.jsp?nodecode=' + _nodecode
        })
        // window.open('/ipmanage/ipaddrmodule/views/jsp/ipv6Plan/ipv6SecondPlan.jsp?nodecode=' + _nodecode)
});
// 往下级分配地址总数\往下级分配率
$(document).on('click', '.allocnum', function() {
    var _nodecode = $(this).attr('nodecode')
    window.top.$vm.$openTab({
            name: '地址分配',
            path: bathPath + '/nos/ipv6manage/allocate/AllocateIpCondition.jsp?MenuNodeCode=' + _nodecode
        })
        // window.open('/ipmanage/nos/ipv6manage/allocate/AllocateIpCondition.jsp?NodeCode=' + _nodecode)
});
// 已注册地址\注册率
$(document).on('click', '.assignednum', function() {
    var _nodecode = $(this).attr('nodecode')
    window.top.$vm.$openTab({
            name: '地址注册',
            path: bathPath + '/nos/ipv6manage/assigned/InetnumAssignCondition.jsp?MenuNodeCode=' + _nodecode
        })
        // window.open('/ipmanage/nos/ipv6manage/assigned/InetnumAssignCondition.jsp?NodeCode=' + _nodecode)
});
// 上报率
$(document).on('click', '.reportrate', function() {
    var _nodecode = $(this).attr('nodecode')
    window.top.$vm.$openTab({
            name: '地址注册',
            path: bathPath + '/nos/ipv6manage/assigned/InetnumAssignCondition.jsp?reportflag=S&MenuNodeCode=' + _nodecode
        })
        // window.open('/ipmanage/nos/ipv6manage/assigned/InetnumAssignCondition.jsp?reportflag=S&NodeCode=' + _nodecode)
});
// 备案率
$(document).on('click', '.backsynrate', function() {
    var _nodecode = $(this).attr('nodecode')
    window.top.$vm.$openTab({
            name: '地址注册',
            path: bathPath + '/nos/ipv6manage/assigned/InetnumAssignCondition.jsp?IPBackSynFlag=1&MenuNodeCode=' + _nodecode
        })
        // window.open('/ipmanage/nos/ipv6manage/assigned/InetnumAssignCondition.jsp?IPBackSynFlag=1&NodeCode=' + _nodecode)
});
// 操作
$(document).on('click', '.op', function() {
    var _nodecode = $(this).attr('nodecode')
    SumAddrByLocalNodeV6(_nodecode)
})