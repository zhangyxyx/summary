$(function () {
    getNodeList();
    getSysPara();
    initBtnClickEvent();
    initClearBtnEvent();
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
var showReport = false;//上报是否显示

//初始化layui对象
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
    })
}

//初始化地址类型清空按钮事件 清空规划组织
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

//判断是否显示上报时间上报状态
function getSysPara(){
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/SysCommon/getSysPara?ParaName=IPBackDisplay'),
        type:'get',
        cache:false,
        dataType:'json',
        contentType:"application/json",
        success:function(obj){     
            if(obj.data){
                if(obj.data.PARAVALUE == 'Y'){
                    $("#reportBox").show()
                    showReport = true
                }else{
                    $("#reportBox").hide()
                    showReport = false
                }
            }else{
                $("#reportBox").hide()
                showReport = false
            }
        }
    })
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
                queryAllocatedlist();
                break;
            case "批量回收":
                reclaimipBath()
                break;
            case "新增":
                var NodeCode =  $("#nodeList").combotree('getValue');
                if(NodeCode==null || NodeCode==""){
                    alert("该用户没有系统配置权限！");
                    return;
                }
                  window.open(bathPath+'/ipaddrmodule/views/jsp/Ipv4dzfp/Ipv4dzfp.jsp?NodeCode='+NodeCode,'','toolbar=yes,directories=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600,left=0,top=0');
                break;
            
                
                // window.open('views/jsp/ipv4BigIpList/ipv4BigIpNew.jsp?OriNodeName='+OriNodeName+'&OriNodeCode='+OriNodeCode);
                
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


