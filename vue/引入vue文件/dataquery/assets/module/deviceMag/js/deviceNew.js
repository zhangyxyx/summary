$(function () {
    var urlObj = new UrlSearch();
    type = urlObj.type
    deviceId = urlObj.deviceId
    deviceName = urlObj.deviceName
    getSysPara()
    $('#countyCode').combobox({ 
        valueField:'AREACODE',
        textField:'AREANAME',
        width:220,
        filter: function(q, row){
            var opts = $("#countyCode").combobox('options');
            return row[opts.textField].indexOf(q) != -1;
        },
   });
    queryDevProp();
    queryDevVendor();
    queryDevModel();
    initBtnClickEvent();
    initLayuiObj();
    if(type == 'mod'){
        queryDeviceList(deviceId,deviceName)
        $("#deviceName").attr("disabled","disabled")
    }
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
let deviceId = ''
let type = ''

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
        async:false,
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
        async:false,
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
                        var opts = $("#cityCode").combobox('options');
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
        async:false,
        contentType: "application/json",
        success: function (obj) {
                $("#devPropCode").combobox({
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
                        var opts = $("#devPropCode").combobox('options');
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
        async:false,
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
                        var opts = $("#devVendorCode").combobox('options');
                        return row[opts.textField].indexOf(q) != -1;
                    },
                    onSelect:function(row){
                    }
                });
        }
    });
}

