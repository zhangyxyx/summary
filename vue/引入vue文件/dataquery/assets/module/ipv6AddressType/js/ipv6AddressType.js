var curlPath = window.document.location.href;
var pathName = window.document.location.pathname;
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var tempName = "/ipaddrmodule"; //当前文件的跟目录
var bathPath = "";
var userName = jQuery.ITE.getLoginName('loginName'); //登录用户
if (projectName == tempName) {
    projectName = "";
} else {
    bathPath = curlPath.substring(0, pathName.indexOf('/')) + projectName;
}
var columnsData = [
    [{
            field: 'ipTypeCode',
            title: '地址类型',
            align: 'left',
            width: 80,
            formatter: function(value, row, index) {
                return row.ipTypeName
            }
        },
        { field: 'total', title: '地址总数', align: 'center', width: 60, },
        { field: 'assignedNum', title: '已注册地址数', align: 'center', width: 60, },
        { field: 'assignedRate', title: '注册率', align: 'center', width: 60, },
        { field: 'unUserdNum', title: '剩余地址数', align: 'center', width: 60 },
        { field: 'reportRate', title: '上报率', align: 'center', width: 60, },
        { field: 'backSynRate', title: '备案率', align: 'center', width: 60, fixed: true }
    ]
]
$(function() {
    getNodeList();
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

function SumAddrByTypeV6(nodecode) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/statistics/SumAddrByTypeV6?nodeCode=' + nodecode),
        type: 'get',
        cache: false,
        dataType: 'json',
        contentType: "application/json",
        success: function(obj) {
            var treelist = obj.data
            treeListFilter(treelist[0])
            treelist[0].state = 'open'
            $('#dataList').treegrid({
                data: obj.data,
                idField: 'ipTypeName',
                treeField: 'ipTypeCode',
                fitColumns: true,
                columns: columnsData
            });
        },
        error: function(error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
    });
}

function treeListFilter(tree) {
    if (tree.children.length > 0) {
        tree.state = 'closed'
        tree.children.forEach(function(t) {
            treeListFilter(t)
        })
    }
}
$('#queryAll').click(function() {
    SumAddrByTypeV6($("#nodeList").combotree('getValue'))
});