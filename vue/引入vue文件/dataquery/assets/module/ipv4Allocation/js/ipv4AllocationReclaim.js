$(function () {
    var urlObj = new UrlSearch();
    InetnumID = urlObj.InetnumID
    $("#NodeCode").text(urlObj.NodeName)
    $("#NextNodeCode").text(urlObj.NextNodeName)
    $("#inetnum").text(urlObj.reclaimip)
    initBtnClickEvent();
    initLayuiObj();
    queryUnusedip(urlObj.NodeCode,urlObj.NextNodeCode,urlObj.reclaimip,urlObj.IpTypeCode)
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
        //ip地址段不为空时校验
        let Inetnum = $("#reclaimInetnum").val();
        //获取当前点击的按钮
        let btnType = $(this).val();
        if (btnType == "确定") {
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
                        $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                        return false;
                    }
                    if ("IPv4" != validIPAddress(IPAddrArr[0]) || "IPv4" != validIPAddress(IPAddrArr[1])) {
                        $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
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
            }else{
                $.messager.alert('提示', '回收地址不能为空！', 'warning');
            }
        }
        switch (btnType) {
            case "确定":
                confirmReclaim();
                break;
            case "关闭":
                window.top.$vm.$closeTab()
        }
    });
}

//获取空闲地址查询接口
function queryUnusedip(NodeCode,NextNodeCode,reclaimip,IpTypeCode){
    var beginip = ''
    var endip = ''
    var inetnum = checkInetnum(reclaimip)
        beginip =  inetnum.split('-')[0]
        endip =  inetnum.split('-')[1]
    let params ={
        nodecode:NextNodeCode,
        inetnumstart:dealIpv4FromAll(beginip),
        inetnumend:dealIpv4FromAll(endip),
        scope:'intersection',
        ipclasstype:IpTypeCode == 'null'?'':IpTypeCode
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv4/Ipv4Unusedip/queryUnusedip'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success: function (obj) {
            if(obj.code == "0000"){
                obj.data.forEach(function(item,index){
                    let beginInetnum = item.inetnumstart
                    let endInetnum = item.inetnumend
                    if(ipToNumber(beginip) == ipToNumber(item.inetnumstart) && ipToNumber(item.inetnumend) == ipToNumber(endip)){
                        InetnumArr.push(reclaimip)
                    }else{
                        if(ipToNumber(beginip)>ipToNumber(item.inetnumstart)){
                         beginInetnum = beginip
                        } 
                        if(ipToNumber(item.inetnumend) > ipToNumber(endip)){
                            endInetnum = endip
                        }
                        if(beginInetnum == endInetnum){
                            InetnumArr.push(dealIpv4ToAll(beginInetnum))
                        }else{
                            InetnumArr.push((dealIpv4ToAll(beginInetnum)+'-'+dealIpv4ToAll(endInetnum)))
                        } 
                    }
                })
                
                //   console.log(InetnumArr)
                  initUnusedInetnum(InetnumArr)
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

//展示空闲地质
function initUnusedInetnum(InetnumArr){
    // console.log(InetnumArr)
    var text = ''
    text += '<form action="" method="get"> '
    InetnumArr.forEach((item,index) => {
        text += '<div class="item" style="width:20%;float:left;height:30px;padding-left:20px;line-height:30px;"><label class= "inetnum" onclick="chooseInetnum(\'' + item + '\')"><input name="inetnum" type="radio" style="margin-right: 10px;" value="'+item+'" />'+item+'</label> </div>'
    });
    text += '</form> '
    $('.inetnumDiv').append(text)
}
//选中空闲地址回填
function chooseInetnum(inetnum){
    $("#reclaimInetnum").val(inetnum)
}
//确认
function confirmReclaim(){
    let reclaimInetnum =  $("#reclaimInetnum").val()
    let count = 0
    InetnumArr.forEach(function(item,index){
        let reclaimInetnumStart = checkInetnum(reclaimInetnum).split('-')[0]
        let reclaimInetnumEnd = checkInetnum(reclaimInetnum).split('-')[1]
        let itemStart = checkInetnum(item).split('-')[0]
        let itemEnd = checkInetnum(item).split('-')[1]
        if(ipToNumber(reclaimInetnumStart)>=ipToNumber(itemStart) && ipToNumber(reclaimInetnumEnd) <= ipToNumber(itemEnd)){
            count++;
            return;
        }
    })
    if(count == 0){
        $.messager.alert('提示', '回收地址必须在空闲地址内！', 'warning');
    }else{
        var inetnum = checkInetnum(reclaimInetnum)
        beginip =  inetnum.split('-')[0]
        endip =  inetnum.split('-')[1]
        var params = {
            InetnumID:InetnumID,
            inetnumStart:dealIpv4FromAll(beginip),
            inetnumEnd:dealIpv4FromAll(endip),
        }
        $.ajax({
            url:encodeURI(bathPath+'/ipaddrmodule/IpAllocateCondition/reclaimAllocateIp'),
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
                    $.messager.alert('提示','回收成功！','success');
                    const ifrs = window.top.$vm.$('iframe')
                    for (const item of ifrs) {
                      if (item.src.indexOf('/ipmanage/ipaddrmodule/views/jsp/ipv4Allocation/ipv4Allocation.jsp') != -1) {
                        item.contentWindow.queryAllocatedlist()
                        // item.contentWindow.location.reload(true)
                      }
                    }
                    window.top.$vm.$closeTab()
                    // queryAllocatedlist();//刷新数据
                }else{
                    $.messager.alert('提示','回收失败!'+obj.tip,'error');
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

//ip地址转数字
 function ipToNumber(ip) { 
      var num = 0; 
      if(ip == "") { 
        return num; 
      }   
      var aNum = ip.split(".");  
      if(aNum.length != 4) { 
        return num; 
      }   
      num += parseInt(aNum[0]) << 24; 
      num += parseInt(aNum[1]) << 16; 
      num += parseInt(aNum[2]) << 8; 
      num += parseInt(aNum[3]) << 0; 
      num = num >>> 0;//这个很关键，不然可能会出现负数的情况 
      return num;  
    }
    //数字转ip地址
 function numberToIp(number) {   
      var ip = ""; 
      if(number <= 0) { 
        return ip; 
      } 
      var ip3 = (number << 0 ) >>> 24; 
      var ip2 = (number << 8 ) >>> 24; 
      var ip1 = (number << 16) >>> 24; 
      var ip0 = (number << 24) >>> 24 
        
      ip += ip3 + "." + ip2 + "." + ip1 + "." + ip0; 
        
      return ip;   
    }