//设备型号
function queryDevModel(){
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/device/DeviceVindicate/queryDevModel'),
        type: 'post',
        cache: false,
        async:false,
        data: JSON.stringify({}),
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
                $("#devModelCode").combobox({
                    valueField:'devModelCode',
                    textField:'devModelName',
                    data:obj.data,
                    width:220,
                    //panelHeight: 'auto',//高度自适应
                    multiple: false,
                    editable:true,//定义用户是否可以直接往文本域中输入文字
                    //直接过滤，数据太多时不行，太卡了，放弃
                    onLoadSuccess: function (data) {
                    },
                    filter: function(q, row){
                        var opts = $("#devModelCode").combobox('options');
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
        let Inetnum = $("#loopAddress").val();
        //获取当前点击的按钮
        let btnType = $(this).val();
        if(btnType == '确定'){
            if($("#deviceName").val() == ''){
                $.messager.alert('提示', '设备名称不能为空！', 'warning');
                return false;
            }else if (Inetnum == "") {
                $.messager.alert('提示', '设备IP不能为空！', 'warning');
                return false;
            }else if ("IPv4" != validIPAddress(Inetnum)) {
                $.messager.alert('提示', '请输入正确的设备IP格式！', 'warning');
                return false;
            }
            
        }
        switch (btnType) {
            case "确定":
                confirmAdd();
                break;
            case "重置":
                reset();
                break;
            case "关闭":
                window.top.$vm.$closeTab()
                break;
        }
    });
}

//修改时查询数据
function queryDeviceList(deviceId,deviceName){
    let params = {
        nodescope:"all",
        nodeCode:"NOD999",
        deviceId:deviceId,
        deviceName: deviceName, 
        devscope:'indistinct',
        changeType:'0',
        pagesize: '0',
        pageno:'0'
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
                let deviceData = obj.data.result[0]
                $("#deviceName").val(deviceData.deviceName)
                $("#loopAddress").val(deviceData.loopAddress)
                $("#devMacAddress").val(deviceData.devMacAddress)
                $("input[type='radio'][name='ifOnline']").prop('checked',false);//赋默认值
                $("input[type='radio'][name='ifOnline'][value='"+deviceData.ifOnline+"']").prop("checked","true")
                layui.use('form',function(){
                    var form=layui.form;
                    form.render();
                })
                $("#remarks").val(deviceData.remarks)
                $('#cityCode').combobox('setValue', deviceData.cityCode)
                getIpBackArea('3',deviceData.cityCode);
                $('#countyCode').combobox('setValue', deviceData.countyCode)
                $('#devPropCode').combobox('setValue', deviceData.devPropCode)
                $('#devVendorCode').combobox('setValue', deviceData.devVendorCode)
                $('#devModelCode').combobox('setValue', deviceData.devModelCode)
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

// 确定增加
function confirmAdd(){
    if(type == 'mod'){ //修改
        let devicelist = [
            {
                deviceId:deviceId,
                deviceName:$("#deviceName").val(),
                changeType:'0',
                loopAddress:$("#loopAddress").val(),
                cityCode:$("#cityCode").combobox('getValue'),
                countyCode:$("#countyCode").combobox('getValue'),
                devPropCode:$("#devPropCode").combobox('getValue'),
                devVendorCode:$("#devVendorCode").combobox('getValue'),
                devModelCode:$("#devModelCode").combobox('getValue'),
                devMacAddress:$("#devMacAddress").val(),
                ifOnline:$("input[name='ifOnline']:checked").val(),
                operator:userName,
                remarks:$("#remarks").val()
            }
        ]
        let params = devicelist
        $.ajax({
            url: encodeURI(bathPath + '/ipaddrmodule/device/DeviceVindicate/updateDevices'),
            type:'POST',
            data:JSON.stringify(params),
            dataType:'json',
            contentType: 'application/json;chartset=UTF-8',
            beforeSend: function () {
    
            },
            success: function (obj) {
                if(obj.code == "0000"){
                    let tipArr = [];
                    obj.data.forEach(function(item,index){
                       if(item.result != null){
                        tipArr.push(item)
                       }
                    })
                    if(tipArr.length){
                        var content =''
                        tipArr.forEach(function(item,index){
                            content+=item.result+ '<br/>'
                        })
                       $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                    }else{
                        $.messager.alert('提示','修改成功！','success');
                        const ifrs = window.top.$vm.$('iframe')
                        for (const item of ifrs) {
                          if (item.src.indexOf('/ipmanage/ipaddrmodule/views/jsp/deviceMag/deviceMag.jsp') != -1) {
                            // item.contentWindow.getDeviceList()
                            item.contentWindow.location.reload(true)
                            setTimeout(function () {
                                window.top.$vm.$closeTab()
                            }, 1000);
                          }
                        }
                        
                    }
                   
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
    }else{ // 新增
        let devicelist = [
            {
                deviceName:$("#deviceName").val(),
                changeType:'0',
                loopAddress:$("#loopAddress").val(),
                cityCode:$("#cityCode").combobox('getValue'),
                countyCode:$("#countyCode").combobox('getValue'),
                devPropCode:$("#devPropCode").combobox('getValue'),
                devVendorCode:$("#devVendorCode").combobox('getValue'),
                devModelCode:$("#devModelCode").combobox('getValue'),
                devMacAddress:$("#devMacAddress").val(),
                ifOnline:$("input[name='ifOnline']:checked").val(),
                operator:userName,
                remarks:$("#remarks").val()
            }
        ]
        let params = devicelist
        $.ajax({
            url: encodeURI(bathPath + '/ipaddrmodule/device/DeviceVindicate/addDevices'),
            type:'POST',
            data:JSON.stringify(params),
            dataType:'json',
            contentType: 'application/json;chartset=UTF-8',
            beforeSend: function () {
    
            },
            success: function (obj) {
                if(obj.code == "0000"){
                    let tipArr = [];
                    obj.data.forEach(function(item,index){
                       if(item.result != null){
                        tipArr.push(item)
                       }
                    })
                    if(tipArr.length){
                        var content =''
                        tipArr.forEach(function(item,index){
                            content+=item.result+ '<br/>'
                        })
                       $.messager.alert('提示',content,'error').window({ width: 600,left:300,top:200 });
                    }else{
                        $.messager.alert('提示','新增成功！','success');
                        const ifrs = window.top.$vm.$('iframe')
                        for (const item of ifrs) {
                          if (item.src.indexOf('/ipmanage/ipaddrmodule/views/jsp/deviceMag/deviceMag.jsp') != -1) {
                            // item.contentWindow.getDeviceList()
                            item.contentWindow.location.reload(true)
                            setTimeout(function () {
                                window.top.$vm.$closeTab()
                            }, 1000);
                          }
                        }
                        
                    }
                    
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
}

//重置
function reset(){
    $("#deviceName").val('')
    $("#loopAddress").val('')
    $("#devMacAddress").val('')
    $("input[name='ifOnline']:checked").val('0')
    $("#remarks").val('')
    $('#cityCode').combobox('setValue', '')
    $('#countyCode').combobox('setValue', '')
    $('#devPropCode').combobox('setValue','')
    $('#devVendorCode').combobox('setValue', '')
    $('#devModelCode').combobox('setValue', '')
}


//校验输入的IP地址是合法的ipv4或ipv6
function validIPAddress(IP) {
    //按"."进行分割
    var parts = IP.split(".");
    //IPv4由4个部分组成
    if (parts.length == 4) {
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