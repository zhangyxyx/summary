$(function () {
    var urlObj = new UrlSearch();
    deviceId = urlObj.deviceId
    deviceName = urlObj.deviceName
    queryDeviceList(deviceId,deviceName)
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
let deviceId = ''

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


//初始化按钮点击事件
function initBtnClickEvent() {
    $(".btnItem").click(function () {
        let btnType = $(this).val();
        switch (btnType) {
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
        changeType:"0",
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
                $("#deviceName").text(deviceData.deviceName?deviceData.deviceName:"")
                $("#loopAddress").text(deviceData.loopAddress?deviceData.loopAddress:"")
                $("#devMacAddress").text(deviceData.devMacAddress?deviceData.devMacAddress:"")
                $("#ifOnline").text(deviceData.ifOnline=='1'?'否':'是');
                $("#operator").text(deviceData.operator?deviceData.operator:"");
                $("#remarks").text(deviceData.remarks?deviceData.remarks:"")
                $('#cityCode').text(deviceData.cityName?deviceData.cityName:"")
                $('#countyCode').text(deviceData.countyName?deviceData.countyName:"")
                $('#devPropCode').text(deviceData.devPropName?deviceData.devPropName:"")
                $('#devVendorCode').text(deviceData.devVendorName?deviceData.devVendorName:"")
                $('#devModelCode').text(deviceData.devModelName?deviceData.devModelName:"")

                $('#firstEntryTime').text(deviceData.firstEntryTime)
                $('#lastChangedTime').text(deviceData.lastChangedTime)
                let nodeNmae = []
                deviceData.deviceNodeRelatedMapList.forEach(function(item,index){
                    nodeNmae.push(item.nodeName)
                })
                $('#relateNodeNames').text(nodeNmae.join(','))
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