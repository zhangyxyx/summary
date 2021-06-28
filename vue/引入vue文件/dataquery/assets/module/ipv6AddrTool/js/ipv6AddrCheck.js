$(function(){
    getV6IpTypeList();
    initCheckBtnEvent();
    initInputBlurEvent();
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
var len = 0;//编码方案长度
var schemelist = '';//编码方案数据

//Combotree根据选中的值展开所有父节点
function expandParent(treeObj, node){  
    var parentNode = treeObj.tree("getParent", node.target);  
    if(parentNode != null && parentNode != "undefined"){  
        treeObj.tree("expand", parentNode.target);  
        expandParent(treeObj, parentNode);  
    }  
};  
//获取v6地址类型
function getV6IpTypeList(){
    let params = {
        userName: userName,
        nodeCode: '',
        ipType: '',
        authType: ''
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
                    
                }
            });
            
        }
    });
}

//校验按钮点击事件初始化
function initCheckBtnEvent(){
    $("#checkBtn").click(function(){
        var ipv6Addr = $("#ipv6Addr").val().toLocaleUpperCase();
        if(ipv6Addr == ''){
            $.messager.alert('提示','请输入IPv6地址!','warning');
            return;
        }
         //校验IPv6地址前缀长度
        var prefixLen = Number($(".prefixLen").html());
        var difference = len - prefixLen;
        // console.log(difference)
        var count = 1;
        var count2 = 0;
        $("#errorTip").hide()
        if(prefixLen < len){
            for(var i=schemelist.length-1; i>=0; i--){
                //等于一个标识长度
                if(difference == schemelist[i].BitLength){
                    count ++;
                    //则该标识的编码名称、编码无需处理，直接显示为空
                    schemelist[i].LableCodeName = '';
                    schemelist[i].HexadecimalCode1 = '';
                    loadLabelCodeTable();
                    break;
                }
            }
            for(var i=schemelist.length-1; i>=0; i--){
                 //多个标识的长度和(有点问题)
                 if(difference != 0){
                    // count2 = count2 - schemelist[schemelist.length-1-i].BitLength;
                    for(var j=schemelist.length-1; j>=0; j--){
                        if(difference == schemelist[i].BitLength + schemelist[j].BitLength){
                            count2++
                        }
                    }
                }else{
                    break;
                }
            }
            if(count != 2 && count2 == 0 && difference >= 0){
                // schemelist.length = 0
                // $(".planItemBox").html(" ")
                loadLabelCodeTable()
                $("#errorTip").show()
                // $.messager.alert('提示','IPv6地址的前缀长度不合法!','warning');
            }
        }
    })
}

//地址失去焦点
function initInputBlurEvent(){
    $("#ipv6Addr").blur(function(){
        var ipv6Addr = $("#ipv6Addr").val().toLocaleUpperCase();
        if(ipv6Addr==''){
            return;
        }
        //校验v6地址是否合法
        var flag = checkInetnum(ipv6Addr);
        if(!flag){
            return;
        }
        var startIPv6Addr = ipv6AddrFormat(ipv6Addr,'start');
        var endIPv6Addr = ipv6AddrFormat(ipv6Addr,'end');
        $(".fullyCoded").html(startIPv6Addr + " - " + endIPv6Addr)
        $(".prefixLen").html(ipv6Addr.split("/")[1])
        if(startIPv6Addr.slice(0,6) != "240E:0"){
            $.messager.alert('提示','非中国电信集团地址!','warning');
            return;
        }
        //新疆移动
        // if(startIPv6Addr.slice(0,6) != "2409:8"){
        //     $.messager.alert('提示','非中国移动集团地址!','warning');
        //     return;
        // }
       
        //查询编码对应的地址类型
        $.ajax({
            url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeUsed/GetIpTypeCodeByHex?HexadecimalCode='+startIPv6Addr.slice(6,7)),
            type:'POST',
            data:{},
            dataType:'json',
            contentType: 'application/json;chartset=UTF-8',
            beforeSend: function () {
               
            },
            success:function(obj){
                var IpTypeCode = obj.data;
                if(IpTypeCode == "" || IpTypeCode == undefined){
                    $.messager.alert('提示','IPv6地址错误，无法匹配到地址类型!','warning');
                    $("#ipTypeList").combotree('setValue', '')
                    $(".planItemBox").html("");
                    schemelist=[]
                    loadLabelCodeTable()
                    //按钮禁用
                    $("#checkBtn").attr("disabled", true);
                    $("#checkBtn").addClass("btnDisable");
                }else{
                    $("#ipTypeList").combotree('setValue', IpTypeCode);

                    var comboObj = $("#ipTypeList");  
                    var treeObj = comboObj.combotree("tree");  
                    var nodesChecked = treeObj.tree("getSelected");  
                    expandParent(treeObj, nodesChecked); 

                    $("#checkBtn").attr("disabled", false);
                    $("#checkBtn").removeClass("btnDisable");
                    getOneIpTypeScheme(IpTypeCode)
                }
            },
            error:function(error){
                $.messager.alert('提示','接口调用失败!','error');
            },
            complete:function(){
            }
        });
    })
}

