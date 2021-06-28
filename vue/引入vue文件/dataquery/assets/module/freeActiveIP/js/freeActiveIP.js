$(function () {
    getNodeList();
    getNMAPdate();
    initBtnClickEvent();
    initLayuiObj();
});
var curlPath = window.document.location.href;
var pathName = window.document.location.pathname;
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var tempName = "/ipaddrmodule";//当前文件的跟目录
var bathPath = "";
if (projectName == tempName) {
    projectName = "";
} else {
    bathPath = curlPath.substring(0, pathName.indexOf('/')) + projectName;
}
// bathPath = "";//环境上需要注释掉
let userName = jQuery.ITE.getLoginName('loginName');//登录用户
let queryAllPage = {//汇总查询
    pageSize: 20,
    pageNum: 1,
    total: 0,
}
var tableDataList = []

//初始化layui对象
function initLayuiObj() {
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //日期范围
        laydate.render({
            elem: '#dateTime',
            range: true
        });
    })
}

//获取节点信息
function getNodeList() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/NodeManage/GetNodeList'),
        type: 'post',
        cache: false,
        data: JSON.stringify({ userName: userName, nodeCode: '' }),
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
            let nodeList = obj.data;
            $("#nodeList").combotree({
                idField: 'nodeCode',
                textField: 'nodeName',
                data: nodeList,
                panelHeight: 'auto',//高度自适应
                width: 220,
                multiple: false,
                editable: false,//定义用户是否可以直接往文本域中输入文字
                onLoadSuccess: function () {
                    $("#nodeList").combotree('tree').tree("collapseAll");
                },
                //直接过滤，数据太多时不行，太卡了，放弃
                filter: function (q, row) {
                    return row.text.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function (q, e) {
                        $('#nodeList').combotree('tree').tree('doFilter', q)
                    }
                },
                onSelect: function (row) {//点击节点联动地址类型
                }
            });
            //初始化显示权限节点
            $('#nodeList').combotree('setValue', nodeList[0].nodeCode);
        }
    });
}

//获取首次扫描批次
function getNMAPdate() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpAddrType/GetNMAPdate'),
        type: 'get',
        cache: false,
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
            var NMAPdate = obj.data
            $("#firstNMAPdate").combobox({
                valueField:'FIRSTNMAPDATE',
                textField:'FIRSTNMAPDATE',
                data:NMAPdate,
                width:220,
                //panelHeight: 'auto',//高度自适应
                multiple: false,
                editable:true,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function (data) {
                    if(data){
                        $('#firstNMAPdate').combobox('setValue',data[0].FIRSTNMAPDATE);
                    }
                },
                filter: function(q, row){
                    var opts = $(domId).combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){
                }
            });
            //页面初始化的时候默认触发汇总查询事件
            $("#queryAll").click();
        }
    });
}

//初始化按钮点击事件
function initBtnClickEvent() {
    $(".btnItem").click(function () {
        //ip地址段不为空时校验
        let Inetnum = $("#inetnumtep").val();
        //获取当前点击的按钮
        let btnType = $(this).val();
            if (Inetnum != "") {
                if ("IPv4" != validIPAddress(Inetnum)) {
                    $.messager.alert('提示', '请输入正确的活跃IP格式！', 'warning');
                    return false;
                }
            }
        switch (btnType) {
            case "查询":
                getNMAPip();
                break;
            case "导出":
                exportNMAPip();
                break;
            case "轮询活跃地址":
                getAbnomalActiveIP();
                break;
                
        }
    });
}


//初始化表格分页
function initClickPageEvent() {
    $('#pagination').pagination({
        total: queryAllPage.total,
        pageSize: queryAllPage.pageSize,
        pageNumber: queryAllPage.pageNum,
        pageList: [20, 30, 40, 50],
        onSelectPage: function (pageNumber, pageSize) {
            queryAllPage.pageSize = pageSize;
            queryAllPage.pageNum = pageNumber;
            getNMAPip();
        }
    });
}


//查询
function getNMAPip() {
    let params = {
        nodecode: $("#nodeList").combotree('getValue'), 
        FirstNMAPdate:$("#firstNMAPdate").combobox('getValue'),
        ip: $("#inetnumtep").val(),
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString()
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpAddrType/GetNMAPip'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success: function (obj) {
            if(obj.code == "0000"){
                let tableData = obj.data.result;
                queryAllPage.total = obj.data.totalResult;
                loadDetailTable(tableData);
                initClickPageEvent();
            }else{
                $.messager.alert('提示',obj.tip,'error');
            }
            
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function () {

        }
    });
}

