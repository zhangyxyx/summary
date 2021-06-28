$(function(){
    //url参数处理
    var urlObj = new UrlSearch();
    InetnumID = urlObj.InetnumID
    IpTypeName = urlObj.IpTypeName
    IpTypeCode = urlObj.IpTypeCode
    getOneIpTypeScheme(IpTypeCode);
    ipv6TableList=[{InetnumID:InetnumID}]
   
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
//bathPath = "";//环境上需要注释掉
var userName = jQuery.ITE.getLoginName('loginName');//登录用户
var InetnumID = ''
var IpTypeName = ''
var IpTypeCode = ''
var schemelist= []
var ipv6TableList= []

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
            console.log(schemelist)
            if(schemelist.length == 0){
                $.messager.alert('提示','未查到对应的编码方案!','error');
            }
            loadIpv6ListTable()
            var content = loadCodePlanContent();
            $(".relatedTablePanel .planItemBox").append(content)
            iniData()
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
    for(var i = 0;i < schemelist.length;i++){
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
                        for(var k = 0;k < labelCodeList.length;k++){
                            if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == labelCodeList[k].LableCodeName)){
								arr.push(labelCodeList[k].HexadecimalCode)
                                schemelist[i].HexadecimalCode =  arr.join(',')
                            }
                            if(schemelist[i].LableCodeName==undefined){
                                schemelist[i].HexadecimalCode = ''
                            }
                        }
                        // console.log(schemelist)
                        // loadLabelCodeTable(schemelist);                    
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
			}
			else{
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
                                if(schemelist[i].LableCodeName==undefined){
                                    schemelist[i].HexadecimalCode = ''
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
				else{//区县
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
                                    schemelist[i].HexadecimalCode =  arr.join(',')
                                }
                                if(schemelist[i].LableCodeName==undefined){
                                    schemelist[i].HexadecimalCode = ''
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

//初始化表格
function loadIpv6ListTable(){
    /*定义表格的表头*/
    var columnsData=[[
        {field:'InetnumID', title: 'IP地址段',align:'center',width:130},
        {field:'IPV6Plan',  title: '编码方案(1-128位)',align:'center',width:170,
        formatter:function(value,row,index){
            return '<div class="planItemBox" onclick="ipv6DetailList()"></div>'
        }}
    ]];
    var tableId="codePlanDataList";
    var tableH='auto';
    var opt={
        columnsData:columnsData,
        data:ipv6TableList,
        tableH:tableH,
        NofilterRow:true,
        tableOpt:{
            pagination:false//分页
        }
    };
    relatedTable(tableId,opt);
    // setTimeout(() => {
    //     if(ipv6TableList.length == 0){
    //         $(".ipv6ListTablePanel .noData").show();
    //     }else{
    //         $(".ipv6ListTablePanel .noData").hide();
    //     }
    // }, 200);
}
//编码方案内容
function loadCodePlanContent(){
    $(".relatedTablePanel .planItemBox").html("");//清空
    var len = 0;
    var content = '';
    var itemWidth = "itemWidth"+schemelist.length;//宽度均分
    for(var i = 0;i < schemelist.length;i++){
        if(schemelist[i].LableCodeName != undefined && schemelist[i].LableCodeName != ''){
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'">'+schemelist[i].LableCodeName.substr(0, 1)+'</div>'
        }else{
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'">'+schemelist[i].LableName.substr(0, 1)+'</div>'
        }        
        
        len += Number(schemelist[i].BitLength);
    }
    spaceLen = 64 - len;
    if(schemelist.length != 0){
        content += '<div class="schemeItem subnetSpace">子</div>';
        content += '<div class="schemeItem interfaceAddr">接</div>';
    }
    return content;
}

//详细编码方案内容
function loadCodePlanContentDeatail(){
    $(".relateContent .planItemBox").html("");//清空
    var len = 0;
    var content = '';
    var itemWidth = "itemWidth"+schemelist.length;//宽度均分
    for(var i = 0;i < schemelist.length;i++){
        if(schemelist[i].LableCodeName != undefined && schemelist[i].LableCodeName != ''){
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

//详细编码方案内容对应位置编码
function loadCodePlanContentIPV6(){
    $(".relateContent .planItemBoxDetail").html("");//清空
    var len = 0;
    var content = '';
    var itemWidth = "itemWidth"+schemelist.length;//宽度均分
    for(var i = 0;i < schemelist.length;i++){
        content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'">'+schemelist[i].HexadecimalCode+'</div>'
        len += Number(schemelist[i].BitLength);
    }
    spaceLen = 64 - len;
    var subnetSpace ='';
    for(var i = 0; i<spaceLen/4 ;i++ ){
        subnetSpace+='0'
    }
    if(schemelist.length != 0){
        content += '<div class="schemeItem subnetSpace">'+formattedNumber(subnetSpace) +'</div>';
        content += '<div class="schemeItem interfaceAddr">:0000:0000:0000:0000</div>';
    }
    return content;
}
// 点击编码方案弹窗
function ipv6DetailList(){
    var layer = layui.layer;
    layer.open({
        type: 1, 
        title:['IPv6地址与编码方案关系图', 'text-align: center;'],
        area: ['80%', '240px'],
        offset: '150px',
        content: initLayerContent(),
        cancel: function(index, layero){ 
           
        }
    });
    var content = loadCodePlanContentDeatail();
    $(".relateContent .planItemBox").append(content)
    var content1 = loadCodePlanContentIPV6();
    $(".relateContent .planItemBoxDetail").append(content1)
}

// IPv6地址与编码方案关系图弹出层内容
function initLayerContent(){
    var startIPv6Addr = ipv6AddrFormat(InetnumID,'start');
    var endIPv6Addr = ipv6AddrFormat(InetnumID,'end');
    //动态生成弹出层元素
    let content = '';
    content += ' <div class="relateContent">';
    content += '<div class="relateContentTop">';
    content += '<div class="ipv6InfoBox"><span>IPv6地址：</span><span class="IPv6Addr">'+InetnumID+'</span><span>地址类型：</span><span class="IPv6AddrType">'+IpTypeName+'</span></div>'
    content += '<div class="ipv6InfoBox"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="fullyCoded">'+startIPv6Addr + " - " + endIPv6Addr+'</span></div>';
    content += '</div>';
    content += '<div class="conTitle">IPV6地址与编码方案映射关系</div>';
    content += '<div class="planItemBox"></div>';
    content += '<div class="planItemBoxDetail"></div>';
    content += '</div>';
    return content;
}
//全编码格式
function ipv6AddrFormat(ipv6Addr,attr){
    var befordAddr = ipv6Addr.split("::")[0];
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
    //补全
    var len = befordAddrArr.length;
    for(j = len+1;j <= 8 ;j++){
        if(attr == "start"){
            befordAddrArr.push("0000");
        }else{
            befordAddrArr.push("FFFF");
        }
    }
    var addrFormat = befordAddrArr.join(",");
    addrFormat = addrFormat.replace(/[,]/g, ":");
    return addrFormat
}
//num位0，每四位加：
function formattedNumber(num) {
    var num = (num || 0).toString();
    var result = '';
    while (num.length > 4) {
        result = ':' + num.slice(-4) + result;
        num = num.slice(0, num.length - 4);
    }
    if (num) { result = num + result; }
    return result;
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