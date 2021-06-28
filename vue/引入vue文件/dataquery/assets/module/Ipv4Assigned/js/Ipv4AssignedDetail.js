$(function () {
   queryIpAssignedIpv4list(urlObj.InetnumID)
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
var urlObj = new UrlSearch();
var AssigendUP={};

function loadPanel(){//加载面板
    $('#base').panel({
          collapsible:true,   
          title: '基本信息'  
        }); 
    $("#Detailed").panel({
        collapsible:true,  
        collapsed:true, 
      title: '详细信息'  
    }); 
    $("#ipback").panel({
            collapsible:true,  
            collapsed:true, 
          title: '备案信息',
        }); 
              
}

//获取详细数据
function queryIpAssignedIpv4list(InetnumID){
    let params = {
        pagesize: '0',
        pageno: '0',
        InetnumID:InetnumID
    }
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
                if(obj.data.result.length==1){
                    AssigendUP=obj.data.result[0];
                    var url;
                    switch (AssigendUP.Status) {
                        case "UserAssigned":
                            url=bathPath +"/ipaddrmodule/views/jsp/Ipv4Assigned/UserAssignedDetail.jsp";
                            break;
                        default:
                            url=bathPath +"/ipaddrmodule/views/jsp/Ipv4Assigned/NteAssignedDetail.jsp";
                    }
                    if( AssigendUP.Sydwzjhm != null ){
                        let length = AssigendUP.Sydwzjhm.length;
                        let Sydwzjhm = ''
                        let fistStr = "";
                        let lastStr = "";
                        if( length > 3 ){
                            fistStr = AssigendUP.Sydwzjhm.substring(0,3);
                        }
                        if( length > 6 ){
                            lastStr = AssigendUP.Sydwzjhm.substring(length-3,length);
                        }
                        if( fistStr != null ){
                            Sydwzjhm += fistStr+"********";
                        }
                        if( lastStr != null){
                            Sydwzjhm += lastStr;
                        }
                        AssigendUP.Sydwzjhm = Sydwzjhm
                    }
                     $("#showIpStatus").load(url, {NodeName: $("#NodeName").val()}, function(){
                        loadPanel()
                        setValue()
                     })
                }
            //     let tableData = obj.data.result;
              
            //     tableData.forEach(function(item,index){
            //       item.inetnum = formatIpMask(item.inetnumStart,item.inetnumEnd)
            //    });
               
            //    console.log(tableData)
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

function setValue(){
    // console.log(AssigendUP)
    if(!$.isEmptyObject(AssigendUP)){
        let spanList=$(".layui-input-inline span")
        for (var i = 0; i < spanList.length; i++) {  
            
            $("#"+spanList[i].id).text(AssigendUP[spanList[i].id]?AssigendUP[spanList[i].id]:'')
            switch (spanList[i].id) {
                case "ReportFlag":
                    let reportFlagText=''
                    if(AssigendUP.ReportFlag == 'F'){
                        reportFlagText =  '<img  src="assets/module/ipv4Allocation/img/ReportFlagF.png" valign="center">'+AssigendUP.ReportFlagName; 
                    }else if(AssigendUP.ReportFlag == 'S'){
                        reportFlagText =  '<img  src="assets/module/ipv4Allocation/img/ReportFlagS.png" valign="center">'+AssigendUP.ReportFlagName;
                    }else if(AssigendUP.ReportFlag == 'D'){
                        reportFlagText =  '<img  src="assets/module/ipv4Allocation/img/ReportFlagD.png" valign="center">'+AssigendUP.ReportFlagName;
                    }else if(AssigendUP.ReportFlag == 'U'){
                        reportFlagText =  '<img  src="assets/module/ipv4Allocation/img/ReportFlagU.png" valign="center">'+AssigendUP.ReportFlagName;
                    }else if(AssigendUP.ReportFlag == 'N'){
                        reportFlagText =  '<img  src="assets/module/ipv4Allocation/img/ReportFlagN.png" valign="center">'+AssigendUP.ReportFlagName;
                    }else{
                        reportFlagText =   '';
                    }
                    $('#ReportFlag').text('')
                    $('#ReportFlag').append(reportFlagText)
                    break;
                case "IPBackSynFlag":
                    let IPBackSynFlagText=''
                    if(AssigendUP.IPBackSynFlag == '0'){
                        IPBackSynFlagText =  '<img  src="assets/module/ipv4Allocation/img/IPBackSynFlag0.png" valign="center">'+AssigendUP.IPBackSynFlagName;
                    }else if(AssigendUP.IPBackSynFlag == '1'){
                        IPBackSynFlagText =  '<img  src="assets/module/ipv4Allocation/img/IPBackSynFlag1.png" valign="center">'+AssigendUP.IPBackSynFlagName;
                    }else if(AssigendUP.IPBackSynFlag == '2'){
                        IPBackSynFlagText =  '<img  src="assets/module/ipv4Allocation/img/IPBackSynFlag2.png" valign="center">'+AssigendUP.IPBackSynFlagName;
                    }else if(AssigendUP.IPBackSynFlag == '3'){
                        IPBackSynFlagText =  '<img  src="assets/module/ipv4Allocation/img/IPBackSynFlag3.png" valign="center">'+AssigendUP.IPBackSynFlagName;
                    }else if(AssigendUP.IPBackSynFlag == '4'){
                        IPBackSynFlagText =  '<img  src="assets/module/ipv4Allocation/img/IPBackSynFlag4.png" valign="center">'+AssigendUP.IPBackSynFlagName;
                    }else{
                        IPBackSynFlagText =   '';
                    }
                    $('#IPBackSynFlag').text('')
                    $('#IPBackSynFlag').append(IPBackSynFlagText)
                    break;
                case "inetnum":
                    $("#inetnum").text(formatIpMask(AssigendUP.inetnumStart,AssigendUP.inetnumEnd))
                break;
                case "IsSelfUse":
                    $("#IsSelfUse").text(AssigendUP.IsSelfUse == '1' ? '是':'否')
                break;
                    default:
            } 
         } 
         if(AssigendUP.DeviceLoopback){
              //详细信息
        $('#Detailed').empty()
        let DeviceLoopbackArr = AssigendUP.DeviceLoopback.split('##')
        let content = '';
        DeviceLoopbackArr.forEach(function(item,index){
            if(index != 0){
                content += '<hr>';
            }         
        content += '<div class="devItem">'
        content += '<div class="layui-form-item">';
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">使用设备名称 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<span id="DeviceName' + index + '">'+(AssigendUP.DeviceName?(AssigendUP.DeviceName.split('##')[index]?AssigendUP.DeviceName.split('##')[index]:''):'')+'</span>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">注册地址的设备[输入loopback] :</label>'
        content += '<div class="layui-input-inline">'
        content += '<span id="DeviceLoopback' + index + '">'+(AssigendUP.DeviceLoopback?(AssigendUP.DeviceLoopback.split('##')[index]?AssigendUP.DeviceLoopback.split('##')[index]:''):'')+'</span>'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-form-item">';
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">端口名称 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<span id="PortName' + index + '">'+(AssigendUP.PortName?(AssigendUP.PortName.split('##')[index]?AssigendUP.PortName.split('##')[index]:''):'')+'</span>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">端口速率 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<span id="portSpeed' + index + '">'+(AssigendUP.portSpeed?(AssigendUP.portSpeed.split('##')[index]?AssigendUP.portSpeed.split('##')[index]:''):'')+'</span>'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-form-item">';
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">地址池名称 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<span id="ippoolname' + index + '">'+(AssigendUP.ippoolname?(AssigendUP.ippoolname.split('##')[index]?AssigendUP.ippoolname.split('##')[index]:''):'')+'</span>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">VPN实例 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<span id="vpnname' + index + '">'+(AssigendUP.vpnname?(AssigendUP.vpnname.split('##')[index]?AssigendUP.vpnname.split('##')[index]:''):'')+'</span>'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-form-item">';
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">使用描述 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<span id="UseDescr' + index + '">'+(AssigendUP.UseDescr?(AssigendUP.UseDescr.split('##')[index]?AssigendUP.UseDescr.split('##')[index]:''):'')+'</span>'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-form-item">';
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">CVLAN :</label>'
        content += '<div class="layui-input-inline">'
        content += '<span id="cvlan' + index + '">'+(AssigendUP.cvlan?(AssigendUP.cvlan.split('##')[index]?AssigendUP.cvlan.split('##')[index]:''):'')+'</span>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">SVLAN :</label>'
        content += '<div class="layui-input-inline">'
        content += '<span id="svlan' + index + '">'+(AssigendUP.svlan?(AssigendUP.svlan.split('##')[index]?AssigendUP.svlan.split('##')[index]:''):'')+'</span>'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        })
        // console.log(content)
        $("#Detailed").append(content)
         } 
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
