$(function () {
    getNodeList();
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

//获取节点信息
function getNodeList() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/NodeManage/GetNodeList'),
        type: 'post',
        cache: false,
        data: JSON.stringify({ userName: userName, nodeCode: '' }),
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
            let nodeList = obj.data;
            $("#nodeList").combotree({
                idField: 'nodeCode',
                textField: 'nodeName',
                data: nodeList,
                panelHeight: 'auto',//高度自适应
                width: 220,
                multiple: false,
                editable: false,//定义用户是否可以直接往文本域中输入文字
                onLoadSuccess: function () {
                    $("#nodeList").combotree('tree').tree("collapseAll");
                },
                //直接过滤，数据太多时不行，太卡了，放弃
                filter: function (q, row) {
                    return row.text.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function (q, e) {
                        $('#nodeList').combotree('tree').tree('doFilter', q)
                    }
                },
                onSelect: function (row) {//点击节点联动地址类型
                }
            });
            //初始化显示权限节点
            $('#nodeList').combotree('setValue', nodeList[0].nodeCode);
            //页面初始化的时候默认触发汇总查询事件
            $("#queryAll").click();
        }
    });
}

//初始化按钮点击事件
function initBtnClickEvent() {
    $(".btnItem").click(function () {
        //ip地址段不为空时校验
        let Inetnum = $("#inetnumtep").val();
        //获取当前点击的按钮
        let btnType = $(this).val();
        if (btnType == "查询") {
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
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return false;
                    }
                    if ("IPv4" != validIPAddress(IPAddrArr[0]) || "IPv4" != validIPAddress(IPAddrArr[1])) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
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
                        console.log(1111)
                        $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                        return;
                    }
                }
            }
        }
        switch (btnType) {
            case "查询":
                getBigIplist();
                break;
            case "批量删除":
                deleteList();
                break;
            case "新增":
                let OriNodeCode = $("#nodeList").combotree('getValue')
                let OriNodeName = $("#nodeList").combotree('getText')
                if($("#nodeList").combotree('tree').tree('getSelected').nodeLevel == '1'){
                    window.top.$vm.$openTab({
                        name: '大段地址新增',
                        path: bathPath + '/ipaddrmodule/views/jsp/ipv4BigIpList/ipv4BigIpNew.jsp?OriNodeName=' + OriNodeName+'&OriNodeCode='+OriNodeCode 
                    })
                }else{
                    $.messager.alert('提示', '只有管理组织为根节点才能点击新增操作!', 'warning');
                }
                
                // window.open('views/jsp/ipv4BigIpList/ipv4BigIpNew.jsp?OriNodeName='+OriNodeName+'&OriNodeCode='+OriNodeCode);
                
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
            getBigIplist();
        }
    });
}


