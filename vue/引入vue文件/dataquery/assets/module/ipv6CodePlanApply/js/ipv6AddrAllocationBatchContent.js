$(function(){
    //url参数处理
    var urlObj = new UrlSearch();
    OriIpType = urlObj.OriIpType;
    OriIpTypeName = urlObj.OriIpTypeName;
    topNodeCode = urlObj.topNodeCode;
    topNodeName = urlObj.topNodeName;
    freeAddr = urlObj.freeAddr;
    
    $(".topNodeName").html(topNodeName);
    $(".addrTypeName").html(OriIpTypeName);
    $(".freeAddr").html(freeAddr);
    $(".addrPrefixLen").html(freeAddr.split("/")[1]);
    $("#addrNum").val('2')
    getNodeList();
    getV6IpTypeList(topNodeCode);
    //getOneIpTypeScheme(OriIpType);
    initIconClickEvent();
    loadIpv6InfoTable();
    automaticAssignBtnClickEvent();
    manuallyAssignedBtnClickEvent();
    getAddrItemBtnClickEvent();
    initSubmitBtnClickEvent();     
});
var curlPath = window.document.location.href;
var pathName=window.document.location.pathname;
var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1); 
var tempName = "/ipaddrmodule";//当前文件的跟目录
var bathPath = "";
if(projectName == tempName){
	projectName = "";
}else{
	bathPath = curlPath.substring(0, pathName.indexOf('/'))+projectName;
}
// bathPath = "";//环境上需要注释掉
var userName = jQuery.ITE.getLoginName('loginName');//登录用户
var OriIpType = '';//原地址类型编码
var OriIpTypeName = '';//原地址类型名称
var PlanIpType = '';//新地址类型编码
var topNodeCode = '';//上级组织编码
var topNodeName = '';//上级组织名称
var freeAddr = '';//空闲地址
var schemelist = [];//编码方案数据
var schemelistRelated = []
var addrPrefixLen = 0;//地址前缀长度
var ipv6TableList = [];//表格的值
var AllIpv6List = [];//自动或者手动当前生成的地址
var countyInfoList = [];//初始化区县列表信息
var LevelFlagQuxuan = '1'//省市区县与节点的关联关系的LevelFlag
var checkboxFlag = true
var notNodeCode = '' //申请组织参数
//确认按钮初始化
function initSubmitBtnClickEvent(){
    $("#submitBtn").click(function(){
        if(ipv6TableList.length == 0){
            $.messager.alert('提示','请先生成IPv6地址!','warning');
            return;
        }
        var AllocatedIpv6List = [];
        var allocationAddrList = [];
        var selRow = $('#ipv6ListDataList').datagrid('getSelections')
        for(var i=0;i<ipv6TableList.length;i++){
            for(var j=0;j<selRow.length;j++){
                if(ipv6TableList[i].NextNodeName == selRow[j].NextNodeName && ipv6TableList[i].Ipv6Addr == selRow[j].Ipv6Addr){
                    AllocatedIpv6List.push({
                        Seq:ipv6TableList[i].Seq,
                        NodeCode:ipv6TableList[i].NodeCode,
                        NodeName:ipv6TableList[i].NodeName,
                        NextNodeCode:ipv6TableList[i].NextNodeCode,
                        NextNodeName:ipv6TableList[i].NextNodeName,
                        Inetnum:ipv6TableList[i].Ipv6Addr,
                        PrefixLen:ipv6TableList[i].PrefixLen,
                        IpTypeCode:ipv6TableList[i].IpTypeCode,
                        IpTypeName:ipv6TableList[i].IpTypeName,
                        IpTypeCodeNew:ipv6TableList[i].IpTypeCodeNew,
                        IpTypeNameNew:ipv6TableList[i].IpTypeNameNew,
                        Remarks:ipv6TableList[i].Remarks,
                    })

                    // allocationAddrList.push({
                    //     inetnum:ipv6TableList[i].Ipv6Addr,
                    //     nodeCode:ipv6TableList[i].NodeCode,
                    //     nextNodeCode:ipv6TableList[i].NextNodeCode,
                    //     ipTypeCode:ipv6TableList[i].IpTypeCode,
                    //     ipTypeCodeNew:ipv6TableList[i].IpTypeCodeNew,
                    //     remarks:ipv6TableList[i].Remark,
                    //     operator:userName,
                    // })
                    ipv6TableList[i].checked = '1'
                    break;
                }else {
                    if(ipv6TableList[i].checked !='2'){
                        ipv6TableList[i].checked = '0'
                    }
                }
            }
        }
        let params1 = AllocatedIpv6List
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/allocatedipv6/batchAllocatedIpv6List'),
                    type:'POST',
                    data:JSON.stringify(params1),
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                        
                    },
                    success:function(obj){
                        if(obj.code == "0000"){
                            for(var i=0;i<ipv6TableList.length;i++){
                                for(var j=0;j<obj.data.length;j++){
                                    if(ipv6TableList[i].Seq == obj.data[j].Seq){
                                        ipv6TableList[i].Result = obj.data[j].Result
                                    }
                                }
                            }
                            checkboxFlag =false;
                            console.log(ipv6TableList)
                            loadIpv6InfoTable()
                            $("#deleteBtn").attr('disabled',true)
                            $("#submitBtn").attr('disabled',true)
                            $("#deleteBtn").css({'background-color' : '#999'});
                            $("#submitBtn").css({'background-color' : '#999'});
                            $(".operateBtn").css('display','none')
                            $(".ipv6ListTablePanel").find(".datagrid-header-check").children("input[type=\"checkbox\"]").attr("disabled", true);
                            $(".ipv6ListTablePanel").find(".datagrid-cell-check").children("input[type=\"checkbox\"]").attr("disabled", true);
                            window.parent.getSearcLeftNode('all','reload')
                        }else{
                            $.messager.alert('提示','地址分配失败，'+obj.tip,'error');
                        }
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });

        // let params = {
        //     data:allocationAddrList
        // }
        // $.ajax({
        //     url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6Allocated/AddAllocatedIpv6'),
        //     type:'POST',
        //     data:JSON.stringify(params),
        //     dataType:'json',
        //     contentType: 'application/json;chartset=UTF-8',
        //     beforeSend: function () {
                
        //     },
        //     success:function(obj){
        //         if(obj.data == ""||obj.data == null){
        //             // console.log(params)
        //             $.messager.alert('提示','地址分配成功！','success');
        //         }else{
        //             $.messager.alert('提示','地址分配失败！'+obj.tip,'error');
        //             for(var i=0;i<ipv6TableList.length;i++){
        //                 for(var j=0;j<obj.data.length;j++){
        //                     if(ipv6TableList[i].Ipv6Addr == obj.data[j].Inetnum && ipv6TableList[i].NextNodeCode == obj.data[j].NextNodeCode){
        //                         ipv6TableList[i].Remarks = obj.data[j].Remarks
        //                     }
        //                 }
        //             }
        //         }
                
        //     },
        //     error:function(error){
        //         $.messager.alert('提示','接口调用失败!','error');
        //     },
        //     complete:function(){
        //     }
        // });    
    })
    $("#deleteBtn").click(function(){
        //返回选中多行  
        var selRow = $('#ipv6ListDataList').datagrid('getSelections')  
        //判断是否选中行  
        if (selRow.length==0) {  
            $.messager.alert("提示", "请选择要删除的行！", "info");  
            return;  
        }else{                  
            var arr=ipv6TableList;
            for(var i=0;i<ipv6TableList.length;i++){
                for(var j=0;j<selRow.length;j++){
                    if(ipv6TableList[i].NextNodeName == selRow[j].NextNodeName && ipv6TableList[i].Ipv6Addr == selRow[j].Ipv6Addr){
                        arr.splice(i, 1);
                    }else{
                        
                    }
                }
            }
            ipv6TableList = arr
            // console.log(arr);
            if(ipv6TableList.length == 0){
                $('#addrPrefixLen').attr("disabled", false)
                $('#addrNum').attr("disabled", false)
            }
            loadIpv6InfoTable()
        }
    })
    $("#closeBtn").click(function(){
        window.parent.document.getElementById('plan2').style.display = 'none'
    })
}

//展开收起按钮初始化
function initIconClickEvent(){
    $(".icon").click(function(){
        if($(this).hasClass("icon-jiahao")){
            //切换符号
            $(this).removeClass("icon-jiahao");
            $(this).addClass("icon-jianhao3");
            $(".codePlanBox").removeClass("hidden");
        }else{
            $(this).addClass("icon-jiahao");
            $(this).removeClass("icon-jianhao3");
            $(".codePlanBox").addClass("hidden");
        }
    })
}

//自动分配按钮点击事件
function automaticAssignBtnClickEvent(){
    $("#automaticAssignAddr").click(function(){
        if($("#nodeList").combobox('getText')==''){
            $.messager.alert('提示','请先选择规划组织!','warning');
            return;
        }
        if($("#ipTypeList").combobox('getText')==''){
            $.messager.alert('提示','请先选择规划地址类型!','warning');
            return;
        }
        //判断是否选择了自动分配
        // var assignType = $("input[name='label']:checked").val();
        // if(assignType != "自动分配"){
        //     $.messager.alert('提示','请先选择自动分配方式!','warning');
        //     return;
        // }
        if(LevelFlagQuxuan == '0'){
            $.messager.alert('提示','请先配置省市区县与节点的关联关系!','warning');
            return;
        }
        if($("#editRemarks").val().length > 255 ){
            $.messager.alert('提示','字段长度不能大于255!','warning');
            return;
        }
        var addrPrefixLenVal = $("#addrPrefixLen").val();
        if( addrPrefixLenVal == ""){
            $.messager.alert('提示','地址前缀长度不能为空!','warning');
            return;
        }
        if(!(/(^[1-9]\d*$)/.test(addrPrefixLenVal))){
            $.messager.alert('提示','地址前缀长度需要为正整数!','warning');
            return;
        }
        if(addrPrefixLenVal < addrPrefixLen || addrPrefixLenVal > 64){
            $.messager.alert('提示','IPv6的地址前缀长度不符合规范，应大于等于'+addrPrefixLen+"，小于等于64",'warning');
            return;
        }
        var addrNum = $("#addrNum").val();
        if(addrNum == ""){
            $.messager.alert('提示','地址个数不能为空！','warning');
            return;
        }
        if(addrNum != "" && !(/(^[1-9]\d*$)/.test(addrNum))){
            $.messager.alert('提示','请输入大于等于1的正整数！','warning');
            return;
        }
        //校验页面中已选标识对应的下拉框数据是否都选择了值
        for(var i = 0;i < schemelist.length;i ++){
           
            if(schemelist[i].flag == true || schemelist[i].flag == undefined){//已选标识
                if(schemelist[i].LableCodeName == ""||schemelist[i].LableCodeName == undefined){
                    $.messager.alert('提示','已选标识的编码名称有为空选项，请检查！','warning');
                    return;
                }
            }
        }

        //地址自动生成逻辑
        // loading()
        start() ;
        setTimeout(function(){
            getIpv6ListByAutomatic()
        }, 1000);
    })
}

