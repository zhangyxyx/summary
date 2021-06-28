$(function () {
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
                if ("IPv4" != validIPAddress(loopAddress)) {
                    $.messager.alert('提示', '请输入正确的设备IP格式！', 'warning');
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
                    if ("IPv4" != validIPAddress(Inetnum)) {
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
            case "导入":
                importDevice();
                break;
            case "分配地址":
                allotIpv4();
                break;
            case "核查全部设备分配地址并计算注册率":
                checkAndCalculateAllDeviceAllotIpv4();
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
        deviceName: $("#deviceName").val(), 
        devscope:'indistinct',
        loopAddress: $("#loopAddress").val(), 
        loopscope:'indistinct',
        startIp: dealIpv4FromAll(beginip),
        endIp: dealIpv4FromAll(endip),
        scope: 'indistinct',
        allotStatus:$('#allotStatus option:selected').val(),
        abnormalCause:$("#abnormalCause").val(),
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString()
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/ipv4/allotdeviceip/queryDeviceAllotIpv4List'),
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
        { field: 'deviceName', title: '设备名称', align: 'center', width: 140,
        formatter:function(value,row,index){
            return "<a class='operateBtn' onclick=goDetail(\'"+row.deviceId+"\',\'"+row.deviceName+"\')>"+row.deviceName+"</a>"
           } },
        { field: 'loopAddress', title: '设备IP', align: 'center', width: 140}, 
        { field: 'ipNodeName', title: 'IP地址所在组织', align: 'center', width: 140 },
        { field: 'ipTypeName', title: '地址类型', align: 'center', width: 140 },
        { field: 'inetnum', title: 'IP地址段', align: 'center', width: 100,
        formatter:function(value,row,index){
            return "<a class='operateBtn' onclick=goUsedIpInDeviceAllotIpList(\'"+row.deviceName+"\',\'"+row.inetnum+"\')>"+row.inetnum+"</a>"
           }  },
        { field: 'assignedRate', title: '注册率', align: 'center', width: 100 },
        { field: 'allotStatus', title: '状态', align: 'center', width: 140,
        formatter:function(value,row,index){
            if(value == '1'){
                return '正常'
            }else if(value == '-1'){
                return '异常'
            }
        }},
        { field: 'abnormalCause', title: '异常原因', align: 'center', width: 140 },
        { field: 'operate', title: '操作', align: 'center', width: 180,
        formatter:function(value,row,index){
            return "<a class='operateBtn' style='margin-right:4px' onclick=deleteDeviceAllotIpv4(\'"+index+"\')>回收</a><a class='operateBtn' style='margin-right:4px' onclick=calculateDeviceIpv4AssignedRate(\'"+index+"\')>计算注册率</a><a class='operateBtn' onclick=checkDeviceAllotIpv4(\'"+index+"\')>核查地址</a>"
           }
        },
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
        }
    };
    relatedTable(tableId, opt);
}

//跳转到详情
function goDetail(deviceId,deviceName){
    window.top.$vm.$openTab({
        name: '设备详情',
        path: bathPath + '/ipaddrmodule/views/jsp/deviceMag/deviceDetail.jsp?deviceId='+deviceId+'&deviceName='+deviceName
    })
}

//跳转查询该范围内所有注册地址页面
function goUsedIpInDeviceAllotIpList(deviceName,inetnum){
    window.top.$vm.$openTab({
        name: '设备维度注册地址查询',
        path: bathPath + '/ipaddrmodule/views/jsp/deviceMag/usedIpInDeviceAllotIpMag.jsp?inetnum='+inetnum+'&deviceName='+deviceName+'&inetnumStatus=assigned'
    })
}

//回收
function deleteDeviceAllotIpv4(rowIndex){
    $.messager.confirm('回收', '是否确认回收当前设备?', function(flag){
        if (flag){
            var row=$("#dataList").datagrid("selectRow",rowIndex).datagrid("getSelected");
            // console.log(row)
            // console.log(deleteList)
            var params = [{
                inetnumId:row.inetnumId,
                deviceId:row.deviceId,
                deviceName:row.deviceName,
                loopAddress:row.loopAddress,
                ipNodeCode:row.ipNodeCode,
                ipNodeName:row.ipNodeName,
                inetnum:row.inetnum,
                startIp:row.startIp,
                endIp:row.endIp,
                inetnumSum:row.inetnumSum,
                ipTypeCode:row.ipTypeCode,
                ipTypeName:row.ipTypeName,
                remarks:row.remarks,
                operator:row.operator,
                netUserId:userName,
            }]
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/ipv4/allotdeviceip/deleteDeviceAllotIpv4'),
                type:'POST',
                data:JSON.stringify(params),
                dataType:'json',
                contentType: 'application/json',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '正在回收中...',
                        text: ''
                    });
                },
                success:function(obj){
                    if(obj.code == "0000"){
                        let resultData = obj.data.filter((item,index) =>{
                            return item.allotResult!=null
                        })
                        if(resultData.length){
                            var content =''
                            resultData.forEach(function(item,index){
                                content+=item.deviceName+':'+item.allotResult + '<br/>'
                            })
                           $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                        }else{
                            $.messager.alert('提示','回收成功！','success');
                        }
                        queryDeviceAllotIpv4List();//刷新数据
                    }else{
                        $.messager.alert('提示','回收失败!'+obj.tip,'error');
                    }
                },
                error:function(error){
                    $.messager.progress('close');
                    $.messager.alert('提示','接口调用失败!','error');
                },
                complete:function(){
                    $.messager.progress('close');
                }
            });
        }
    });
}

