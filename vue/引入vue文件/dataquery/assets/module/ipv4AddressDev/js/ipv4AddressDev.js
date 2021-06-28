$(function () {
    getNodeList();
    initBtnClickEvent();
    initLayuiObj();
   
});
var curlPath = window.document.location.href;
var pathName = window.document.location.pathname;
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var tempName = "/ipaddrmodule";//当前文件的跟目录
// var bathPath = "";
if (projectName == tempName) {
    projectName = "";
} else {
    bathPath = curlPath.substring(0, pathName.indexOf('/')) + projectName;
}
// bathPath = ''//环境上注销
let userName = jQuery.ITE.getLoginName('loginName');//登录用户
let queryAllPage = {//汇总查询
    pageSize: 20,
    pageNum: 1,
    total: 0,
}
var tableData = []
var tableDataDeal = []

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
        let Inetnum = $("#inetnumtep").val();
        //获取当前点击的按钮
        let btnType = $(this).val();
        if (btnType == "查询") {
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
                        $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                        return;
                    }
                }
            }
        }
        switch (btnType) {
            case "查询":
                queryIpv4CompareResultList();
                break;
            case "导出":
                exportList();
                break;
            case "设置标记":
                addAssignedIpUserMasks()
                break;
            case "取消标记":
                deleteAssignedIpUserMasks()
                break;
            case "地址比对":
                compareCollectAssignedIpv4()
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
            queryIpv4CompareResultList();
        }
    });
}

// 查询条件
function paramsData(){
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
        nodecode: $("#nodeList").combotree('getValue'),
        nodescope:'all',
        dealBeginDate: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[0]+' 00:00:00',
        dealEndDate: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[1]+' 23:59:59',
        startIp: dealIpv4FromAll(beginip),
        endIp: dealIpv4FromAll(endip),
        scope: 'intersection',
        ipSource:'',
        deviceName:$("#deviceNameZC").val(),
        devscope:'indistinct',
        deviceLoopback:$("#loopAddressZC").val(),
        loopscope:'indistinct',
        portName:$("#portNameZC").val(),
        ipPoolName:$("#ipPoolNameZC").val(),
        collectdeviceName:$("#deviceNameCJ").val(),
        collectdevscope:'indistinct',
        collectdeviceLoopback:$("#loopAddressCJ").val(),
        collectloopscope:'indistinct',
        collectportName:$("#portNameCJ").val(),
        collectipPoolName:$("#ipPoolNameCJ").val(),
        userMark:$("#userMark").val(),
        dealStatus:$("#dealStatus").val(),
        reportFlag:$("#reportFlag").val(),
        ipbackFlag:$("#ipbackFlag").val(),
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString(),
        showTree:"true"
    }
    return params
}