//手动分配添加地址按钮点击事件
function manuallyAssignedBtnClickEvent(){
    $("#manuallyAssignedAddr").click(function(){

        if($("#nodeList").combobox('getText')==''){
            $.messager.alert('提示','请先选择规划组织!','warning');
            return;
        }
        if($("#ipTypeList").combobox('getText')==''){
            $.messager.alert('提示','请先选择规划地址类型!','warning');
            return;
        }
        //判断是否选择了手动分配
        var assignType = $("input[name='label']:checked").val();
        if(assignType != "手动输入或选择地址"){
            $.messager.alert('提示','请先选择手动输入或选择地址分配方式!','warning');
            return;
        }
        if(LevelFlagQuxuan == '0'){
            $.messager.alert('提示','请先配置省市区县与节点的关联关系!','warning');
            return;
        }
        var ipv6Addr = $("#ipv6Addr").val().toUpperCase();
        ipv6Addr = ipv6AddrFormat(ipv6Addr)
        if( ipv6Addr == ""){
            $.messager.alert('提示','IPv6地址不能为空!','warning');
            return;
        }
        if(ipv6Addr.split('/')[1] > 64){
            $.messager.alert('提示','地址前缀不能大于64!','warning');
            return;
        }
         //校验页面中已选标识对应的下拉框数据是否都选择了值
         for(var i = 0;i < schemelist.length;i ++){
            if(schemelist[i].flag == true || schemelist[i].flag == undefined){//已选标识
                if(schemelist[i].LableCodeName == ""||schemelist[i].LableCodeName == undefined){
                    $.messager.alert('提示','已选标识的编码名称有为空选项，请检查！','warning');
                    return;
                }
            }
        }
        //校验v6地址是否合法
        var checkResult = checkInetnum(ipv6Addr);
        if(checkResult != 'ok'){
            return;
        }
        for(var q = 0;q < ipv6TableList.length;q ++){
            // console.log(ipv6AddrFormat(ipv6TableList[q].addInetNum))
            if(ipv6AddrFormat(ipv6Addr).split("/")[0] == ipv6AddrFormat(ipv6TableList[q].initIpv6) &&ipv6Addr.split("/")[1] == ipv6TableList[q].addInetNum.split("/")[1]){
                $.messager.alert('提示','Ipv6地址与地址列表已分配地址冲突!','warning');
                return
            }
        }
        //反校验IPv6地址
        var flag = ipv6AntiCheck(ipv6Addr);
        if(!flag){
            $.messager.alert('提示','IPv6地址不符合编码方案!','warning');
            return
        }
        //校验是否符合表格中的编码方案
        if(!checkTablePlan(ipv6Addr)){
            $.messager.alert('提示','IPv6地址不符合编码方案!','warning');
            return
        }
        //调用一个空闲地址接口
        // AllIpv6List.push(ipv6Addr)
        // filterIpv6Info();

        var freeAddrS = ipv6AddrFormatStartEnd(freeAddr,'start')
        var freeAddrE = ipv6AddrFormatStartEnd(freeAddr,'end')
        var ipv6AddrS = ipv6AddrFormatStartEnd(ipv6Addr,'start')
        var ipv6AddrE = ipv6AddrFormatStartEnd(ipv6Addr,'end')
        var count = 0 
        if(!ipv6AddrInFree(ipv6AddrS,ipv6AddrE,freeAddrS,freeAddrE)){
            $.messager.alert('提示','IPv6地址不在空闲地址范围内!','warning');
            return;
        }
        for(var k = 0;k<ipv6TableList.length;k++){
            if(ipv6AddrCross(ipv6AddrS,ipv6AddrE,ipv6TableList[k].StartFullIp,ipv6TableList[k].EndFullIp)){
                $.messager.alert('提示','IPv6地址与地址列表已分配地址有交叉!','warning');
                count++;
                break;
            }
        }  
        if(count == 0){
            ipv6TableList.push({
                nodeName:$("#nodeList").combobox('getText'),
                addInetNum:ipv6Addr,
                StartFullIp: ipv6AddrS,
                EndFullIp: ipv6AddrE,
                addrPrefixLen:ipv6Addr.split("/")[1],
                OriIpTypeName:OriIpTypeName,
                PlanIpTypeName:$("#ipTypeList").combobox('getText'),
                Remark:$("#editRemarks").val(),
                initIpv6:ipv6Addr.split("/")[0],//用于去重
            })
            loadIpv6InfoTable(1) 
        }  
    })
}

// 校验是否符合表格中的编码方案
function checkTablePlan(ipv6Addr){
    for(var j = 0;j < schemelist.length;j ++){
        if(schemelist[j].flag == true || schemelist[j].flag == undefined){//已选标识
            if(schemelist[j].HexadecimalCode == ""){//未选择编码
                var domId = "#labelCodeList" + schemelist[j].LableId;
                var opts = $(domId).combobox('options');
                //通用标识还是区县标识
                if(schemelist[j].LableName == "区县标识" ||schemelist[j].LableName == "省份标识"){//区县标识
                    var codeArr = [];
                    for(var k = 0;k < opts.data.length;k ++){
                        codeArr.push(opts.data[k].CountyHexadecimal);
                    }
                    schemelist[j].HexadecimalCode = codeArr.join(',');
                }else{//通用标识
                    var codeArr = [];
                    for(var k = 0;k < opts.data.length;k ++){
                        codeArr.push(opts.data[k].hexadecimalCode);
                    }
                    schemelist[j].HexadecimalCode = codeArr.join(',');
                }
            }else{//存在编码，将编码才分成单个编码数组
                schemelist[j].HexadecimalCode = hexCodeFormat(schemelist[j].HexadecimalCode).join(',');
            }
        }
    }
    var BitLengthAdd = 0
    var count1 = 0
    var ipv6AddrDeal = ipv6Addr.split('::')[0].split(":").join('')
    var splitIPV6 = ''
    for(var j=0;j<schemelist.length;j++){
        if(schemelist[j].flag == true || schemelist[j].flag == undefined){
          if(j == 0){
            splitIPV6 = ipv6AddrDeal.substring(0,schemelist[j].BitLength/4)        
          }else{
            splitIPV6 = ipv6AddrDeal.substring(BitLengthAdd/4,(BitLengthAdd+schemelist[j].BitLength)/4)
          }
          if(schemelist[j].HexadecimalCode.split(":").join('').indexOf(splitIPV6) == -1){
            count1++
          }
          BitLengthAdd+=schemelist[j].BitLength
       }  
    }
    if(count1 > 0){
        return false
    }else{
        return true
    }
}

