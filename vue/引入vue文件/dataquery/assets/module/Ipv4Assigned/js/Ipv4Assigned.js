$(function () {
    getNodeList();
    initLayuiObj();
    getSysPara();
    initClearBtnEvent();
    initBtnClickEvent();
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
var showReport = false;//上报是否显示

function initClearBtnEvent() {
    $(".clearBtn").click(function () {
        $('#ipTypeList').combotree("clear")
        if ($("#ipTypeList").combotree('getValue') == "") {
            $('.clearBtn').css('display', 'none')
        } else {
            $('.clearBtn').css('display', 'block')
        }
    })
}
function initLayuiObj() {
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //日期范围
        laydate.render({
            elem: '#dateTime',
            range: true
        });
        //日期范围
        laydate.render({
            elem: '#reportTime',
            range: true
        });
        //日期范围
        laydate.render({
            elem: '#IPBackSynTime',
            range: true
        });
        
    })
}
function getNodeList() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/NodeManage/queryNode'),
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
                    getIpTypeList(row.nodeCode);
                }
            });
            //初始化显示权限节点
            $('#nodeList').combotree('setValue', nodeList[0].nodeCode);
            //页面初始化的时候默认触发汇总查询事件
            $("#queryAll").click();
        }
    });
}

//获取地址类型
function getIpTypeList(nodeCode) {
    $('.clearBtn').css('display', 'none')
    let params = {
        userName: userName,
        nodeCode: nodeCode,
        ipType: "",
        authType: "",
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpAddrType/GetIPTypeV4List'),
        type: 'post',
        cache: false,
        data: JSON.stringify(params),
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
            let ipTypeList = obj.data;
            $("#ipTypeList").combotree({
                idField: 'id',
                textField: 'text',
                data: ipTypeList,
                panelHeight: 'auto',//高度自适应
                width: 220,
                multiple: false,
                editable: false,//定义用户是否可以直接往文本域中输入文字
                onLoadSuccess: function () {
                    $("#ipTypeList").combotree('tree').tree("collapseAll");
                },
                //直接过滤，数据太多时不行，太卡了，放弃
                filter: function (q, row) {
                    return row.text.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function (q, e) {
                        $('#ipTypeList').combotree('tree').tree('doFilter', q)
                    }
                },
                onBeforeSelect: function (row) { //节点被选中前触发，返回 false 则取消选择动作(但是返回false，下拉选项依旧会关闭)
                    if (row.click == "N") {//标签不可选
                        return false;
                    } else {
                        $('.clearBtn').css('display', 'block');
                        return true;
                    }
                },
            });
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
                    if ("IPv4" != validIPAddress(Inetnum,true)) {
                        // console.log(1111)
                        $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                        return;
                    }
                }
            }
        }
        switch (btnType) {
            case "查询":
                queryAllocatedlist();
                break;
            case "批量回收":
                reclaimipBath()
                break;
            case "新增":
                var NodeCode =  $("#nodeList").combotree('getValue');
                var NodeName=  $("#nodeList").combotree('getText');
                if(NodeCode==null || NodeCode==""){
                    alert("该用户没有系统配置权限！");
                    return;
                }
                window.top.$vm.$openTab({
                    name: '注册新增',
                    path: bathPath + '/ipaddrmodule/views/jsp/Ipv4Assigned/Ipv4AssignedAdd.jsp?NodeCode='+NodeCode+"&NodeName="+NodeName
                })
                //   window.open(bathPath + '/ipaddrmodule/views/jsp/Ipv4Assigned/Ipv4AssignedAdd.jsp?NodeCode='+NodeCode+"&NodeName="+NodeName);
                break; 
            case "导入":
                importPage();
                break;
            case "导出":
                queryIpAssignedIpv4listImport();
                break; 
            case "实时备案":
                trueBackIPs();
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
            queryAllocatedlist();
        }
    });
}