//明细查询
function getBigIplist() {
    var beginip = ''
    var endip = ''
    if($("#inetnumtep").val() != ''){
        if(checkInetnum($("#inetnumtep").val()) == 'false'){
            $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
        }else{
            var inetnum = checkInetnum($("#inetnumtep").val())
            beginip =  inetnum.split('-')[0]
            endip =  inetnum.split('-')[1]
        }  
    }  
    let params = {
        nodecode: $("#nodeList").combotree('getValue'),
        BeginApplyDate: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[0]+' 00:00:00',
        EndApplyDate: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[1]+' 23:59:59',
        beginip: dealIpv4FromAll(beginip),
        endip: dealIpv4FromAll(endip),
        scope: 'intersection',
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString()
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv4/Ipv4Bigip/queryBigIplist'),
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
                tableData.forEach(function(item,index){
                    if(item.inetnumsum < 256){

                    }else{
                        $.ajax({
                            url: encodeURI(bathPath + '/ipaddrmodule/SysCommon/ipNumFormatToBCUpt/'+item.inetnumsum.toString()),
                            cache:false, 
                            async:false, 
                            dataType:'json',
                            statusCode:{
                                200:function(data){
                                    if(data.responseText){
                                        item.inetnumsum=data.responseText
                                    }else{
                                        item.inetnumsum=data
                                    }
                                    
                                },
                            }
                        });
                    }
                item.beginip = dealIpv4ToAll( item.beginip)
                item.endip = dealIpv4ToAll( item.endip)
               })
               
            tableDataList = tableData
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

//全编码转成非全编码
function dealIpv4ToAll(ip){
    var ipArr = ip.split('.')
    var ipArrD = []
    ipArr.forEach(function(item,index){
        if( item == '0' || item == '00' || item == '000' || item == '0000'){
            ipArrD.push('0')
        }else{
            ipArrD.push(item.replace(/\b(0+)/gi,""))
        }
    })
    return ipArrD.join('.')
}

//非全编码转成全编码
function dealIpv4FromAll(ip){
    var ipArr = ip.split('.')
    var ipArrD = []
    ipArr.forEach(function(item,index){
        if( item.length == 1){
            ipArrD.push('00'+item)
        }else if( item.length == 2){
            ipArrD.push('0'+item)
        }else{
            ipArrD.push(item)
        }
    })
    return ipArrD.join('.')
}

//加载明细表格数据
function loadDetailTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [[ 
        { field: 'ck', checkbox: true, width: '30' },  //复选框 
        { field: 'nodename', title: '管理组织', align: 'center', width: 140 },
        { field: 'beginip', title: '起始地址', align: 'center', width: 140 },
        { field: 'endip', title: '终止地址', align: 'center', width: 100 },
        { field: 'inetnumsum', title: '地址数', align: 'center', width: 100 },
        { field: 'applydate', title: '导入时间', align: 'center', width: 80 },
        { field: 'applyid', title: '申请单号', align: 'center', width: 80 },
        { field: 'remarks', title: '备注', align: 'center', width: 140 },
    ]];
    var tableId = "dataList";
    var tableH = $(".tablePanel").height();
    var opt = {
        columnsData: columnsData,
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false//分页
        }
    };
    relatedTable(tableId, opt);
}