//全编码格式调接口
function ipv6AddrFormat(ipv6Addr,attr){
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
            //切割IPV6地址对应位置编码，塞进数组
            var ipv6Addr = $("#ipv6Addr").val().toLocaleUpperCase();
            var startIPv6Addr = ipv6AddrFormat(ipv6Addr,'start');
            var endIPv6Addr = ipv6AddrFormat(ipv6Addr,'end');
            var start = 0
            var end = 0
            var length = 0
            var spaceLength = 0
            var schemelistLength = schemelist.length
            var startSplit= ''
            var endSplit= ''
            for(var i =0;i< schemelist.length; i++){
                if(startIPv6Addr.substring(start,(start + schemelist[i].BitLength/4+1)).indexOf(":") != -1){//当截取中有：多截取一位
                    end = start + schemelist[i].BitLength/4+1
                    if(i == 0){
                         startSplit= startIPv6Addr.substring(start,end)
                         endSplit= endIPv6Addr.substring(start,end)
                    }else{
                        startSplit= startIPv6Addr.substring(start,end).split(':').join("")
                        endSplit= endIPv6Addr.substring(start,end).split(':').join("")
                    }
                    start += (schemelist[i].BitLength/4)+1
                }else{//当截取中没有：
                    end = start + schemelist[i].BitLength/4
                    if(i == 0){
                        startSplit= startIPv6Addr.substring(start,end)
                        endSplit= startIPv6Addr.substring(start,end)
                    }else{
                        startSplit= startIPv6Addr.substring(start,end).split(':').join("")
                        endSplit= endIPv6Addr.substring(start,end).split(':').join("")
                    }
                    start += (schemelist[i].BitLength/4)
                } 
                // 判断起始和终点地址截取是否一样
                if(startSplit == endSplit){
                    schemelist[i].HexadecimalCodeSplit = startSplit
                }else{
                    schemelist[i].HexadecimalCodeSplit = startSplit + "," + endSplit
                }  
                length += Number(schemelist[i].BitLength); 
            }
            //子网空间和接口地址
            spaceLength = 64 - length;           
            var arr =[]
            var j =1
            for( var i=startIPv6Addr.split('').length-1;i>=0;i--){
                if(i>(19-spaceLength/4-j) && i<19 ){
                    arr.push(startIPv6Addr.split('')[i])
                    if(startIPv6Addr.split('')[i] == ':'){
                        j++
                    }
                }
            }
            var arr1 =[]
            var k =1
            for( var i=endIPv6Addr.split('').length-1;i>=0;i--){
                if(i>(19-spaceLength/4-k) && i<19 ){
                    arr1.push(endIPv6Addr.split('')[i])
                    if(endIPv6Addr.split('')[i] == ':'){
                        k++
                    }
                }
            }
            var arr2 =[]
            var g =1
            for( var i=startIPv6Addr.split('').length-1;i>=0;i--){
                if(i>=20){
                    arr2.push(startIPv6Addr.split('')[i])
                    if(startIPv6Addr.split('')[i] == ':'){
                        g++
                    }
                }
            }
            var arr3 =[]
            var f =1
            for( var i=endIPv6Addr.split('').length-1;i>=0;i--){
                if(i>=20){
                    arr3.push(endIPv6Addr.split('')[i])
                    if(endIPv6Addr.split('')[i] == ':'){
                        f++
                    }
                }
            }
            var CodeSplit = ''
            var CodeSplit1 = ''
            if(arr.reverse().join('') == arr1.reverse().join('')){
                CodeSplit =  arr.join('')
            }else{
                CodeSplit = arr.join('')+','+arr1.join('')
            }
            if(arr2.reverse().join('') == arr3.reverse().join('')){
                CodeSplit1 =  arr2.join('')
            }else{
                CodeSplit1 = arr2.join('')+','+arr3.join('')
            }
            
            schemelist.push({
                'BitLength': spaceLength,
                'CodeTableName': "",
                'HexadecimalCode': "",
                'HexadecimalCode1': "",
                'HexadecimalCodeSplit': CodeSplit,
                'Ipv6Position': (length+1)+'-'+64,
                'LableCodeName': "",
                'LableName': "子网空间",
            },{
                'BitLength': 64,
                'CodeTableName': "",
                'HexadecimalCode': "",
                'HexadecimalCode1': "",
                'HexadecimalCodeSplit':  CodeSplit1,
                'Ipv6Position': '65-128',
                'LableCodeName': "",
                'LableName': "接口地址", 
            })
            // 加载页面
            var content = loadCodePlanContent();
            $(".planItemBox").append(content)
            iniData()
            InPlanRange()
             $("#checkBtn").click()
             getAllIPv6()
            loadLabelCodeTable();
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//初始化数据
function iniData(){
    // console.log(schemelist)
    for(var i = 0;i < schemelist.length-2;i++){
        // if(schemelist[i].del == ""){//划分的
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
                        var labelCodeList = obj.data;
                        var arr =[]
                        if(labelCodeList){
                            for(var k = 0;k < labelCodeList.length;k++){
                                if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == labelCodeList[k].LableCodeName)){
                                    arr.push(labelCodeList[k].HexadecimalCode)
                                    schemelist[i].HexadecimalCode1 =  arr.join(',')
                                }
                                if(schemelist[i].LableCodeName==undefined){
                                    schemelist[i].HexadecimalCode1 = ''
                                }
                            }
                            loadLabelCodeTable(schemelist); 
                        }                   
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
			}
			else{
                if(schemelist[i].LableName == "省份标识" || schemelist[i].LableName == "省与专业公司标识"){//省份
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
                                    schemelist[i].HexadecimalCode1 =  arr.join(',')
                                }
                                if(schemelist[i].LableCodeName==undefined){
                                    schemelist[i].HexadecimalCode1 = ''
                                }
                            }
                            loadLabelCodeTable(schemelist);
                        },
                        error:function(error){
                            $.messager.alert('提示','接口调用失败!','error');
                        },
                        complete:function(){
                        }
                    });
				}
				else if(schemelist[i].LableName == "区县标识"){//区县
                    var params = {
                        AreaName:'',
                        pagesize:999,
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
                            var arr = []
                            for(var k = 0;k < labelCodeList.length;k++){
                                if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == (labelCodeList[k].FatherAreaName+'-'+labelCodeList[k].AreaName))){
                                    arr.push(labelCodeList[k].CountyHexadecimal)
                                    schemelist[i].HexadecimalCode1 =  arr.join(',')
                                }
                                if(schemelist[i].LableCodeName==undefined){
                                    schemelist[i].HexadecimalCode1 = ''
                                }
                            }
                            loadLabelCodeTable(schemelist);
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