//查询
function queryIpv4CompareResultList() {
    let params = paramsData()
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/ipv4/collectipcompare/queryIpv4CompareResultList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success: function (obj) {
            if(obj.code == "0000"){
                tableData = obj.data.result;
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
        { field: 'ck', checkbox: true, width: 30 },  //复选框 
        { field: 'ipSourceName', title: '地址来源', align: 'center', width: 140,
        formatter:function(value,row,index){
            if(row.ipSource == 'assigned'){
                return '<span class="icon iconfont icon-jiahao first" style="margin-right:4px"  onclick="initClickTableEvent(this,'+row.inetnumId+','+index+')"></span><span>'+value+'</span><span>（'+row.collect.length+'）</span>';
            }else{
                return '<span style="margin-left:25px">'+value+'</span>';
            }
        } },
        { field: 'nodeName', title: '注册节点', align: 'center', width: 140 },
        { field: 'inetnum', title: 'IP地址', align: 'center', width: 140 ,
        formatter:function(value,row,index){
            return "<a class='operateBtn' onclick=goDetail(\'"+row.inetnumId+"\')>"+formatIpMask(row.startIp,row.endIp)+"</a>"
           },
           styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        }
         },
        { field: 'deviceName', title: '设备名称', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'deviceLoopback', title: '设备IP', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'portName', title: '端口名称', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'ipPoolName', title: '地址池名称', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'useDescr', title: '端口描述', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'portSpeed', title: '端口速率', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'cvlan', title: 'CVLAN', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'svlan', title: 'SVLAN', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'vpnName', title: 'VPN实例', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'busiNum', title: '业务号码', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'localCirCode', title: '本地电路编码', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'longCirCode', title: '长途电路编码', align: 'center', width: 140,
        styler: function (value, row, index) {
            if ((row.userMark == '-1')){
                return 'background-color:#dedede';
            }
        } },
        { field: 'userMark', title: '人工标记', align: 'center', width: 140,
        formatter:function(value,row,index){
            return userMarkStatus(value)
        } },
        { field: 'remarks', title: '人工备注', align: 'center', width: 140 },
        { field: 'dealStatus', title: '处理状态', align: 'center', width: 140, 
        formatter:function(value,row,index){
            return dealStatus(value)
        } },
        { field: 'dealTime', title: '处理日期', align: 'center', width: 140 },
        { field: 'reportFlag', title: '上报状态', align: 'center', width: 140,
        formatter:function(value,row,index){
            return reportFlag(value)
        }  },
        { field: 'ipbackFlag', title: '备案状态', align: 'center', width: 140,
        formatter:function(value,row,index){
            return ipbackFlag(value)
        }  },
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
            checkOnSelect:false,
            onLoadSuccess: function (data) {
                formatLongString()
                $(".datagrid-filter-row").hide();
                    var s= $("#dataList").datagrid('getPanel');
                    var rows = s.find('tr.datagrid-row');
                    var rows1 = s.find('tr.datagrid-row td[field!=ck]');
                    rows1.unbind('click').bind('click',function(e){
                            return false;
                    });
            },
        },
        
    };
    relatedTable(tableId, opt);
}