function queryAllocatedlist() {
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
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString()
    }
    var fields = $('.layui-form').serializeArray();
    $.each(fields, function(i, field) {
        if (field.value) {
             switch (field.name) {
                case "NodeCodeLike":
                    params[field.name]=$("#nodeList").combotree('getValue');
                    break;
                case "IpClassType":
                    params[field.name]=$("#ipTypeList").combotree('getValue');
                    break;
                case "inetnum":
                     params.beginip= dealIpv4FromAll(beginip);
                     params.endip=dealIpv4FromAll(endip);
                     params.scope='intersection';
                    break; 
                case "dateTime":
                     params.BeginAllotDate= $("#dateTime").val().split(" - ")[0]+' 00:00:00';
                     params.EndAllotDate= $("#dateTime").val().split(" - ")[1]+' 23:59:59';
                    break; 
                case "reportTime":
                     params.BeginReport= $("#reportTime").val().split(" - ")[0]+' 00:00:00';
                     params.EndReport= $("#reportTime").val().split(" - ")[1]+' 23:59:59';
                    break;
                case "IPBackSynTime":
                     params.BeginIPBackSynTime= $("#IPBackSynTime").val().split(" - ")[0]+' 00:00:00';
                     params.EndIPBackSynTime= $("#IPBackSynTime").val().split(" - ")[1]+' 23:59:59';
                    break; 
                default:
                    params[field.name] = field.value;
            }
        }
    });
    // console.log(params)
    $.ajax({
        url: encodeURI(bathPath + "/ipaddrmodule/IpAssigned/queryIpAssignedIpv4list"),
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
                tableData.forEach(function(item,index){
                  item.inetnum = formatIpMask(item.inetnumStart,item.inetnumEnd)
                  if( item.Sydwzjhm != null ){
                    let length = item.Sydwzjhm.length;
                    let Sydwzjhm = ''
                    let fistStr = "";
                    let lastStr = "";
                    if( length > 3 ){
                        fistStr = item.Sydwzjhm.substring(0,3);
                    }
                    if( length > 6 ){
                        lastStr = item.Sydwzjhm.substring(length-3,length);
                    }
                    if( fistStr != null ){
                        Sydwzjhm += fistStr+"********";
                    }
                    if( lastStr != null){
                        Sydwzjhm += lastStr;
                    }
                    item.Sydwzjhm = Sydwzjhm
                }
               });
               
                tableDataList = tableData;
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
    var columnsData ;
    var frozenColumns;
    if(showReport){
        frozenColumns =[[ 
            { field: 'ck', checkbox: true, width: '30' },  //复选框 
            {
                field: 'operate', title: '操作', align: 'center',width: '120',
                formatter: function (value, row, index) {
                    let InetnumID = row.InetnumID;
                    let inetnum = row.inetnum;
                    if(row.Inetnumdealflag == '1'){
                        return "<a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=detail(\'" + InetnumID + "\','Y')>详情</a>";
                    }else{
                        return "<a class='operateBtn' style='cursor:hand' onclick=reclaimip(\'" + InetnumID + "\',\'" + inetnum + "\',\'" + row.inetnumStart + "\',\'"+ row.inetnumEnd + "\')>回收</a><a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=update(\'" + InetnumID + "\','Y')>修改</a><a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=detail(\'" + InetnumID + "\','Y')>详情</a>";
                    }
                }
            },
            { field: 'NodeName', title: '管理组织', align: 'center',width: '180' },
            { field: 'inetnum', title: 'IP地址', align: 'center',width: '120' },
            { field: 'statusName', title: '类别', align: 'center',width: '120',},
            { field: 'NetTypeName', title: '地址类型', align: 'center',width: '160',
            formatter(value, row, index){
                if(row.NetTypeName){
                    return row.NetTypeName
                }else{
                    return row.UserTypeName
                }
            } },
            { field: 'ReportFlag', title: '上报状态', align: 'center',width: 80 ,
            formatter: function (value, row, index) {
                let reportFlagText= ''
                if(row.ReportFlag == 'F'){
                    reportFlagText =  '<img  src="assets/module/ipv4Allocation/img/ReportFlagF.png" valign="center" title = "集团上报状态:'+(row.Status=='Allocated'?'地址分配':'')+'上报失败&#10;集团上报时间:'+(row.Reporttime?row.Reporttime:'')+'&#10;同步信息:'+(row.ReportInfo?row.ReportInfo:'')+'"><a style="margin-left: 5px;color:red;cursor:pointer" onclick="goFailDetail(event,'+index+')";>详细</a>'; 
                }else if(row.ReportFlag == 'S'){
                    reportFlagText =   '<img src="assets/module/ipv4Allocation/img/ReportFlagS.png" valign="center" title = "集团上报状态:'+(row.Status=='Allocated'?'地址分配':'')+'上报成功&#10;集团上报时间:'+(row.Reporttime?row.Reporttime:'')+'&#10;同步信息:'+(row.ReportInfo?row.ReportInfo:'')+'">';
                }else if(row.ReportFlag == 'D'){
                    reportFlagText =   '<img src="assets/module/ipv4Allocation/img/ReportFlagD.png" valign="center" title = "集团上报状态:'+(row.Status=='Allocated'?'地址分配':'')+'处理中&#10;集团上报时间:'+(row.Reporttime?row.Reporttime:'')+'&#10;同步信息:'+(row.ReportInfo?row.ReportInfo:'')+'">';
                }else if(row.ReportFlag == 'U'){
                    reportFlagText =   '<img src="assets/module/ipv4Allocation/img/ReportFlagU.png" valign="center" title = "集团上报状态:'+(row.Status=='Allocated'?'地址分配':'')+'未上报&#10;集团上报时间:'+(row.Reporttime?row.Reporttime:'')+'&#10;同步信息:'+(row.ReportInfo?row.ReportInfo:'')+'">';
                }else if(row.ReportFlag == 'N'){
                    reportFlagText =   '<img src="assets/module/ipv4Allocation/img/ReportFlagN.png" valign="center" title = "集团上报状态:'+(row.Status=='Allocated'?'地址分配':'')+'不用上报&#10;集团上报时间:'+(row.Reporttime?row.Reporttime:'')+'&#10;同步信息:'+(row.ReportInfo?row.ReportInfo:'')+'">';
                }else{
                    reportFlagText =   '';
                }
                return reportFlagText;
                
            } }, 
            { field: 'IPBackSynFlag', title: '备案状态', align: 'center',width: 80 ,
            formatter: function (value, row, index) {
                let reportFlagText= ''
                if(row.IPBackSynFlag == '0'){
                    reportFlagText =  '<img  src="assets/module/ipv4Allocation/img/IPBackSynFlag0.png" valign="center" title = "备案状态:未备案&#10;备案时间:'+(row.IPBackSynTime?row.IPBackSynTime:'')+'&#10;备案ID:'+(row.IpbackId?row.IpbackId:'')+'&#10;同步信息:'+(row.IpBackSynInfo?row.IpBackSynInfo:'')+'">';
                }else if(row.IPBackSynFlag == '1'){
                    reportFlagText =   '<img  src="assets/module/ipv4Allocation/img/IPBackSynFlag1.png" valign="center" title = "备案状态:备案成功&#10;备案时间:'+(row.IPBackSynTime?row.IPBackSynTime:'')+'&#10;备案ID:'+(row.IpbackId?row.IpbackId:'')+'&#10;同步信息:'+(row.IpBackSynInfo?row.IpBackSynInfo:'')+'">';
                }else if(row.IPBackSynFlag == '2'){
                    reportFlagText =   '<img  src="assets/module/ipv4Allocation/img/IPBackSynFlag2.png" valign="center" title = "备案状态:备案中&#10;备案时间:'+(row.IPBackSynTime?row.IPBackSynTime:'')+'&#10;备案ID:'+(row.IpbackId?row.IpbackId:'')+'&#10;同步信息:'+(row.IpBackSynInfo?row.IpBackSynInfo:'')+'">';
                }else if(row.IPBackSynFlag == '3'){
                    reportFlagText =   '<img  src="assets/module/ipv4Allocation/img/IPBackSynFlag3.png" valign="center" title = "备案状态:备案失败&#10;备案时间:'+(row.IPBackSynTime?row.IPBackSynTime:'')+'&#10;备案ID:'+(row.IpbackId?row.IpbackId:'')+'&#10;同步信息:'+(row.IpBackSynInfo?row.IpBackSynInfo:'')+'"><a style="margin-left: 5px;color:red;cursor:pointer" onclick="goFailDetail2(event,'+index+')";>详细</a>';
                }else if(row.IPBackSynFlag == '4'){
                    reportFlagText =   '<img  src="assets/module/ipv4Allocation/img/IPBackSynFlag4.png" valign="center" title = "备案状态:不用报备&#10;备案时间:'+(row.IPBackSynTime?row.IPBackSynTime:'')+'&#10;备案ID:'+(row.IpbackId?row.IpbackId:'')+'&#10;同步信息:'+(row.IpBackSynInfo?row.IpBackSynInfo:'')+'">';
                }else{
                    reportFlagText =   '';
                }
                return reportFlagText;
                
            } }, 
            ]];
        columnsData = [[    
                           
            { field: 'IpBackInfoFillCompleteName', title: '是否备案完整', align: 'center',width: 100 }, 
            { field: 'UserSubject', title: '用户名称', align: 'center',width: 140 },
            { field: 'DeviceLoopback', title: '注册地址的设备IP', align: 'center',width: 140,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
            }},
            { field: 'DeviceName', title: '使用设备名称', align: 'center',width: 180,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
            }},
            { field: 'PortName', title: '使用端口名称', align: 'center',width: 180,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
            }},
            { field: 'AccessSpeed', title: '带宽(Mb)', align: 'center',width: 140},
            { field: 'UseDescr', title: '使用描述', align: 'center',width: 140,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
            }},
            { field: 'UserDepartment', title: '使用部门', align: 'center',width: 100 },
            { field: 'ContactPerson', title: '联系人', align: 'center',width: 100 },
            { field: 'Contractinfo', title: '联系方式', align: 'center',width: 100 },
            { field: 'SpecificUsage', title: '具体用途', align: 'center',width: 100 },
            { field: 'ReplyManName', title: '操作人', align: 'center',width: 100 },
            { field: 'UseTypeName', title: '地址使用方式', align: 'center',width: 100 },
            { field: 'AllotDate', title: '注册日期', align: 'center',width: 180 },
            { field: 'Remarks', title: '备注', align: 'center',width: 140,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
                
            }},
            { field: 'ArchFlagName', title: '是否备案', align: 'center',width: 140},
            { field: 'ProvinceName', title: '单位所在省', align: 'center',width: 140},
            { field: 'CityName', title: '单位所在市', align: 'center',width: 140},
            { field: 'CountyName', title: '单位所在县', align: 'center',width: 140},
            { field: 'GatewayIP', title: '网关IP地址', align: 'center',width: 140},
            { field: 'GatewayLocation', title: '网关所在地址', align: 'center',width: 140},
            { field: 'WgShengName', title: '网关所在省', align: 'center',width: 140},
            { field: 'WgShiName', title: '网关所在市', align: 'center',width: 140},
            { field: 'WgXianName', title: '网关所在县', align: 'center',width: 140},
            { field: 'UseUnitFlagName', title: '使用单位性质', align: 'center',width: 140},
            { field: 'SydwzjlxName', title: '使用单位证件类型', align: 'center',width: 140},
            { field: 'Sydwzjhm', title: '使用单位证件号码', align: 'center',width: 140}, 
            { field: 'YyfwlxName', title: '应用服务类型', align: 'center',width: 140,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
                
            }},
            { field: 'SyqyName', title: '使用区域', align: 'center',width: 140},  
        ]];
    }else{
        frozenColumns =[[ 
            { field: 'ck', checkbox: true, width: '30' },  //复选框 
            {
                field: 'operate', title: '操作', align: 'center',width: '120',
                formatter: function (value, row, index) {
                    let InetnumID = row.InetnumID;
                    let inetnum = row.inetnum;
                    if(row.Inetnumdealflag == '1'){
                        return "<a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=detail(\'" + InetnumID + "\','Y')>详情</a>";
                    }else{
                        return "<a class='operateBtn' style='cursor:hand' onclick=reclaimip(\'" + InetnumID + "\',\'" + inetnum + "\',\'" + row.inetnumStart + "\',\'"+ row.inetnumEnd + "\')>回收</a><a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=update(\'" + InetnumID + "\','Y')>修改</a><a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=detail(\'" + InetnumID + "\','Y')>详情</a>";
                    }
                }
            },
            { field: 'NodeName', title: '管理组织', align: 'center',width: '180' },
            { field: 'inetnum', title: 'IP地址', align: 'center',width: '120' },
            { field: 'statusName', title: '类别', align: 'center',width: '120',},
            { field: 'NetTypeName', title: '地址类型', align: 'center',width: '160',
            formatter(value, row, index){
                if(row.NetTypeName){
                    return row.NetTypeName
                }else{
                    return row.UserTypeName
                }
            } },
            ]];
        columnsData = [[ 
            { field: 'IpBackInfoFillCompleteName', title: '是否备案完整', align: 'center',width: 100 }, 
            { field: 'UserSubject', title: '用户名称', align: 'center',width: 140 },
            { field: 'DeviceLoopback', title: '注册地址的设备IP', align: 'center',width: 140,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
            }},
            { field: 'DeviceName', title: '使用设备名称', align: 'center',width: 180,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
            }},
            { field: 'PortName', title: '使用端口名称', align: 'center',width: 180,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
            }},
            { field: 'AccessSpeed', title: '带宽(Mb)', align: 'center',width: 140},
            { field: 'UseDescr', title: '使用描述', align: 'center',width: 140,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
                
            }},
            { field: 'UserDepartment', title: '使用部门', align: 'center',width: 100 },
            { field: 'ContactPerson', title: '联系人', align: 'center',width: 100 },
            { field: 'Contractinfo', title: '联系方式', align: 'center',width: 100 },
            { field: 'SpecificUsage', title: '具体用途', align: 'center',width: 100 },
            { field: 'ReplyManName', title: '操作人', align: 'center',width: 100 },
            { field: 'UseTypeName', title: '地址使用方式', align: 'center',width: 100 },  
            { field: 'AllotDate', title: '注册日期', align: 'center', width: 180 },
            { field: 'Remarks', title: '备注', align: 'center', width: 160 ,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
                
            }},
            { field: 'ArchFlagName', title: '是否备案', align: 'center',width: 140},
            { field: 'ProvinceName', title: '单位所在省', align: 'center',width: 140},
            { field: 'CityName', title: '单位所在市', align: 'center',width: 140},
            { field: 'CountyName', title: '单位所在县', align: 'center',width: 140},
            { field: 'GatewayIP', title: '网关IP地址', align: 'center',width: 140},
            { field: 'GatewayLocation', title: '网关所在地址', align: 'center',width: 140},
            { field: 'WgShengName', title: '网关所在省', align: 'center',width: 140},
            { field: 'WgShiName', title: '网关所在市', align: 'center',width: 140},
            { field: 'WgXianName', title: '网关所在县', align: 'center',width: 140},
            { field: 'UseUnitFlagName', title: '使用单位性质', align: 'center',width: 140},
            { field: 'SydwzjlxName', title: '使用单位证件类型', align: 'center',width: 140},
            { field: 'Sydwzjhm', title: '使用单位证件号码', align: 'center',width: 140}, 
            { field: 'YyfwlxName', title: '应用服务类型', align: 'center',width: 140,
            formatter(value, row, index){
                if(value){
                    return "<span style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display:inline-block;width:100%'  title=\""+value+"\">"+value+"</span>"
                }
                
            }},
            { field: 'SyqyName', title: '使用区域', align: 'center',width: 140},
        ]];
    }
   
    var tableId = "dataList";
    var tableH = $(".tablePanel").height();
    var opt = {
        columnsData: columnsData,
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false,//分页
            checkOnSelect:false,
            fitColumns: false,
            frozenColumns:frozenColumns,
            onLoadSuccess:function(row){//当表格成功加载时执行      
                $(".datagrid-filter-row").hide();    
                var rowData = row.rows;
                $.each(rowData,function(idx,val){//遍历JSON
                      if(val.Inetnumdealflag == '1'){
                        $(".tablePanel").find(".datagrid-cell-check").children("input[type=\"checkbox\"]").eq(idx).attr("disabled", "disabled").attr("title","删除上报中");
                      }
                });        
            }
        }
    };
    relatedTable(tableId, opt);
}
function getSysPara(){
    $.ajax({
        url:encodeURI(bathPath + '/ipaddrmodule/SysCommon/getSysPara?ParaName=IPBackDisplay'),
        type:'get',
        cache:false,
        dataType:'json',
        contentType:"application/json",
        success:function(obj){     
            if(obj.data){
                if(obj.data.PARAVALUE == 'Y'){
                    $(".reportBox").show()
                    showReport = true
                }else{
                    $(".reportBox").hide()
                    showReport = false
                }
            }else{
                $(".reportBox").hide()
                showReport = false
            }
        }
    })
}
//批量回收
function reclaimipBath(){
    var selRow = $('#dataList').datagrid('getChecked')
    let reclaimList = []
    let delList = []
    selRow.forEach(function(item,index){
        if(item.Inetnumdealflag != '1'){
            reclaimList.push({
                "rownum":index.toString(),
                "InetnumID":item.InetnumID,
                "IPBackSynFlag":'0',
                "ReportFlag":'U',
                "Inetnumdealflag":'1',
            })
            delList.push({
                "InetnumID":item.InetnumID,
                "inetnumStart":item.inetnumStart,
                "inetnumEnd":item.inetnumEnd
            })
        }
    })
    if(reclaimList.length == 0){
        $.messager.alert('提示','未选择要回收的地址！','error');
    }else{
        $.messager.confirm('回收', '是否确认回收当前的选中信息?', function(flag){
            if (flag){ 
                
                let params = reclaimList
                    $.ajax({
                        url:encodeURI(bathPath + '/ipaddrmodule/IpAssigned/BathIpAssignedDel'),
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
                                $.messager.progress('close');
                            if(obj.data.length){
                                    var content =''
                                obj.data.forEach(function(item,index){
                                    content+='IP地址'+selRow[item.rownum].inetnum+':'+item.errormsg + '<br/>'
                                })
                               $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                            }else{
                                $.messager.alert('提示','回收成功！','success');
                            }
                                queryAllocatedlist();//刷新数据
                            }else{
                                $.messager.alert('提示','回收失败!'+obj.tip,'error');
                                queryAllocatedlist();//刷新数据
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
}
//跳转到上报异常信息
function goFailDetail(event,rowIndex){
    var row=$("#dataList").datagrid("selectRow",rowIndex).datagrid("getSelected");
    // console.log(row)

	// ReportInfo/inetnum/showips/Status/NextBranchName/BranchName/UserSubject/DeviceName/PortName/AllotDate/ApplyId/classtypename
    var MenuNodeName =row.NodeName;
	var ReportInfo = row.ReportInfo;
	if (!ReportInfo) {
		ReportInfo = "";
	}
	var inetnum = row.inetnum;
	if (!inetnum) {
		inetnum = "";
	}
	var Status = row.Status;
	if (!Status) {
		Status = "";
	}
	var BackAddress = row.BackAddress;
	if (!BackAddress) {
		BackAddress = "";
	}
	var NetTypeName = row.IpTypeName;
	if (!NetTypeName) {
		NetTypeName = "";
	}
	var UserSubject = row.UserSubject;
	if (!UserSubject) {
		UserSubject = "";
	}
	var DeviceName = row.DeviceName;
	if (!DeviceName) {
		DeviceName = "";
	}
	var PortName = row.PortName;
	if (!PortName) {
		PortName = "";
	}
	var AllotDate =row.AllotDate
	if (!AllotDate) {
		AllotDate = "";
	}
	var IPBackSynInfo = row.IPBackSynInfo;
	if (!IPBackSynInfo) {
		IPBackSynInfo = "";
	}

	var showips = row.inetnum;
	if (!showips) {
		showips = "";
	}

	var NextNodeName = row.NextNodeName;
	if (!NextNodeName) {
		NextNodeName = "";
	}

	var UserTypeName = row.UserTypeName;
	
	var openUrl = bathPath+"/nos/ipaddrmanage/ipaddressquery/ActUpReportException.jsp?ReportInfo="
		+ ReportInfo
		+ "&inetnum="
		+ inetnum
		+ "&MenuNodeName="
		+ MenuNodeName
		+ "&Status="
		+ Status
		+ "&BackAddress="
		+ BackAddress
		+ "&NetTypeName="
		+ NetTypeName
		+ "&UserSubject="
		+ UserSubject
		+ "&DeviceName="
		+ DeviceName
		+ "&PortName="
		+ PortName
		+ "&AllotDate="
		+ AllotDate
		+ "&IPBackSynInfo="
		+ IPBackSynInfo
		+ "&showips="
		+ showips
		+ "&NextNodeName="
        + NextNodeName
        + "&UserTypeName="
        + UserTypeName;// 弹出窗口的url
        window.open(openUrl)
}
//跳转到备案失败信息
function goFailDetail2(event,rowIndex){
    var row=$("#dataList").datagrid("selectRow",rowIndex).datagrid("getSelected");
    // console.log(row)

	// ReportInfo/inetnum/showips/Status/NextBranchName/BranchName/UserSubject/DeviceName/PortName/AllotDate/ApplyId/classtypename
    var MenuNodeName =row.NodeName;
	var IPBackSynInfo = row.IPBackSynInfo;
	if (!IPBackSynInfo) {
		IPBackSynInfo = "";
	}
	var inetnum = row.inetnum;
	if (!inetnum) {
		inetnum = "";
	}
	var Status = row.Status;
	if (!Status) {
		Status = "";
	}
	var BackAddress = row.BackAddress;
	if (!BackAddress) {
		BackAddress = "";
	}
	var NetTypeName = row.IpTypeName;
	if (!NetTypeName) {
		NetTypeName = "";
	}
	var UserSubject = row.UserSubject;
	if (!UserSubject) {
		UserSubject = "";
	}
	var DeviceName = row.DeviceName;
	if (!DeviceName) {
		DeviceName = "";
	}
	var PortName = row.PortName;
	if (!PortName) {
		PortName = "";
	}
	var AllotDate =row.AllotDate
	if (!AllotDate) {
		AllotDate = "";
	}
	var IPBackSynInfo = row.IPBackSynInfo;
	if (!IPBackSynInfo) {
		IPBackSynInfo = "";
	}

	var showips = row.inetnum;
	if (!showips) {
		showips = "";
	}

	var NextNodeName = row.NextNodeName;
	if (!NextNodeName) {
		NextNodeName = "";
	}

	var UserTypeName = row.UserTypeName;
	
	var openUrl = bathPath+"/nos/ipaddrmanage/ipaddressquery/ActIPBackException.jsp?IPBackSynInfo="
		+ IPBackSynInfo
		+ "&inetnum="
		+ inetnum
		+ "&MenuNodeName="
		+ MenuNodeName
		+ "&Status="
		+ Status
		+ "&BackAddress="
		+ BackAddress
		+ "&NetTypeName="
		+ NetTypeName
		+ "&UserSubject="
		+ UserSubject
		+ "&DeviceName="
		+ DeviceName
		+ "&PortName="
		+ PortName
		+ "&AllotDate="
		+ AllotDate
		+ "&IPBackSynInfo="
		+ IPBackSynInfo
		+ "&showips="
		+ showips
		+ "&NextNodeName="
        + NextNodeName
        + "&UserTypeName="
        + UserTypeName;// 弹出窗口的url
        window.open(openUrl)
}

//单个回收
function reclaimip(inetnumid, inetnum, inetnumStart,inetnumEnd){
    let reclaimList = []
    let delList = []
    reclaimList.push({
        "rownum":0,
        "InetnumID":inetnumid,
        "IPBackSynFlag":'0',
        "ReportFlag":'U',
        "Inetnumdealflag":'1',
    })
    delList.push({
        "InetnumID":inetnumid,
        "inetnumStart":inetnumStart,
        "inetnumEnd":inetnumEnd
    })
    $.messager.confirm('回收', '确认回收地址吗?', function(flag){
        if (flag){
            if(showReport){
                let params = reclaimList
                $.ajax({
                    url:encodeURI(bathPath + '/ipaddrmodule/IpAssigned/BathIpAssignedDel'),
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
                            $.messager.progress('close');
                        if(obj.data.length){
                                var content =''
                            obj.data.forEach(function(item,index){
                                content+='IP地址'+inetnum+':'+item.errormsg + '<br/>'
                            })
                           $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                        }else{
                            $.messager.alert('提示','回收成功！','success');
                        }
                            queryAllocatedlist();//刷新数据
                        }else{
                            $.messager.alert('提示','回收失败!'+obj.tip,'error');
                            queryAllocatedlist();//刷新数据
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
            }else{
                let params = delList[0]
                $.ajax({
                    url:encodeURI(bathPath + '/ipaddrmodule/IpAssigned/AssignedActualDel'),
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
                            $.messager.progress('close');
                        if(obj.data){
                                var content =''
                            obj.data.forEach(function(item,index){
                                content+='IP地址'+inetnum+':'+item.errormsg + '<br/>'
                            })
                           $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                        }else{
                            $.messager.alert('提示','回收成功！','success');
                        }
                            queryAllocatedlist();//刷新数据
                        }else{
                            $.messager.alert('提示','回收失败!'+obj.tip,'error');
                            queryAllocatedlist();//刷新数据
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
        }
    })
}

//详情
function detail(InetnumID,showReport){
    window.top.$vm.$openTab({
           name: '注册地址详情',
           path: bathPath + '/ipaddrmodule/views/jsp/Ipv4Assigned/Ipv4AssignedDetail.jsp?InetnumID='+ InetnumID 
   })
       // var path_open = '/ipaddrmodule/views/jsp/ipv4Allocation/ipv4AllocationDetail.html?InetnumID='+ InetnumID  +'&showReport='+showReport;
       // window.open(path_open);
}
//修改
function update(InetnumID){
    var NodeCode =  $("#nodeList").combotree('getValue');
    var NodeName=  $("#nodeList").combotree('getText');
    if(NodeCode==null || NodeCode==""){
        alert("该用户没有系统配置权限！");
        return;
    }
    window.top.$vm.$openTab({
        name: '注册修改',
        path: bathPath + '/ipaddrmodule/views/jsp/Ipv4Assigned/Ipv4AssignedAdd.jsp?NodeCode='+NodeCode+"&NodeName="+NodeName+"&type=mod&InetnumID="+InetnumID
    })
    // window.open(bathPath + '/ipaddrmodule/views/jsp/Ipv4Assigned/Ipv4AssignedAdd.jsp?NodeCode='+NodeCode+"&NodeName="+NodeName+"&type=mod&InetnumID="+InetnumID);
}
//导出
function queryIpAssignedIpv4listImport(){
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
        pagesize: '0',
        pageno: '0'
    }
    var fields = $('.layui-form').serializeArray();
    $.each(fields, function(i, field) {
        if (field.value) {
             switch (field.name) {
                case "NodeCodeLike":
                    params[field.name]=$("#nodeList").combotree('getValue');
                    break;
                case "IpClassType":
                    params[field.name]=$("#ipTypeList").combotree('getValue');
                    break;
                case "inetnum":
                     params.beginip= dealIpv4FromAll(beginip);
                     params.endip=dealIpv4FromAll(endip);
                     params.scope='intersection';
                    break; 
                case "dateTime":
                     params.BeginAllotDate= $("#dateTime").val().split(" - ")[0]+' 00:00:00';
                     params.EndAllotDate= $("#dateTime").val().split(" - ")[1]+' 23:59:59';
                    break; 
                case "reportTime":
                     params.BeginReport= $("#reportTime").val().split(" - ")[0]+' 00:00:00';
                     params.EndReport= $("#reportTime").val().split(" - ")[1]+' 23:59:59';
                    break;
                case "IPBackSynTime":
                     params.BeginIPBackSynTime= $("#IPBackSynTime").val().split(" - ")[0]+' 00:00:00';
                     params.EndIPBackSynTime= $("#IPBackSynTime").val().split(" - ")[1]+' 23:59:59';
                    break; 
                default:
                    params[field.name] = field.value;
            }
        }
    });
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/IpAssigned/queryIpAssignedIpv4listImport'),
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
//导入
function importPage(){
    window.open(bathPath+'/nos/ipaddrmanage/ipaddrassigned/IPAssignedImoprt.jsp','','toolbar=no,directories=no,menubar=no,scrollbars=yes,resizable=yes,width=900,height=500,left=10,top=0');
}
//实时备案
function trueBackIPs(){
    //获取当前combotree的tree对象
var tree = $('#nodeList').combotree('tree'); 
//获取当前选中的节点
var data = tree.tree('getSelected'); 


	window.open(bathPath+"/nos/ipaddrmanage/ipaddrassigned/IPAssignedBackExec.jsp?MenuNodeName="+data.nodeName)//跳转路径
}