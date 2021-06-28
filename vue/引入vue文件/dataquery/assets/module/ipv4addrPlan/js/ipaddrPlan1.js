//接收的参数
var getParam = {};
//v4地址规划树查询Data
var AddrPlanV4 = {}
//表格列
var relatedColumns1 = [
    [
        {
            field: ' ', title: '<input type="checkbox"/>全选 ', align: 'center',
            formatter: function (value, row, index) {
                if (row.IsAllocated == '0') {
                    return '<input type="checkbox"/>';
                }
                else {
                    return '';
                }
            }
        },
    { field: 'Nodename', title: '分配组织', align: 'center' },
    { field: 'Nextnodename', title: '申请组织', align: 'center' },
    { field: 'IptypeName', title: '新地址类型', align: 'center' },
    { field: 'IptypeName', title: '原地址类型', align: 'center' },
    { field: 'VPNINSTANCE', title: '分配人', align: 'center' },
    { field: 'ReplyMan', title: '分配时间', align: 'center' },
    {field: ' 1', title: '操作 ', align: 'center',
         formatter: function (value, row, index) {
        if (row.IsAllocated == '0') {
            return '<a class="itebtn1" onclick="planRecover(this)"><span>规划回收</span><input type="hidden" value="' + row + '"></button>'
        }
        else {
            return '';
        }
    }
    }
 
    ]
];
//规划地址详细地址---表格
function getSearchData() {
    $.ajax({
        //url: 'assets/module/ipaddrPlan/json/2.json',
        url:'assets/module/ipaddrPlan/json/GetPlanAddrAllocatedListV4.json',
        beforeSend: function () {
        },
        complete: function () {
        },
        dataType: 'json',
        success: function (data) {
            var data1 = data
            //渲染表格
            relatedTable(1, "userList", data1, relatedColumns1);
        }
    });
}
//表格
function relatedTable(pagesizetrk, id, data, columnsData) {
    $("#" + id).children('.noData').remove();
    var datagridOpt = {
        headerCls: 'weasyui-datagrid-header',
        bodyCls: 'weasyui-datagrid-body',
        width: '100%',
        striped: true,
        pagination: false, //分页控件
        fitColumns: true,
        showRefresh: false, //是否显示刷新按钮
        singleSelect: true,
        columns: columnsData,
        data: data
    };

    $("#" + id).datagrid(datagridOpt);


}
$(function () {
    getSearchData()
})
//查询
$('#search').on('click', function () {
    getSearcLeftNode()
})
//左侧树形段
function getSearcLeftNode() {
    console.log(1);
    //校验
    var flag = checkParam();
    if (!flag) return;

    var OriNodeCode = $('#OriNodeCode').val() //上级组织编码
    var PlanNodeCode = $('#PlanNodeCode option:selected').val() //规划组织编码
    var PlanIpType = $('#PlanIpType option:selected').val() //规划地址类型编码
    var StartTime = $('#StartTime').val() //规划终止日期
    var EndTime = $('#EndTime').val() //规划终止日期
    var Inetnum = $('#Inetnum').val()//IP地址段


    $.ajax({
        url: '/api/ipaddr/GetAddrPlanV4',
        method: 'post',
        data: {
            OriNodeCode: OriNodeCode,
            PlanNodeCode: PlanNodeCode,
            PlanIpType: PlanIpType,
            StartTime: StartTime,
            EndTime: EndTime,
            Inetnum: Inetnum //IP地址段
        },
        success: function (res) {
            AddrPlanV4 = res.data
            //展示地址段树


        },
        error: function (err) {

        }
    })
}
//上级组织
function GetNodeList() {
    $.ajax({
        url: 'assets/module/ipaddrPlan/json/nodetree.json',
        //url:'/api/ipaddr/GetNodeList',
        //type:'post',
        // data:{
        //     username: getParam.username,
        //     NodeCode:getParam.OriNodeCode,
        // },
        success: function (data) {
            var thisData = data
            thisData = iteration(thisData);
            initTreeXz(thisData);
        },
        error: function (error) { }
    })
}
//节点树
function initTreeXz(treeDate) {
    $('#xzNodeTree').tree({
        multiple: false,
        width: 140,
        lines: true,
        animate: true,
        data: treeDate,
        cascadeCheck: false,
        checkbox: false,
        onLoadSuccess: function (node, data) {
        },
        onClick: function (node) {
            $('#OriNodeCode').val(node.id)
        }

    });
}
//规划类型
function GetIPTypeV4List() {
    $.ajax({
        url: '/api/ipaddr/GetNodeList',
        type: '',
        data: {
            NodeCode: '',//入参上级组织的节点标识NodeCode
        },
        success: function (res) {

        },
        error: function (error) { }
    })
}
//校验查询条件
function checkParam() {
    var OriNodeCode = $('#OriNodeCode').val() //上级组织编码   
    var StartTime = $('#StartTime').parent().find('.textbox-value').val() //规划终止日期
    var EndTime = $('#EndTime').parent().find('.textbox-value').val() //规划终止日期
    var Inetnum = $('#Inetnum').val()//IP地址段
    var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
    console.log(OriNodeCode);
    if (OriNodeCode == "") {
        $.messager.alert('提示', '上级组织不能为空!');
        return false;
    }
    if (Inetnum != "") {
        console.log('j');
        //如果地址段和传过来的一致则不进行校验   
        if (Inetnum != getParam.Inetnum) {
            if (!reg.test(Inetnum)) {
                $.messager.alert('提示', '地址段格式不正确！');
                return false;
            }
        }
    }
    if (EndTime < StartTime) {
        $.messager.alert('提示', '结束时间不能小于开始时间!');
        return false;
    }
}
//得到链接中的参数并处理
function getParmdata() {
    //用户名称username，地址段Inetnum，上级组织OriNodeCode，自动查询AutoQuery    
    getParam.username = getUrlParam('username')
    getParam.Inetnum = getUrlParam('Inetnum')
    getParam.OriNodeCode = getUrlParam('OriNodeCode')
    getParam.AutoQuery = getUrlParam('AutoQuery')
    $('#Inetnum').val(getParam.Inetnum ? getParam.Inetnum : "") //地址段赋值
    $('#OriNodeCode').val(getParam.OriNodeCode ? getParam.OriNodeCode : "") //上级组织赋值
    //自动查询
    if (getParam.AutoQuery == 'Y') {
        getSearcLeftNode()
    }
}
//获取对应参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURI(r[2]);
    return null; //返回参数值
}
//递归处理节点树数据
function iteration(data) {
    for (var j = 0; j < data.length; j++) {
        data[j].id = data[j].nodecode;
        data[j].text = data[j].nodename;
        if (data[j].children != undefined && data[j].children.length > 0) {
            iteration(data[j].children);
        }
    }
    console.log(data)
    return data;
}
$(function () {
    //处理链接中的入参
    getParmdata()
    //上级组织
    GetNodeList()
    //规划类型
    GetIPTypeV4List()
    
})