// 判断是否在标识的编码范围内
function InPlanRange(){
    for(var i = 0;i < schemelist.length-2;i++){
        if(schemelist[i].CodeTableName == "IPv6LableCode"){//通用
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/GetLableCodeNameList?LableId='+schemelist[i].LableId),
                type:'POST',
                data:JSON.stringify({
                    LableId:schemelist[i].LableId
                }),
                async: false,
                dataType:'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function () {
            
                },
                success:function(obj){ 
                    var count = 0
                    for(var j =0; j<obj.data;j++){
                        if(schemelist[i].LableCodeName == obj.data[j].LableCodeName){
                            count ++
                        }
                    }
                    if(count > 0){
                        schemelist[i].flag = 1
                    }else{
                        schemelist[i].flag = 0
                    }
                     var params = {
                        LableId:schemelist[i].LableId,
                        LableCodeName:schemelist[i].LableCodeName
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
                             var list = obj.data 
                             var count1 = 0     
                             for(var j =0;j<list.length;j++){
                                 if(list[j].hexadecimalCode == schemelist[i].HexadecimalCodeSplit){
                                    count1++
                                 }
                             }  
                             if(count1 > 0){
                                schemelist[i].flag = 1
                            }else{
                                schemelist[i].flag = 0
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
                            var AreaCodeList =  obj.data
                            var AreaCode = ''
                            for(var j = 0; j<AreaCodeList.length;j++){
                                if(schemelist[i].LableCodeName == AreaCodeList[j].AreaName){
                                    AreaCode = AreaCodeList[j].AreaCode
                                }
                            }
                            $.ajax({
                                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetOneAreaInfo'),
                                type:'POST',
                                data:JSON.stringify({
                                    AreaCode:AreaCode
                                }),
                                async: false,
                                dataType:'json',
                                contentType: 'application/json;chartset=UTF-8',
                                beforeSend: function () {
                            
                                },
                                success:function(obj){
                                    var LevelFlag = obj.data[0].LevelFlag
                                },
                                error:function(error){
                                    $.messager.alert('提示','接口调用失败!','error');
                                },
                                complete:function(){
                                }
                            });
                            $.ajax({
                                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetOneCountyCodeList'),
                                type:'POST',
                                data:JSON.stringify({
                                    AreaCode:AreaCode,
                                    AreaCodeList:''
                                }),
                                async: false,
                                dataType:'json',
                                contentType: 'application/json;chartset=UTF-8',
                                beforeSend: function () {
                            
                                },
                                success:function(obj){
                                    var list = obj.data      
                                     for(var j =0;j<list.length;j++){
                                         if(list[j].CountyHexadecimal == schemelist[i].HexadecimalCodeSplit){
                                            schemelist[i].flag = 1
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
                }else  if(schemelist[i].LableName == "区县标识"){//区县
                    var params = {
                        AreaName:'',
                        pagesize:999,
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
                            var AreaCodeList =  obj.data.rows
                            var AreaCode = ''
                            for(var j = 0; j<AreaCodeList.length;j++){
                                if(schemelist[i].LableCodeName == (AreaCodeList[j].FatherAreaName+'-'+AreaCodeList[j].AreaName)){
                                    AreaCode = AreaCodeList[j].AreaCode
                                }
                            }
                            $.ajax({
                                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetOneCountyCodeList'),
                                type:'POST',
                                data:JSON.stringify({
                                    AreaCode:AreaCode,
                                    AreaCodeList:''
                                }),
                                async: false,
                                dataType:'json',
                                contentType: 'application/json;chartset=UTF-8',
                                beforeSend: function () {
                            
                                },
                                success:function(obj){
                                    var list = obj.data      
                                    for(var j =0;j<list.length;j++){
                                        if(list[j].CountyHexadecimal == schemelist[i].HexadecimalCodeSplit){
                                           schemelist[i].flag = 1
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
        }
    }
} 

//编码方案内容
function loadCodePlanContent(){
    $(".planItemBox").html("");//清空
    len = 0;
    var content = '';
    var itemWidth = "itemWidth"+(schemelist.length-2);//宽度均分
    for(var i = 0;i < schemelist.length-2;i++){
        if(schemelist[i].LableCodeName != "" && schemelist[i].LableCodeName != undefined){
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'">'+schemelist[i].LableCodeName+'（'+schemelist[i].BitLength+'）'+'</div>'
        }else{
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'">'+schemelist[i].LableName+'（'+schemelist[i].BitLength+'）'+'</div>'
        }        
        
        len += Number(schemelist[i].BitLength);
    }
    spaceLen = 64 - len;
    if(schemelist.length != 0){
        content += '<div class="schemeItem subnetSpace">子网空间（'+spaceLen+'）</div>';
        content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
    }
    return content;
}

//加载标识表格数据
function loadLabelCodeTable(){
    var tableData = schemelist
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData=[[
        {field:'LableName', title: '标识名称',align:'center',width:100},
		{field:'LableCodeName',  title: '编码名称',align:'center',width:100},
		{field:'HexadecimalCode1', title: '编码',align:'center',width:100},
        {field:'HexadecimalCodeSplit', title: 'IPV6地址对应位置编码',align:'center',width:100,
        formatter:function(value,row,index){
            if(row.HexadecimalCodeSplit.indexOf(',') != -1){
                return '<p>'+row.HexadecimalCodeSplit.split(',')[0]+'</p>'+'<p>'+row.HexadecimalCodeSplit.split(',')[1]+'</p>'
            }else{
                return row.HexadecimalCodeSplit
            }
         }},
        {field:'BitLength', title: '长度(bit)',align:'center',width:100},
        {field:'Ipv6Position', title: '在128位地址中的地址',align:'center',width:100},
        {field:'operate',title: '是否正确',align:'center',width:50,
        formatter:function(value,row,index){
            if(row.HexadecimalCode1 == ''){
                return '正确'
            }else{
                if(row.flag == '1'){
                    return '正确'
                }else{
                 return '<span style="color :red;">错误</span>'
                }
            }
        }}
    ]];
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
		return false;
    }

    if( prefix == "" ){
        //alert("地址前缀长度不能为空!");  
        $.messager.alert('提示',"地址前缀长度不能为空!",'warning'); 
		return false;
    }

	//校验IPv6地址
	if( IPV6Formatting(ipv6addr) == "Error" ){
        //alert(ipaddr+"地址格式非法，请重新填写!");   
        $.messager.alert('提示',ipaddr+"地址格式非法，请重新填写!",'warning'); 
		return false;
    }

    // if(prefix < addrPrefixLen || prefix > 128){
    //     $.messager.alert('提示','IPv6的地址前缀长度不符合规范，应大于等于'+addrPrefixLen+"，小于等于128",'warning');
    //     return false;
    // }
	//校验地址前缀
	if( prefix != "" ){
		if( !isNumber(prefix,"int") ){
            //alert(prefix+"地址前缀应填写数字!");   
            $.messager.alert('提示',prefix+"地址前缀应填写数字!",'warning'); 
			return false;
		}
		//地址前缀应为1-128的数字
		if( parseInt(prefix) > 128 || parseInt(prefix) < 1 ){
            //alert("地址前缀应为1-128间的数字!");   
            $.messager.alert('提示',"地址前缀应为1-128间的数字!",'warning'); 
			return false;
		}
	}
	return true;
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
//编码方案为空的时候调用
function getAllIPv6(){
    var CountyCodeMngList = []
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
            CountyCodeMngList = obj.data.rows
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
    var ipv6Addr = $("#ipv6Addr").val().toLocaleUpperCase();
    var len = 0
    var AreaCode = ''
    for(var i = 0;i < schemelist.length;i++){
        len +=schemelist[i].BitLength
        if(len <= ipv6Addr.split("/")[1]){
            if(schemelist[i].LableCodeName == undefined || schemelist[i].LableCodeName == ''){
                if(schemelist[i].LableName == '区县标识'){
                    for(var j =0;j<CountyCodeMngList.length;j++){
                        if(CountyCodeMngList[j].CountyHexadecimal.indexOf('-') != -1){
                            var CountyHexadecimal1 = CountyCodeMngList[j].CountyHexadecimal.split('-')[0]
                            var CountyHexadecimal2 = CountyCodeMngList[j].CountyHexadecimal.split('-')[0]
                            if(parseInt(CountyHexadecimal1, 16) <= parseInt(schemelist[i].HexadecimalCodeSplit, 16) && parseInt(CountyHexadecimal2, 16) >= parseInt(schemelist[i].HexadecimalCodeSplit, 16)){
                                schemelist[i].LableCodeName = CountyCodeMngList[j].FatherAreaName+'-'+  CountyCodeMngList[j].AreaName
                                schemelist[i].HexadecimalCode1 = CountyCodeMngList[j].CountyHexadecimal
                                AreaCode = CountyCodeMngList[j].AreaCode
                            }
                        }else{
                            if(CountyCodeMngList[j].CountyHexadecimal == schemelist[i].HexadecimalCodeSplit){
                                schemelist[i].LableCodeName = CountyCodeMngList[j].FatherAreaName+'-'+  CountyCodeMngList[j].AreaName
                                schemelist[i].HexadecimalCode1 = CountyCodeMngList[j].CountyHexadecimal
                                AreaCode = CountyCodeMngList[j].AreaCode
                            }
                        }
                        schemelist[i].flag = 1
                        // $.ajax({
                        //     url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetOneCountyCodeList'),
                        //     type:'POST',
                        //     data:JSON.stringify({
                        //         AreaCode:AreaCode,
                        //         AreaCodeList:''
                        //     }),
                        //     async: false,
                        //     dataType:'json',
                        //     contentType: 'application/json;chartset=UTF-8',
                        //     beforeSend: function () {
                        
                        //     },
                        //     success:function(obj){
                        //         var list = obj.data      
                        //         for(var j =0;j<list.length;j++){
                        //             if(list[j].CountyHexadecimal == schemelist[i].HexadecimalCodeSplit){
                        //                schemelist[i].flag = 1
                        //             }
                        //         }   
                        //     },
                        //     error:function(error){
                        //         $.messager.alert('提示','接口调用失败!','error');
                        //     },
                        //     complete:function(){
                        //     }
                        // });
                    }
                }else if(schemelist[i].LableName == '省份标识'){
                
                }else{
                    if(schemelist[i].LableId){
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
                                    for(var j =0; j < obj.data.length;j++){
                                        if(obj.data[j].HexadecimalCode.indexOf('-') != -1){
                                            var HexadecimalCode1 = obj.data[j].HexadecimalCode.split('-')[0]
                                            var HexadecimalCode2 = obj.data[j].HexadecimalCode.split('-')[0]
                                            if(parseInt(HexadecimalCode1, 16) <= parseInt(schemelist[i].HexadecimalCodeSplit, 16) && parseInt(HexadecimalCode2, 16) >= parseInt(schemelist[i].HexadecimalCodeSplit, 16)){
                                                schemelist[i].LableCodeName = obj.data[j].LableCodeName
                                                schemelist[i].HexadecimalCode1 = obj.data[j].HexadecimalCode
                                            }
                                        }else{
                                            if(obj.data[j].HexadecimalCode == schemelist[i].HexadecimalCodeSplit){
                                                schemelist[i].LableCodeName = obj.data[j].LableCodeName
                                                schemelist[i].HexadecimalCode1 = obj.data[j].HexadecimalCode
                                            }
                                        }
                                        schemelist[i].flag = 1
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
                }
            }
        }
    }
    
}