//分配址查询
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
        NodeCodeLike: $("#nodeList").combotree('getValue'),
        NextNodeName:$("#NextNodeName").val(),
        IpClassType:$("#ipTypeList").combotree('getValue'),
        BeginAllotDate: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[0]+' 00:00:00',
        EndAllotDate: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[1]+' 23:59:59',
        BeginReport: $("#reportTime").val() == "" ? "" : $("#reportTime").val().split(" - ")[0]+' 00:00:00',
        EndReport: $("#reportTime").val() == "" ? "" : $("#reportTime").val().split(" - ")[1]+' 23:59:59',
        ReportFlag:$("#reportFlag").val(),
        beginip: dealIpv4FromAll(beginip),
        endip: dealIpv4FromAll(endip),
        scope: 'intersection',
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString()
    }
    // console.log(params)
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpAllocateCondition/queryAllocatedlist'),
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
               })
               
            tableDataList = tableData
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
    if(showReport){
        columnsData = [[ 
            { field: 'ck', checkbox: true, width: '30' },  //复选框 
            { field: 'inetnum', title: 'IP地址', align: 'center', width: 140 },
            { field: 'IpTypeName', title: '地址类型', align: 'center', width: 100 },
            { field: 'NodeName', title: '分配组织名称', align: 'center', width: 100 },
            { field: 'NextNodeName', title: '被分配组织名称', align: 'center', width: 100 },
            { field: 'AllotDate', title: '分配日期', align: 'center', width: 120 },
            { field: 'ReplyManName', title: '分配人', align: 'center', width: 120 },
            { field: 'Remarks', title: '备注', align: 'center', width: 120 },
            { field: 'ReportFlag', title: '上报状态', align: 'center', width: 80,
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
            { field: 'Reporttime', title: '上报时间', align: 'center', width: 120 },
            {
                field: 'operate', title: '操作', align: 'center', width: 100,
                formatter: function (value, row, index) {
                    let InetnumID = row.InetnumID;
                    let inetnum = row.inetnum;
                    if(row.Inetnumdealflag == '1'){
                        return "<a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=detail(\'" + InetnumID + "\','Y')>详情</a>";
                    }else{
                        return "<a class='operateBtn' style='cursor:hand' onclick=reclaimip(\'" + InetnumID + "\',\'" + inetnum + "\',\'" + row.NodeCode + "\',\'"+ row.NodeName + "\',\'" + row.NextNodeCode + "\',\'"+ row.NextNodeName+ "\',\'"+ row.IpTypeCode+ "\',\'Y\',\'" + row.IPVersion + "\',\'" + row.PrivateFlag + "\',\'" + row.Status + "\',)>回收</a><a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=detail(\'" + InetnumID + "\','Y')>详情</a>";
                    }
                }
            }
        ]];
    }else{
        columnsData = [[ 
            { field: 'ck', checkbox: true, width: '30' },  //复选框 
            { field: 'inetnum', title: 'IP地址', align: 'center', width: 140 },
            { field: 'IpTypeName', title: '地址类型', align: 'center', width: 100 },
            { field: 'NodeName', title: '分配组织名称', align: 'center', width: 120 },
            { field: 'NextNodeName', title: '被分配组织名称', align: 'center', width: 120 },
            { field: 'AllotDate', title: '分配日期', align: 'center', width: 120 },
            { field: 'ReplyManName', title: '分配人', align: 'center', width: 100 },
            { field: 'Remarks', title: '备注', align: 'center', width: 120 },
            {
                field: 'operate', title: '操作', align: 'center', width: 100,
                formatter: function (value, row, index) {
                    let InetnumID = row.InetnumID;
                    let inetnum = row.inetnum;
                    if(row.Inetnumdealflag == '1'){
                        return "<a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=detail(\'" + InetnumID + "\','N')>详情</a>";
                    }else{
                        return "<a class='operateBtn' style='cursor:hand' onclick=reclaimip(\'" + InetnumID + "\',\'" + inetnum + "\',\'" + row.NodeCode + "\',\'"+ row.NodeName + "\',\'" + row.NextNodeCode + "\',\'"+ row.NextNodeName+ "\',\'"+ row.IpTypeCode+ "\',\'N\',\'" + row.IPVersion + "\',\'" + row.PrivateFlag + "\',\'" + row.Status + "\',)>回收</a><a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=detail(\'" + InetnumID + "\','N')>详情</a>";
                    }
                    
                }
            }
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
            onLoadSuccess:function(row){//当表格成功加载时执行      
                $(".datagrid-filter-row").hide();    
                var rowData = row.rows;
                $.each(rowData,function(idx,val){//遍历JSON
                      if(val.Inetnumdealflag == '1'){
                        $(".tablePanel").find(".datagrid-cell-check").children("input[type=\"checkbox\"]").eq(idx).attr({
                            "disabled":"disabled",
                            "title":'删除上报中'
                        });
                      }
                });        
            }
        }
    };
    relatedTable(tableId, opt);
}
//单个回收
function reclaimip(inetnumid, inetnum, nodecode,NodeName, NextNodeCode, NextNodeName,IpTypeCode,IPBackDisplay,IPVersion, PrivateFlag, Status,ReportInfo){
    $.messager.confirm('回收', '确认回收地址吗?', function(flag){
        if (flag){
            if (IPBackDisplay == "Y") { //全部回收
                var flag = "";
			$.ajax({
		        type:"get",
		        url: bathPath+"/nos/ipaddrmanage/ipallocate/IpAllocateExec.jsp?method=flag&NextNodeCode="+NextNodeCode,
		        //dataType:"json",
		    	async: false,
		        success: function(data){
		        	flag = data.trim();
		        }         
		    });
		
			if(flag == 'Y'){
				//若flag=Y，说明是需要上报的节点。则调用新的回收页面（全部回收），该页面不支持部分回收
                let params = [
                    {
                        rownum:'0',
                        InetnumID:inetnumid,
                        IPBackSynFlag:'0',
                        ReportFlag:'U',
                        Inetnumdealflag:'1'
                    }
                ]
                $.ajax({
                    url: encodeURI(bathPath + '/ipaddrmodule/IpAllocateCondition/BathDelAllocateAll'),
                    type:'POST',
                    data:JSON.stringify(params),
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
            
                    },
                    success: function (obj) {
                        if(obj.code == "0000"){
                            if(obj.data.length){
                                var content =''
                            obj.data.forEach(function(item,index){
                                content+=item.errormsg + '<br/>'
                            })
                           $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                        }else{
                            $.messager.alert('提示','回收成功！','success');
                        }
                            queryAllocatedlist()
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
				
			}else if(flag == 'N'){
				//若flag=N，说明是不需要上报的节点。调用现有的分配回收页面（支持部分回收）
                window.top.$vm.$openTab({
                    name: '分配地址部分回收',
                    path: bathPath + '/ipaddrmodule/views/jsp/ipv4Allocation/ipv4AllocationReclaim.jsp?InetnumID='+ inetnumid +'&reclaimip='+inetnum+'&NodeCode='+nodecode+'&NodeName='+NodeName +'&NextNodeCode='+NextNodeCode+'&NextNodeName='+NextNodeName+'&IpTypeCode='+IpTypeCode 
                })
			}
               
            }else{ //部分回收
                window.top.$vm.$openTab({
                    name: '分配地址部分回收',
                    path: bathPath + '/ipaddrmodule/views/jsp/ipv4Allocation/ipv4AllocationReclaim.jsp?InetnumID='+ inetnumid +'&reclaimip='+inetnum+'&NodeCode='+nodecode+'&NodeName='+NodeName +'&NextNodeCode='+NextNodeCode+'&NextNodeName='+NextNodeName+'&IpTypeCode='+IpTypeCode 
                })
                // var path_open = '/ipaddrmodule/views/jsp/ipv4Allocation/ipv4AllocationReclaim.html?InetnumID='+ inetnumid +'&reclaimip='+inetnum+'&NodeCode='+nodecode+'&NextNodeCode='+NextNodeCode;
				// window.open(path_open);
            }
        }
    })
}

//批量回收
function reclaimipBath(){
    // var selRow = $('#dataList').datagrid('getSelections')
    var selRow = $('#dataList').datagrid('getChecked')
    let reclaimList = []
    selRow.forEach(function(item,index){
        if(item.Inetnumdealflag != '1'){
            reclaimList.push({
                "rownum":index,
                "InetnumID":item.InetnumID,
                "IPBackSynFlag":'0',
                "ReportFlag":'U',
                "Inetnumdealflag":'1',
            })
        }
    })
    if(reclaimList.length == 0){
        $.messager.alert('提示','未选择要回收的地址！','error');
    }else{
        $.messager.confirm('回收', '是否确认回收当前的选中信息?', function(flag){
            if (flag){
                var params = reclaimList
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/IpAllocateCondition/BathDelAllocateAll'),
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

//详情
function detail(InetnumID,showReport){
     window.top.$vm.$openTab({
            name: '分配地址详情',
            path: bathPath + '/ipaddrmodule/views/jsp/ipv4Allocation/ipv4AllocationDetail.jsp?InetnumID='+ InetnumID +'&showReport='+showReport
    })
        // var path_open = '/ipaddrmodule/views/jsp/ipv4Allocation/ipv4AllocationDetail.html?InetnumID='+ InetnumID  +'&showReport='+showReport;
		// window.open(path_open);
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

//校验输入的IP地址是合法的ipv4或ipv6
function validIPAddress(IP) {
    //按"."进行分割
    var parts = IP.split(".");
    //IPv4由4个部分组成
    if (parts.length === 4 || parts.length < 4) {
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

//IP转成整型
function ip2int(ip) {
    var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
}

function Trim(Liter){	
	return Liter.trim();
}

function IPV6Formatting(IPstr)
{
	if (IPstr==null)
	{
		return "Error";
	}
	if (IPstr=="")
	{
		return "Error";
	}
	var i = 0;
	var marknum = 0;
	var mark1 = IPstr.indexOf("::");
	var mark2 = IPstr.lastIndexOf("::");
	if(mark1!=mark2)
	{
		return "Error";
	}
	var tmpstr = IPstr;
	if(tmpstr.indexOf(".")>=0)
	{
		var v4tmp = tmpstr.substring(tmpstr.lastIndexOf(":")+1,tmpstr.length);
		if(IPFormatting(v4tmp).indexOf("Error")>=0)
		{
			return "Error";			
		}
		marknum = marknum +2;
		tmpstr = tmpstr.substring(0,tmpstr.lastIndexOf(":"));
	}
	var strlen = tmpstr.length;
	for(i=0;i<strlen;i++)
	{
		var tmpchar = tmpstr.charAt(i);
		if(tmpchar!=':' && (tmpchar<'0' || tmpchar>'9') && (tmpchar<'a' || tmpchar>'f') && (tmpchar<'A' || tmpchar>'F'))
		{
			return "Error";
		}
	}
	tmpstr = tmpstr + ":";
	while(tmpstr.indexOf(":")!=-1)
	{
		var substr = tmpstr.substring(0,tmpstr.indexOf(":"));
		var tmplen = tmpstr.length;
		if(tmplen != tmpstr.indexOf(":")+1)
		{
			tmpstr = tmpstr.substring(tmpstr.indexOf(":")+1,tmpstr.length);
		}
		else
		{
			tmpstr = "";
		}
		if(substr!="")
		{
			if(substr.length>4)
			{
				return "Error";
			}
		}
		marknum=marknum+1;
		if(marknum>8)
		{
			return "Error";
		}
	}
	if(marknum<3)
	{
		return "Error";
	}
	if(mark1==-1 && marknum<8)
	{
		return "Error";
	}
	return IPstr;
}

function IPFormatting(IPstr)
{
	if (IPstr==null)
	{
		return "Error";
	}
	if (IPstr=="")
	{
		return "Error";
	}
	IPstr=IPstr+".";
	var i=1;
	var j;
	var temp="";
	var ReturnIP="";
	while (IPstr.indexOf(".")!=-1)
	{
		if (i>4)
		{
			return "Error";
		}
		temp=IPstr.substring(0,IPstr.indexOf("."));
		while ((j=temp.indexOf(" "))!=-1)
		{
			temp=temp.substring(0,j)+temp.substring(j+1,temp.length);
		}
		if (temp.length>3)
		{
			return "Error";
		}
		j=0;
		while (temp.length>1)
		{
			if (temp.charAt(j)==0)
			{
				temp=temp.substring(1,temp.length);
			}
			else
			{
				break;
			}
		}
		if (!isNumber(temp,"int"))
		{
			return "Error";
		}
		if (parseInt(temp)>255 || parseInt(temp)<0 || (parseInt(temp)==0 && i==1))
		{
			return "Error";
		}
		ReturnIP = ReturnIP+parseInt(temp)+".";
		IPstr=IPstr.substring(IPstr.indexOf(".")+1,IPstr.length);
		i++;
	}
	if (i!=5)
	{
		return "Error";
	}
	return ReturnIP.substring(0,ReturnIP.length-1);
}

function isNumber(inputstr,mode)
{
	var str = " " + inputstr + " " ;
	var startindex, endindex ;
	var returnbool=true, tag = true ;
	var i ;
	var firstchar ;
	var negative = false, positive = false, unuse = false, zero = false ;
	startindex = str.indexOf(" ")
	endindex = str.lastIndexOf(" ")
	while(tag)
	{
		tag = false
  	 	firstchar = str.substring(startindex, startindex+1)
  	 	if(firstchar == " " && !zero)
		{
			startindex++
			tag = true
			unuse=true
  	 	}
		else if( firstchar == "0" )
		{
			startindex++
			tag = true
			zero = true
  	 	}
		else if(firstchar == "-")
		{
			if(negative || positive || zero)
			{
				returnbool = false
			}
			else
			{
  	 			startindex++
  	 			tag = true
  	 			negative=true
  	 		}
  	 	}
		else if(firstchar == "+")
		{
			if(negative || positive || zero)
			{
				returnbool = false
			}
			else
			{
  	 			startindex++
  	 			tag = true
  	 			positive=true
  	 		}
  	 	}
  	 	if(str.substring(endindex,endindex+1) <= " ")
		{
  	 		endindex--
  	 		tag=true
  	 	}
  	 	if (endindex <= startindex) tag = false
	}
    str = str.substring(startindex, endindex+1)
    if(returnbool)
	{
  		if (mode.toLowerCase() == "int")
		{
			if(str.indexOf(".")!=-1)
				returnbool=false;
  	 		else 
			{
				if (negative) 
					str = "-" + str
  				i = parseInt(str)
			}
		}
		else if(mode.toLowerCase() == "float")
		{	
			if (str.substring(0,1) == ".") 
				str = "0" + str
			if (negative) 
				str = "-" + str
			i = parseFloat(str)
		}
		else i = parseFloat(str)
		if (i == str)
		{
			returnbool = true
		}
		else returnbool = false
	}
	return returnbool
}

function split(str,sep)
{
	//alert("str"+str);
	if(sep==null||sep=="")
		sep=' ';	
	//alert("2");
	var result=new Array();

	var r=0;
	
	if(sep!=null)
	{			
		var start=0,count=0;

		//alert("3");

		while(start+count<str.length)
		{
			if(sep.indexOf(str.charAt(start+count))==-1)
			{
				//alert("count++:"+str.charAt(start+count));
				count++;
			}
			else
			{				
				if(count==0)
					start++;
				else
				{
					result[r++]=str.substring(start,start+count);
					//alert("str:"+str.substring(start,start+count));
					start+=count;
					count=0;
				}
			}			
		}

		//alert("4");
		if(count!=0)
		{
			result[r++]=str.substring(start,start+count);
		}			
	}
	return result;	
}

function getIpRange(strIpAddr,strBitNumber)
{
    var mask=getMaskIntValue(strBitNumber);
    var minip=ipStrToInt(strIpAddr)&mask;
    var maxip=minip|(mask^0xffffffff);
    return ipIntToStr(minip)+"-"+ipIntToStr(maxip);
}

function getMaskIntValue(bitNumber)
{
    var maskIntValue = 0x80000000;
    if ((bitNumber<=0) || (bitNumber>32)) return 0;
    maskIntValue >>= (bitNumber - 1);
    return maskIntValue ;
}
function ipStrToInt(ipString)
{
    var begin=0;
    var end=0,segValue=0,returnValue=0;
    for(var i=0;i<3;i++)
    {
        end = ipString.indexOf(".",begin);
        if (end==-1) return 0;
        segValue=parseInt(ipString.substring(begin,end));
        if ((segValue<0) || (segValue>255)) return 0;
        returnValue = (returnValue << 8) | segValue ;
        begin = end+1;
    }
    segValue=parseInt(ipString.substring(begin));
    if ((segValue<0) || (segValue>255)) return 0;
    returnValue = (returnValue << 8) | segValue ;
    return returnValue;
}
function ipIntToStr(intIpString)
{
    var retValue="";
    var intValue=0;
    intValue = (intIpString&0xff000000)>>>24
	retValue += intValue ;
    retValue += ".";
    intValue = (intIpString&0x00ff0000)>>>16;
	retValue += intValue ;
    retValue += ".";
    intValue = (intIpString&0x0000ff00)>>>8;
	retValue += intValue ;
    retValue += ".";
    intValue = (intIpString&0x000000ff);
	retValue += intValue ;
    return retValue;
}

//检查IP地址/段的地址是否正确
function checkInetnum(ipaddr)
{
	var result = "";
	var inetnumtmpObj = document.getElementById("inetnumtmp");
	var inetnumObj = document.getElementById("inetnum");
	if( ipaddr.indexOf("-") == -1 && ipaddr.indexOf("/") == -1 )
	{
		//判断单独地址是否正确
		result = checkpartip(ipaddr);
		if( result == "false" )
		{
			inetnumtmpObj.focus();
			return 'false';
		}
		else
		{
			inetnumObj.value = result;
			return result;
		}
	}
	else
	{
		if( ipaddr.indexOf("-") != -1 )
		{
			//地址段格式
			result = checkipaddr(ipaddr);
			if( result == "false" )
			{
				inetnumtmpObj.focus();
				return 'false';
			}
			else
			{
				inetnumObj.value = result;
				return result;
			}
		}
		if( ipaddr.indexOf("/") != -1 )
		{
			//地址段格式
			result = checkipmask(ipaddr);
			if( result == "false" )
			{
				inetnumtmpObj.focus();
				return 'false';
			}
			else
			{
				inetnumObj.value = result;
				return result;
			}
		}
	}
}

//检查地址/段，输入部分IP地址时，格式是否正确
function checkpartip(ipaddr)
{
	var result = split(ipaddr,".");
	
	var len = result.length;

	if( len < 4 )
	{
		//输入了部分IP地址
		var inetnum = "";
		var beginip = "";
		var endip = "";
		var i = 0;
		for( i = 0; i < len; i++ )
		{
			var partip =result[i].trim();
			if( !isNumber(partip,"int") )
			{
				alert(ipaddr+"地址错误，应填写数字!");   
				return "false";
			}
			//判断每一位的数字是否为0-255间的数字，且第一位数字不能为0
			if( parseInt(partip) > 255 || parseInt(partip) < 0 || (parseInt(partip) == 0 && i == 0) )
			{
				alert(ipaddr+"地址,应为0-255间的数字!");   
				return "false";
			}
			
			beginip += partip + ".";
			endip += partip + ".";
		}//end of for( i = 0; i < len; i++ )
		
		var surplus = 4 - parseInt(len);
		for( i = 0; i < surplus; i++ )
		{
			beginip += "0" + ".";
			endip += "255" + ".";
		}
		
		beginip = beginip.substring(0,beginip.length-1);
		endip = endip.substring(0,endip.length-1);
		
		inetnum = beginip + "-" + endip;
		
		return inetnum;
	}
	else
	{
		//判断地址格式是否合法
		if( IPFormatting(ipaddr) == "Error" )
		{
			alert(ipaddr+"地址格式非法，请重新填写!");   
			return "false";
		}
		
		return ipaddr + "-" + ipaddr;
	}
}

//查询地址段的地址格式是否正确
function checkipaddr(ipaddr)
{
	var loc = ipaddr.indexOf("-");
	var beginip = Trim(ipaddr.substring(0,loc));//起始地址
	var endip = Trim(ipaddr.substring(loc+1,ipaddr.length));//终止地址
	
	//判断地址格式是否合法
	if( IPFormatting(beginip) == "Error" )
	{
		alert(ipaddr+"地址段起始地址格式非法，请重新填写!");   
		return "false";
	}
	if( IPFormatting(endip) == "Error" )
	{
		alert(ipaddr+"地址段终止地址格式非法，请重新填写!");   
		return "false";
	}
	
	//将地址转换为标准格式
	var formatbeginip = formatIP(beginip);
	var formatendip = formatIP(endip);
	
	if( formatbeginip > formatendip )
	{
		alert(ipaddr+"地址段中的起始地址大于终止地址，请重新填写！");
		return "false";
	}
	
	var inetnum = beginip + "-" + endip;
	
	return inetnum;
}

//查询掩码格式的地址是否正确
function checkipmask(ipaddr)
{
	var loc = ipaddr.indexOf("/");
	var ip = Trim(ipaddr.substring(0,loc));
	var mask = Trim(ipaddr.substring(loc+1,ipaddr.length));//地址掩码，去掉前后多余空格
	
	//判断地址格式是否合法
	if( IPFormatting(ip) == "Error" )
	{
		alert(ipaddr+"地址中，IP地址格式非法，请重新填写!");   
		return "false";
	}
	if( !isNumber(mask,"int") )
	{
		alert(ipaddr+"地址中，掩码格式非法，请重新填写!");   
		return "false";
	}
	if( parseInt(mask) <= 0 || parseInt(mask) > 32 )
	{
		alert(ipaddr+"地址中，掩码位数超过32，请重新填写!");   
		return "false";
	}
	
	var inetnum = getIpRange(ip,parseInt(mask));

	return inetnum;
}

/*******************************************************************
 函数名：	formatIP(sIP)
 功能：		将10.0.0.2转换为010.000.000.002格式
 入口参数：	sIP:IP地址
 返回值：	标准格式IP地址
*******************************************************************/
//------------------------------------------------------------------
function formatIP(sIP) 
{
    //alert("begin formatIP");
    var result = "";
    
    var loc = sIP.indexOf(".");
    var ip1 = Trim(sIP.substring(0,loc));
    var loc1 = sIP.indexOf(".",loc+1);
    var ip2 = Trim(sIP.substring(loc+1,loc1));
    loc = loc1;
    loc1 = sIP.indexOf(".",loc+1);
    var ip3 = Trim(sIP.substring(loc+1,loc1));
    var ip4 = Trim(sIP.substring(loc1+1,sIP.length));
    
    //alert(sIP);
    //alert(ip1.length);
    //alert(ip2.length);
    //alert(ip3.length);
    //alert(ip4.length);
    
    if(ip1.length == 1) 
    {
        result += "00" + ip1;
    }
    else
    {
        if(ip1.length == 2) 
        {
            result += "0" + ip1;
        }
        else
        {
            if(ip1.length == 3) 
            {
                result += ip1;
            }
        }
    }
    result += ".";
    
    if(ip2.length == 1) 
    {
        result += "00" + ip2;
    }
    else
    {
        if(ip2.length == 2) 
        {
            result += "0" + ip2;
        }
        else
        {
            if(ip2.length == 3) 
            {
                result += ip2;
            }
        }
    }
    result += ".";
    
    if(ip3.length == 1) 
    {
        result += "00" + ip3;
    }
    else
    {
        if(ip3.length == 2) 
        {
            result += "0" + ip3;
        }
        else
        {
            if(ip3.length == 3) 
            {
                result += ip3;
            }
        }
    }
    result += ".";
    
    if(ip4.length == 1) 
    {
        result += "00" + ip4;
    }
    else
    {
        if(ip4.length == 2) 
        {
            result += "0" + ip4;
        }
        else
        {
            if(ip4.length == 3) 
            {
                result += ip4;
            }
        }
    }
    
    //alert(result);
    
    return result;
}

//全编码转成非全编码
function dealIpv4ToAll(ip){
    var ipArr = ip.split('.')
    var ipArrD = []
    ipArr.forEach(function(item,index){
        if( item == '0' || item == '00' || item == '000' || item == '0000'){
            ipArrD.push('0')
        }else{
            ipArrD.push(item.replace(/\b(0+)/gi,""))
        }
    })
    return ipArrD.join('.')
}
//非全编码转成全编码
function dealIpv4FromAll(ip){
    var ipArr = ip.split('.')
    var ipArrD = []
    ipArr.forEach(function(item,index){
        if( item.length == 1){
            ipArrD.push('00'+item)
        }else if( item.length == 2){
            ipArrD.push('0'+item)
        }else{
            ipArrD.push(item)
        }
    })
    return ipArrD.join('.')
}

function ipStrToInt(ipString)
{
    var begin=0;
    var end=0,segValue=0,returnValue=0;
    for(var i=0;i<3;i++)
    {
        end = ipString.indexOf(".",begin);
        if (end==-1) return 0;
        segValue=parseInt(ipString.substring(begin,end));
        if ((segValue<0) || (segValue>255)) return 0;
        returnValue = (returnValue << 8) | segValue ;
        begin = end+1;
    }
    segValue=parseInt(ipString.substring(begin));
    if ((segValue<0) || (segValue>255)) return 0;
    returnValue = (returnValue << 8) | segValue ;
    return returnValue;
}
function ipIntToStr(intIpString)
{
    var retValue="";
    var intValue=0;
    intValue = (intIpString&0xff000000)>>>24
	retValue += intValue ;
    retValue += ".";
    intValue = (intIpString&0x00ff0000)>>>16;
	retValue += intValue ;
    retValue += ".";
    intValue = (intIpString&0x0000ff00)>>>8;
	retValue += intValue ;
    retValue += ".";
    intValue = (intIpString&0x000000ff);
	retValue += intValue ;
    return retValue;
}

/*******************************************************************
 函数名：	formatIpMask(start,end)
 功能：		将起始地址终止地址转换成  地址—地址 或者 地址/掩码 或 单地址
 例如：  formatIpMask('127.0.0.0','127.0.0.0') => '127.0.0.0'
        formatIpMask('127.0.0.0','127.0.0.2') => '127.0.0.0-127.0.0.2'
        formatIpMask('127.0.0.0','127.0.0.255') => '127.0.0.0/24'
 入口参数：	start,end 地址段的起始地址和终止地址（全编码也可）
*******************************************************************/
function formatIpMask(start,end){
    try{
        var startint=ipStrToInt(start);
        var endint=ipStrToInt(end);
        if(startint==endint){
            return ipIntToStr(startint);
        }
        var mask=31;
        var out=false;
        for(;mask>=0;mask--)
        {    		
                if((startint&(1<<31-mask))!=0||(endint&(1<<31-mask))==0)
                {
                    out=true;
                    break;
                }
            }  
        if(mask<31)
          {
           if(mask!=0||out)
           {
              mask++;
           }
        if(mask==0||(startint&(-1<<(32-mask)))==(endint&(-1<<(32-mask))))
              return ipIntToStr(startint)+"/"+mask;    		
          }
        return ipIntToStr(startint)+"-"+ipIntToStr(endint);
    }catch(e){
        return "Error";
    }
}