//加载明细表格数据
function loadDetailTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [[ 
        { field: 'ip', title: '首次扫描活跃IP', align: 'center', width: 140 },
        { field: 'activetype', title: '存活方式', align: 'center', width: 140 },
        { field: 'NMAPdetail', title: '首次扫描端口详情', align: 'center', width: 240 },
        { field: 'FirstNMAPdate', title: '首次扫描批次', align: 'center', width: 140,formatter:function(value,row,index){
            return row.FirstNMAPdate.split(' ')[0]
           }
         },
        { field: 'nodename', title: '管理组织', align: 'center', width: 100 },
        { field: 'status', title: '首次地址状态', align: 'center', width: 100 },
        { field: 'AnotherNMAPdate', title: '复核日期', align: 'center', width: 140 },
        { field: 'AnotherNMAPtype', title: '复核情况', align: 'center', width: 140 },
        { field: 'AnotherNMAPdetail', title: '复核端口开放', align: 'center', width: 240 },
    ]];
    var tableId = "dataList";
    var tableH = $(".tablePanel").height();
    var opt = {
        columnsData: columnsData,
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false//分页
        }
    };
    relatedTable(tableId, opt);
}

//导出
function exportNMAPip() {
    let params = {
        nodecode: $("#nodeList").combotree('getValue'), 
        FirstNMAPdate:$("#firstNMAPdate").combobox('getValue'),
        ip: $("#inetnumtep").val(),
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpAddrType/ExpNMAPip'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            $.messager.progress({
                title: '提示',
                msg: '数据正在导出中，请稍候...',
                text: ''
            });
        },
        success: function (obj) {
            if(obj.code == "0000"){
                let fileName = obj.data.split('IpManageCP-0.0.1')[1]
                // let fileName = obj.data.replace('/slview/resinB3.1.6/webapps/IpManageCP-0.0.1', "");
                // console.log(fileName)
                window.open(encodeURI(bathPath+fileName));
            }else{
                $.messager.alert('提示',obj.tip,'error');
            }
            
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete:function(){
            $.messager.progress('close');
        }
    });
}

//轮询活跃地址
function getAbnomalActiveIP() {
    let params = {
        nodecode: $("#nodeList").combotree('getValue'), 
        FirstNMAPdate:$("#firstNMAPdate").combobox('getValue'),
        ip: $("#inetnumtep").val(),
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpAddrType/GetAbnomalActiveIP'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success: function (obj) {
            if(obj.code == "0000"){
                $.messager.alert('提示',obj.tip,'success');
            }else{
                $.messager.alert('提示',obj.tip,'error');
            }
            
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function () {

        }
    });
}

//校验输入的IP地址是合法的ipv4或ipv6
function validIPAddress(IP) {
    //按"."进行分割
    var parts = IP.split(".");
    //IPv4由4个部分组成
    if (parts.length === 4) {
        for (var i = 0; i < parts.length; i++) {
            var cur = parts[i];
            //空字符串或当前部分不是数字
            //那么肯定不合法
            if (!cur || isNaN(cur)) {
                return "Neither_Ipv4";
            }
            //转化为数字
            var num = +cur;
            //合法范围应该在0-255之间
            if (num < 0 || num > 255) {
                return "Neither_Ipv4";
            }
            //排除"172.016.254.01"这样以0开头的不合法情况
            /*if(num + "" !== cur){
                return "Neither_Ipv4";
            }*/
        }
        return "IPv4";
    }
    //合法的IPv6像这样：
    //"2001:0db8:85a3:0000:0000:8a2e:0370:7334"
    //以":"来分割
    parts = IP.split(":");
    //正则验证是否有指定字符以外的字符存在
    var reg = /[^0123456789abcdefABCDEF]/;

    //IPv6由8个部分组成
    if (parts.length === 8) {
        for (i = 0; i < parts.length; i++) {
            var cur = parts[i];
            //如果是空字符串或者当前部分长度超标
            if (!cur || cur.length > 4) {
                return "Neither_Ipv6";
            }
            //如果包含非法字符
            if (reg.test(cur)) {
                return "Neither_Ipv6";
            }
        }
        return "IPv6";
    }
    //不是合法的IP地址
    return "Neither";
}