//反校验IPv6地址
function ipv6AntiCheck(ipv6Addr){
    var count = 0;
    var flag = true;
    for(var i = 0;i < schemelist.length;i ++){
        if(schemelist[i].flag == true || schemelist[i].flag == undefined){//已选标识
            if(schemelist[i].LableName == "省份标识"){
                $.ajax({ 
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeUsed/GetNodeAreaCode?NodeCode=NOD999'),
                    type:'POST',
                    data:{},
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {

                    },
                    success:function(obj){
                        let AreaCode = obj.data.AreaCode
                        let params = {
                            AreaCode:AreaCode,
                            AreaCodeList:''
                        }
                        $.ajax({ 
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetMoreCountyCodeList'),
                    type:'POST',
                    data:JSON.stringify(params),
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                        
                    },
                    success:function(obj){
                        var labelCodeList = obj.data;
                        var ipv6AddrStr = ipv6Addr.replace(/[:]/g, "");
                        var startIndex = Number(schemelist[i].Ipv6Position.split("-")[0]-1)/4;
                        var endIndex = Number(schemelist[i].Ipv6Position.split("-")[1])/4;
                        count = 0;
                        for(var j = 0;j < labelCodeList.length;j++){
                            if(labelCodeList[j].CountyHexadecimal.replace(/[:]/g, "")== ipv6AddrStr.slice(startIndex,endIndex)){
                                count++;
                            }
                        }
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }
            else if(schemelist[i].LableName == "区县标识"){//区县标识
                // console.log(countyInfoList)
                var AreaCode=''
                if($("#labelNameList"+schemelist[i].LableId).length>0){
                    if($("#labelNameList"+schemelist[i].LableId).combobox('getValues')!=''){
                        AreaCode = $("#labelNameList"+schemelist[i].LableId).combobox('getValues').join(",")
                    }else{
                        var AreaCodeList=[]
                        for(var j =0; j<countyInfoList.length;j++){
                            AreaCodeList.push(countyInfoList[j].AreaCode)
                        }
                        AreaCode =  AreaCodeList.join(',')
                    }
                }else{
                    for(var j =0; j<countyInfoList.length;j++){
                        if(schemelist[i].LableCodeName == (countyInfoList[j].FatherAreaName+'-'+countyInfoList[j].AreaName)){
                            AreaCode = countyInfoList[j].AreaCode
                        }
                    }
                }
                // console.log(AreaCode)
                let params = {
                    AreaCode:'',
                    AreaCodeList:AreaCode
                }
                     $.ajax({ 
            url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetMoreCountyCodeList'),
            type:'POST',
            data:JSON.stringify(params),
            async: false,
            dataType:'json',
            contentType: 'application/json;chartset=UTF-8',
            beforeSend: function () {
                
            },
            success:function(obj){
                var labelCodeList = obj.data;
                var ipv6AddrStr = ipv6Addr.replace(/[:]/g, "");
                var startIndex = Number(schemelist[i].Ipv6Position.split("-")[0]-1)/4;
                var endIndex = Number(schemelist[i].Ipv6Position.split("-")[1])/4;
                count = 0;
                for(var j = 0;j < labelCodeList.length;j++){
                    if(labelCodeList[j].CountyHexadecimal.replace(/[:]/g, "")== ipv6AddrStr.slice(startIndex,endIndex)){
                        count++;
                    }
                }
            },
            error:function(error){
                $.messager.alert('提示','接口调用失败!','error');
            },
            complete:function(){
            }
           });
            }else{//通用标识
                var params = {
                    LableId:schemelist[i].LableId,
                    CodeNameList:''
                }
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/GetLableCodeList'),
                    type:'POST',
                    data:JSON.stringify(params),
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                        
                    },
                    success:function(obj){
                        var labelCodeList = obj.data;
                        var ipv6AddrStr = ipv6Addr.replace(/[:]/g, "");
                        var startIndex = Number(schemelist[i].Ipv6Position.split("-")[0]-1)/4;
                        var endIndex = Number(schemelist[i].Ipv6Position.split("-")[1])/4;
                        count = 0;
                        for(var j = 0;j < labelCodeList.length;j++){
                            if(labelCodeList[j].hexadecimalCode.replace(/[:]/g, "") == ipv6AddrStr.slice(startIndex,endIndex)){
                                count++;
                            }
                        }
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }
            if(count == 0){
                flag = false;
                break;
            }
        }
    }
    //if(count)
    return flag;
}

//手动分配获取ip点击事件
function getAddrItemBtnClickEvent(){
    $("#getAddrItem").click(function(){
        if(LevelFlagQuxuan == '0'){
            $.messager.alert('提示','请先配置省市区县与节点的关联关系!','warning');
            return;
        }
        var assignType = $("input[name='label']:checked").val();
        if(assignType != "手动输入或选择地址"){
            $.messager.alert('提示','请先选择手动输入或选择地址分配方式!','warning');
            return;
        }
        var ipRangeList =ipv6TableList.map(function(item){
            if(ipv6TableList.length <= 0){
                return ''
            }else{
                return item.addInetNum
            }
        })
        //  window.top.$vm.$openTab({
        //                         name: '地址分配',
        //                         path:bathPath+"/nos/ipv6manage/unusedipalloc/unusedIpAllotCondition.jsp"
        //             })
        window.open(bathPath+"/nos/ipv6manage/unusedipalloc/unusedIpAllotCondition.jsp?allotType=allocate&NodeCode="+topNodeCode+"&inetnum="+freeAddr+"&IpTypeCode="+OriIpType+"&ipRange="+ipRangeList.join(';'))

        // window.open(bathPath+"/nos/ipv6manage/unusedipalloc/unusedIpAllotCondition.jsp,toolbar=no,location=no,scrollbars=yes,resizable=yes,width=1200,height=700,left=0,top=0");	
    })
}

//自动生成ipv6地址
function getIpv6ListByAutomatic(){
    //编码未选择，需要获取下拉框所有数据
    var codeList = [];
    for(var j = 0;j < schemelist.length;j ++){
        if(schemelist[j].flag == true || schemelist[j].flag == undefined){//已选标识
            if(schemelist[j].HexadecimalCode == ""){//未选择编码
                var domId = "#labelCodeList" + schemelist[j].LableId;
                var opts = $(domId).combobox('options');
                //通用标识还是区县标识
                if(schemelist[j].LableName == "区县标识" || schemelist[j].LableName == "省份标识"){//区县标识
                    var codeArr = [];
                    for(var k = 0;k < opts.data.length;k ++){
                        codeArr.push(opts.data[k].CountyHexadecimal);
                    }
                    schemelist[j].HexadecimalCode = codeArr.join(',');
                }else{//通用标识
                    console.log(opts)
                    var codeArr = [];
                    for(var k = 0;k < opts.data.length;k ++){
                        codeArr.push(opts.data[k].hexadecimalCode);
                    }
                    schemelist[j].HexadecimalCode = codeArr.join(',');
                }
            }else{//存在编码，将编码才分成单个编码数组
                schemelist[j].HexadecimalCode = hexCodeFormat(schemelist[j].HexadecimalCode).join(',');
            }
        }
    }
    //提取出所有数组编码
    for(var p = 0;p < schemelist.length;p ++){
        if(schemelist[p].flag == true || schemelist[p].flag == undefined){//已选标识
            codeList.push(schemelist[p].HexadecimalCode.split(","))
        }else{
            // var domId2 = "#labelCodeList" + schemelist[p].LableId;
            // console.log(domId2)
        }
    }
    var  resultArry = getCombination(codeList);//获取组合数据
    AllIpv6List = [];//每次加数据需要清空
    resultArry.forEach((value)=>{//自动分配地址
        if(isArray(value)){
            AllIpv6List.push(getIpv6InfoByHexadecimalCode(value.join(",").replace(/,/g, ""))); 
        }else{
            AllIpv6List.push(getIpv6InfoByHexadecimalCode(value)); 
        }
        
    })	
    //数组排序(按照从小到大的顺序)
    AllIpv6List.sort();
    //走拆分流程
    var SplitIpv6AddrArr = SplitIpv6Addr()
    if(SplitIpv6AddrArr!= ''){
        AllIpv6List = []
    for(var k=0;k<SplitIpv6AddrArr.length;k++){
        AllIpv6List.push({
            Ipv6Addr:SplitIpv6AddrArr[k].IPv6Inetnum,
            EndFullIp:SplitIpv6AddrArr[k].EndIp,
            StartFullIp:SplitIpv6AddrArr[k].StartIp,
            PrefixLen:SplitIpv6AddrArr[k].PrefixLen,
            IpTypeCode:OriIpType,
            NodeCode:topNodeCode
        })
    }
    //是否为分配组织的原地址类型下的空闲地址
    // filterIpv6Info();
    //是否交叉
    for (var i =0; i < AllIpv6List.length; i++){
        for(var j=0;j<ipv6TableList.length;j++){
            if(ipv6AddrCross(AllIpv6List[i].StartFullIp,AllIpv6List[i].EndFullIp,ipv6TableList[j].StartFullIp,ipv6TableList[j].EndFullIp)){
                AllIpv6List.splice(i--, 1)
                break;
            }
        }
    }
    //自动分配数据过滤（根据地址列表已有数据）
    AllIpv6List = AllIpv6List.filter(function(item){
        var count = 0;
        for(var q = 0;q < ipv6TableList.length;q ++){
            if(item.Ipv6Addr.split("/")[0] == ipv6TableList[q].initIpv6){
                count ++;
            }
        }
        return count == 0;
    })
    var ipv6Len = AllIpv6List.length;
    // console.log(AllIpv6List)
    var addrNum = $("#addrNum").val();
    // loadinghid()
    end()
    // if(addrNum != ""){//页面输入地址个数
    //     if(ipv6Len >= addrNum){
    //         AllIpv6List.splice(addrNum,ipv6Len - addrNum);//将集合中C个依次增加到地址列表中
    //     }else if(ipv6Len == 0){
    //         $.messager.alert('提示','无满足规范的IPv6地址!','warning');
    //         return;
    //     }else if(ipv6Len < addrNum && ipv6Len != 0){
            
    //     }
    // }else{//无地址个数，(接口处理)

    // }

    //根据有无区县编码来加载表格数据

    var count1 = 0 //判断是否有区县标识
    var countryIndex = ''//区县标识的index
    var countryLabelCodeList = [] //区县标识编码数组
    var countryLabelNameList = [] //区县标识编码名称数组
    for(var i = 0; i<schemelist.length;i++){
        if(schemelist[i].flag == true || schemelist[i].flag == undefined){
            if(schemelist[i].LableName == '区县标识'){
                count1++,
                countryIndex = i
                var domId = "#labelNameList" + schemelist[i].LableId;
                var opts = $(domId).combobox('getData');
                countryLabelCodeList = $("#labelCodeList" + schemelist[i].LableId).combobox('getData')
                countryLabelNameList = $("#labelNameList" + schemelist[i].LableId).combobox('getData')
                // console.log($("#labelCodeList" + schemelist[i].LableId).combobox('getData'))
                // console.log(opts)
                var countryNameList = schemelist[i].LableCodeName.split(',')
                var countryNameList1 = []
                var countryCodeList = []
                for(var k = 0; k<countryNameList.length;k++){
                    for(var j = 0; j<opts.length;j++){
                        if(opts[j].AreaName == countryNameList[k]){
                            countryCodeList.push(opts[j].NodeCode) 
                            countryNameList1.push(opts[j].NodeName)
                        }
                    }
                }
                // countryCode = countryCodeList?countryCodeList.join(','):''
            }
        }
    }
    var countryBitLength = 0 // 用来截取生成地址区县编码的位置
    for(var i = 0; i<schemelist.length;i++){
        if(schemelist[i].flag == true || schemelist[i].flag == undefined){
            if(schemelist[i].LableName == '区县标识'){
                break;
            }else{
                countryBitLength += Number(schemelist[i].BitLength)
            }
        }  
    }
    // console.log(AllIpv6List)
        //表格数据赋值
        var ipv6LenAdd = 0
    if(count1>0){
        AllIpv6List.forEach((value,index)=>{
            if(index < addrNum){
                //判断生成的地址中区县位置的编码是否对应选中区县名称和编码
            var nameSplit = ''
            //截取地址中区县位置的编码
            var codeSplit = value.StartFullIp.split(":").join('').substring(countryBitLength/4,(countryBitLength+Number(schemelist[countryIndex].BitLength))/4)
            //通过编码获取对应的区县名称
            var AreaCodeSplit = ''
            for(var i = 0; i<countryLabelCodeList.length;i++){
                if(codeSplit == countryLabelCodeList[i].CountyHexadecimal){
                    AreaCodeSplit = countryLabelCodeList[i].AreaCode
                }
            }
            for(var i = 0; i<countryLabelNameList.length;i++){
                if(AreaCodeSplit == countryLabelNameList[i].AreaCode){
                    nameSplit = countryLabelNameList[i].NodeName
                }
            }
            var count2 = 0
            for(var i = 0; i<ipv6TableList.length;i++){
                if(nameSplit == ipv6TableList[i].NextNodeName){
                    count2++
                }
            }
            if(count2 < 2){
                ipv6TableList.push({
                    checked: 1,
                    NodeName:topNodeName,
                    NodeCode:topNodeCode,
                    NextNodeName:$("#nodeList").combobox('getText'),
                    NextNodeCode:$("#nodeList").combobox('getValue'),
                    Ipv6Addr:value.Ipv6Addr,
                    StartFullIp: value.StartFullIp,
                    EndFullIp: value.EndFullIp,
                    PrefixLen:$("#addrPrefixLen").val(),
                    IpTypeName:OriIpTypeName,
                    IpTypeCode:OriIpType,
                    IpTypeNameNew:$("#ipTypeList").combobox('getText'),
                    IpTypeCodeNew:$("#ipTypeList").combobox('getValue'),
                    Remark:$("#editRemarks").val(),
                    initIpv6:value.Ipv6Addr.split("/")[0],//用于去重
                },
                // {
                //     checked:countryCode?1:0,
                //     NodeName:$("#nodeList").combobox('getText'),
                //     NodeCode:$("#nodeList").combobox('getValue'),
                //     NextNodeName:countryName,
                //     NextNodeCode:countryCode,
                //     Ipv6Addr:value.Ipv6Addr,
                //     StartFullIp: value.StartFullIp,
                //     EndFullIp: value.EndFullIp,
                //     PrefixLen:$("#addrPrefixLen").val(),
                //     IpTypeName:OriIpTypeName,
                //     IpTypeCode:OriIpType,
                //     IpTypeNameNew:$("#ipTypeList").combobox('getText'),
                //     IpTypeCodeNew:$("#ipTypeList").combobox('getValue'),
                //     Remark:countryCode?$("#editRemarks").val():"未关联节点 无法分配",
                //     initIpv6:value.Ipv6Addr.split("/")[0],//用于去重
                // }
                )
                ipv6LenAdd += 1
                countryNameList1.forEach((value1,index1)=>{
                    //当截取对应的区县编码和选中的编码相同时增加数据
                    if(value1 == nameSplit){
                        if(countryCodeList[index1]){
                            ipv6TableList.push(
                                {
                                    checked:countryCodeList[index1]?'1':'2',
                                    NodeName:$("#nodeList").combobox('getText'),
                                    NodeCode:$("#nodeList").combobox('getValue'),
                                    NextNodeName:value1,
                                    NextNodeCode:countryCodeList[index1],
                                    Ipv6Addr:value.Ipv6Addr,
                                    StartFullIp: value.StartFullIp,
                                    EndFullIp: value.EndFullIp,
                                    PrefixLen:$("#addrPrefixLen").val(),
                                    IpTypeName:OriIpTypeName,
                                    IpTypeCode:OriIpType,
                                    IpTypeNameNew:$("#ipTypeList").combobox('getText'),
                                    IpTypeCodeNew:$("#ipTypeList").combobox('getValue'),
                                    Remark:$("#editRemarks").val(),
                                    initIpv6:value.Ipv6Addr.split("/")[0],//用于去重
                                    Result:countryCodeList[index1]?'':"未关联节点 无法分配"
                                })
                                ipv6LenAdd += 1
                        }
                    }
                    
                })
            }
            }
            
            
        })	
    }else{
        AllIpv6List.forEach((value)=>{
            if(ipv6TableList.length < addrNum){     
                ipv6TableList.push({
                    checked: 1,
                    NodeName:topNodeName,
                    NodeCode:topNodeCode,
                    NextNodeName:$("#nodeList").combobox('getText'),
                    NextNodeCode:$("#nodeList").combobox('getValue'),
                    Ipv6Addr:value.Ipv6Addr,
                    StartFullIp: value.StartFullIp,
                    EndFullIp: value.EndFullIp,
                    PrefixLen:$("#addrPrefixLen").val(),
                    IpTypeName:OriIpTypeName,
                    IpTypeCode:OriIpType,
                    IpTypeNameNew:$("#ipTypeList").combobox('getText'),
                    IpTypeCodeNew:$("#ipTypeList").combobox('getValue'),
                    Remark:$("#editRemarks").val(),
                    initIpv6:value.Ipv6Addr.split("/")[0],//用于去重
                })
                ipv6LenAdd += 1
            }   
        })	
    }
    
    ipv6TableList.forEach((value,index)=>{
        value.Seq = index
    })


    //根据地址去重(地址前缀长度不一样的地址是相同的)
    //ipv6TableList = arrayUnique(ipv6TableList,"initIpv6");
    // if(count1>0){
    //     ipv6Len = (AllIpv6List.length)*2;//实时数据
    // }else{
    //     ipv6Len = AllIpv6List.length;//实时数据
    // }
    if(ipv6LenAdd == 0){//过滤完没有值
        $.messager.alert('提示','无满足规范的IPv6地址!','warning');
        return;
    }
    loadIpv6InfoTable(ipv6LenAdd)
    }else{
        // loadinghid()
        end()
        $.messager.alert('提示','规划地址不在需要规划的空闲地址中!','warning'); 
    }
    
}
// 拆分
function SplitIpv6Addr(){
    var AllIpv6ListSplit = []
    var PrefixLen = 0
    var status = 0
    var BitLength = 0 
    var AddrNum = 0
    var freeAddrS = ipv6AddrFormatStartEnd(freeAddr,'start')
    var freeAddrE = ipv6AddrFormatStartEnd(freeAddr,'end')
    for(var j=0;j<schemelist.length;j++){
        if(schemelist[j].flag == true){
            BitLength+=schemelist[j].BitLength
        }
    }
    if($("#addrPrefixLen").val() >= BitLength){
        AddrNum = Math.pow(2,($("#addrPrefixLen").val()-BitLength))
        for(var i = 0;i<AllIpv6List.length;i++){

            var parmas = {
                IPv6Addr:AllIpv6List[i].toUpperCase(),
                PrefixLen:$("#addrPrefixLen").val(),
                StartLoc:1,
                AddrNum:AddrNum
            }
            if(status == 0){
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeUsed/SplitIpv6Addr'),
                    type:'POST',
                    data:JSON.stringify(parmas),
                    dataType:'json',
                    async:false,
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
        
                    },
                    success:function(obj){
                        if(obj.code == 0001){
                            $.messager.alert('提示',obj.msg,'error');
                            status = 1
                        }else if(obj.code == 0000){ 
                            for(var j=0;j<obj.data.length;j++){
                                if(ipv6AddrInFree(obj.data[j].StartIp,obj.data[j].EndIp,freeAddrS,freeAddrE)){
                                    AllIpv6ListSplit=AllIpv6ListSplit.concat(obj.data[j])
                                }   
                            }
                        }
                    },
                    error:function(error){
                        status = 1
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }
            // filterIpv6Info1(AllIpv6ListSplit)
            // if(AllIpv6ListSplit.length >= $("#addrNum").val()){
            //     // 是否为分配组织的原地址类型下的空闲地址
            //     if(filterIpv6Info1(AllIpv6ListSplit).length>= $("#addrNum").val()){
            //         break;
            //     }
            // }
        }
    }else{
        $.messager.alert('提示','地址前缀长度需大于等于编码长度!','error');
    }
    return AllIpv6ListSplit
}
// 判断是否为数组
function isArray(o){

    return Object.prototype.toString.call(o)== '[object Array]';
    
}
//是否为分配组织的原地址类型下的空闲地址
function filterIpv6Info(){
    let params = {
        NodeCode:topNodeCode,
        IpTypeCode:OriIpType,
        PreNodeCode:'',
        Ipv6List:AllIpv6List
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeUsed/checkUnusedIpv6List'),
        type:'POST',
        data:JSON.stringify(params),
        async: false,
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success:function(obj){//符合空闲条件的地址
            if(obj.data == undefined){
                // $.messager.alert('提示','IPv6地址不在空闲地址范围内!','error');
                AllIpv6List = [];
            }else{
                var data = obj.data;
                AllIpv6List = obj.data
            }
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}
//是否为分配组织的原地址类型下的空闲地址
function filterIpv6Info1(AllIpv6ListSplit){
    let list = []
    let filterList = []
    for(var k=0;k<AllIpv6ListSplit.length;k++){
        list.push(AllIpv6ListSplit[k].IPv6Inetnum)
    }
    let params = {
        NodeCode:topNodeCode,
        IpTypeCode:OriIpType,
        PreNodeCode:'',
        Ipv6List:list
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeUsed/checkUnusedIpv6List'),
        type:'POST',
        data:JSON.stringify(params),
        async: false,
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success:function(obj){//符合空闲条件的地址
            if(obj.data == undefined){
                // $.messager.alert('提示','IPv6地址不在空闲地址范围内!','error');
                filterList = [];
            }else{
                var data = obj.data;
                filterList = obj.data
            }
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
    return filterList
}

//将十六进制编码转为ipv6格式
function getIpv6InfoByHexadecimalCode(HexadecimalCode){
    HexadecimalCode = HexadecimalCode.replace(/[:]/g, "")
    var len = HexadecimalCode.length;
    var num = Math.floor(len/4);
    var ipv6Item = '';
    var count = 0;
    var PrefixLen = 0
    for(var j = 0;j < schemelist.length;j ++){
        if(schemelist[j].flag == true || schemelist[j].flag == undefined){//已选标识
            PrefixLen+=schemelist[j].BitLength
        }
    }
    for(var i = 0;i < 8;i ++){
        if(num >= i){
            if(len < (i+1)*4){
                var zero = '';
                if((i+1)*4 - len == 1){
                    zero = "0";
                }else if((i+1)*4 - len == 2){
                    zero = "00";
                }else if((i+1)*4 - len == 3){
                    zero = "000";
                }
                ipv6Item += HexadecimalCode.slice(i*4,len) + zero;
            }else{
                if(len == (i+1)*4){
                    ipv6Item += HexadecimalCode.slice(i*4,(i+1)*4);  
                }else{
                    ipv6Item += HexadecimalCode.slice(i*4,(i+1)*4) + ':';
                }
            }
        }else{
            //ipv6Item += ":0000";
            count ++;
            if(count == 1){
                if(ipv6Item.slice(ipv6Item.length-1,ipv6Item.length) == ':'){//处理007C:0234:
                    ipv6Item = ipv6Item.slice(0,ipv6Item.length-1)
                }
                ipv6Item += "::";//缩写
            }
        }
    }
    ipv6Item += "/" + PrefixLen;
    return ipv6Item;
}

//组合生成ipv6地址
function getCombination(array){
    let resultArry=[];
        array.forEach((arrItem)=>{
            if(resultArry.length===0){
                resultArry=arrItem
            }else{
                const emptyArray=[];
                resultArry.forEach((item)=>{
                    arrItem.forEach((value)=>{
                        emptyArray.push([...item,value])
                    })	
                })
                resultArry=emptyArray
           }
       });
    return resultArry;
}

//获取节点信息
function getNodeList(){
    //获取申请组织参数
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/SysCommon/getSysPara?ParaName=NoneedQueryNodes'),
        type:'get',
        cache:false,
        dataType:'json',
        contentType:"application/json",
        success:function(obj){     
            if(obj.data){
                notNodeCode = obj.data.PARAVALUE   
            }else{
                notNodeCode = ''
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/NodeManage/queryNode'),
                type:'post',
                cache:false,
                data:JSON.stringify({notNodeCode:notNodeCode,fathernodecode: topNodeCode}),
                dataType:'json',
                contentType:"application/json",
                success:function(obj){                                    
                    let nodeList = obj.data;
                    var nextNodeList = nodeList;
                    // var nextNodeList = getNextNodeInfo(nodeList);
                    var len = $(".length").width()
                    $("#nodeList").combobox({
                        valueField:'nodeCode',
                        textField:'nodeName',
                        data:nextNodeList,
                        width:len,
                        //panelHeight: 'auto',//高度自适应
                        multiple: false,
                        editable:false,//定义用户是否可以直接往文本域中输入文字
                        //直接过滤，数据太多时不行，太卡了，放弃
                        onLoadSuccess: function () {
                           
                        },
                        filter: function(q, row){
                            var opts = $('#nodeList').combobox('options');
                            return row[opts.textField].indexOf(q) != -1;
                        },
                        onSelect:function(row){
                            getV6IpTypeList(row.NodeCode)
                            schemelist=[]
                            // loadLabelCodeTable()
                            ipv6TableList =[]
                            loadIpv6InfoTable()
                            loadCodePlanContent()
                            // if($("#ipTypeList").combotree('getValue')!=''){
                            //     getOneIpTypeScheme('')
                            // }
                        }
                    });
                }
            });                            
        }
    });
}

//获取v6地址类型
function getV6IpTypeList(nodeCode){
    let params = {
        userName: userName,
        nodeCode: nodeCode,
        ipType: OriIpType,
        authType: "",
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/IPV6/IpAddrType/GetIPTypeV6List'),
        type:'post',
        cache:false,
        data:JSON.stringify(params),
        dataType:'json',
        contentType:"application/json",
        success:function(obj){     
            let ipTypeList = obj.data; 
            var len = $(".length").width()                        
            $("#ipTypeList").combotree({
                idField:'ipTypeId',
                textField:'ipTypeName',
                data:ipTypeList,
                width:len,
                //panelHeight: 'auto',//高度自适应
                multiple: false,
                editable:false,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    $("#ipTypeList").combotree('tree').tree("collapseAll");
                },
                filter: function(q, row){
                    var opts = $(this).combobox('options');
		            return row[opts.textField].indexOf(q) == 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function(q, e) {
                        $('#ipTypeList').combotree('tree').tree('doFilter', q)
                    }
                },
                onBeforeSelect:function(row){ //节点被选中前触发，返回 false 则取消选择动作(但是返回false，下拉选项依旧会关闭)
                    
                },
                onSelect:function(row){
                    if(ipv6TableList.length != 0){
                        ipv6TableList=[]
                        loadIpv6InfoTable()
                    }
                    getOneIpTypeScheme(row.ipTypeId)
                    if($(".icon").hasClass("icon-jiahao")){
                        //切换符号
                        $(".icon").removeClass("icon-jiahao");
                        $(".icon").addClass("icon-jianhao3");
                        $(".codePlanBox").removeClass("hidden");
                    }
                }
            });
            
        }
    });
}

//查询对应地址类型的编码方案
function getOneIpTypeScheme(IpTypeCode){
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeMng/GetOneIpTypeScheme?IpTypeCode='+IpTypeCode),
        type:'POST',
        data:{},
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            schemelist = obj.data[0].schemelist
            if(schemelist.length == 0){
                $.messager.alert('提示','未查到对应的编码方案，请先修改编码方案!','error');
            }
            var content = loadCodePlanContent();
            $(".planItemBox").append(content)
            initTableData();
            getlabelList()
            loadLabelCodeTable();
            // console.log(schemelist)
            for(var i = 0; i<schemelist.length;i++){
                if(schemelist[i].LableCodeName != undefined &&schemelist[i].LableCodeName != ''){
                    if(schemelist[i].LableName == '区县标识'||schemelist[i].LableName == '省份标识'){
                        // console.log(schemelist[i])
                        initLabelCodeListByAreaCode1(schemelist[i].LableId,schemelist[i].LableCodeName,schemelist[i].LableName)
                    }else{
                        initLabelCodeListByLabelName1(schemelist[i].LableId,schemelist[i].LableCodeName)
                    }
                }
            } 
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//按节点查询其关联的标识编码
function getRelatedInfosByNode(LableId){
    var NodeCode = $("#nodeList").combobox('getValue')
    schemelistRelated = []
    getYesNoRelatedInfosByNode(LableId,NodeCode)
}

function getYesNoRelatedInfosByNode(LableId,NodeCode){
    let params = {
        LableId:LableId.toString(),
        NodeCode:NodeCode,
        Status:'Allocated'
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableNodeRelated/queryRelatedInfosByNode'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        async:false, 
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            if(obj.data.length != 0){
                for(var i=0; i<obj.data.length; i++){
                    schemelistRelated.push(obj.data[i])
               }
            }else{
                let params1 = {
                    LableId:LableId.toString()
                }
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableNodeRelated/queryNotRelatedLableCodes'),
                    type:'POST',
                    data:JSON.stringify(params1),
                    dataType:'json',
                    async:false, 
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                        
                    },
                    success:function(obj){
                        if(obj.data.length != 0){
                            for(var i=0; i<obj.data.length; i++){
                                schemelistRelated.push(obj.data[i])
                           }
                        }else{
                            
                        }
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}
// 规划组织的nodecode获取级别level
function getLevel(){
    var NodeCode = $("#nodeList").combobox('getValue')
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeUsed/GetNodeAreaCode?NodeCode='+NodeCode),
        type:'POST',
        data:{},
        async: false,
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success:function(obj){
            if(obj.data){
                LevelFlagQuxuan = '1'
                // var AreaCode = obj.data.AreaCode;
                var LevelFlag = obj.data.LevelFlag;
                var checkboxItem =  $(".checkboxCommon");
                addrPrefixLen = 0
                if(LevelFlag == '1'){
                        for(let k = 0;k < checkboxItem.length;k++){//当前的tr
                            $('.checkboxCommon').eq(k).attr("checked", false);
                        }
                        for(var i = 0;i < schemelist.length;i++){
                            if(schemelist[i].LableName == '区县标识'){
                                if(schemelist[i].isNecessary == '0'){
                                    addrPrefixLen += Number(schemelist[i].BitLength);
                                    $("#addrPrefixLen").val(addrPrefixLen)
                                    schemelist[i].flag = true;
                                }else{
                                    var domId = "#labelNameList" + schemelist[i].LableId;
                                    var domId2 = "#labelCodeList" + schemelist[i].LableId;
                                    if($(domId).find('input').length){
                                         $(domId).combobox('disable'); //不可用 
                                         $(domId2).combobox('disable'); //不可用
                                    }
                                    schemelist[i].flag = false;
                                }
                            }else{
                                if(getLableNodeRelatedList(schemelist[i].LableId).length != 0){
                                    var domId = "#labelNameList" + schemelist[i].LableId;
                                    var domId2 = "#labelCodeList" + schemelist[i].LableId;
                                    $(domId2).parents('tr').find('.checkboxCommon').prop("checked", true);
                                    $(domId2).parents('tr').find('.checkboxCommon').prop("disabled",'disabled');
                                    addrPrefixLen += Number(schemelist[i].BitLength);
                                    $("#addrPrefixLen").val(addrPrefixLen)
                                    schemelist[i].flag = true;
                                }else{
                                    if(schemelist[i].isNecessary != '1'){
                                        addrPrefixLen += Number(schemelist[i].BitLength);
                                        $("#addrPrefixLen").val(addrPrefixLen)
                                        schemelist[i].flag = true;
                                    }else{
                                        var domId = "#labelNameList" + schemelist[i].LableId;
                                        var domId2 = "#labelCodeList" + schemelist[i].LableId;
                                        if($(domId).find('input').length){
                                             $(domId).combobox('disable'); //不可用 
                                             $(domId2).combobox('disable'); //不可用
                                        }
                                        schemelist[i].flag = false;
                                    }
                                }
                            }  
                        }
                }else{
                    for(var i = 0;i < schemelist.length;i++){
                    if(schemelist[i].LableName == '区县标识'){
                        // for(let k = 0;k < checkboxItem.length;k++){//当前的tr
                        //     $('.checkboxCommon').eq(k).attr("checked", true);
                        //     $('.checkboxCommon').eq(k).attr("disabled",'disabled');
                        // }
                        var domId = "#labelNameList" + schemelist[i].LableId;
                        var domId2 = "#labelCodeList" + schemelist[i].LableId;
                        $(domId2).parents('tr').find('.checkboxCommon').prop("checked", true);
                        $(domId2).parents('tr').find('.checkboxCommon').prop("disabled",'disabled');
                        addrPrefixLen += Number(schemelist[i].BitLength);
                        $("#addrPrefixLen").val(addrPrefixLen)
                        schemelist[i].flag = true;
                    }else{

                        if(getLableNodeRelatedList(schemelist[i].LableId).length != 0){
                            var domId = "#labelNameList" + schemelist[i].LableId;
                            var domId2 = "#labelCodeList" + schemelist[i].LableId;
                            $(domId2).parents('tr').find('.checkboxCommon').prop("checked", true);
                            $(domId2).parents('tr').find('.checkboxCommon').prop("disabled",'disabled');
                            addrPrefixLen += Number(schemelist[i].BitLength);
                            $("#addrPrefixLen").val(addrPrefixLen)
                            schemelist[i].flag = true;
                        }else{
                            if(schemelist[i].isNecessary != '1'){
                                addrPrefixLen += Number(schemelist[i].BitLength);
                                $("#addrPrefixLen").val(addrPrefixLen)
                                schemelist[i].flag = true; 
                            }else{
                                var domId = "#labelNameList" + schemelist[i].LableId;
                                var domId2 = "#labelCodeList" + schemelist[i].LableId;
                                if($(domId).find('input').length){
                                     $(domId).combobox('disable'); //不可用 
                                     $(domId2).combobox('disable'); //不可用
                                }
                                schemelist[i].flag = false; 
                            }
                        }        
                    } 
                }
                }
            }else{
                addrPrefixLen = 0
                for(var i = 0;i < schemelist.length;i++){
                    if(schemelist[i].LableName == '区县标识'){
                        LevelFlagQuxuan = '0'
                    }
                    if(schemelist[i].isNecessary != '1'){
                        addrPrefixLen += Number(schemelist[i].BitLength);
                        $("#addrPrefixLen").val(addrPrefixLen)
                        schemelist[i].flag = true;
                    }else{
                        if(getLableNodeRelatedList(schemelist[i].LableId).length != 0){
                            var domId = "#labelNameList" + schemelist[i].LableId;
                            var domId2 = "#labelCodeList" + schemelist[i].LableId;
                            $(domId2).parents('tr').find('.checkboxCommon').prop("checked", true);
                            $(domId2).parents('tr').find('.checkboxCommon').prop("disabled",'disabled');
                            addrPrefixLen += Number(schemelist[i].BitLength);
                            $("#addrPrefixLen").val(addrPrefixLen)
                            schemelist[i].flag = true;
                        }else{
                            var domId = "#labelNameList" + schemelist[i].LableId;
                            var domId2 = "#labelCodeList" + schemelist[i].LableId;
                            if($(domId).length){
                                 $(domId).combobox('disable'); //不可用 
                                 $(domId2).combobox('disable'); //不可用
                            }
                            schemelist[i].flag = false;
                        }
                    }
                }
            }
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//按标识ID查询标识编码关联节点
function getLableNodeRelatedList(LableId){
    var tableData = []
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/Ipv6LableNodeRelated/queryLableNodeRelatedList'),
        type: 'post',
        cache: false,
        data: JSON.stringify({ LableId: LableId.toString()}),
        dataType: 'json',
        async:false,
        contentType: "application/json",
        success: function(obj) {
            tableData = obj.data
        }
    });
    return tableData;
}

//编码方案内容
function loadCodePlanContent(){
    $(".planItemBox").html("");//清空
    var len = 0;
    var content = '';
    var itemWidth = "itemWidth"+schemelist.length;//宽度均分
    for(var i = 0;i < schemelist.length;i++){
        len += Number(schemelist[i].BitLength);
    }
    spaceLen = 64 - len;
    if(spaceLen == 0){
        itemWidth = "itemWidthDeal"+schemelist.length;
    }
    for(var i = 0;i < schemelist.length;i++){
        if(schemelist[i].LableCodeName != undefined && schemelist[i].LableCodeName != ''){
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'" title='+schemelist[i].LableCodeName+'（'+schemelist[i].BitLength+'）'+'>'+schemelist[i].LableCodeName+'（'+schemelist[i].BitLength+'）'+'</div>'
        }else{
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'" title='+schemelist[i].LableName+'（'+schemelist[i].BitLength+'）'+'>'+schemelist[i].LableName+'（'+schemelist[i].BitLength+'）'+'</div>'
        }        
    }
    if(schemelist.length != 0){
        if(spaceLen == 0){
        content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
        }else{
            content += '<div class="schemeItem subnetSpace">子网空间（'+spaceLen+'）</div>';
            content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
        }
        
    }
    return content;
}
//初始化表格数据
function initTableData(){
    for(var i = 0;i < schemelist.length;i++){
        if(schemelist[i].CodeTableName == "IPv6LableCode"){//通用
            var params = {
                LableId:schemelist[i].LableId,
                LableCodeName:''
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/GetNormalCodeMngList'),
                type:'POST',
                data:JSON.stringify(params),
                async: false,
                dataType:'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function () {
            
                },
                success:function(obj){
                    if(obj.data){
                        var labelCodeList = obj.data;
                        var arr = []
                        for(var k = 0;k < labelCodeList.length;k++){
                           if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == labelCodeList[k].LableCodeName)){
                                arr.push(labelCodeList[k].HexadecimalCode)
                                schemelist[i].HexadecimalCode =  arr.join(',')
                            }
                        }
                    }
                    
                    // loadLabelCodeTable(schemelist);
                },
                error:function(error){
                    $.messager.alert('提示','接口调用失败!','error');
                },
                complete:function(){
                }
            });
        }else{
            if(schemelist[i].LableName == "省份标识"){//省份
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetProvinceCodeMngList?AreaName='),
                    type:'POST',
                    data:{},
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                
                    },
                    success:function(obj){
                        //数据合并，根据AreaCode相同
                        var labelCodeList = mergeCodeByAreaCode(obj.data);
                        var arr = []
                        for(var k = 0;k < labelCodeList.length;k++){
                            if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == labelCodeList[k].AreaName)){
                                arr.push(labelCodeList[k].CountyHexadecimal)
                                schemelist[i].HexadecimalCode =  arr.join(',')
                            }
                        }
                        // loadLabelCodeTable(schemelist);
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }else{//区县
                var params = {
                    AreaName:'',
                    pagesize:1000,
                    pageno:1
                }
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetCountyCodeMngList'),
                    type:'POST',
                    data:JSON.stringify(params),
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                
                    },
                    success:function(obj){
                        //数据合并，根据AreaCode相同
                        var labelCodeList = mergeCodeByAreaCode(obj.data.rows);
                        countyInfoList = mergeCodeByAreaCode(obj.data.rows)
                        var arr = []
                        for(var k = 0;k < labelCodeList.length;k++){
                            if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == (labelCodeList[k].FatherAreaName+'-'+labelCodeList[k].AreaName))){
                                arr.push(labelCodeList[k].CountyHexadecimal)
                                schemelist[i].HexadecimalCode =  arr.join(',')
                            }
                        }
                        // loadLabelCodeTable(schemelist);
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }
        }
    }
}
//获取标识数据匹配isNecessary
function getlabelList(){
    let params = {
        LableId:'',
        LableName:'',    
    };
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableMng/GetLableList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            let tableData = obj.data;
            schemelist = schemelist.map(function(o) {
                o.isNecessary = '';
                return o;
              })
            for(var i =0; i<tableData.length;i++){
                for(var j=0;j<schemelist.length;j++){
                    if(tableData[i].LableId == schemelist[j].LableId&&tableData[i].LableName == schemelist[j].LableName){
                        schemelist[j].isNecessary= tableData[i].isNecessary
                    }
                }
            }
            loadLabelCodeTable()
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}
//加载标识表格数据
function loadLabelCodeTable(){
    var tableData = schemelist
    //清空无数据提示信息
    $(".codePlanTablePanel .noData").hide();
    var flag = false;//是否有复选框列
    for(var i = 0;i < schemelist.length;i ++){
        if(schemelist[i].isNecessary == "0"){
            flag = true;
            break;
        }
    }
    /*定义表格的表头*/
    if(flag){
        var columnsData=[[
            {field:'isNecessary',  title: '',align:'center',width:20,
            formatter:function(value,row,index){
                if(row.isNecessary == "1"){
                    return '<input type="checkbox" name="'+row.LableId+'" class="checkboxCommon"  />'
                }
            }},
            {field:'LableName', title: '标识名称',align:'center',width:100},
            {field:'LableCodeName',  title: '编码名称',align:'center',width:150,
            formatter:function(value,row,index){
                if(row.LableCodeName == undefined||row.LableCodeName == ''){
                    return '<input class="easyui-combobox labelNameList" id="labelNameList'+row.LableId+'"/>'
                }else{
                    return value;
                }
            }},
            {field:'HexadecimalCode', title: '编码',align:'center',width:150,
            formatter:function(value,row,index){
                // if(row.LableCodeName == undefined||row.LableCodeName == ''){
                return '<input class="easyui-combobox labelCodeList" id="labelCodeList'+row.LableId+'"/>'
                // }else{
                //     return value;
                // }
            }},
            {field:'BitLength', title: '长度(bit)',align:'center',width:100},
            {field:'Ipv6Position', title: '在128位地址中的地址',align:'center',width:100},
        ]];
    }else{
        var columnsData=[[
            {field:'LableName', title: '标识名称',align:'center',width:100},
            {field:'LableCodeName',  title: '编码名称',align:'center',width:150,
            formatter:function(value,row,index){
                if(row.LableCodeName == undefined||row.LableCodeName == ''){
                    return '<input class="easyui-combobox labelNameList" id="labelNameList'+row.LableId+'"/>'
                }else{
                    return value;
                }
            }},
            {field:'HexadecimalCode', title: '编码',align:'center',width:150,
            formatter:function(value,row,index){
                if(row.LableCodeName == undefined||row.LableCodeName == ''){
                    return '<input class="easyui-combobox labelCodeList" id="labelCodeList'+row.LableId+'"/>'
                }else{
                    return value;
                }
            }},
            {field:'BitLength', title: '长度(bit)',align:'center',width:100},
            {field:'Ipv6Position', title: '在128位地址中的地址',align:'center',width:100},
        ]];
    }
    var tableId="codePlanDataList";
    var tableH='auto';
    var opt={
        columnsData:columnsData,
        data:tableData,
        tableH:tableH,
        NofilterRow:true,
        tableOpt:{
            pagination:false//分页
        }
    };
    relatedTable(tableId,opt);
    initLabelCodeList();
    initComboboxData();
    getLevel()
    initCheckboxChangeEvent();
}