//删除选中
function deleteList(){
    var selRow = $('#dataList').datagrid('getSelections')
    if(selRow.length == 0){
        $.messager.alert('提示','未选择要删除的地址！','error');
    }else{
        $.messager.confirm('删除', '是否确认删除当前的选中信息?', function(flag){
            if (flag){
                let deleteList = []
                selRow.forEach(function(item,index){
                    deleteList.push({
                        "beginip":dealIpv4FromAll(item.beginip),
                        "endip":dealIpv4FromAll(item.endip),
                        "nodecode":item.nodecode,
                        "remarks":item.remarks,
                        "ipversion":item.ipversion,
                        "applyid":item.applyid,
                    })
                })
                // console.log(deleteList)
                var params = deleteList
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv4/Ipv4Bigip/batchBigIPDel'),
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
                            $.messager.alert('提示','删除成功！','success');
                            getBigIplist();//刷新数据
                        }else if(obj.code == "0001"){
                            var content ='删除失败!<br/>'
                              obj.tip.split(';第').forEach(function(item,index){
                                  if(index != (obj.tip.split(';第').length-1)){
                                      content+=item + ';<br/>第'  
                                  }else{
                                      content+=item
                                  }
                              });
                            $.messager.alert('提示',content,'error').window({ width: 670,left:335,top:200 });
                            getBigIplist();//刷新数据
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

//校验输入的IP地址是合法的ipv4或ipv6
function validIPAddress(IP) {
    //按"."进行分割
    var parts = IP.split(".");
    //IPv4由4个部分组成
    if (parts.length === 4 || parts.length < 4) {
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

//IP转成整型
function ip2int(ip) {
    var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
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

function split(str,sep)
{
	//alert("str"+str);
	if(sep==null||sep=="")
		sep=' ';	
	//alert("2");
	var result=new Array();

	var r=0;
	
	if(sep!=null)
	{			
		var start=0,count=0;

		//alert("3");

		while(start+count<str.length)
		{
			if(sep.indexOf(str.charAt(start+count))==-1)
			{
				//alert("count++:"+str.charAt(start+count));
				count++;
			}
			else
			{				
				if(count==0)
					start++;
				else
				{
					result[r++]=str.substring(start,start+count);
					//alert("str:"+str.substring(start,start+count));
					start+=count;
					count=0;
				}
			}			
		}

		//alert("4");
		if(count!=0)
		{
			result[r++]=str.substring(start,start+count);
		}			
	}
	return result;	
}

function getIpRange(strIpAddr,strBitNumber)
{
    var mask=getMaskIntValue(strBitNumber);
    var minip=ipStrToInt(strIpAddr)&mask;
    var maxip=minip|(mask^0xffffffff);
    return ipIntToStr(minip)+"-"+ipIntToStr(maxip);
}

function getMaskIntValue(bitNumber)
{
    var maskIntValue = 0x80000000;
    if ((bitNumber<=0) || (bitNumber>32)) return 0;
    maskIntValue >>= (bitNumber - 1);
    return maskIntValue ;
}
function ipStrToInt(ipString)
{
    var begin=0;
    var end=0,segValue=0,returnValue=0;
    for(var i=0;i<3;i++)
    {
        end = ipString.indexOf(".",begin);
        if (end==-1) return 0;
        segValue=parseInt(ipString.substring(begin,end));
        if ((segValue<0) || (segValue>255)) return 0;
        returnValue = (returnValue << 8) | segValue ;
        begin = end+1;
    }
    segValue=parseInt(ipString.substring(begin));
    if ((segValue<0) || (segValue>255)) return 0;
    returnValue = (returnValue << 8) | segValue ;
    return returnValue;
}
function ipIntToStr(intIpString)
{
    var retValue="";
    var intValue=0;
    intValue = (intIpString&0xff000000)>>>24
	retValue += intValue ;
    retValue += ".";
    intValue = (intIpString&0x00ff0000)>>>16;
	retValue += intValue ;
    retValue += ".";
    intValue = (intIpString&0x0000ff00)>>>8;
	retValue += intValue ;
    retValue += ".";
    intValue = (intIpString&0x000000ff);
	retValue += intValue ;
    return retValue;
}

//检查IP地址/段的地址是否正确
function checkInetnum(ipaddr)
{
	var result = "";
	var inetnumtmpObj = document.getElementById("inetnumtmp");
	var inetnumObj = document.getElementById("inetnum");
	if( ipaddr.indexOf("-") == -1 && ipaddr.indexOf("/") == -1 )
	{
		//判断单独地址是否正确
		result = checkpartip(ipaddr);
		if( result == "false" )
		{
			inetnumtmpObj.focus();
			return 'false';
		}
		else
		{
			inetnumObj.value = result;
			return result;
		}
	}
	else
	{
		if( ipaddr.indexOf("-") != -1 )
		{
			//地址段格式
			result = checkipaddr(ipaddr);
			if( result == "false" )
			{
				inetnumtmpObj.focus();
				return 'false';
			}
			else
			{
				inetnumObj.value = result;
				return result;
			}
		}
		if( ipaddr.indexOf("/") != -1 )
		{
			//地址段格式
			result = checkipmask(ipaddr);
			if( result == "false" )
			{
				inetnumtmpObj.focus();
				return 'false';
			}
			else
			{
				inetnumObj.value = result;
				return result;
			}
		}
	}
}

//检查地址/段，输入部分IP地址时，格式是否正确
function checkpartip(ipaddr)
{
	var result = split(ipaddr,".");
	
	var len = result.length;

	if( len < 4 )
	{
		//输入了部分IP地址
		var inetnum = "";
		var beginip = "";
		var endip = "";
		var i = 0;
		for( i = 0; i < len; i++ )
		{
			var partip =result[i].trim();
			if( !isNumber(partip,"int") )
			{
				alert(ipaddr+"地址错误，应填写数字!");   
				return "false";
			}
			//判断每一位的数字是否为0-255间的数字，且第一位数字不能为0
			if( parseInt(partip) > 255 || parseInt(partip) < 0 || (parseInt(partip) == 0 && i == 0) )
			{
				alert(ipaddr+"地址,应为0-255间的数字!");   
				return "false";
			}
			
			beginip += partip + ".";
			endip += partip + ".";
		}//end of for( i = 0; i < len; i++ )
		
		var surplus = 4 - parseInt(len);
		for( i = 0; i < surplus; i++ )
		{
			beginip += "0" + ".";
			endip += "255" + ".";
		}
		
		beginip = beginip.substring(0,beginip.length-1);
		endip = endip.substring(0,endip.length-1);
		
		inetnum = beginip + "-" + endip;
		
		return inetnum;
	}
	else
	{
		//判断地址格式是否合法
		if( IPFormatting(ipaddr) == "Error" )
		{
			alert(ipaddr+"地址格式非法，请重新填写!");   
			return "false";
		}
		
		return ipaddr + "-" + ipaddr;
	}
}

//查询地址段的地址格式是否正确
function checkipaddr(ipaddr)
{
	var loc = ipaddr.indexOf("-");
	var beginip = Trim(ipaddr.substring(0,loc));//起始地址
	var endip = Trim(ipaddr.substring(loc+1,ipaddr.length));//终止地址
	
	//判断地址格式是否合法
	if( IPFormatting(beginip) == "Error" )
	{
		alert(ipaddr+"地址段起始地址格式非法，请重新填写!");   
		return "false";
	}
	if( IPFormatting(endip) == "Error" )
	{
		alert(ipaddr+"地址段终止地址格式非法，请重新填写!");   
		return "false";
	}
	
	//将地址转换为标准格式
	var formatbeginip = formatIP(beginip);
	var formatendip = formatIP(endip);
	
	if( formatbeginip > formatendip )
	{
		alert(ipaddr+"地址段中的起始地址大于终止地址，请重新填写！");
		return "false";
	}
	
	var inetnum = beginip + "-" + endip;
	
	return inetnum;
}

//查询掩码格式的地址是否正确
function checkipmask(ipaddr)
{
	var loc = ipaddr.indexOf("/");
	var ip = Trim(ipaddr.substring(0,loc));
	var mask = Trim(ipaddr.substring(loc+1,ipaddr.length));//地址掩码，去掉前后多余空格
	
	//判断地址格式是否合法
	if( IPFormatting(ip) == "Error" )
	{
		alert(ipaddr+"地址中，IP地址格式非法，请重新填写!");   
		return "false";
	}
	if( !isNumber(mask,"int") )
	{
		alert(ipaddr+"地址中，掩码格式非法，请重新填写!");   
		return "false";
	}
	if( parseInt(mask) <= 0 || parseInt(mask) > 32 )
	{
		alert(ipaddr+"地址中，掩码位数超过32，请重新填写!");   
		return "false";
	}
	
	var inetnum = getIpRange(ip,parseInt(mask));

	return inetnum;
}

function formatIP(sIP) 
{
    //alert("begin formatIP");
    var result = "";
    
    var loc = sIP.indexOf(".");
    var ip1 = Trim(sIP.substring(0,loc));
    var loc1 = sIP.indexOf(".",loc+1);
    var ip2 = Trim(sIP.substring(loc+1,loc1));
    loc = loc1;
    loc1 = sIP.indexOf(".",loc+1);
    var ip3 = Trim(sIP.substring(loc+1,loc1));
    var ip4 = Trim(sIP.substring(loc1+1,sIP.length));
    
    //alert(sIP);
    //alert(ip1.length);
    //alert(ip2.length);
    //alert(ip3.length);
    //alert(ip4.length);
    
    if(ip1.length == 1) 
    {
        result += "00" + ip1;
    }
    else
    {
        if(ip1.length == 2) 
        {
            result += "0" + ip1;
        }
        else
        {
            if(ip1.length == 3) 
            {
                result += ip1;
            }
        }
    }
    result += ".";
    
    if(ip2.length == 1) 
    {
        result += "00" + ip2;
    }
    else
    {
        if(ip2.length == 2) 
        {
            result += "0" + ip2;
        }
        else
        {
            if(ip2.length == 3) 
            {
                result += ip2;
            }
        }
    }
    result += ".";
    
    if(ip3.length == 1) 
    {
        result += "00" + ip3;
    }
    else
    {
        if(ip3.length == 2) 
        {
            result += "0" + ip3;
        }
        else
        {
            if(ip3.length == 3) 
            {
                result += ip3;
            }
        }
    }
    result += ".";
    
    if(ip4.length == 1) 
    {
        result += "00" + ip4;
    }
    else
    {
        if(ip4.length == 2) 
        {
            result += "0" + ip4;
        }
        else
        {
            if(ip4.length == 3) 
            {
                result += ip4;
            }
        }
    }
    
    //alert(result);
    
    return result;
}