//初始化加减号按钮点击事件
function initClickTableEvent(e,inetnumId,rowIndex){
    var rows = $('#dataList').datagrid('getRows');//获得所有行
    var row = rows[rowIndex];//根据index获得其中一行。
    //   console.log(row)
    //$(".icon").click(function(){
        if($(e).hasClass("icon-jiahao")){//打开
            //切换符号
            $(e).removeClass("icon-jiahao");
            $(e).addClass("icon-jianhao3");
            //获得当前点击的地址编码
            // IpTypeCode = $(e).attr("IpTypeCode");

            // getIpTypeInfo(tableData);
            let openList = row.collect
            
            // tableData.forEach(function(item,index){
            //     if(item.ipSource == 'collect' && item.inetnumId == inetnumId){
            //         openList.push(item)
            //     }
            // })
            // console.log(openList)
            //获取到当前点击图标所对应的tr
            let trP = '';
            let index = '';
            if($(e).hasClass("first")){//第一次节点
                trP = $(e).parent().parent().parent();
                index = trP.attr("datagrid-row-index");
            }else{
                trP = $(e).parent().parent();
                index = trP.attr("datagrid-row-index");
            }
            // //遍历生成子节点
            var len = openList.length;
            for(var i = 0;i < len ;i++){//倒序追加
                let content = '';
                let colorbg = '#cee4fb'
                if(row.userMark == '-1'){
                    colorbg = '#dedede'
                }
                var rowIndex = index +''+ (len-1-i).toString();//每行的唯一标识
                content += '<tr class="trAdd trAdd'+rowIndex+'" datagrid-row-index='+rowIndex+' >';
                content += '<td style="width:30px"></td>';
                content += '<td style="width:140px"><span>'+openList[len-1-i].ipSourceName+'</span></td><td></td>';
                content += '<td style="background:'+colorbg+';width:140px"><span>'+formatIpMask(openList[len-1-i].startIp,openList[len-1-i].endIp)+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="deviceName"><span>'+(openList[len-1-i].deviceName?openList[len-1-i].deviceName:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="deviceLoopback"><span>'+(openList[len-1-i].deviceLoopback?openList[len-1-i].deviceLoopback:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="portName"><span>'+(openList[len-1-i].portName?openList[len-1-i].portName:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="ipPoolName"><span>'+(openList[len-1-i].ipPoolName?openList[len-1-i].ipPoolName:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="useDescr"><span>'+(openList[len-1-i].useDescr?openList[len-1-i].useDescr:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="portSpeed"><span>'+(openList[len-1-i].portSpeed?openList[len-1-i].portSpeed:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="cvlan"><span>'+(openList[len-1-i].cvlan?openList[len-1-i].cvlan:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="svlan"><span>'+(openList[len-1-i].svlan?openList[len-1-i].svlan:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="vpnName"><span>'+(openList[len-1-i].vpnName?openList[len-1-i].vpnName:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="busiNum"><span>'+(openList[len-1-i].busiNum?openList[len-1-i].busiNum:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="localCirCode"><span>'+(openList[len-1-i].localCirCode?openList[len-1-i].localCirCode:'')+'</span></td>';
                content += '<td style="background:'+colorbg+';width:140px" key="longCirCode"><span>'+(openList[len-1-i].longCirCode?openList[len-1-i].longCirCode:'')+'</span></td>';
                content += '<td style="width:140px" key="userMark"><span>'+userMarkStatus(openList[len-1-i].userMark)+'</span></td>';
                content += '<td style="width:140px" key="remarks"><span>'+(openList[len-1-i].remarks?openList[len-1-i].remarks:'')+'</span></td>';
                content += '<td style="width:140px" key="dealStatus"><span>'+dealStatus(openList[len-1-i].dealStatus)+'</span></td>';
                content += '<td style="width:140px" key="dealTime"><span>'+(openList[len-1-i].dealTime?openList[len-1-i].dealTime:'')+'</span></td>';
                content += '<td style="width:140px" key="reportFlag"><span>'+reportFlag(openList[len-1-i].reportFlag)+'</span></td>';
                content += '<td style="width:140px" key="ipbackFlag"><span>'+ipbackFlag(openList[len-1-i].ipbackFlag)+'</span></td>';
                content += '</tr>'
                trP.after(content);
               jQuery.each($(".trAdd"+rowIndex).children(), function(){
                   let key =$(this).attr('key')
                   if(key!= undefined && row[key] != openList[len-1-i][key]){
                       $(this).css('color','red')
                   }
                
               });
            }
            //initClickTableEvent();//初始化按钮点击事件
        }else{//关闭
            $(e).removeClass("icon-jianhao3");
            $(e).addClass("icon-jiahao");
            //获取到当前点击图标所对应的tr
            let trP = '';
            let index = '';
            if($(e).hasClass("first")){//第一次节点
                trP = $(e).parent().parent().parent();
                index = trP.attr("datagrid-row-index");
            }else{
                trP = $(e).parent().parent();
                index = trP.attr("datagrid-row-index");
            }
            //移除当前点击下的所有子节点
            $(".trAdd").each(function(i){
                if($(this).attr("datagrid-row-index").indexOf(index) == 0 && $(this).attr("datagrid-row-index") != index){//自己不能删除
                    $(this).remove();
                }
            })
        }
    //});
}

//导出
function exportList(){
    let params = paramsData()
    params.pagesize = '0'
    params.pageno = '0'
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/ipv4/collectipcompare/exportIpv4CompareResultFile'),
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
            if (obj.code == "0000") {
                $.messager.progress('close');
                if(obj.data.filedir){
                    window.open(bathPath+"/nms/Common/Inc/download.jsp?filename="+obj.data.filedir+"&viewfilename="+obj.data.filename)
                }
                $.messager.alert('提示',"导出成功！",'success');
            } else {
                $.messager.alert('提示', obj.tip, 'error');
            }
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function () {

        }
    });
}

//设置标记
function addAssignedIpUserMasks(){
    let selRow = $('#dataList').datagrid('getChecked')
    if(selRow.length == 0){
        $.messager.alert('提示','未选择要设置标记的地址！','error');
    }else{
        //打开弹出层
    var layer = layui.layer;
    var layerTitle = '设置标记';
    layer.open({
        type: 1, 
        title:[layerTitle, 'text-align: center;'],
        area: ['60%', 'auto'],
        offset: '150px',
        content: initLayerContent(),
        cancel: function(index, layero){ 
           
        }
    });
    layui.use('form', function(){
        var form = layui.form;//高版本建议把括号去掉，有的低版本，需要加()
        form.render('select');
        //form.render();
    });
    initSubmitEvent();
    initCloseEvent()
    }
}

//确认
function initSubmitEvent(){
    $("#submitBtn").click(function(){
        var userMask = $("#editUserMark").val();
        var remarks = $("#editRemarks").val();
        // let selRow = $('#dataList').datagrid('getSelections')
        var selRow = $('#dataList').datagrid('getChecked')
        console.log(selRow)
        let params = []
        if(userMask == ''){
            $.messager.alert('提示','人工标记不能为空！','error')
            return false
        }
        var remarksFlag  = true;
        if(remarks != ''){ // 校验特殊字符
            let remarksList = [
                {
                   code:remarks,
                   value:remarks
                }
            ]
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/SysCommon/MetacharactersCheck'),
                type:'POST',
                data:JSON.stringify(remarksList),
                dataType:'json',
                async:false,
                contentType: 'application/json;chartset=UTF-8',
                success:function(obj){
                    if(obj.code == "0000"){
                       if(obj.data){
                           if(obj.data[0].checkFlag){
                            remarksFlag=true
                           }else{
                            remarksFlag=false
                            $.messager.alert('提示','人工备注不能包含特殊字符！','error')
                           }
                       }
                    }else{
                       
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
        if(remarksFlag){
            selRow.forEach(function(item,index){
                params.push({
                    "ipSource": item.ipSource,
                    "nodeCode":  item.nodeCode,
                    "inetnumId":  item.inetnumId,
                    "assignedStatus":  item.assignedStatus,
                    "userMark":userMask,
                    "remarks":remarks,
                    "startIp":  item.startIp,
                    "endIp":  item.endIp,
                    "assignedStatus":  item.assignedStatus,
                    "operator": userName,
                })
            })
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/ipv4/collectipcompare/addAssignedIpUserMasks'),
                type:'POST',
                data:JSON.stringify(params),
                dataType:'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '正在设置标记中...',
                        text: ''
                    });
                },
                success:function(obj){
                    if(obj.code == "0000"){
                        $.messager.progress('close');
                        if(obj.data){
                            var content =''
                            let failedArr =  obj.data.filter((item,index)=>{
                                return item.flag == 'failed'
                            })
                            if(failedArr.length){
                                obj.data.forEach(function(item,index){
                                    content+='注册'+item.inetnumId+':'+item.result + '<br/>'
                                })
                               $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                            }else{
                                $.messager.alert('提示','设置标记成功！','success');
                            }
                            
                           $(".layui-layer-close").click();
                           queryIpv4CompareResultList()
                        }else{
                            $.messager.alert('提示','取消成功！','success');
                        }
                    }else{
                        $.messager.progress('close');
                        $.messager.alert('提示','新增失败!'+obj.tip,'error');
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
    })
}

//关闭
function initCloseEvent(){
    $("#closeBtn").click(function(){
        $(".layui-layer-close").click();
    })
}

//设置标记弹出内容
function initLayerContent(){
    //动态生成弹出层元素
    let content = '';
    content += ' <form class="layui-form" action="" style="padding: 20px;">';
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline1 editItem">'
    content += '<label class="layui-form-label layui-required">人工标记</label>'
    content += '<div class="layui-input-inline">'
    content += '<select id="editUserMark"><option value=""></option><option value="-1" selected>不处理</option></select>'
    content += '</div>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline1 editItem">'
    content += '<label class="layui-form-label">人工备注</label>'
    content += '<div class="layui-input-inline" style="width:calc(100% - 140px)!important">'
    content += '<textarea placeholder="请输入" class="layui-textarea" id="editRemarks"></textarea>'
    content += '</div>'
    content += '</div>'
    content += '</div>'
    content += '</form>'
    content += '<div class="editBtnBox">'
    content += '<button class="btnItem" id="submitBtn">确定</button>'
    content += '<button class="closeBtn" id="closeBtn">关闭</button>'
    content += '</div>';
    return content;
}

//取消标记
function deleteAssignedIpUserMasks(){
    let selRow = $('#dataList').datagrid('getChecked')
    let deleteList = []
    selRow.forEach(function(item,index){
        deleteList.push({
            "ipSource": item.ipSource,
            "nodeCode":  item.nodeCode,
            "inetnumId":  item.inetnumId,
            "startIp":  item.startIp,
            "endIp":  item.endIp,
            "assignedStatus":  item.assignedStatus,
            "operator": userName,
           
        })
    })
    if(selRow.length == 0){
        $.messager.alert('提示','未选择要取消标记的地址！','error');
    }else{
        $.messager.confirm('取消标记', '是否确认当前的选中信息取消标记？', function(flag){
            if (flag){
                $.ajax({
                    url: encodeURI(bathPath + '/ipaddrmodule/ipv4/collectipcompare/deleteAssignedIpUserMasks'),
                    type:'POST',
                    data:JSON.stringify(deleteList),
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                        $.messager.progress({
                            title: '提示',
                            msg: '正在取消标记中...',
                            text: ''
                        });
                    },
                    success: function (obj) {
                        if(obj.code == "0000"){
                            $.messager.progress('close');
                            if(obj.data){
                                var content =''
                                let failedArr = obj.data.filter((item,index) =>{
                                    return item.flag == 'failed'
                                })
                                if(failedArr.length){
                                    failedArr.forEach(function(item,index){
                                        content+=item.ipSource+item.inetnumId+':'+item.result + '<br/>'
                                    })
                                   $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                                }else{
                                    $.messager.alert('提示','取消成功！','success');
                                }
                                
                               queryIpv4CompareResultList()
                            }else{
                                $.messager.alert('提示','取消失败！','success');
                            }
                        }else{
                            $.messager.progress('close');
                            $.messager.alert('提示',obj.tip,'error');
                        }
                        
                    },
                    error: function (error) {
                        $.messager.progress('close');
                        $.messager.alert('提示', '接口调用失败!', 'error');
                    },
                    complete: function () {
            
                    }
                });
            }
        });
    }
}

//地址对比
function compareCollectAssignedIpv4(){
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/ipv4/collectipcompare/compareCollectAssignedIpv4'),
        type:'POST',
        data:JSON.stringify({nodeCode:$("#nodeList").combotree('getValue')}),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            $.messager.progress({
                title: '提示',
                msg: '正在对比中...',
                text: ''
            });
        },
        success: function (obj) {
            $.messager.progress('close');
            if(obj.code == "0000"){
                $.messager.alert('提示','对比成功！','success');
            }else{
                $.messager.alert('提示',obj.tip,'error');
            }
            queryIpv4CompareResultList()
        },
        error: function (error) {
            $.messager.progress('close');
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function () {
            $.messager.progress('close');
        }
    });
}

//跳转到详情
function goDetail(inetnumId){
    window.top.$vm.$openTab({
        name: '注册地址详情',
        path: bathPath + '/ipaddrmodule/views/jsp/Ipv4Assigned/Ipv4AssignedDetail.jsp?InetnumID='+ inetnumId 
    })
}

//字符转义
function userMarkStatus(status){
    let val = ''
    switch (status) {
        case "-1":val = '不处理';break;
        default:val='';break;
    }
    return val
}

function dealStatus(status){
    let val = ''
    switch (status) {
        case "R":val = '采集地址完全重复';break;
        case "C":val='采集地址交叉重复，待确认';break;
        case "D":val='与注册地址不一致，待确认';break;
        case "N":val='不更新';break;
        case "Y":val='已更新';break;
        case "BD":val='配置采集业务号码与备案不一致';break;
        case "CD":val='配置中提取的电路编号与配置的不一致';break;
        case "DV":val='是否回收待核实';break;
        case "UV":val='漏报待核实';break;
        default:val='';break;
    }
    return val
}

function reportFlag(status){
    let val = ''
    switch (status) {
        case "F":val = '上报失败';break;
        case "S":val='上报成功';break;
        case "D":val='处理中';break;
        case "U":val='未上报';break;
        case "N":val='不用上报';break;
        default:val='';break;
    }
    return val
}

function ipbackFlag(status){
    let val = ''
    switch (status) {
        case "0":val = '未备案';break;
        case "1":val='备案成功';break;
        case "2":val='上报中';break;
        case "3":val='备案失败';break;
        default:val='不用备案';break;
    }
    return val
}