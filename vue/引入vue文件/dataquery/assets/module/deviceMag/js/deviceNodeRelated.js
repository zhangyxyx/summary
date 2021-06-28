$(function() {
    //url参数处理
    var urlObj = new UrlSearch();
    nodecode = urlObj.nodecode;
    nodename = urlObj.nodename;
    // LableId = urlObj.LableId;
    // LableName = urlObj.LableName
    // BitLength = urlObj.BitLength
    // console.log(nodecode)
    $("#nodeText").text(urlObj.nodename)
    // $("#labelLen").text(BitLength)
    // getNodeList();
    getSysPara();
    $('#countyCode').combobox({ 
        valueField:'AREACODE',
        textField:'AREANAME',
        width:220,
   });
    queryDevProp();
    queryDevVendor();
    deviceNodeRelatedList()
});
var nodecode = ''
var nodename = ''
var LableId = '';//标签标识
var LableName = '';
var BitLength = '';
var noClick = true
var _urlList = []
var curlPath = window.document.location.href;
var pathName = window.document.location.pathname;
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var tempName = "/ipaddrmodule"; //当前文件的跟目录
var bathPath = "";
if (projectName == tempName) {
    projectName = "";
} else {
    bathPath = curlPath.substring(0, pathName.indexOf('/')) + projectName;
}

// bathPath = "";//环境上需要注释掉
var userName = jQuery.ITE.getLoginName('loginName');//登录用户
// console.log(userName)
// var nodeCode = ''
var tableData = []
let queryAllPage = {//汇总查询
    pageSize: 20,
    pageNum: 1,
    total: 0,
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
            getDeviceList();
        }
    });
}

function getSysPara(){
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/SysCommon/getSysPara?ParaName=provinceAreacode'),
        type: 'get',
        cache: false,
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
            fatherareacode =  obj.data.PARAVALUE
            getIpBackArea('2',fatherareacode);
        }
    });
}

//设备所在市，县
function getIpBackArea(levelflag,fatherareacode) {
    let params = {
        areacode: '', 
        fatherareacode:fatherareacode,
        levelflag:levelflag,
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/IpBackAreaCode'),
        type: 'get',
        data:params,
        cache: false,
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
            if(levelflag == 2){ //市
                var optionsShi = obj.data
                $("#cityCode").combobox({
                    valueField:'AREACODE',
                    textField:'AREANAME',
                    data:optionsShi,
                    width:220,
                    //panelHeight: 'auto',//高度自适应
                    multiple: false,
                    editable:true,//定义用户是否可以直接往文本域中输入文字
                    //直接过滤，数据太多时不行，太卡了，放弃
                    onLoadSuccess: function (data) {
                    },
                    filter: function(q, row){
                        var opts = $(domId).combobox('options');
                        return row[opts.textField].indexOf(q) != -1;
                    },
                    onSelect:function(row){
                        getIpBackArea('3',row.AREACODE);
                    }
                });
            }else if(levelflag == 3){//县
                var optionsXian = obj.data
                $("#countyCode").combobox("setValue", '');
                $("#countyCode").combobox("loadData", optionsXian);
            }else{

            }
        }
    });
}

//设备属性
function queryDevProp(){
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/device/DeviceVindicate/queryDevProp'),
        type: 'post',
        cache: false,
        data: JSON.stringify({}),
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
                $("#devProCode").combobox({
                    valueField:'devPropCode',
                    textField:'devPropName',
                    data:obj.data,
                    width:220,
                    //panelHeight: 'auto',//高度自适应
                    multiple: false,
                    editable:true,//定义用户是否可以直接往文本域中输入文字
                    //直接过滤，数据太多时不行，太卡了，放弃
                    onLoadSuccess: function (data) {
                    },
                    filter: function(q, row){
                        var opts = $(domId).combobox('options');
                        return row[opts.textField].indexOf(q) != -1;
                    },
                    onSelect:function(row){
                    }
                });
        }
    });
}

