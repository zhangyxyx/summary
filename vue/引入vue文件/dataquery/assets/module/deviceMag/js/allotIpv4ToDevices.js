$(function () {
    var urlObj = new UrlSearch();
    deviceName = urlObj.deviceName
    getNodeList();
    initBtnClickEvent();
    initClearBtnEvent();
    initLayuiObj();
    $("#loopAddress").val(urlObj.loopAddress)
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
var alloDevicesList = []
var deviceName = ''

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
                    $("#loopAddress").val('')
                    $("#cityName").text('')
                    $("#countyName").text('')
                    $("#devPropName").text('')
                    $("#devVendorName").text('')
                    $("#devModelName").text('')
                    $("#ifOnline").text('')
                    $("#remarks").val('')
                    getDeviceList(row.nodeCode)//根据关联节点获取设备名称
                }
            });
            $("#nodeList1").combotree({
                idField: 'nodeCode',
                textField: 'nodeName',
                data: nodeList,
                panelHeight: 'auto',//高度自适应
                width: 220,
                multiple: false,
                editable: false,//定义用户是否可以直接往文本域中输入文字
                onLoadSuccess: function () {
                    $("#nodeList1").combotree('tree').tree("collapseAll");
                },
                //直接过滤，数据太多时不行，太卡了，放弃
                filter: function (q, row) {
                    return row.text.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function (q, e) {
                        $('#nodeList1').combotree('tree').tree('doFilter', q)
                    }
                },
                onSelect: function (row) {//点击节点联动地址类型
                    getIpTypeList(row.nodeCode);
                }
            });
            //初始化显示权限节点
            $('#nodeList').combotree('setValue', nodeList[0].nodeCode);
            getIpTypeList('');
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
                width: 220,
                panelHeight: 'auto',//高度自适应
                multiple: false,
                editable: false,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    $("#ipTypeList").combotree('tree').tree("collapseAll");
                },
                filter: function (q, row) {
                    var opts = $(this).combobox('options');
                    return row[opts.textField].indexOf(q) == 0;
                    // return row.textField.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function (q, e) {
                        $('#ipTypeList').combotree('tree').tree('doFilter', q)
                    }
                },
                onBeforeSelect: function (row) { //节点被选中前触发，返回 false 则取消选择动作(但是返回false，下拉选项依旧会关闭)
                //    console.log(row)
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
                    $.messager.alert('提示', '请输入正确的活跃IP格式！', 'warning');
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
                        // console.log(1111)
                        $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                        return;
                    }
                }
            }
        }
        switch (btnType) {
            case "查询":
                queryAllocatedIpv4List();
                break;
            case "批量分配":
                bathAllocated();
                break;
            case "批量删除":
                bathDelIPDevices();
                break;
            case "分配设备地址":
                allotIpv4ToDevices();
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
            queryAllocatedIpv4List();
        }
    });
}

