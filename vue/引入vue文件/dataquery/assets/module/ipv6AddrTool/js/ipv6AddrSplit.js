$(function(){
    initSpiltBtnEvent();
	initIpv6AddrInputBlurEvent();
	initPrefixLenInputBlurEvent();
	initAddrSplitStartInputBlurEvent();
	initAddrMadeNumInputBlurEvent();
	initExportBtnEvent()
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
var len = 0;//编码方案长度
var schemelist = '';//编码方案数据
var ipv6AddrArr = [];//拆分后的数据
//获取v6地址类型
function getV6IpTypeList(){
    let params = {
        userName: userName,
        nodeCode: '',
        ipType: '',
        authType: ''
    }
    $.ajax({
        url:encodeURI(bathPath+'/api/ipaddr/GetIPTypeV6List'),
        type:'post',
        cache:false,
        data:JSON.stringify(params),
        dataType:'json',
        contentType:"application/json",
        success:function(obj){     
            let ipTypeList = obj.data; 
            var len = $(".length").width()                        
            $("#ipTypeList").combotree({
                idField:'IptypeCode',
                textField:'IptypeName',
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

//拆分按钮点击事件初始化
function initSpiltBtnEvent(){
    $("#splitBtn").click(function(){
		var ipv6Addr = $("#ipv6Addr").val();
		var prefixLen = $("#prefixLen").val();
		var addrSplitStart = $("#addrSplitStart").val();
		var addrMadeNum = $("#addrMadeNum").val();
        if(ipv6Addr == ''){
            $.messager.alert('提示','请输入IPv6地址!','warning');
            return;
		}
		if(prefixLen == ''){
            $.messager.alert('提示','请输入拆分后IPv6地址前缀长度!','warning');
            return;
		}
		var ipv6AddrPrefixLen = Number($("#ipv6Addr").val().split("/")[1]);
		if(prefixLen < ipv6AddrPrefixLen || prefixLen > (ipv6AddrPrefixLen+8)){
			$.messager.alert('提示','前缀长度需要大于等于'+ipv6AddrPrefixLen+',小于等于'+(ipv6AddrPrefixLen+8),'warning');
            return;
		}
		if(addrSplitStart == ''){
            $.messager.alert('提示','请输入从第几个开始拆分地址!','warning');
            return;
		}
		if(addrMadeNum == ''){
            $.messager.alert('提示','请输入生成地址个数!','warning');
            return;
		}
		showloading(true)
		//调用地址拆分接口
		var parmas = {
			IPv6Addr:ipv6Addr.toUpperCase(),
			PrefixLen:prefixLen,
			StartLoc:addrSplitStart,
			AddrNum:addrMadeNum
		}
		$.ajax({
			url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeUsed/SplitIpv6Addr'),
			type:'POST',
			data:JSON.stringify(parmas),
			dataType:'json',
			contentType: 'application/json;chartset=UTF-8',
			beforeSend: function () {

			},
			success:function(obj){
				showloading(false)
				$(".splitResultPanel").removeClass("hidden");
				$(".addrItemBox").html('');
				ipv6AddrArr = obj.data;
				var content = '';
				var count = ipv6AddrArr.length > 20?20:ipv6AddrArr.length;
				for(var i = 0;i < count;i ++){
					content += '<div class= "addrItem">'+ipv6AddrArr[i].IPv6Inetnum+'</div>';
				}
				$(".addrItemBox").append(content);
				$(".addrMadeNumText").html(addrMadeNum);
			},
			error:function(error){
				showloading(false)
				$.messager.alert('提示','接口调用失败!','error');
			},
			complete:function(){
			}
		});
    })
}

function showloading(t) {
	if (t) {//如果是true则显示loading
		loading = layer.load(1, {
			shade: [0.4, '#ccc'],  //0.5透明度的灰色背景
			content:'正在拆分中',
			success: function (layero) {
				layero.find('.layui-layer-content').css({
					'padding-top': '39px',
					'width': '60px'
				});
			}
		});
	} else {//如果是false则关闭loading
		layer.closeAll('loading');
	}
}

function initExportBtnEvent(){
	$("#exportBtn").click(function(){
		var sheetData = {};
        var refScope = '';
        var sheetName = 'IPv6拆分地址';
        var fileName = 'IPv6拆分地址';
        sheetData.SheetNames = [sheetName];
        sheetData.Sheets = {};
        sheetData.Sheets[sheetName] = {};
        //合并单元格
        var mergeData = [];
		var exportHead = [
			{
				title:'IPv6地址'
			}
		]

		var columnMapping={
            "0":"A1",
            "1":"B8",
            "2":"C8",
            "3":"D8",
            "4":"E8",
            "5":"F8",
            "6":"G8",
            "7":"H8",
            "8":"I8",
            "9":"J8"
        };
        var letterMapping={
            "0":"A",
            "1":"B",
            "2":"C",
            "3":"D",
            "4":"E",
            "5":"F",
            "6":"G",
            "7":"H",
            "8":"I",
            "9":"J"
		};
	
        /*表格头*/
        $.each(exportHead,function(index,item){
            sheetData.Sheets[sheetName][columnMapping[index]] = setHeader(item.title);
        });

        /*表格体*/
        var rows = 2;//第一行数据所在位置
        ipv6AddrArr.forEach(function(item,index) {
            for(var i=0;i<exportHead.length;i++){
                sheetData.Sheets[sheetName][letterMapping[i] + rows] = setCell(item.IPv6Inetnum);
            }
            rows++;
        });
        sheetData.Sheets[sheetName]['!merges'] = mergeData;
        refScope ='A1:'+letterMapping[exportHead.length-1] +(rows);
        sheetData.Sheets[sheetName]['!ref'] = refScope;
        sheetData.Sheets[sheetName]['!cols'] = [
            { wpx: 300 },
        ];
        exportExcel(fileName, sheetData);
	})
}

//地址失去焦点
function initIpv6AddrInputBlurEvent(){
    $("#ipv6Addr").blur(function(){
		var ipv6Addr = $("#ipv6Addr").val();
		if(ipv6Addr==''){
            return;
        }
        //校验v6地址是否合法
        checkInetnum(ipv6Addr);
    })
}

//前缀长度输入框失去焦点
function initPrefixLenInputBlurEvent(){
    $("#prefixLen").blur(function(){
		var prefixLen = Number($("#prefixLen").val());
		var ipv6AddrPrefixLen = Number($("#ipv6Addr").val().split("/")[1]);
		if(prefixLen == ''){
			return;
		}
		if(!(/(^[1-9]\d*$)/.test(prefixLen))){
			$.messager.alert('提示','只能输入正整数!','warning');
			return;
		}
		if(prefixLen < ipv6AddrPrefixLen || prefixLen > (ipv6AddrPrefixLen+8)){
			$.messager.alert('提示','前缀长度需要大于等于'+ipv6AddrPrefixLen+',小于等于'+(ipv6AddrPrefixLen+8),'warning');
            return;
		}
		var num = prefixLen - ipv6AddrPrefixLen;
		var addrSplitNum = Math.pow(2,num);
		$(".addrSplitNum").html(addrSplitNum);
        
    })
}

//开始拆分输入框失去焦点
function initAddrSplitStartInputBlurEvent(){
    $("#addrSplitStart").blur(function(){
		var addrSplitStart = Number($("#addrSplitStart").val());
		var addrSplitNum = Number($(".addrSplitNum").html());
		if(addrSplitStart == ''){
			return;
		}
		if(!(/(^[1-9]\d*$)/.test(addrSplitStart))){
			$.messager.alert('提示','只能输入正整数!','warning');
			return;
		}
		if(addrSplitStart > addrSplitNum){
			$.messager.alert('提示','开始拆分位置需要小于等于'+addrSplitNum+'','warning');
            return;
		}
        
    })
}

//生成地址个数输入框失去焦点
function initAddrMadeNumInputBlurEvent(){
    $("#addrMadeNum").blur(function(){
		var addrMadeNum = Number($("#addrMadeNum").val());
		var addrSplitNum = Number($(".addrSplitNum").html());
		var addrSplitStart = Number($("#addrSplitStart").val());
		if(addrMadeNum == ''){
			return;
		}
		if(!(/(^[1-9]\d*$)/.test(addrMadeNum))){
			$.messager.alert('提示','只能输入正整数!','warning');
			return;
		}
		if(addrSplitStart + addrMadeNum -1 > addrSplitNum){
			$.messager.alert('提示','生成地址个数大于可拆分的地址个数，请重新输入','warning');
            return;
		}
        
    })
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