//设备厂商
function queryDevVendor(){
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/device/DeviceVindicate/queryDevVendor'),
        type: 'post',
        cache: false,
        data: JSON.stringify({}),
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
                $("#devVendorCode").combobox({
                    valueField:'devVendorCode',
                    textField:'devVendorName',
                    data:obj.data,
                    width:220,
                    //panelHeight: 'auto',//高度自适应
                    multiple: false,
                    editable:true,//定义用户是否可以直接往文本域中输入文字
                    //直接过滤，数据太多时不行，太卡了，放弃
                    onLoadSuccess: function (data) {
                    },
                    filter: function(q, row){
                        var opts = $(domId).combobox('options');
                        return row[opts.textField].indexOf(q) != -1;
                    },
                    onSelect:function(row){
                    }
                });
        }
    });
}

//右侧IPv6标识编码与组织节点关联内容展示
function deviceNodeRelatedList(){   
    let loopAddress=$("#loopAddress").val()
    if (loopAddress != "") {
        if ("IPv4" != validIPAddress(loopAddress,true)) {
            $.messager.alert('提示', '请输入正确的设备IP格式！', 'warning');
            return false;
        }
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/device/DeviceVindicate/queryDeviceList'),
        type: 'post',
        cache: false,
        data: JSON.stringify(
            { 
            nodescope:"all",
            changeType:'0',
            deviceName: $("#deviceName").val(), 
            devscope:'indistinct',
            loopAddress: $("#loopAddress").val(), 
            loopscope:'indistinct',
            cityCode:$("#cityCode").combobox('getValue'),
            countyCode:$("#countyCode").combobox('getValue'),
            devPropCode:$("#devProCode").combobox('getValue'),
            devVendorCode:$("#devVendorCode").combobox('getValue'),
            pagesize: queryAllPage.pageSize.toString(),
            pageno: queryAllPage.pageNum.toString()
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function(obj) {
            // console.log(obj.data.datalist)
            tableData = obj.data.result
            queryAllPage.total = obj.data.totalResult;
            tableData.forEach(function(item,index){
                if(item.deviceNodeRelatedMapList.length){
                    item.deviceNodeRelatedMapList.forEach(function(item1,index1){
                        if(item1.nodeCode == nodecode){
                            item.relateFlag = true;
                        }
                    })
                }else{
                    item.relateFlag = false
                }
            })
            // console.log(tableData)
            loadLabelTable(tableData);
            initClickPageEvent();
        }
    });
}

//加载标识表格数据
function loadLabelTable(tableData){
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData=[[
        // { field: 'op1', title: '关联:', width: 30, align: 'center'},
        {
            field: 'op11', title:'<input id=\"relatedcheckbox\" type=\"checkbox\" style="margin: 3px 0 0 12px;float: left;" ><span>关联</span>', width: 60,align: 'center',
            formatter: function (value, row, rowIndex) {
                if(nodecode == 'NOD999' || row.relateFlag){
                    return ''
                }else{
                    return "<input type=\"checkbox\"  name=\"GL\" value=\"" + row.deviceId + "\"  style='margin-top:4px'>";
                }
            }
        },
        // { field: 'op2', title: '删除:', width: 30, align: 'center'},
        {
            field: 'op22', title: '<input id=\"deletecheckbox\" type=\"checkbox\"  style="margin: 3px 0 0 12px;float: left;"><span></span>删除</span>', width: 60,align: 'center',
            formatter: function (value, row, rowIndex) {
                if( nodecode != 'NOD999' && row.relateFlag){
                    return "<input type=\"checkbox\"  name=\"SC\"   value=\"" + row.deviceId + "\"  style='margin-top:4px' >";
                }else{
                    return ''
                }
            }
        },
        {field:'operate',title: '操作',align:'center',width:100,
        formatter:function(value,row,index){
            var html = '<div class="operateBtnBox">';
            if(nodecode != 'NOD999'){
                if(row.relateFlag){
                    html += "<div class='operateItem'><a style='color:#f40' class='operateBtn' onclick=delInfo(\'"+row.deviceId+"','"+row.deviceName+"\')>删除</a></div>"
                }else{
                    html += "<div class='operateItem'><a class='operateBtn' onclick=relatedInfo(\'"+row.deviceId+"','"+row.deviceName+"','"+row.loopAddress+"\')>关联</a></div>"
                }
            }
            html += '</div>';
            return html
        }},
        {field:'LableCodeName', title: '已关联节点',align:'center',width:80,
        formatter:function(value,row,index){
            let nodeNmae = []
                row.deviceNodeRelatedMapList.forEach(function(item,index){
                    nodeNmae.push(item.nodeName)
                })
             return nodeNmae.join(',')
        }},
        {field:'deviceName', title: '设备名称',align:'center',width:80,},
        {field:'loopAddress',  title: '设备IP',align:'center',width:80},
        {field:'cityName', title: '所在地市',align:'center',width:80},
        {field:'countyName', title: '所在区县',align:'center',width:80},
        {field:'devPropName', title: '设备属性',align:'center',width:80},
        {field:'devVendorName', title: '设备厂家',align:'center',width:80},
        {field:'devModelName',  title: '设备型号',align:'center',width:80},
        {field:'devMacAddress', title: '设备物理地址',align:'center',width:80},
        {field:'ifOnline', title: '是否下线',align:'center',width:80,
        formatter:function(value,row,index){
            if(row.ifOnline == '0'){
                return '是'
            }else{
                return '否'
            }
           } },
        {field:'remarks', title: '备注',align:'center',width:80}
    ]];
    var tableId="dataList";
    var tableH=$(".infoBox").height();
    var opt={
        columnsData:columnsData,
        data:tableData,
        tableH:tableH,
        NofilterRow:true,
        tableOpt:{
            fitColumns:true,
            pagination:false,//分页
            checkOnSelect: false, 
            selectOnCheck: false,
        },
    };
    relatedTable(tableId,opt);
    initCheckbox()
}


//初始化表格多选框
function initCheckbox(){
    $("#relatedcheckbox").unbind();
    $("#deletecheckbox").unbind();

    $("input[name='GL']").unbind().bind("click", function () {
        //总记录数
        var totolrows = $("input[name='GL']").length;
        //选中的记录数
        var checkrows = $("input[name='GL']:checked").length;
        //全选
        if (checkrows == totolrows) {
            $("#relatedcheckbox").prop("checked", true);
        }
        else {
            $("#relatedcheckbox").prop("checked", false);
        }
          
        
        $("#relatedlist").val("");
        var items = $("input[name='GL']:checked");
        var result = "";
        $.each(items, function (index, item) {
            if(result){
                result = result + "," + item.value;
            }else{
                result = result + item.value;
            }
            

        });
        $("#relatedlist").val(result);


    });
    $("input[name='SC']").unbind().bind("click", function () {

        //总记录数
        var totolrows = $("input[name='SC']").length;
        //选中的记录数
        var checkrows = $("input[name='SC']:checked").length;

        if (checkrows == totolrows) {
            $("#deletecheckbox").prop("checked", true);
        }
        else {
            $("#deletecheckbox").prop("checked", false);
        }

        $("#deletelist").val("");
        var items = $("input[name='SC']:checked");
        var result = "";
        $.each(items, function (index, item) {
            if(result){
                result = result + "," + item.value;
            }else{
                result = result + item.value;
            }
        });
        $("#deletelist").val(result);

    });

     //全选
     $("#relatedcheckbox").click(function () {
        if ($(this).prop("checked")) {
            $("input[name='GL']").prop("checked", true);
        } else {
            $("input[name='GL']").prop("checked", false);
        }
        $("#relatedlist").val("");
        var items = $("input[name='GL']:checked");
        var result = "";
        $.each(items, function (index, item) {
            if(result){
                result = result + "," + item.value;
            }else{
                result = result + item.value;
            }
        });
        $("#relatedlist").val(result);
    });
    $("#deletecheckbox").click(function () {
        if ($(this).prop('checked')) {
            $("input[name='SC']").prop("checked", true);
        } else {
            $("input[name='SC']").prop("checked",false);
        }

        $("#deletelist").val("");
        var items = $("input[name='SC']:checked");
        var result = "";
        $.each(items, function (index, item) {
            if(result){
                result = result + "," + item.value;
            }else{
                result = result + item.value;
            }
        });
        $("#deletelist").val(result);
    });
}

//批量删除选中行
function delInfoList(){
    console.log($("#deletelist").val().split(','))
    if($("#deletelist").val() == ''){
        $.messager.alert('提示','未选择要删除的设备！','error');
    }else{
        $.messager.confirm('删除', '是否确认删除当前的选中信息?', function(flag){
            if (flag){
                var relatedlistArr = [];
                var deletelist = $("#deletelist").val().split(',')
                //拆分十六进制编码
                for(var i = 0;i < deletelist.length;i++){
                    for(var j = 0;j < tableData.length;j++){
                        if(deletelist[i] == tableData[j].deviceId){
                            relatedlistArr.push({
                                deviceId:tableData[j].deviceId,
                                deviceName:tableData[j].deviceName,
                                nodeCode:nodecode,
                                nodeName:nodename
                            })
                        }
                    }
                }
                var params = relatedlistArr
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/device/devicenode/deleteDeviceNodeRelateMap'),
                    type:'POST',
                    data:JSON.stringify(params),
                    dataType:'json',
                    contentType: 'application/json',
                    beforeSend: function () {
                        $.messager.progress({
                            title: '提示',
                            msg: '正在删除中...',
                            text: ''
                        });
                    },
                    success:function(obj){
                        if(obj.code == "0000"){
                            $.messager.alert('提示','删除成功！','success');
                            deviceNodeRelatedList();//刷新数据
                        }else{
                            $.messager.alert('提示','删除失败!'+obj.tip,'error');
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
}

//删除一行
function delInfo(deviceId,deviceName){
    $.messager.confirm('删除', '是否确认删除当前行的信息?', function(flag){
        if (flag){

            var params = [{
                deviceId:deviceId,
                deviceName:deviceName,
                nodeCode:nodecode,
                nodeName:nodename
            }]
            console.log(params)
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/device/devicenode/deleteDeviceNodeRelateMap'),
                type:'POST',
                data:JSON.stringify(params),
                dataType:'json',
                contentType: 'application/json',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '正在删除中...',
                        text: ''
                    });
                },
                success:function(obj){
                    if(obj.code == "0000"){
                        $.messager.alert('提示','删除成功！','success');
                        deviceNodeRelatedList();//刷新数据
                    }else{
                        $.messager.alert('提示','删除失败!'+obj.tip,'error');
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

//批量关联选中行
function relatedInfoList(){
    console.log($("#relatedlist").val().split(','))
    if($("#relatedlist").val() == ''){
        $.messager.alert('提示','未选择要关联的设备！','error');
    }else{
        $.messager.confirm('关联', '是否确认关联当前的选中信息?', function(flag){
            if (flag){
                var relatedlistArr = [];
                var relatedlist = $("#relatedlist").val().split(',')
                //拆分十六进制编码
                for(var i = 0;i < relatedlist.length;i++){
                    for(var j = 0;j < tableData.length;j++){
                        if(relatedlist[i] == tableData[j].deviceId){
                            relatedlistArr.push({
                                deviceId:tableData[j].deviceId,
                                deviceName:tableData[j].deviceName,
                                loopAddress:tableData[j].loopAddress,
                                nodeCode:nodecode,
                                nodeName:nodename
                            })
                        }
                    }
                }
                var params = relatedlistArr
                // console.log(params)
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/device/devicenode/addDeviceNodeRelateMap'),
                    type:'POST',
                    data:JSON.stringify(params),
                    dataType:'json',
                    contentType: 'application/json',
                    beforeSend: function () {
                        $.messager.progress({
                            title: '提示',
                            msg: '正在关联中...',
                            text: ''
                        });
                    },
                    success:function(obj){
                        if(obj.code == "0000"){
                            $.messager.alert('提示','关联成功！','success');
                            deviceNodeRelatedList();//刷新数据
                        }else{
                            $.messager.alert('提示','关联失败!'+obj.tip,'error');
                            deviceNodeRelatedList();//刷新数据
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
}

//关联一行
function relatedInfo(deviceId,deviceName,loopAddress){
    $.messager.confirm('关联', '是否确认关联当前行的信息?', function(flag){
        if (flag){
            var params = [{
                deviceId:deviceId,
                deviceName:deviceName,
                nodeCode:nodecode,
                nodeName:nodename,
                loopAddress:loopAddress
            }]
            console.log(params)
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/device/devicenode/addDeviceNodeRelateMap'),
                type:'POST',
                data:JSON.stringify(params),
                dataType:'json',
                contentType: 'application/json',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '正在关联中...',
                        text: ''
                    });
                },
                success:function(obj){
                    if(obj.code == "0000"){
                        $.messager.alert('提示','关联成功！','success');
                        deviceNodeRelatedList();//刷新数据
                    }else{
                        $.messager.alert('提示','关联失败!'+obj.tip,'error');
                        deviceNodeRelatedList();//刷新数据
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

////JS获取url地址栏参数值
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
