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
}
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

function IPPrefixFormatting(IPstr)
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
	if (i>5)
	{
		return "Error";
	}
	return ReturnIP.substring(0,ReturnIP.length-1);
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

//从掩码位数获取掩码
function getMaskAddr(strBitNumber) 
{ 
	var bstring="";
	var strAddr="";
	var intBitNumber=parseInt(strBitNumber,10);
	for (var i=0;i<intBitNumber;i++)	bstring+="1";
	for (var i=intBitNumber;i<32;i++)	bstring+="0";
	var seg1 = parseInt(bstring.substring(0,8),2);
	var seg2 = parseInt(bstring.substring(8,16),2);
	var seg3 = parseInt(bstring.substring(16,24),2);
	var seg4 = parseInt(bstring.substring(24,32),2);
	strAddr = strAddr+seg1+"."+seg2+"."+seg3+"."+seg4;
	return strAddr;
}

    //从掩码获取掩码位数
    function getMaskBitNumber(mask) 
    {
        var maskIntValue;
        var returnValue=0;

            maskIntValue = ipStrToInt(mask);
            //从左向右找到第一个0
            var testValue = 0x80000000;
            while(returnValue<32)
            {
                if ((maskIntValue & testValue) == 0) break;
                returnValue ++ ;
                testValue = testValue>>>1;
            }

            //掩码应大于0
            if (returnValue==0) return "Error:1";

            //若掩码为32位，则直接返回
            if (returnValue==32) return 32;

            //否则检查右面是否都为0
            if ((maskIntValue<<returnValue) == 0)
                return returnValue ;
            else
                return "Error:2";
    }

function getMaskIntValue(bitNumber)
{
    var maskIntValue = 0x80000000;
    if ((bitNumber<=0) || (bitNumber>32)) return 0;
    maskIntValue >>= (bitNumber - 1);
    return maskIntValue ;
}

function getIpRange(strIpAddr,strBitNumber)
{
    var mask=getMaskIntValue(strBitNumber);
    var minip=ipStrToInt(strIpAddr)&mask;
    var maxip=minip|(mask^0xffffffff);
    return ipIntToStr(minip)+"-"+ipIntToStr(maxip);
}

function checkLoopBackAddr(IPstr)
{
	if (IPstr == null)
	{
		return "error:1";
	}
	if (IPstr == "error:2")
	{
		return 2;
	}
	if (IPstr.indexOf(",") != -1)
	{
		IPstr = IPstr + ",";
		var temp;
		var finalstr = "";
		while (IPstr.indexOf(",") != -1)
		{
			temp = IPstr.substring(0, IPstr.indexOf(","))
			finalstr = finalstr + checkLoopBackAddrDetail(temp)+",";
			IPstr = IPstr.substring(IPstr.indexOf(",")+1, IPstr.length);
		}
		if (finalstr.indexOf("Error:3")!= -1)
		{
			return "Error:3";
		}
		if (finalstr.indexOf("Error:4")!= -1)
		{
			return "Error:4";
		}
		if (finalstr.indexOf("Error:5")!= -1)
		{
			return "Error:5";
		}
		else
		{
			return finalstr.substring(0, finalstr.length-1);
		}	 
	}
	else
	{
		var finalstr = checkLoopBackAddrDetail(IPstr);
		if (finalstr.indexOf("Error:3")!= -1)
		{
			return "Error:3";
		}
		if (finalstr.indexOf("Error:4")!= -1)
		{
			return "Error:4";
		}
		if (finalstr.indexOf("Error:5")!= -1)
		{
			return "Error:5";
		}
		else
		{
			return finalstr;
		}
	}
}

function checkLoopBackAddrDetail(IPstr)
{
	var temp;
	var i = 1;
	var j = 0;
	var k ;
	var x = 0;
	var n = 0;

	for (var a=0; a<IPstr.length ; a++)
	{
		if (IPstr.charAt(a) == '-' )
		{
			x++;
		}
	}
	if (x>0)
	{
		var TempIPstr = IPstr;
		TempIPstr = TempIPstr + ".";
		IPstr = "";
		while (TempIPstr.indexOf(".") != -1)
		{
			var b = 0;
			var c = 0;
			temp = TempIPstr.substring(0, TempIPstr.indexOf("."));
			for (var a=0; a<temp.length ; a++)
			{
				if (temp.charAt(a) == '-' )
				{
					b++;
				}
			}
			for (var a=0; a<temp.length ; a++)
			{
				if (temp.charAt(a) == ':' )
				{
					c++;
				}
			}
			if (c>0)
			{
				return "Error:3";
			}
			if (x > 0)
			{
				if (x != 1)
				{
					return "Error:3";
				}
				if (x == 1 && b == 1)
				{
					j = i;
					var part1;
					var part2;
					part1 =	temp.substring(0, temp.indexOf("-"));
					part2 = temp.substring(temp.indexOf("-")+1, temp.length);
					while ((k = part1.indexOf(" "))!=-1)
					{
						part1 = part1.substring(0, k) + part1.substring(k+1, part1.length);
					}
					while ((k = part2.indexOf(" "))!=-1)
					{
						part2 = part2.substring(0, k) + part2.substring(k+1, part2.length);
					}
					k=0;
					while (part1.length>1)
					{
						if (part1.charAt(k)==0)
						{
							part1 = part1.substring(1, part1.length);
						}
						else
						{
							break;
						}
					}
					while (part2.length>1)
					{
						if (part2.charAt(k)==0)
						{
							part2 = part1.substring(1, part2.length);
						}
						else
						{
							break;
						}
					}
					if (!isNumber(part1,"int"))
					{
						return "Error:3";
					}
					if (!isNumber(part2,"int"))
					{
						return "Error:3";
					}
					if (parseInt(part1)>255 || parseInt(part1)<0 || (parseInt(part1)==0 && i==1))
					{
						return "Error:3";
					}
					if (parseInt(part2)>255 || parseInt(part2)<0 || (parseInt(part2)==0 && i==1))
					{
						return "Error:3";
					}
					if (parseInt(part1) >= parseInt(part2))
					{
						return "Error:4";
					}
					temp = parseInt(part1) + "-" + parseInt(part2);

				}
				IPstr	= IPstr + temp +".";	
				TempIPstr	= TempIPstr.substring(TempIPstr.indexOf(".")+1, TempIPstr.length);
			}
			else{}
			i++;
		}
		if (j > 0 && j != 4)
		{
			return "Error:3";
		}
		return IPstr.substring(0, IPstr.length-1);
	}
	else 
	{
		return IPstr;
	}		
}

function FormatIPToAllIP(sIP) 
{
	var result = "";
	var loc = sIP.indexOf(".");
	var ip1 = Trim(sIP.substring(0,loc));
	var loc1 = sIP.indexOf(".",loc+1);
	var ip2 = Trim(sIP.substring(loc+1,loc1));
	loc = loc1;
	loc1 = sIP.indexOf(".",loc+1);
	var ip3 = Trim(sIP.substring(loc+1,loc1));
	var ip4 = Trim(sIP.substring(loc1+1,sIP.length));
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
	return result;
}
