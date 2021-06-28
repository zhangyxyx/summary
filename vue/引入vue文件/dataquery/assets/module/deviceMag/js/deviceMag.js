$(function () {
    getSysPara();
    $('#countyCode').combobox({ 
        valueField:'AREACODE',
        textField:'AREANAME',
        width:220,
        filter: function(q, row){
            var opts = $('#countyCode').combobox('options');
            return row[opts.textField].indexOf(q) != -1;
        },
   });
    // getIpBackArea('3','');
    queryDevProp();
    queryDevVendor();
    initBtnClickEvent();
    initLayuiObj();
    //页面初始化的时候默认触发汇总查询事件
    $("#queryAll").click();
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
                        var opts = $('#cityCode').combobox('options');
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
                        var opts = $('#devProCode').combobox('options');
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
                        var opts = $('#devVendorCode').combobox('options');
                        return row[opts.textField].indexOf(q) != -1;
                    },
                    onSelect:function(row){
                    }
                });
        }
    });
}


//初始化按钮点击事件
function initBtnClickEvent() {
    $(".btnItem").click(function () {
        //ip地址段不为空时校验
        let loopAddress = $("#loopAddress").val();
        //获取当前点击的按钮
        let btnType = $(this).val();
        if(btnType == '查询'){
            if (loopAddress != "") {
                if ("IPv4" != validIPAddress(loopAddress,true)) {
                    $.messager.alert('提示', '请输入正确的设备IP格式！', 'warning');
                    return false;
                }
            }
        }
        switch (btnType) {
            case "查询":
                getDeviceList();
                break;
            case "导入":
                importDevice();
                break;
            case "新增":
                addDevices();
                break;
            case "批量删除":
              deleteDevices();
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
            getDeviceList();
        }
    });
}


//查询
function getDeviceList() {
    let params = {
        nodescope:"all",
        nodeCode:"NOD999",
        deviceName: $("#deviceName").val(), 
        devscope:'indistinct',
        changeType:'0',
        loopAddress: $("#loopAddress").val(), 
        loopscope:'indistinct',
        cityCode:$("#cityCode").combobox('getValue'),
        countyCode:$("#countyCode").combobox('getValue'),
        devPropCode:$("#devProCode").combobox('getValue'),
        devVendorCode:$("#devVendorCode").combobox('getValue'),
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
        { field: 'ck', checkbox: true, width: '30' },  //复选框 
        { field: 'deviceName', title: '设备名称', align: 'center', width: 140,
        formatter:function(value,row,index){
            return "<a class='operateBtn' onclick=goDetail(\'"+row.deviceId+"\',\'"+row.deviceName+"\')>"+row.deviceName+"</a>"
           } },
        { field: 'loopAddress', title: '设备IP', align: 'center', width: 140 },
        { field: 'cityName', title: '所在地市', align: 'center', width: 140 },
        { field: 'countyName', title: '所在区县', align: 'center', width: 140 },
        { field: 'devPropName', title: '设备属性', align: 'center', width: 100 },
        { field: 'devVendorName', title: '设备厂家', align: 'center', width: 100 },
        { field: 'devModelName', title: '设备型号', align: 'center', width: 140 },
        { field: 'devMacAddress', title: '设备物理地址', align: 'center', width: 140 },
        { field: 'ifOnline', title: '是否下线', align: 'center', width: 140 ,
        formatter:function(value,row,index){
            if(row.ifOnline == '0'){
                return "是"
            }else{
                return "否"
            }
            
           } },
        { field: 'remarks', title: '备注', align: 'center', width: 180 },
        { field: 'operate', title: '操作', align: 'center', width: 140,
        formatter:function(value,row,index){
            return "<a class='operateBtn' style='margin-right:4px' onclick=updateDevices(\'"+row.deviceId+"\',\'"+row.deviceName+"\')>修改</a><a class='operateBtn' onclick=deleteDevices(event,"+index+")>删除</a>"
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
            }
            
        },
        
    };
    relatedTable(tableId, opt);
}

//新增
function addDevices(){
    window.top.$vm.$openTab({
        name: '设备新增',
        path: bathPath + '/ipaddrmodule/views/jsp/deviceMag/deviceNew.jsp'
    })
    // var path_open = '/ipaddrmodule/views/jsp/deviceMag/deviceNew.html';
    // window.open(path_open);
}

//修改
function updateDevices(deviceId,deviceName){
    window.top.$vm.$openTab({
        name: '设备修改',
        path: bathPath + '/ipaddrmodule/views/jsp/deviceMag/deviceNew.jsp?type=mod&deviceId='+deviceId+'&deviceName='+deviceName
    })
    // var path_open = '/ipaddrmodule/views/jsp/deviceMag/deviceNew.html?type=mod&deviceId='+deviceId+'&deviceName='+deviceName;
    // window.open(path_open);
}

//跳转到详情
function goDetail(deviceId,deviceName){
    window.top.$vm.$openTab({
        name: '设备详情',
        path: bathPath + '/ipaddrmodule/views/jsp/deviceMag/deviceDetail.jsp?deviceId='+deviceId+'&deviceName='+deviceName
    })
}

//删除
function deleteDevices(event,rowIndex){
    var selRow = [];
    let deleteList = []
    let info = ''
    if(rowIndex != undefined){
        selRow.push($("#dataList").datagrid("selectRow",rowIndex).datagrid("getSelected"));
        info = '是否确认删除当前的设备?'
    }else{
        selRow = $('#dataList').datagrid('getSelections')
        info = '是否确认删除当前的选中信息?'
    }
    selRow.forEach(function(item,index){
        deleteList.push({
            "deviceId": item.deviceId,
            "deviceName":  item.deviceName,
            "changeType":  item.changeType,
            "loopAddress":  item.loopAddress,
            "cityCode":  item.cityCode,
            "countyCode":  item.countyCode,
            "devPropCode":  item.devPropCode,
            "devVendorCode":  item.devVendorCode,
            "devModelCode":  item.devModelCode,
            "devMacAddress":  item.devMacAddress,
            "ifOnline":  item.ifOnline,
            "operator":  userName,
            "remarks":  item.remarks
        })
    })
    if(deleteList.length == 0){
        $.messager.alert('提示','未选择要删除的地址！','error');
    }else{
        $.messager.confirm('删除', info, function(flag){
            if (flag){
                // console.log(deleteList)
                var params = deleteList
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/device/DeviceVindicate/deleteDevices'),
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
                            let resultData = obj.data.filter((item,index) =>{
                                return item.result!=null
                            })
                            if(resultData.length){
                                var content =''
                                resultData.forEach(function(item,index){
                                    content+=item.deviceName+':'+item.result + '<br/>'
                                })
                               $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                            }else{
                                $.messager.alert('提示','删除成功！','success');
                            }
                            getDeviceList();//刷新数据
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
                url:encodeURI(bathPath+'/ipaddrmodule/device/DeviceVindicate/batchImportDevices'),
                type:'post',            
                datatype:'json',
                data:{'LoginName':userName},
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
                        if(obj.data.filedir){
                            // $.messager.alert('提示',"导入失败！",'error');
                            window.open(bathPath+"/nms/Common/Inc/download.jsp?filename="+obj.data.filedir+"&viewfilename="+obj.data.filename)
                        }
                        $.messager.alert('提示',"导入成功！",'success');
                        getDeviceList();//刷新数据
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
            window.open(bathPath+"/ipaddrmodule/itep/var/config/ipaddr/Device/deviceTemp.xls");
        }else if($(this).val() == "关闭"){
            $(".layui-layer-close").click();
        }
    });
}