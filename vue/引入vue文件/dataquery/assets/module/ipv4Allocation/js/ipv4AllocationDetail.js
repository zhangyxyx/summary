$(function () {
    var urlObj = new UrlSearch();
    InetnumID = urlObj.InetnumID
    showReport = urlObj.showReport
    if(urlObj.showReport == 'Y'){
        $("#reportDiv").show()
        $("#reportDiv1").show()
    }else if(urlObj.showReport == 'N'){
        $("#reportDiv").hide()
        $("#reportDiv1").hide()
    }
    queryAllocatedlist(InetnumID)
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
let InetnumArr = []
let InetnumID = ''
let showReport = ''
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


//获取空闲地址查询接口
function queryAllocatedlist(InetnumID){
    let params ={
        InetnumID:InetnumID,
        pagesize:'0',
        pageno: '0'
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
                let result = obj.data.result[0];
                $("#NodeCode").text(result.NodeName)
                $("#NextNodeCode").text(result.NextNodeName)
                $("#inetnum").text(formatIpMask(result.inetnumStart,result.inetnumEnd))
                $("#IpTypeName").text(result.IpTypeName?result.IpTypeName:'')
                $("#ReplyMan").text(result.ReplyManName)
                $("#AllotDate").text(result.AllotDate)
                $("#remarks").text(result.Remarks?result.Remarks:'')
                if(showReport == 'Y'){
                    $("#Reporttime").text(result.Reporttime?result.Reporttime:'')
                    $("#ReportInfo").text(result.ReportInfo?result.ReportInfo:'')
                    // $("#ReportFlag").text(result.ReportFlag)
                    var text = ''
                    if(result.ReportFlag == 'F'){
                        text =  '<img  src="assets/module/ipv4Allocation/img/ReportFlagF.png" valign="center" title = "集团上报状态:'+(result.Status=='Allocated'?'地址分配':'')+'上报失败&#10;集团上报时间:'+(result.Reporttime?result.Reporttime:'')+'&#10;同步信息:'+(result.ReportInfo?result.ReportInfo:'')+'">'; 
                    }else if(result.ReportFlag == 'S'){
                        text =  '<img src="assets/module/ipv4Allocation/img/ReportFlagS.png" valign="center" title = "集团上报状态:'+(result.Status=='Allocated'?'地址分配':'')+'上报成功&#10;集团上报时间:'+(result.Reporttime?result.Reporttime:'')+'&#10;同步信息:'+(result.ReportInfo?result.ReportInfo:'')+'">';
                    }else if(result.ReportFlag == 'D'){
                        text =  '<img src="assets/module/ipv4Allocation/img/ReportFlagD.png" valign="center" title = "集团上报状态:'+(result.Status=='Allocated'?'地址分配':'')+'处理中&#10;集团上报时间:'+(result.Reporttime?result.Reporttime:'')+'&#10;同步信息:'+(result.ReportInfo?result.ReportInfo:'')+'">';
                    }else if(result.ReportFlag == 'U'){
                        text =  '<img src="assets/module/ipv4Allocation/img/ReportFlagU.png" valign="center" title = "集团上报状态:'+(result.Status=='Allocated'?'地址分配':'')+'未上报&#10;集团上报时间:'+(result.Reporttime?result.Reporttime:'')+'&#10;同步信息:'+(result.ReportInfo?result.ReportInfo:'')+'">';
                    }else if(result.ReportFlag == 'N'){
                        text =  '<img src="assets/module/ipv4Allocation/img/ReportFlagN.png" valign="center" title = "集团上报状态:'+(result.Status=='Allocated'?'地址分配':'')+'不用上报&#10;集团上报时间:'+(result.Reporttime?result.Reporttime:'')+'&#10;同步信息:'+(result.ReportInfo?result.ReportInfo:'')+'">';
                    }else{
                        text =  '';
                    }
                    $("#ReportFlag").append(text)
                   
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