//初始化编码下拉框（无数据）
function initLabelCodeList(){
    for(var i = 0;i < schemelist.length;i++){
        if(schemelist[i].LableCodeName == ""||schemelist[i].LableCodeName == undefined){
            var domId = "#labelCodeList" + schemelist[i].LableId;
            $(domId).combobox({
                valueField:'code',
                textField:'code',
                data:[],
                width:200,
                //panelHeight: 'auto',//高度自适应
                multiple: true,
                editable:false,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    
                },
                filter: function(q, row){
                    var opts = $(domId).combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){
                    
                }
            });
        }
    }
}

//初始化复选框点击事件
function initCheckboxChangeEvent(){
    $(".checkboxCommon").click(function() {
        if ($(this).is(":checked")== true) {
            for(var i = 0;i < schemelist.length;i++){
                if($(this).attr("name") == schemelist[i].LableId){
                    var domId = "#labelNameList" + schemelist[i].LableId;
                    var domId2 = "#labelCodeList" + schemelist[i].LableId;
                    $(domId).combobox('enable'); //可用 
                    $(domId2).combobox('enable'); //可用
                    addrPrefixLen += Number(schemelist[i].BitLength);
                    //地址前缀长度赋值
                    $("#addrPrefixLen").val(addrPrefixLen)
                    schemelist[i].flag = true;
                }
            }
        } else {
            for(var i = 0;i < schemelist.length;i++){
                if($(this).attr("name") == schemelist[i].LableId){
                    var domId = "#labelNameList" + schemelist[i].LableId;
                    var domId2 = "#labelCodeList" + schemelist[i].LableId;
                    $(domId).combobox('disable'); //不可用 
                    $(domId2).combobox('disable'); //不可用
                    addrPrefixLen -= Number(schemelist[i].BitLength);
                    //地址前缀长度赋值
                    $("#addrPrefixLen").val(addrPrefixLen)
                    schemelist[i].flag = false;
                }
            }
        }
    });
}

