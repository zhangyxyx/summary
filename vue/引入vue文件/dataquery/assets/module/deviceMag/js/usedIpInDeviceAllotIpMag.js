$(function () {
    var urlObj = new UrlSearch();
    console.log(urlObj)
    $("#allotDeviceName").val(urlObj.deviceName)
    $("#inetnumtep").val(urlObj.inetnum)
    $("#status").val(urlObj.inetnumStatus)
    $('#status').find("option[value=assigned]").attr("selected",true);
    layui.form.render('select') //再次渲染
    getNodeList();
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
                width: 208,
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
            //页面初始化的时候默认触发汇总查询事件
            $("#queryAll").click();
        }
    });
}

//初始化按钮点击事件
function initBtnClickEvent() {
    $(".btnItem").click(function () {
        //ip地址段不为空时校验
        let loopAddress = $("#loopAddress").val();
        let Inetnum = $("#inetnumtep").val();
        //获取当前点击的按钮
        let btnType = $(this).val();
        if(btnType == '查询'){
            if (loopAddress != "") {
                if ("IPv4" != validIPAddress(loopAddress,true)) {
                    $.messager.alert('提示', '请输入正确的注册设备IP格式！', 'warning');
                    return false;
                }
            }
            if (Inetnum != "") {
                if (Inetnum.indexOf("/") != -1) {//地址段
                    var IPAddrArr = Inetnum.split("/");
                    if (IPAddrArr.length != 2) {
                        $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                        return false;
                    }
                    if ("IPv4" != validIPAddress(IPAddrArr[0])) {
                        $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                        return false;
                    } else {
                        //在IP地址后加上"/"符号以及1-32的数字
                        if (!(IPAddrArr[1] >= 1 && IPAddrArr[1] <= 32)) {
                            $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                            return false;
                        }
                    }
                } else if (Inetnum.indexOf("-") != -1) {
                    var IPAddrArr = Inetnum.split("-");
                    if (IPAddrArr.length != 2) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return false;
                    }
                    if ("IPv4" != validIPAddress(IPAddrArr[0]) || "IPv4" != validIPAddress(IPAddrArr[1])) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return false;
                    }
                    //起始地址不能大于终止地址
                    var addr1 = IPAddrArr[0].split(".");
                    var addr2 = IPAddrArr[1].split(".");
                    if (ip2int(IPAddrArr[0])>ip2int(IPAddrArr[1]))  {
                        $.messager.alert('提示', '起始地址不能大于终止地址！', 'warning');
                        return false;
                    }
                } else {//掩码
                    if ("IPv4" != validIPAddress(Inetnum,true)) {
                        console.log(1111)
                        $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                        return;
                    }
                }
            }
        }
        switch (btnType) {
            case "查询":
                queryDeviceAllotIpv4List();
                break;
            case "导出":
                exportCodeInfo();
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
            queryDeviceAllotIpv4List();
        }
    });
}