//计算注册率
function calculateDeviceIpv4AssignedRate(rowIndex){
    var row=$("#dataList").datagrid("selectRow",rowIndex).datagrid("getSelected");
    // console.log(row)
    var params = [{
        inetnumId:row.inetnumId,
    }]
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/ipv4/allotdeviceip/calculateDeviceIpv4AssignedRate'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json',
        beforeSend: function () {
            $.messager.progress({
                title: '提示',
                msg: '正在计算中...',
                text: ''
            });
        },
        success:function(obj){
            if(obj.code == "0000"){
                $.messager.alert('提示','计算成功！','success');
                queryDeviceAllotIpv4List();//刷新数据
            }else{
                $.messager.alert('提示','计算失败!'+obj.tip,'error');
            }
        },
        error:function(error){
            $.messager.progress('close');
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
            $.messager.progress('close');
        }
    });
}

//核查地址
function checkDeviceAllotIpv4(rowIndex){
    var row=$("#dataList").datagrid("selectRow",rowIndex).datagrid("getSelected");
    // console.log(row)
    var params = [{
        inetnumId:row.inetnumId,
        deviceName:row.deviceName,
        loopAddress:row.loopAddress,
        ipNodeCode:row.ipNodeCode,
        ipNodeName:row.ipNodeName,
        inetnum:row.inetnum,
        startIp:row.startIp,
        endIp:row.endIp,
        inetnumSum:row.inetnumSum,
    }]
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/ipv4/allotdeviceip/checkDeviceAllotIpv4'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json',
        beforeSend: function () {
            $.messager.progress({
                title: '提示',
                msg: '正在核查中...',
                text: ''
            });
        },
        success:function(obj){
            if(obj.code == "0000"){
                $.messager.alert('提示','核查成功！','success');
                queryDeviceAllotIpv4List();//刷新数据
            }else{
                $.messager.alert('提示','核查失败!'+obj.tip,'error');
            }
        },
        error:function(error){
            $.messager.progress('close');
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
            $.messager.progress('close');
        }
    });
}