//初始化下拉数据
function initComboboxData(){
    var count = 0
    for(var i = 0; i<schemelist.length;i++){
        if(schemelist[i].LableName == '区县标识'){
            count++
        }
    }
    if(count == 0){
        for(var i = 0;i < schemelist.length;i++){
            let LableId = schemelist[i].LableId.toString()
            // addrPrefixLen += Number(schemelist[i].BitLength);
            if(schemelist[i].LableCodeName == undefined||schemelist[i].LableCodeName == ''){//未定义的编码名称
                var NodeCode = $("#nodeList").combobox('getValue')
                let params = {
                    LableId:LableId,
                    NodeCode:NodeCode,
                    Status:'Allocated'
                }
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableNodeRelated/queryRelatedInfosByNode'),
                    type:'POST',
                    data:JSON.stringify(params),
                    dataType:'json',
                    async:false,
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                        
                    },
                    success:function(obj){
                        if(obj.data.length != 0){
                            var labelNameList = obj.data;
                        // 去重
                        labelNameList = labelNameList.reduce((cur, next) => {
                            obj[next.LableCodeName] ? "" : obj[next.LableCodeName] = true && cur.push(next);
                            return cur;
                            }, []) //设置cur默认类型为数组，并且初始值为空的数组
                        // if(schemelist[i].LableCodeName != undefined &&schemelist[i].LableCodeName != ''){
                        //     initLabelCodeListByLabelName(schemelist[i].LableId,schemelist[i].LableCodeName)
                        // }
                        var domId = "#labelNameList" + schemelist[i].LableId;
                        $(domId).combobox({
                            valueField:'LableCodeName',
                            textField:'LableCodeName',
                            data:labelNameList,
                            width:200,
                            //panelHeight: 'auto',//高度自适应
                            multiple: true,
                            editable:true,//定义用户是否可以直接往文本域中输入文字
                            //直接过滤，数据太多时不行，太卡了，放弃
                            onLoadSuccess: function () {
                                
                            },
                            filter: function(q, row){
                                var opts = $(domId).combobox('options');
                                return row[opts.textField].indexOf(q) != -1;
                            },
                            onSelect:function(row){
                                var CodeNameList = $(domId).combobox('getValues').join(",");
                                var LableId = domId.slice(14,domId.length)
                                initLabelCodeListByLabelName(LableId,CodeNameList)
                                //联动编码方案数据
                                for(var k = 0 ;k < schemelist.length; k++){
                                    if(schemelist[k].LableId == LableId){
                                        schemelist[k].LableCodeName = $(domId).combobox('getText')
                                    }
                                }
                            },
                            onUnselect:function(){
                                var CodeNameList = $(domId).combobox('getValues').join(",");
                                var LableId = domId.slice(14,domId.length)
                                initLabelCodeListByLabelName(LableId,CodeNameList)
                                //联动编码方案数据
                                for(var k = 0 ;k < schemelist.length; k++){
                                    if(schemelist[k].LableId == LableId){
                                        schemelist[k].LableCodeName = $(domId).combobox('getText')
                                    }
                                }
                            }
                        });
                        }else{
                            let params1 = {
                                LableId:LableId
                            }
                            $.ajax({
                                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableNodeRelated/queryNotRelatedLableCodes'),
                                type:'POST',
                                data:JSON.stringify(params1),
                                dataType:'json',
                                async:false,
                                contentType: 'application/json;chartset=UTF-8',
                                beforeSend: function () {
                                    
                                },
                                success:function(obj){
                                    var labelNameList = obj.data;
                        // 去重
                        labelNameList = labelNameList.reduce((cur, next) => {
                            obj[next.LableCodeName] ? "" : obj[next.LableCodeName] = true && cur.push(next);
                            return cur;
                            }, []) //设置cur默认类型为数组，并且初始值为空的数组
                        // if(schemelist[i].LableCodeName != undefined &&schemelist[i].LableCodeName != ''){
                        //     initLabelCodeListByLabelName(schemelist[i].LableId,schemelist[i].LableCodeName)
                        // }
                        var domId = "#labelNameList" + LableId;
                        $(domId).combobox({
                            valueField:'LableCodeName',
                            textField:'LableCodeName',
                            data:labelNameList,
                            width:200,
                            //panelHeight: 'auto',//高度自适应
                            multiple: true,
                            editable:true,//定义用户是否可以直接往文本域中输入文字
                            //直接过滤，数据太多时不行，太卡了，放弃
                            onLoadSuccess: function () {
                                
                            },
                            filter: function(q, row){
                                var opts = $(domId).combobox('options');
                                return row[opts.textField].indexOf(q) != -1;
                            },
                            onSelect:function(row){
                                var CodeNameList = $(domId).combobox('getValues').join(",");
                                var LableId = domId.slice(14,domId.length)
                                initLabelCodeListByLabelName(LableId,CodeNameList)
                                //联动编码方案数据
                                for(var k = 0 ;k < schemelist.length; k++){
                                    if(schemelist[k].LableId == LableId){
                                        schemelist[k].LableCodeName = $(domId).combobox('getText')
                                    }
                                }
                            },
                            onUnselect:function(){
                                var CodeNameList = $(domId).combobox('getValues').join(",");
                                var LableId = domId.slice(14,domId.length)
                                initLabelCodeListByLabelName(LableId,CodeNameList)
                                //联动编码方案数据
                                for(var k = 0 ;k < schemelist.length; k++){
                                    if(schemelist[k].LableId == LableId){
                                        schemelist[k].LableCodeName = $(domId).combobox('getText')
                                    }
                                }
                            }
                        });
                                },
                                error:function(error){
                                    $.messager.alert('提示','接口调用失败!','error');
                                },
                                complete:function(){
                                }
                            });
                        }
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }
        }
    }else{
        // addrPrefixLen = 0;//清零
    // console.log(schemelist)
    for(var i = 0;i < schemelist.length;i++){
        // addrPrefixLen += Number(schemelist[i].BitLength);
        if(schemelist[i].LableCodeName == undefined||schemelist[i].LableCodeName == ''){//未定义的编码名称
            if(schemelist[i].LableName == "区县标识"){//区县标识
                //查询规划组织对应的区域标识
                var NodeCode = $("#nodeList").combobox('getValue')
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeUsed/GetNodeAreaCode?NodeCode='+NodeCode),
                    type:'POST',
                    data:{},
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {

                    },
                    success:function(obj){
                        if(obj.data){
                            var AreaCode = obj.data.AreaCode;
                            var LevelFlag = obj.data.LevelFlag;
                             //查询区县名称
                        var parmas = {
                            LevelFlag:3,
                            FatherAreaCode:AreaCode,
                        }
                        $.ajax({
                            url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetCityCountyInfoList'),
                            type:'POST',
                            data:JSON.stringify(parmas),
                            async: false,
                            dataType:'json',
                            contentType: 'application/json;chartset=UTF-8',
                            beforeSend: function () {
        
                            },
                            success:function(obj){
                                var labelNameList = obj.data;
                            
                                // countyInfoList = obj.data
                                for(var j = 0; j < labelNameList.length;j++){
                                    labelNameList[j].AreaName = labelNameList[j].FatherAreaName + '—' + labelNameList[j].AreaName
                                }
                                var domId = "#labelNameList" + schemelist[i].LableId;
                                $(domId).combobox({
                                    valueField:'AreaCode',
                                    textField:'AreaName',
                                    data:labelNameList,
                                    width:200,
                                    //panelHeight: 'auto',//高度自适应
                                    multiple: true,
                                    editable:true,//定义用户是否可以直接往文本域中输入文字
                                    //直接过滤，数据太多时不行，太卡了，放弃
                                    onLoadSuccess: function () {
                                        
                                    },
                                    filter: function(q, row){
                                        var opts = $(domId).combobox('options');
                                        return row[opts.textField].indexOf(q) != -1;
                                    },
                                    onSelect:function(row){
                                        var AreaCodeList = $(domId).combobox('getValues').join(",");
                                        var LableId = domId.slice(14,domId.length)
                                        initLabelCodeListByAreaCode(LableId,AreaCodeList)
                                        //联动编码方案数据
                                        for(var k = 0 ;k < schemelist.length; k++){
                                            if(schemelist[k].LableId == LableId){
                                                schemelist[k].LableCodeName = $(domId).combobox('getText')
                                            }
                                        }
                                    },
                                    onUnselect:function(){
                                        var AreaCodeList = $(domId).combobox('getValues').join(",");
                                        var LableId = domId.slice(14,domId.length)
                                        initLabelCodeListByAreaCode(LableId,AreaCodeList)
                                        //联动编码方案数据
                                        for(var k = 0 ;k < schemelist.length; k++){
                                            if(schemelist[k].LableId == LableId){
                                                schemelist[k].LableCodeName = $(domId).combobox('getText')
                                            }
                                        }
                                    }
                                });
                            },
                            error:function(error){
                                $.messager.alert('提示','接口调用失败!','error');
                            },
                            complete:function(){
                            }
                        });
                        }else{
                            var labelNameList = [];
                            var domId = "#labelNameList" + schemelist[i].LableId;
                            $(domId).combobox({
                                valueField:'AreaCode',
                                textField:'AreaName',
                                data:labelNameList,
                                width:200,
                                //panelHeight: 'auto',//高度自适应
                                multiple: true,
                                editable:true,//定义用户是否可以直接往文本域中输入文字
                                //直接过滤，数据太多时不行，太卡了，放弃
                                onLoadSuccess: function () {
                                    
                                },
                                filter: function(q, row){
                                    var opts = $(domId).combobox('options');
                                    return row[opts.textField].indexOf(q) != -1;
                                },
                                onSelect:function(row){
                                    var AreaCodeList = $(domId).combobox('getValues').join(",");
                                    var LableId = domId.slice(14,domId.length)
                                    initLabelCodeListByAreaCode(LableId,AreaCodeList)
                                    //联动编码方案数据
                                    for(var k = 0 ;k < schemelist.length; k++){
                                        if(schemelist[k].LableId == LableId){
                                            schemelist[k].LableCodeName = $(domId).combobox('getText')
                                        }
                                    }
                                },
                                onUnselect:function(){
                                    var AreaCodeList = $(domId).combobox('getValues').join(",");
                                    var LableId = domId.slice(14,domId.length)
                                    initLabelCodeListByAreaCode(LableId,AreaCodeList)
                                    //联动编码方案数据
                                    for(var k = 0 ;k < schemelist.length; k++){
                                        if(schemelist[k].LableId == LableId){
                                            schemelist[k].LableCodeName = $(domId).combobox('getText')
                                        }
                                    }
                                }
                            });
                        }
                        // if(LevelFlag == "1"){//判断复选框是否可操作
                        //     var checkboxItem =  $(".checkboxCommon");
                        //     addrPrefixLen -= Number(schemelist[i].BitLength);//已取消的标识不计算在内
                        //     for(let k = 0;k < checkboxItem.length;k++){//当前的tr
                        //         if(checkboxItem[k].attributes[1].value == schemelist[i].LableId){
                        //             $('.checkboxCommon').eq(k).attr("checked", false);
                        //             //其余列不可操作
                        //             var domId = "#labelNameList" + schemelist[i].LableId;
                        //             var domId2 = "#labelCodeList" + schemelist[i].LableId;
                        //             $(domId).combobox('disable'); //不可用 
                        //             $(domId2).combobox('disable'); //不可用 
                        //             schemelist[i].flag = false;//复选框没选中，即为没选中此标识
                        //         }
                        //     }
                        // }else{//多选框不可用
                        //     var checkboxItem =  $(".checkboxCommon");
                        //     for(let k = 0;k < checkboxItem.length;k++){//当前的tr
                        //         if(checkboxItem[k].attributes[1].value == schemelist[i].LableId){
                        //             $('.checkboxCommon').eq(k).attr("disabled","disabled");
                        //             var domId = "#labelNameList" + schemelist[i].LableId;
                        //             var domId2 = "#labelCodeList" + schemelist[i].LableId;
                        //             $(domId).combobox('disable'); //不可用 
                        //             $(domId2).combobox('disable'); //不可用 
                        //             schemelist[i].flag = false;//复选框没选中，即为没选中此标识
                        //         }
                        //     }
                        // }
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }else if(schemelist[i].LableName == '省份标识'){
                var parmas = {
                    LevelFlag:1,
                }
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetProvinceInfoList'),
                    type:'POST',
                    data:JSON.stringify(parmas),
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {

                    },
                    success:function(obj){
                        var labelNameList = obj.data;
                    //    var LableCodeCode=''
                    //    for(var j=0;j<labelNameList.length;j++){
                    //        if(schemelist[i].LableCodeName == labelNameList[j].AreaName){
                    //         LableCodeCode = labelNameList[j].AreaCode
                    //        }
                    //    }
                    //    if(schemelist[i].LableCodeName != undefined &&schemelist[i].LableCodeName != ''){
                    //     initLabelCodeListByAreaCode(schemelist[i].LableId,LableCodeCode)
                    //   }
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }else{//通用标识
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/GetLableCodeNameList?LableId='+schemelist[i].LableId),
                    type:'POST',
                    data:{},
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                        
                    },
                    success:function(obj){
                        var labelNameList = obj.data;
                        // 去重
                        labelNameList = labelNameList.reduce((cur, next) => {
                            obj[next.LableCodeName] ? "" : obj[next.LableCodeName] = true && cur.push(next);
                            return cur;
                            }, []) //设置cur默认类型为数组，并且初始值为空的数组
                        // if(schemelist[i].LableCodeName != undefined &&schemelist[i].LableCodeName != ''){
                        //     initLabelCodeListByLabelName(schemelist[i].LableId,schemelist[i].LableCodeName)
                        // }
                        var domId = "#labelNameList" + schemelist[i].LableId;
                        $(domId).combobox({
                            valueField:'LableCodeName',
                            textField:'LableCodeName',
                            data:labelNameList,
                            width:200,
                            //panelHeight: 'auto',//高度自适应
                            multiple: true,
                            editable:true,//定义用户是否可以直接往文本域中输入文字
                            //直接过滤，数据太多时不行，太卡了，放弃
                            onLoadSuccess: function () {
                                
                            },
                            filter: function(q, row){
                                var opts = $(domId).combobox('options');
                                return row[opts.textField].indexOf(q) != -1;
                            },
                            onSelect:function(row){
                                var CodeNameList = $(domId).combobox('getValues').join(",");
                                var LableId = domId.slice(14,domId.length)
                                initLabelCodeListByLabelName(LableId,CodeNameList)
                                //联动编码方案数据
                                for(var k = 0 ;k < schemelist.length; k++){
                                    if(schemelist[k].LableId == LableId){
                                        schemelist[k].LableCodeName = $(domId).combobox('getText')
                                    }
                                }
                            },
                            onUnselect:function(){
                                var CodeNameList = $(domId).combobox('getValues').join(",");
                                var LableId = domId.slice(14,domId.length)
                                initLabelCodeListByLabelName(LableId,CodeNameList)
                                //联动编码方案数据
                                for(var k = 0 ;k < schemelist.length; k++){
                                    if(schemelist[k].LableId == LableId){
                                        schemelist[k].LableCodeName = $(domId).combobox('getText')
                                    }
                                }
                            }
                        });
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }
        }
    }
    }
    
    //地址前缀长度赋值
    // $("#addrPrefixLen").val(addrPrefixLen)
}

//编码名称改变联动编码数据下拉框(通用标识)
function initLabelCodeListByLabelName(LableId,CodeNameList){
    var params = {
        LableId:LableId,
        CodeNameList:CodeNameList
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/GetLableCodeList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            var labelCodeList = obj.data;
            var arr=[]
            for(var j = 0; j< labelCodeList.length;j++){
                arr.push(labelCodeList[j].hexadecimalCode)
            }
            for(var k = 0 ;k < schemelist.length; k++){
                if(schemelist[k].LableId == LableId){
                    schemelist[k].HexadecimalCode = arr.join(',')
                }
            }
            var domId = "#labelCodeList" + LableId;
            $(domId).combobox({
                valueField:'hexadecimalCode',
                textField:'hexadecimalCode',
                data:labelCodeList,
                width:200,
                //panelHeight: 'auto',//高度自适应
                multiple: true,
                editable:true,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    
                },
                filter: function(q, row){
                    var opts = $(domId).combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){
                    //联动编码方案数据
                    for(var k = 0 ;k < schemelist.length; k++){
                        if(schemelist[k].LableId == LableId){
                            schemelist[k].HexadecimalCode = $(domId).combobox('getText')
                        }
                    }
                },
            });
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//编码名称改变联动编码数据下拉框(区县标识)
function initLabelCodeListByAreaCode(LableId,AreaCodeList){
    let params = {
        LableId:LableId,
        AreaCodeList:AreaCodeList
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetMoreCountyCodeList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            var labelCodeList = obj.data;
            var arr=[]
            for(var j = 0; j< labelCodeList.length;j++){
                arr.push(labelCodeList[j].CountyHexadecimal)
            }
            for(var k = 0 ;k < schemelist.length; k++){
                if(schemelist[k].LableId == LableId){
                    schemelist[k].HexadecimalCode = arr.join(',')
                }
            }
            var domId = "#labelCodeList" + LableId;
            $(domId).combobox({
                valueField:'CountyHexadecimal',
                textField:'CountyHexadecimal',
                data:labelCodeList,
                width:200,
                //panelHeight: 'auto',//高度自适应
                multiple: true,
                editable:true,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                },
                filter: function(q, row){
                    var opts = $(domId).combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){
                    //联动编码方案数据
                    for(var k = 0 ;k < schemelist.length; k++){
                        if(schemelist[k].LableId == LableId){
                            schemelist[k].HexadecimalCode = $(domId).combobox('getText')
                        }
                    }
                },
            });
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//根据已有编码名称显示编码数据下拉框(通用标识)
function initLabelCodeListByLabelName1(LableId,CodeNameList){
    var params = {
        LableId:LableId,
        CodeNameList:CodeNameList
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/GetLableCodeList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            var labelCodeList = obj.data;
            var arr=[]
            for(var j = 0; j< labelCodeList.length;j++){
                arr.push(labelCodeList[j].hexadecimalCode)
            }
            for(var k = 0 ;k < schemelist.length; k++){
                if(schemelist[k].LableId == LableId){
                    // schemelist[k].HexadecimalCode = arr.join(',')
                }
            }
            var domId = "#labelCodeList" + LableId;
            var count = 0
            $(domId).combobox({
                valueField:'hexadecimalCode',
                textField:'hexadecimalCode',
                data:labelCodeList,
                width:200,
                //panelHeight: 'auto',//高度自适应
                multiple: true,
                editable:true,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    for(var k = 0 ;k < schemelist.length; k++){
                        if(schemelist[k].LableId == LableId){
                            $(domId).combobox("setValues",schemelist[k].HexadecimalCode.split(","))
                        }
                    }
                   
                },
                filter: function(q, row){
                    var opts = $(domId).combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){
                    //联动编码方案数据
                    for(var k = 0 ;k < schemelist.length; k++){
                        if(schemelist[k].LableId == LableId){
                            if(count == 0){
                                schemelist[k].HexadecimalCode = ''
                                $(domId).combobox("setValue",row.hexadecimalCode) 
                                schemelist[k].HexadecimalCode = $(domId).combobox('getText')
                            }
                            
                            // schemelist[k].HexadecimalCode = $(domId).combobox('getText')
                        }
                    }
                    count++
                }, 
                onChange: function(newVal, oldVal){
                    const arr3 = [];
                    newVal.forEach((a)=>{
                        let c = oldVal.findIndex(b =>a === b);
                        if (c > -1) delete oldVal[c];
                        else arr3.push(a);
                    });
                    for(var k = 0 ;k < schemelist.length; k++){
                        if(schemelist[k].LableId == LableId){
                            if(count !=0){
                                schemelist[k].HexadecimalCode = newVal.join(',')
                            }
                        }
                    }
                },
            });
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}
//根据已有编码名称显示编码数据下拉框(区县标识)
function initLabelCodeListByAreaCode1(LableId,AreaCodeList,LableName){
    var AreaCode = ''
    if(LableName == '省份标识'){
        parmas = {
            LevelFlag:'1',
        }
        $.ajax({
            url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetProvinceInfoList'),
            type:'POST',
            data:JSON.stringify(parmas),
            async: false,
            dataType:'json',
            contentType: 'application/json;chartset=UTF-8',
            beforeSend: function () {

            },
            success:function(obj){
                var labelNameList = obj.data;
                for(var j = 0;j<labelNameList.length;j++){
                    if(labelNameList[j].AreaName == AreaCodeList){
                        AreaCode = labelNameList[j].AreaCode
                    } 
                }
                let params = {
                    LableId:LableId,
                    AreaCodeList:AreaCode
                }
            },
            error:function(error){
                $.messager.alert('提示','接口调用失败!','error');
            },
            complete:function(){
            }
        });
     }else{
          //查询规划组织对应的区域标识
    var NodeCode = $("#nodeList").combobox('getValue')
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeUsed/GetNodeAreaCode?NodeCode='+NodeCode),
        type:'POST',
        data:{},
        async: false,
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success:function(obj){
                var AreaCode1 = obj.data.AreaCode;
                var LevelFlag = obj.data.LevelFlag;
                var parmas = {
                        LevelFlag:'3',
                        FatherAreaCode:AreaCode1,
                    }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetCityCountyInfoList'),
                type:'POST',
                data:JSON.stringify(parmas),
                async: false,
                dataType:'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function () {

                },
                success:function(obj){
                    var labelNameList = obj.data;
                    for(var j = 0;j<labelNameList.length;j++){
                        if(labelNameList[j].FatherAreaName+'-'+labelNameList[j].AreaName == AreaCodeList){
                            AreaCode = labelNameList[j].AreaCode
                        }
                    }
                },
                error:function(error){
                    $.messager.alert('提示','接口调用失败!','error');
                },
                complete:function(){
                }
            });  
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
     }
   
    let params = {
        LableId:LableId,
        AreaCodeList:AreaCode
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetMoreCountyCodeList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            var labelCodeList = obj.data;
            var arr=[]
            for(var j = 0; j< labelCodeList.length;j++){
                arr.push(labelCodeList[j].CountyHexadecimal)
            }
            for(var k = 0 ;k < schemelist.length; k++){
                if(schemelist[k].LableId == LableId){
                    // schemelist[k].HexadecimalCode = arr.join(',')
                }
            }
            var domId = "#labelCodeList" + LableId;
            var count = 0
            $(domId).combobox({
                valueField:'CountyHexadecimal',
                textField:'CountyHexadecimal',
                data:labelCodeList,
                width:200,
                //panelHeight: 'auto',//高度自适应
                multiple: true,
                editable:true,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    for(var k = 0 ;k < schemelist.length; k++){
                        if(schemelist[k].LableId == LableId){
                            $(domId).combobox("setValues",schemelist[k].HexadecimalCode.split(","))
                        }
                    }
                },
                filter: function(q, row){
                    var opts = $(domId).combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){
                    //联动编码方案数据
                    for(var k = 0 ;k < schemelist.length; k++){
                        if(schemelist[k].LableId == LableId){
                            if(count == 0){
                                schemelist[k].HexadecimalCode = ''
                                $(domId).combobox("setValue",row.CountyHexadecimal) 
                                schemelist[k].HexadecimalCode = $(domId).combobox('getText')
                            }
                            // schemelist[k].HexadecimalCode = $(domId).combobox('getText')
                        }
                    }
                    count++
                },
                onChange: function(newVal, oldVal){
                    const arr3 = [];
                    newVal.forEach((a)=>{
                        let c = oldVal.findIndex(b =>a === b);
                        if (c > -1) delete oldVal[c];
                        else arr3.push(a);
                    });
                    for(var k = 0 ;k < schemelist.length; k++){
                        if(schemelist[k].LableId == LableId){
                            if(count !=0){
                                schemelist[k].HexadecimalCode = newVal.join(',')
                            }
                        }
                    }
                },
            });
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//初始化ipv6地址表格数据
function loadIpv6InfoTable(ipv6Len){
    /*定义表格的表头*/
    var columnsData=[[
        { field: 'ck', checkbox: true, width: '30' },  //复选框
        {field:'NodeName', title: '分配组织',align:'center',width:90},
        {field:'NextNodeName', title: '申请组织',align:'center',width:90},
        {field:'Ipv6Addr',  title: 'IPv6地址',align:'center',width:100},
        {field:'PrefixLen', title: '地址前缀长度',align:'center',width:80},
        {field:'IpTypeName', title: '原地址类型',align:'center',width:90},
        {field:'IpTypeNameNew', title: '新地址类型',align:'center',width:90},
        {field:'Remark', title: '备注',align:'center',width:80},
        {field:'operate', title: '操作',align:'center',width:50,
        formatter:function(value,row,index){
            return "<a style='color:#f40' class='operateBtn' onclick=delIpv6AddrItem(\'"+row.Ipv6Addr+"\'"+",\'"+row.NextNodeName+"\')>删除</a>"
        }},
        {field:'Result', title: '分配结果',align:'center',width:120,
        formatter:function(value,row,index){
            if(row.Result == '成功' || row.Result == '已分配'){
                return "<a style='color:green' )>"+row.Result+"</a>"
            }else if(row.Result == '失败'){
                return "<a style='color:#f40' )>"+row.Result+"</a>"
            }else if(row.Result == '未分配'){
                return "<a style='color:#409CFC' )>"+row.Result+"</a>"
            }else if(row.Result == undefined){
                return ''
            }else{
                return "<a>"+row.Result+"</a>"
            }
            
        }
     },
    ]];
    var tableId="ipv6ListDataList";
    var tableH='250';
    var opt={
        columnsData:columnsData,
        data:ipv6TableList,
        tableH:tableH,
        NofilterRow:true,      
        tableOpt:{
            pagination:true,//分页
            onLoadSuccess:function(row){//当表格成功加载时执行      
                $(".datagrid-filter-row").hide();    
                var rowData = row.rows;
                $.each(rowData,function(idx,val){//遍历JSON
                      if(val.checked == '1'){
                        $("#ipv6ListDataList").datagrid("checkRow", idx);//如果数据行为已选中则选中该行
                      }else if(val.checked == '0'){
                        $("#ipv6ListDataList").datagrid("unselectRow", idx);//如果数据行为已选中则选中该行
                      }else{
                        $(".ipv6ListTablePanel").find(".datagrid-cell-check").children("input[type=\"checkbox\"]").eq(idx).attr("style", "display:none;");
                      }
                });        
            }
        },
    };
    relatedTable(tableId,opt);
    setTimeout(() => {
        if(ipv6TableList.length == 0){
            $(".ipv6ListTablePanel .noData").show();
        }else{
            $(".ipv6ListTablePanel .noData").hide();
        }
    }, 200);
    if(ipv6Len){
        if(ipv6Len < $('#addrNum').val()){
            $.messager.alert('提示','当前地址段只能分配'+ipv6Len+'条IPv6地址！','info');
        }else{
            $.messager.alert('提示','已增加成功'+ipv6Len+'条IPv6地址！','info');
        }
        $('#addrPrefixLen').attr("disabled", true)
        $('#addrNum').attr("disabled", true)
    }
}

//列表ip地址删除
function delIpv6AddrItem(Ipv6Addr,NextNodeName){
    ipv6TableList = ipv6TableList.filter(function(ele){
        return ele.Ipv6Addr != Ipv6Addr || ele.NextNodeName != NextNodeName;
    });
    if(ipv6TableList.length == 0){
        $('#addrPrefixLen').attr("disabled", false)
        $('#addrNum').attr("disabled", false)
    }
    loadIpv6InfoTable();
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

//获取当前组织的下一级组织信息
function getNextNodeInfo(data){
    var nextNodeList = [];
    data.forEach((item) => { //利用foreach循环遍历
        if(item.nodeCode == topNodeCode){//判断递归结束条件  
            nextNodeList = item.children;
            return;
        }else if(item.children && item.children.length > 0 ){//判断chlidren是否有数据
            getNextNodeInfo(item.children);  //递归调用                      
        }                   
    })
    return nextNodeList;
};

//拆分十六进制编码
function hexCodeFormat(str){
    var codeArr = [];
    if(str.indexOf(",") == -1&&str.indexOf("-") == -1){//十六进制不存在英文逗号和-
        codeArr.push(str);
    }else if(str.indexOf(",") != -1&&str.indexOf("-") == -1){//十六进制存在英文逗号,不存在-
        codeArr = str.split(",");
    }else if(str.indexOf(",") == -1&&str.indexOf("-") != -1){//十六进制存-,不存在英文逗号
        var strArr = str.split('-').map(item=>{//转化为十进制
            return parseInt(item,16);
        })
        var startCode = strArr[0];
        var endCode = strArr[1];
        var zero = '0000000000000000';//补0
        //遍历生成所有的十六进制
        for(var i = startCode;i <= endCode;i ++){
            var hexCode = i.toString(16).toUpperCase();
            var tmp = str.split("-")[0].length - hexCode.length;
            codeArr.push(zero.substr(0,tmp) + hexCode);
        }
    }else{//都存在
       var strArr = str.split(',');
       for(var i = 0 ;i < strArr.length;i ++){
            if(strArr[i].indexOf("-") != -1){
                var strItem = strArr[i].split("-").map(item=>{//转化为十进制
                    return parseInt(item,16);
                })
                var startCode = strItem[0];
                var endCode = strItem[1];
                var zero = '0000000000000000';//补0
                //遍历生成所有的十六进制
                for(var j = startCode;j <= endCode;j ++){
                    var hexCode = j.toString(16).toUpperCase();
                    var tmp = strArr[i].split("-")[0].length - hexCode.length;
                    codeArr.push(zero.substr(0,tmp) + hexCode);
                }
            }else{
                codeArr.push(strArr[i])
            }
       }
    }
    return codeArr;
}

function arrayUnique(arr, name) {
    var hash = {}
    return arr.reduce(function(item, next) {
      hash[next[name]] ? '' : (hash[next[name]] = true && item.push(next))
      return item
    }, [])
}

//检查IPv6地址/段的地址是否正确
function checkInetnum(ipaddr)
{
	var result = "";
	var ipv6addr = Trim(ipaddr);
	var prefix = "";
	var loc = ipv6addr.indexOf("/");
	if( loc != -1 ){
        //截取IPv6地址
        prefix = ipv6addr.substring(loc+1,ipv6addr.length);
		ipv6addr = ipv6addr.substr(0,loc);
	}else{
        //alert(ipaddr+"地址格式非法，请重新填写!");   
        $.messager.alert('提示',ipaddr+"地址格式非法，请重新填写!",'warning');
		return "false";
    }

    if( prefix == "" ){
        //alert("地址前缀长度不能为空!");  
        $.messager.alert('提示',"地址前缀长度不能为空!",'warning'); 
		return "false";
    }

	//校验IPv6地址
	if( IPV6Formatting(ipv6addr) == "Error" ){
        //alert(ipaddr+"地址格式非法，请重新填写!");   
        $.messager.alert('提示',ipaddr+"地址格式非法，请重新填写!",'warning'); 
		return "false";
    }

    if(prefix < addrPrefixLen || prefix > 128){
        $.messager.alert('提示','IPv6的地址前缀长度不符合规范，应大于等于'+addrPrefixLen+"，小于等于128",'warning');
        return;
    }
	//校验地址前缀
	if( prefix != "" ){
		if( !isNumber(prefix,"int") ){
            //alert(prefix+"地址前缀应填写数字!");   
            $.messager.alert('提示',prefix+"地址前缀应填写数字!",'warning'); 
			return "false";
		}
		//地址前缀应为1-128的数字
		if( parseInt(prefix) > 128 || parseInt(prefix) < 1 ){
            //alert("地址前缀应为1-128间的数字!");   
            $.messager.alert('提示',"地址前缀应为1-128间的数字!",'warning'); 
			return "false";
		}
	}
	return "ok";
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
//根据AreaCode去重，十六进制编码合并
function mergeCodeByAreaCode(beforeData){
    var afterData = []
    var tempArr = []
    for (var i = 0; i < beforeData.length; i++) {
      if (tempArr.indexOf(beforeData[i].AreaCode) === -1) {
        afterData.push(beforeData[i])
        tempArr.push(beforeData[i].AreaCode)
      } else {
        for (var j = 0; j < afterData.length; j++) {
          if (afterData[j].AreaCode == beforeData[i].AreaCode) {
            afterData[j].CountyHexadecimal = afterData[j].CountyHexadecimal + ',' + beforeData[i].CountyHexadecimal;
            break
          }
        }
      }
    }
    return afterData
}
//补全编码格式
function ipv6AddrFormat(ipv6Addr){
    var befordAddr = ipv6Addr.split("::")[0];
    var befordAddr1 = ipv6Addr.split("::")[1]
    var befordAddrArr = befordAddr.split(":");
    for(var i = 0;i < befordAddrArr.length;i ++){
        if(befordAddrArr[i].length != 4){//补0
            if(befordAddrArr[i].length == 3){
                befordAddrArr[i] = '0'+befordAddrArr[i];
            }else if(befordAddrArr[i].length == 2){
                befordAddrArr[i] = '00'+befordAddrArr[i];
            }else if(befordAddrArr[i].length == 1){
                befordAddrArr[i] = '000'+befordAddrArr[i];
            }
        }
        
    }
    var addrFormat = befordAddrArr.join(",");
    addrFormat = addrFormat.replace(/[,]/g, ":");
    addrFormat +=('::'+befordAddr1)
    return addrFormat
}
//全编码格式调接口
function ipv6AddrFormatStartEnd(ipv6Addr,attr){
    var ipv6AddrStart = ''
    var ipv6AddrEnd = ''
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/IPV6InetnumProcess/getIPv6StartEndIp?inetnum='+ipv6Addr),
        type:'GET',
        dataType:'json',
        async:false,
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            ipv6AddrStart = obj[0]
            ipv6AddrEnd = obj[1]
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    }); 
    if(attr == 'start'){
        return ipv6AddrStart
    }else{
        return ipv6AddrEnd
    }
}
//判断一段地址是不是在空闲地址中（一段地址，空闲地址）
function ipv6AddrInFree(ipv6AddrS1,ipv6AddrE1,ipv6AddrS2,ipv6AddrE2){
    var ipv6AddrStart1 = ipv6AddrS1.split(':')
    var ipv6AddrEnd1 = ipv6AddrE1.split(':')
    var ipv6AddrStart2 = ipv6AddrS2.split(':')
    var ipv6AddrEnd2 = ipv6AddrE2.split(':')
    var count1 = 0
    var count2 = 0
    for(var i = 0;i<ipv6AddrStart1.length ;i++){
        if(parseInt(ipv6AddrStart1[i], 16) < parseInt(ipv6AddrStart2[i], 16)){
            count1++
            break;
        }
    }
    for(var i = 0;i<ipv6AddrEnd1.length ;i++){
        if(parseInt(ipv6AddrEnd1[i], 16) > parseInt(ipv6AddrEnd2[i], 16)){
            count2++
            break;
        }
    }
    if(count1 > 0 || count2 >0){
        return false
    }else{
        return true
    }
}
//判断两段地址是不是有交叉
function ipv6AddrCross(ipv6AddrS1,ipv6AddrE1,ipv6AddrS2,ipv6AddrE2){
    // IP1:A-B     IP2:C-D     B大于等于C && A小于等于D 算是交叉
    var ipv6AddrStart1 = ipv6AddrS1.split(':') //A
    var ipv6AddrEnd1 = ipv6AddrE1.split(':') //B
    var ipv6AddrStart2 = ipv6AddrS2.split(':') //C
    var ipv6AddrEnd2 = ipv6AddrE2.split(':') //D
    var count1 = 0
    var count2 = 0
    if(ipv6AddrStart1 == ipv6AddrEnd2){
        count1++
    }else{
        for(var i = 0;i<ipv6AddrStart1.length ;i++){
            if(parseInt(ipv6AddrStart1[i], 16) > parseInt(ipv6AddrEnd2[i], 16)){
                break;
            }else if(parseInt(ipv6AddrStart1[i], 16) < parseInt(ipv6AddrEnd2[i], 16)){
                count1++
                break;
            }
        }
    }
    if(ipv6AddrStart2 == ipv6AddrEnd1){
        count2++
    }else{
        for(var i = 0;i<ipv6AddrStart2.length ;i++){
            if(parseInt(ipv6AddrEnd1[i], 16) < parseInt(ipv6AddrStart2[i], 16)){
                break;
            }else if(parseInt(ipv6AddrEnd1[i], 16) > parseInt(ipv6AddrStart2[i], 16)){
                count2++;
                break
            }
        }
    }
    if(count1 > 0 && count2 > 0){
        return true
    }else{
        return false
    }
}
//loading
function loading() {
    var loadHtml = "<div class='loading1' style='display:none'></div><div style='display:none' class='loadingcnt'><div><span>正在分配中....</span></div></div>"
    $("body").append(loadHtml);
    var dHeight = $(document).height();
    var dWidth = $(document).width();
    $(".loading1").css({
        "height": dHeight,
        "width": dWidth,
        "color": '#fff',
    })
    $('.loading1').show();
    $('.loadingcnt').show();
}
function loadinghid() {
    $('.loading1').hide();
    $('.loadingcnt').hide();
    $('.loading1').remove();
    $('.loadingcnt').remove();

}
//批量分配的进度条提示
var myTimeOut ;
function start(){
    $('#prog').show()
    $('#startTip').show()
    $('#endTip').hide()
    $('#bottomBtn .btnItem').attr("disabled", true)
    $('#bottomBtn .btnItem').css({'background-color' : '#999'});
    var value = $('#prog').progressbar('getValue');
    if (value < 100){
        value += Math.floor(Math.random() * 10);
        $('#prog').progressbar('setValue', value);
        $(".progressbar-value .progressbar-text").css("background-color","#53CA22");
        myTimeOut = setTimeout(arguments.callee, 200);
    }
};
function end(){
    clearTimeout(myTimeOut);
    $('#prog').hide()
    $('#startTip').hide()
    $('#endTip').show()
    $('#bottomBtn .btnItem').attr("disabled", false)
    $('#bottomBtn .btnItem').css({'background-color' : '#409CFC'});
    $('#p').progressbar({ 
        value: 0 ,//初始化状态为0
    });
};