//查询设备
function getDeviceList(nodeCode) {
    let params = {
        nodeCode: nodeCode, 
        changeType:"0",
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString()
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/device/DeviceVindicate/queryDeviceList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success: function (obj) {
            if(obj.code == "0000"){
                // console.log(obj.data.datalist)
                $("#deviceName").combobox({
                    valueField:'deviceId',
                    textField:'deviceName',
                    data:obj.data.result,
                    width:220,
                    panelHeight: 'auto',//高度自适应
                    multiple: false,
                    editable:true,//定义用户是否可以直接往文本域中输入文字
                    //直接过滤，数据太多时不行，太卡了，放弃
                    onLoadSuccess: function () {
                        if(deviceName){
                            $('#deviceName').combobox('setValue', deviceName )
                        }
                    },
                    filter: function(q, row){
                        var opts = $('#deviceName').combobox('options');
                        return row[opts.textField].indexOf(q) != -1;
                    },
                    onSelect:function(row){//点击节点联动地址类型
                        // console.log(row)
                        $("#loopAddress").val(row.loopAddress?row.loopAddress:"")
                        $("#cityName").text(row.cityName?row.cityName:"")
                        $("#countyName").text(row.countyName?row.countyName:"")
                        $("#devPropName").text(row.devPropName?row.devPropName:"")
                        $("#devVendorName").text(row.devVendorName?row.devVendorName:"")
                        $("#devModelName").text(row.devModelName?row.devModelName:"")
                        if(row.ifOnline == '0'){
                            $("#ifOnline").text('是')
                        }else{
                            $("#ifOnline").text('否')
                        }
                        
                        $("#remarks").val(row.remarks?row.remarks:'')
                    }
                })
                // let tableData = obj.data.datalist;
                // queryAllPage.total = obj.data.total;
                // loadDetailTable(tableData);
                // initClickPageEvent();
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

//查询分配地址
function queryAllocatedIpv4List(){
    let beginip = ''
    let endip = ''
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
        NextNodeCode: $("#nodeList1").combotree('getValue'), 
        nextNodeScope:'all',
        IpClassType:$("#ipTypeList").combotree('getValue'),
        beginip:dealIpv4FromAll(beginip),
        endip:dealIpv4FromAll(endip),
        scope:'intersection',
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString()
    }
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
                // console.log(obj.data.datalist)
                let tableData = obj.data.result;
                queryAllPage.total = obj.data.totalResult;
                tableData.forEach(function(item,index){
                   item.inetnum = formatIpMask(item.inetnumStart,item.inetnumEnd)
                })
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

//加载地址表格数据
function loadDetailTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [[ 
        { field: 'ck', checkbox: true, width: '30' },  //复选框 
        { field: 'inetnum', title: 'IP地址', align: 'center', width: 140 },
        { field: 'NextNodeName', title: '所属节点', align: 'center', width: 140 },
        { field: 'IpTypeName', title: '地址类型', align: 'center', width: 100 },
        { field: 'inetnumsum', title: '地址数量', align: 'center', width: 100 },
        { field: 'operate', title: '操作', align: 'center', width: 160,
        formatter: function (value, row, index) {
            return "<a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=allAllocated(event,"+index+")>整段分配</a><a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=partAllocated(event,"+index+")>部分分配</a>";
        } }, 
    ]];
    var tableId = "ipDataList";
    var tableH = $(".tablePanel").height();
    var opt = {
        columnsData: columnsData,
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false,//分页
            checkOnSelect:false,
        }
    };
    relatedTable(tableId, opt);
}

//批量分配
function bathAllocated() {  
    var selRow = $('#ipDataList').datagrid('getChecked')
    if(selRow.length == 0){
        $.messager.alert('提示','未选择要批量分配的地址！','error');
    }else{
        selRow.forEach(function (item,index) { 
            allocated(item)
         })
         loadIPDevicesTable(alloDevicesList)
        // console.log(alloDevicesList)
    }
}
//整段分配
function allAllocated(event,rowIndex) {
    var row=$("#ipDataList").datagrid("selectRow",rowIndex).datagrid("getSelected");
    allocated(row)
}
//分配的字段添加到表格中
function allocated(row){
    let count1 = 0
    let count2 = 0
    alloDevicesList.forEach(function (item1,index){
        if(item1.Inetnum == row.inetnum){
            count1++
            $.messager.alert('提示','IPv4地址与地址列表已分配地址有重复!','warning');
            return;
        }
        //地址段交叉
        let no1= (ipToNumber(item1.inetnumStart)<=ipToNumber(row.inetnumStart)&&ipToNumber(row.inetnumStart)<=ipToNumber(item1.inetnumEnd))
        let no2 = (ipToNumber(item1.inetnumStart)<=ipToNumber(row.inetnumEnd)&&ipToNumber(row.inetnumEnd)<=ipToNumber(item1.inetnumEnd))
        let no3 = (ipToNumber(row.inetnumStart)<=ipToNumber(item1.inetnumStart)&&ipToNumber(item1.inetnumEnd)<=ipToNumber(row.inetnumEnd))
        if(no1 || no2 || no3){
            count2++
            $.messager.alert('提示','IPv4地址与地址列表已分配地址有交叉!','warning');
            return;
        }
    })
    if($("#deviceName").combobox('getValue') == ''){
        $.messager.alert('提示','设备名称不能为空!','warning');
    }else if(count1 == 0 && count2 == 0){
        alloDevicesList.push(
            {
                deviceName:$("#deviceName").combobox('getText'),
                deviceId:$("#deviceName").combobox('getValue'),
                loopAddress:$("#loopAddress").val(),
                nodeCode:row.NodeCode,
                nodeName:row.NodeName,
                nextNodeCode:row.NextNodeCode,
                nextNodeName:row.NextNodeName,
                IpTypeCode:row.IpTypeCode,
                IpTypeName:row.IpTypeName,
                Inetnum:row.inetnum,
                inetnumStart:row.inetnumStart,
                inetnumEnd:row.inetnumEnd,
                inetnumsum:row.inetnumsum,
                remarks:$("#remarks").val(),
                checked:'1'
            }
        )
        $(".layui-layer-close").click();
        loadIPDevicesTable(alloDevicesList)
    }
    
}
//部分分配
function partAllocated(event,rowIndex){
    var row=$("#ipDataList").datagrid("selectRow",rowIndex).datagrid("getSelected");
     //打开弹出层
     var layer = layui.layer;
     var layerTitle = '部分地址分配';
     layer.open({
         type: 1, 
         title:[layerTitle, 'text-align: center;'],
         area: ['80%', 'auto'],
         offset: '150px',
         content: initLayerContent(),
         cancel: function(index, layero){ 
            
         }
     });
     $("#partInetnum").text(row.inetnum)
     $("#partInetnumSum").text(row.inetnumsum)
     $("#partBeginIp").val(dealIpv4ToAll(row.inetnumStart))
     $("#partEndIp").val(dealIpv4ToAll(row.inetnumEnd))
     //初始化编辑按钮事件
    initSubmitEvent(row);
    initCloseEvent();
}
//部分回收弹出层内容
function initLayerContent(){
    //动态生成弹出层元素
    let content = '';
    content += ' <form class="layui-form" action="" style="padding:10px">';
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline layui-inline1">'
    content += '<label class="layui-form-label">IP地址</label>'
    content += '<span id="partInetnum" class="labelVal"></span>'
    content += '</div>'
    content += '<div class="layui-inline layui-inline1 ">'
    content += '<label class="layui-form-label">地址数量</label>'
    content += '<span id="partInetnumSum" class="labelVal"></span>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline">'
    content += '<label class="layui-form-label">分配地址</label>'
    content += '<p style="line-height:30px;color:red">注释：可修改起始地址、终止地址，修改后地址需在IP地址范围内</p>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline layui-inline1">'
    content += '<label class="layui-form-label">起始地址</label>'
    content += '<div class="layui-input-inline">'
    content += '<input type="text"  placeholder="请输入" class="layui-input" id="partBeginIp">'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-inline layui-inline1">'
    content += '<label class="layui-form-label">终止地址</label>'
    content += '<div class="layui-input-inline">'
    content += '<input type="text"  placeholder="请输入" class="layui-input" id="partEndIp">'
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
//关闭
function initCloseEvent(){
    $("#closeBtn").click(function(){
        $(".layui-layer-close").click();
    })
}
//确认
function initSubmitEvent(row){
    $("#submitBtn").click(function(){
        var partBeginIp = $("#partBeginIp").val();
        var partEndIp = $("#partEndIp").val();
        if(partBeginIp == ""){
            $.messager.alert('提示','起始地址不能为空!','error');
            return;
        }
        if(partEndIp == ""){
            $.messager.alert('提示','终止地址不能为空!','error');
            return;
        }
        if ("IPv4" != validIPAddress(partBeginIp)) {
            $.messager.alert('提示', '请输入正确的起始地址格式！', 'warning');
            return false;
        }
        if ("IPv4" != validIPAddress(partEndIp)) {
            $.messager.alert('提示', '请输入正确的终止地址格式！', 'warning');
            return false;
        }

        if(ipToNumber(row.inetnumStart) >ipToNumber(partBeginIp) || ipToNumber(row.inetnumEnd) <ipToNumber(partEndIp)){
            $.messager.alert('提示', '起始终止地址需在IP地址的范围内！', 'warning');
            return false;
        }
        if(ipToNumber(partEndIp) < ipToNumber(partBeginIp)){
            $.messager.alert('提示', '起始地址需要小于等于终止地址！', 'warning');
            return false;
        }
        
        let rowData = {...row}
        rowData.inetnumStart = dealIpv4FromAll(partBeginIp)
        rowData.inetnumEnd = dealIpv4FromAll(partEndIp)
        rowData.inetnum = formatIpMask(partBeginIp,partEndIp)
        rowData.inetnumSum = ipToNumber(partEndIp)-ipToNumber(partBeginIp)+1
        allocated(rowData)  
    })
}
//加载分配设备地址表格数据
function loadIPDevicesTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [[ 
        { field: 'ck', checkbox: true, width: '30' },  //复选框 
        { field: 'deviceName', title: '设备名称', align: 'center', width: 140 },
        { field: 'loopAddress', title: '设备IP', align: 'center', width: 140 },
        { field: 'nextNodeName', title: 'IP地址所在组织', align: 'center', width: 140 },
        { field: 'IpTypeName', title: '地址类型', align: 'center', width: 100 },
        { field: 'Inetnum', title: 'IP地址', align: 'center', width: 140 },
        { field: 'remarks', title: '备注', align: 'center', width: 140 },
        { field: 'operate', title: '操作', align: 'center', width: 60,
        formatter: function (value, row, index) {
            return "<a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=delIPDevicesItem(\'"+row.Inetnum+"\')>删除</a>";
        } }, 
        { field: 'allotResult', title: '分配结果', align: 'center', width: 140,
        formatter: function (value, row, index) {
            if(value){
                return "<div title='"+value+"' class='textEllipsis'>"+value+"</div>";
            }else{
                return '';
            }
        } },
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
            // singleSelect:false,
            checkOnSelect:false,
            onLoadSuccess:function(row){//当表格成功加载时执行      
                $(".datagrid-filter-row").hide();    
                var rowData = row.rows;
                $.each(rowData,function(idx,val){//遍历JSON
                      if(val.checked == '1'){
                        $("#dataList").datagrid("checkRow", idx);//如果数据行为已选中则选中该行
                      }else{
                        $(".tablePanel").find(".datagrid-header-check").children("input[type=\"checkbox\"]").attr("style", "display:none;");
                        $(".tablePanel").find(".datagrid-cell-check").children("input[type=\"checkbox\"]").eq(idx).attr("style", "display:none;");
                      }
                });        
            }
        }
    };
    relatedTable(tableId, opt);
}
//删除分配设备地址
function delIPDevicesItem(Inetnum) {
    alloDevicesList = alloDevicesList.filter(function(ele){
        return ele.Inetnum != Inetnum;
    });
    loadIPDevicesTable(alloDevicesList);
}
//批量删除分配设备地址
function bathDelIPDevices() {
    // console.log($('#dataList').datagrid('getChecked'))
    var selRow = $('#dataList').datagrid('getChecked')
    if(selRow.length == 0){
        $.messager.alert('提示','未选择要批量删除的数据！','error');
    }else{
        selRow.forEach(function (item,index) {
            alloDevicesList = alloDevicesList.filter(function(ele){
                return ele.Inetnum != item.Inetnum;
            });
        })
        loadIPDevicesTable(alloDevicesList);
    }
}

//分配设备地址
function allotIpv4ToDevices(){
    // console.log($('#dataList').datagrid('getChecked'))
    var selRow = $('#dataList').datagrid('getChecked')
    if(selRow.length == 0){
        $.messager.alert('提示','未选择要分配的设备地址！','error');
    }else{
        console.log(selRow)
        let params = []
        selRow.forEach(function(item,index){
            params.push({
                "deviceId":item.deviceId,
                "deviceName":item.deviceName,
                "loopAddress":item.loopAddress,
                "ipNodeCode":item.nextNodeCode,
                "ipNodeName":item.nextNodeName,
                "inetnum":item.Inetnum,
                "startIp":item.inetnumStart,
                "endIp":item.inetnumEnd,
                "inetnumSum":item.inetnumsum,
                "ipTypeCode":item.IpTypeCode,
                "ipTypeName":item.IpTypeName,
                "remarks":item.remarks,
                "operator":userName,
                "allotStatus":'1',
                "netUserId":userName
            })
        })
        $.ajax({
            url:encodeURI(bathPath+'/ipaddrmodule/ipv4/allotdeviceip/allotIpv4ToDevices'),
            type:'POST',
            data:JSON.stringify(params),
            dataType:'json',
            contentType: 'application/json',
            beforeSend: function () {
                $.messager.progress({
                    title: '提示',
                    msg: '正在分配地址，请等待...',
                    text: ''
                });
            },
            success:function(obj){
                if(obj.code == "0000"){
                    $.messager.progress('close');
                    // $.messager.alert('提示','分配成功！','success');
                    let resultData = obj.data.filter((item,index) =>{
                        return item.allotResult!=null
                    })
                    if(resultData.length){
                        var content =''
                        resultData.forEach(function(item,index){
                            content+='IP地址'+item.inetnum+':'+item.allotResult + '<br/>'
                        })
                       $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                    }else{
                        $.messager.alert('提示','分配成功！','success');
                    }
                    alloDevicesList.forEach((item,index) => {
                        obj.data.forEach((item1,index1) => {
                            if(item.Inetnum == item1.inetnum){
                                item.allotStatus = item1.allotStatus
                                if(item1.allotResult == null){
                                    item.allotResult = '成功'
                                }else{
                                    item.allotResult = item1.allotResult
                                }
                                item.checked = '0'
                            }
                        })
                    })
                    // console.log(alloDevicesList)
                    loadIPDevicesTable(alloDevicesList)   
                    $(".operateBtn").css('display','none')         
                }
                else{
                    $.messager.alert('提示','保存失败!'+obj.tip,'error');
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