//查询
function queryDeviceAllotIpv4List() {
    var beginip = ''
    var endip = ''
    if($("#inetnumtep").val() != ''){
        if(checkInetnum($("#inetnumtep").val()) == 'false'){
            $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
        }else{
            var inetnum = checkInetnum($("#inetnumtep").val())
            beginip =  inetnum.split('-')[0]
            endip =  inetnum.split('-')[1]
        }  
    }
    let params = {
        nodeCode: $("#nodeList").combotree('getValue'),
        nodescope:'all',
        allotDeviceName: $("#allotDeviceName").val(), 
        allotdevscope:'indistinct',
        deviceName:$("#deviceName").val(),
        loopAddress: $("#loopAddress").val(), 
        portName:$("#portName").val(), 
        useDescr:$("#useDescr").val(), 
        startIp: dealIpv4FromAll(beginip),
        endIp: dealIpv4FromAll(endip),
        scope: 'intersection',
        status:$('#status option:selected').val(),
        deviceNameConsistent:$('#deviceNameConsistent option:selected').val(),
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString()
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/ipv4/allotdeviceip/queryUsedIpInDeviceAllotIpList'),
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
        { field: 'allotDeviceName', title: '分配设备名称', align: 'center', width: 140,
        formatter:function(value,row,index){
            return "<a class='operateBtn' onclick=openDetail(\'"+row.allotDeviceName+"\',\'"+row.allotDeviceId+"\')>"+row.allotDeviceName+"</a>"
           } },
        { field: 'allotInetnum', title: '分配地址IP', align: 'center', width: 140,
        formatter:function(value,row,index){
            return formatIpMask(row.allotStartIp,row.allotEndIp)
            
        } },
        { field: 'NodeName', title: '注册组织', align: 'center', width: 140 },
        { field: 'inetnum', title: '注册地址', align: 'center', width: 140,
        formatter:function(value,row,index){
            if(row.Status == 'NetAssigned' || row.Status == 'UserAssigned'){
                return "<a class='operateBtn' onclick=openAssignedDetail(\'"+row.InetnumID+"\')>"+formatIpMask(row.inetnumStart,row.inetnumEnd)+"</a>"
            }else{
                return formatIpMask(row.inetnumStart,row.inetnumEnd)
            }
            
        } },
        { field: 'statusName', title: '地址状态', align: 'center', width: 100 },
        { field: 'IpTypeName', title: '注册地址类型', align: 'center', width: 100 },
        { field: 'DeviceName', title: '注册设备名称', align: 'center', width: 140,
        formatter:function(value,row,index){
            if(row.DeviceName){
                if(row.deviceNameConsistent == '-1'){
                    return "<a style='color:red' >"+row.DeviceName+"</a>"
                }else{
                    return row.DeviceName
                }
            } 
        }},
        { field: 'DeviceLoopback', title: '注册设备IP', align: 'center', width: 140 },
        { field: 'PortName', title: '端口/地址池名称', align: 'center', width: 140 },
        { field: 'UseDescr', title: '端口描述', align: 'center', width: 140 },
        { field: 'portSpeed', title: '端口速率', align: 'center', width: 100 },
        { field: 'cvlan', title: 'CVLAN', align: 'center', width: 100 },
        { field: 'svlan', title: 'SVLAN', align: 'center', width: 140},
        { field: 'vpnname', title: 'VPN实例', align: 'center', width: 140 },
        
    ]];
    var tableId = "dataList";
    var tableH = $(".tablePanel").height();
    var opt = {
        columnsData: columnsData,
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false,//分页
            fitColumns: false,
        }
    };
    relatedTable(tableId, opt);
}

//跳转到详情
function openDetail(deviceName,deviceId){
    window.top.$vm.$openTab({
        name: '设备详情',
        path: bathPath + '/ipaddrmodule/views/jsp/deviceMag/deviceDetail.jsp?deviceId='+deviceId+'&deviceName='+deviceName
    })
}

function openAssignedDetail(InetnumID){
    window.top.$vm.$openTab({
        name: '注册地址详情',
        path: bathPath + '/ipaddrmodule/views/jsp/Ipv4Assigned/Ipv4AssignedDetail.jsp?InetnumID='+ InetnumID 
    })
}

// 导出
function exportCodeInfo(){
    var beginip = ''
    var endip = ''
    if($("#inetnumtep").val() != ''){
        if(checkInetnum($("#inetnumtep").val()) == 'false'){
            $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
        }else{
            var inetnum = checkInetnum($("#inetnumtep").val())
            beginip =  inetnum.split('-')[0]
            endip =  inetnum.split('-')[1]
        }  
    }
    let params = {
        nodeCode: $("#nodeList").combotree('getValue'),
        nodescope:'all',
        allotDeviceName: $("#allotDeviceName").val(), 
        allotdevscope:'indistinct',
        deviceName:$("#deviceName").val(),
        loopAddress: $("#loopAddress").val(), 
        portName:$("#portName").val(), 
        useDescr:$("#useDescr").val(), 
        startIp: dealIpv4FromAll(beginip),
        endIp: dealIpv4FromAll(endip),
        scope: 'intersection',
        status:$('#status option:selected').val(),
        deviceNameConsistent:$('#deviceNameConsistent option:selected').val(),
        pagesize: '0',
        pageno: '0',
        LoginName:userName
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/ipv4/allotdeviceip/exportUsedIpInDeviceAllotIpsFile'),
        type:'post',
        data:JSON.stringify(params),
        cache:false,
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            $.messager.progress({
                title: '提示',
                msg: '数据正在导出中，请稍候...',
                text: ''
            });
        },
        success:function(obj){
            if(obj.code == "0000"){
                $.messager.progress('close');
                if(obj.data.filedir){
                    window.open(bathPath+"/nms/Common/Inc/download.jsp?filename="+obj.data.filedir+"&viewfilename="+obj.data.filename)
                }
                $.messager.alert('提示',"导出成功！",'success');
            }else{
                $.messager.alert('提示',obj.tip,'error');
            }
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
            $.messager.progress('close');
        }
    });
}
//JS获取url地址栏参数值
function UrlSearch() {
    var name, value;
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?");
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = decodeURI(value);
        }
    }
}