//核查全部设备分配地址并计算注册率
function checkAndCalculateAllDeviceAllotIpv4(){
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/ipv4/allotdeviceip/checkAndCalculateAllDeviceAllotIpv4'),
        type:'POST',
        dataType:'json',
        contentType: 'application/json',
        beforeSend: function () {
            $.messager.progress({
                title: '提示',
                msg: '正在核查计算中...',
                text: ''
            });
        },
        success:function(obj){
            if(obj.code == "0000"){
                $.messager.alert('提示','核查计算成功！','success');
                queryDeviceAllotIpv4List();//刷新数据
            }else{
                $.messager.alert('提示','核查计算失败!'+obj.tip,'error');
            }
        },
        error:function(error){
            $.messager.progress('close');
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
            $.messager.progress('close');
        }
    });
}

//跳转到分配地址页面
function allotIpv4(){
    window.top.$vm.$openTab({
        name: '分配设备地址',
        path: bathPath + '/ipaddrmodule/views/jsp/deviceMag/allotIpv4ToDevices.jsp?deviceName='+$("#deviceName").val()+'&loopAddress='+$("#loopAddress").val()
    })
}

//导入
function importDevice() {
    //动态生成弹出层元素
    let content = '';
    content += '<div class="importPanel">';
    content += '<form  id="importForm" class="importForm" method="post" enctype= "multipart/form-data">'
    content += '<input type="file" name="file" required="required"/>'
    content += '<input type="button" class="importBtn" id="btnSubmit" value="导入"/>'
    content += '<input type="button" class="importBtn" id="importBtn" value="模板下载"/>'
    content += '<input type="button" class="importBtn importCloseBtn" id="importCloseBtn" value="关闭"/>'
    content += '</form>'
    content += '</div>'
    //打开弹出层
    var layer = layui.layer;
    layer.open({
        type: 1, 
        title:['导入数据', 'text-align: center;'],
        area: ['70%', 'auto'],
        offset: '150px',
        content: content,
        cancel: function(index, layero){ 
           
        }
    });
    initImportBtnSubmitEvent();
}

//初始化导入文件事件
function initImportBtnSubmitEvent(){
    $(".importBtn").click(function(){
        if($(this).val() == "导入"){
            //判断是否选择了需要导入的文件
            if($("input[name='file']").val()==""){
                $.messager.alert('提示','请选择需要导入的文件！','error');
                return;
            }
            //调用批量导入接口
            $("#importForm").ajaxSubmit({
                url:encodeURI(bathPath+'/ipaddrmodule/ipv4/allotdeviceip/batchImportallotDeviceIpv4s'),
                type:'post',            
                datatype:'json',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '数据正在导入中，请稍候...',
                        text: ''
                    });
                },
                success:function(obj){  
                    if(obj.code == "0000"){
                        $.messager.progress('close');
                        $(".layui-layer-close").click();
                        console.log(obj.data.filedir)
                        if(obj.data.filedir){
                            // $.messager.alert('提示',"导入失败！",'error');
                            window.open(bathPath+"/nms/Common/Inc/download.jsp?filename="+obj.data.filedir+"&viewfilename="+obj.data.filename)
                        }
                        $.messager.alert('提示',"导入成功！",'success');
                        queryDeviceAllotIpv4List();//刷新数据
                    }else{
                        $.messager.alert('提示',obj.msg,'error');
                        $.messager.progress('close');
                    }
                },
                error:function(error){
                    $.messager.alert('提示','接口调用失败!','error');
                    $.messager.progress('close');
                },
                complete:function(){
                    
                }
            });
        }else if($(this).val() == "模板下载"){
            window.open(bathPath+"/ipaddrmodule/itep/var/config/ipaddr/Device/allotDeviceIpv4Temp.xls");
        }else if($(this).val() == "关闭"){
            $(".layui-layer-close").click();
        }
    });
}


//校验输入的IP地址是合法的ipv4或ipv6
function validIPAddress(IP) {
    //按"."进行分割
    var parts = IP.split(".");
    //IPv4由4个部分组成
    if (parts.length <= 4) {
        for (var i = 0; i < parts.length; i++) {
            var cur = parts[i];
            //空字符串或当前部分不是数字
            //那么肯定不合法
            if (isNaN(cur)) {
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