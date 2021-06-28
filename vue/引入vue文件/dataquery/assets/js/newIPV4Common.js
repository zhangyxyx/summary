
/*******************************************************************
 函数名：	formatIpMask(start,end)
 功能：		将起始地址终止地址转换成  地址—地址 或者 地址/掩码 或 单地址
 例如：  formatIpMask('127.0.0.0','127.0.0.0') => '127.0.0.0'
        formatIpMask('127.0.0.0','127.0.0.2') => '127.0.0.0-127.0.0.2'
        formatIpMask('127.0.0.0','127.0.0.255') => '127.0.0.0/24'
 入口参数：	start,end 地址段的起始地址和终止地址（全编码也可）
*******************************************************************/
function formatIpMask(start, end) {
    try {
        var startint = ipStrToInt(start);
        var endint = ipStrToInt(end);
        if (startint == endint) {
            return ipIntToStr(startint);
        }
        var mask = 31;
        var out = false;
        for (; mask >= 0; mask--) {
            if ((startint & (1 << 31 - mask)) != 0 || (endint & (1 << 31 - mask)) == 0) {
                out = true;
                break;
            }
        }
        if (mask < 31) {
            if (mask != 0 || out) {
                mask++;
            }
            if (mask == 0 || (startint & (-1 << (32 - mask))) == (endint & (-1 << (32 - mask))))
                return ipIntToStr(startint) + "/" + mask;
        }
        return ipIntToStr(startint) + "-" + ipIntToStr(endint);
    } catch (e) {
        return "Error";
    }
}

//全编码转成非全编码
function dealIpv4ToAll(ip) {
    var ipArr = ip.split('.')
    var ipArrD = []
    ipArr.forEach(function (item, index) {
        if (item == '0' || item == '00' || item == '000' || item == '0000') {
            ipArrD.push('0')
        } else {
            ipArrD.push(item.replace(/\b(0+)/gi, ""))
        }
    })
    return ipArrD.join('.')
}

//非全编码转成全编码
function dealIpv4FromAll(ip) {
    var ipArr = ip.split('.')
    var ipArrD = []
    ipArr.forEach(function (item, index) {
        if (item.length == 1) {
            ipArrD.push('00' + item)
        } else if (item.length == 2) {
            ipArrD.push('0' + item)
        } else {
            ipArrD.push(item)
        }
    })
    return ipArrD.join('.')
}

/*******************************************************************
 函数名：	formatIP(sIP)
 功能：		将10.0.0.2转换为010.000.000.002格式
 入口参数：	sIP:IP地址
 返回值：	标准格式IP地址
*******************************************************************/
//------------------------------------------------------------------
function formatIP(sIP) {
    //alert("begin formatIP");
    var result = "";

    var loc = sIP.indexOf(".");
    var ip1 = Trim(sIP.substring(0, loc));
    var loc1 = sIP.indexOf(".", loc + 1);
    var ip2 = Trim(sIP.substring(loc + 1, loc1));
    loc = loc1;
    loc1 = sIP.indexOf(".", loc + 1);
    var ip3 = Trim(sIP.substring(loc + 1, loc1));
    var ip4 = Trim(sIP.substring(loc1 + 1, sIP.length));

    //alert(sIP);
    //alert(ip1.length);
    //alert(ip2.length);
    //alert(ip3.length);
    //alert(ip4.length);

    if (ip1.length == 1) {
        result += "00" + ip1;
    }
    else {
        if (ip1.length == 2) {
            result += "0" + ip1;
        }
        else {
            if (ip1.length == 3) {
                result += ip1;
            }
        }
    }
    result += ".";

    if (ip2.length == 1) {
        result += "00" + ip2;
    }
    else {
        if (ip2.length == 2) {
            result += "0" + ip2;
        }
        else {
            if (ip2.length == 3) {
                result += ip2;
            }
        }
    }
    result += ".";

    if (ip3.length == 1) {
        result += "00" + ip3;
    }
    else {
        if (ip3.length == 2) {
            result += "0" + ip3;
        }
        else {
            if (ip3.length == 3) {
                result += ip3;
            }
        }
    }
    result += ".";

    if (ip4.length == 1) {
        result += "00" + ip4;
    }
    else {
        if (ip4.length == 2) {
            result += "0" + ip4;
        }
        else {
            if (ip4.length == 3) {
                result += ip4;
            }
        }
    }

    //alert(result);

    return result;
}



//校验输入的IP地址是合法的ipv4或ipv6,当校验不完整格式ipv4时第二个参数传true
function validIPAddress(IP, unfull) {
    //按"."进行分割
    var parts = IP.split(".");
    if (unfull) {
        if (parts.length <= 4) {
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
    } else {
        //IPv4由4个部分组成
        if (parts.length === 4) {
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


/*******************************************************************
 函数名：	IPFormatting(sIP)
 功能：		校验是否是合法的ipv4地址
 入口参数：	sIP:IP地址
 返回值：	标准格式IP地址
*******************************************************************/
//------------------------------------------------------------------
function IPFormatting(IPstr) {
    if (IPstr == null) {
        return "Error";
    }
    if (IPstr == "") {
        return "Error";
    }
    IPstr = IPstr + ".";
    var i = 1;
    var j;
    var temp = "";
    var ReturnIP = "";
    while (IPstr.indexOf(".") != -1) {
        if (i > 4) {
            return "Error";
        }
        temp = IPstr.substring(0, IPstr.indexOf("."));
        while ((j = temp.indexOf(" ")) != -1) {
            temp = temp.substring(0, j) + temp.substring(j + 1, temp.length);
        }
        if (temp.length > 3) {
            return "Error";
        }
        j = 0;
        while (temp.length > 1) {
            if (temp.charAt(j) == 0) {
                temp = temp.substring(1, temp.length);
            }
            else {
                break;
            }
        }
        if (!isNumber(temp, "int")) {
            return "Error";
        }
        if (parseInt(temp) > 255 || parseInt(temp) < 0 || (parseInt(temp) == 0 && i == 1)) {
            return "Error";
        }
        ReturnIP = ReturnIP + parseInt(temp) + ".";
        IPstr = IPstr.substring(IPstr.indexOf(".") + 1, IPstr.length);
        i++;
    }
    if (i != 5) {
        return "Error";
    }
    return ReturnIP.substring(0, ReturnIP.length - 1);
}

/*******************************************************************
 函数名：	IPV6Formatting(sIP)
 功能：		校验是否是合法的ipv6地址
 入口参数：	sIP:IP地址
 返回值：	标准格式IP地址
*******************************************************************/
//------------------------------------------------------------------
function IPV6Formatting(IPstr) {
    if (IPstr == null) {
        return "Error";
    }
    if (IPstr == "") {
        return "Error";
    }
    var i = 0;
    var marknum = 0;
    var mark1 = IPstr.indexOf("::");
    var mark2 = IPstr.lastIndexOf("::");
    if (mark1 != mark2) {
        return "Error";
    }
    var tmpstr = IPstr;
    if (tmpstr.indexOf(".") >= 0) {
        var v4tmp = tmpstr.substring(tmpstr.lastIndexOf(":") + 1, tmpstr.length);
        if (IPFormatting(v4tmp).indexOf("Error") >= 0) {
            return "Error";
        }
        marknum = marknum + 2;
        tmpstr = tmpstr.substring(0, tmpstr.lastIndexOf(":"));
    }
    var strlen = tmpstr.length;
    for (i = 0; i < strlen; i++) {
        var tmpchar = tmpstr.charAt(i);
        if (tmpchar != ':' && (tmpchar < '0' || tmpchar > '9') && (tmpchar < 'a' || tmpchar > 'f') && (tmpchar < 'A' || tmpchar > 'F')) {
            return "Error";
        }
    }
    tmpstr = tmpstr + ":";
    while (tmpstr.indexOf(":") != -1) {
        var substr = tmpstr.substring(0, tmpstr.indexOf(":"));
        var tmplen = tmpstr.length;
        if (tmplen != tmpstr.indexOf(":") + 1) {
            tmpstr = tmpstr.substring(tmpstr.indexOf(":") + 1, tmpstr.length);
        }
        else {
            tmpstr = "";
        }
        if (substr != "") {
            if (substr.length > 4) {
                return "Error";
            }
        }
        marknum = marknum + 1;
        if (marknum > 8) {
            return "Error";
        }
    }
    if (marknum < 3) {
        return "Error";
    }
    if (mark1 == -1 && marknum < 8) {
        return "Error";
    }
    return IPstr;
}

//检查IP地址/段的地址是否正确
function checkInetnum(ipaddr) {
    var result = "";
    if (ipaddr.indexOf("-") == -1 && ipaddr.indexOf("/") == -1) {
        //判断单独地址是否正确
        result = checkpartip(ipaddr);
        if (result == "false") {

            return 'false';
        }
        else {

            return result;
        }
    }
    else {
        if (ipaddr.indexOf("-") != -1) {
            //地址段格式
            result = checkipaddr(ipaddr);
            if (result == "false") {

                return 'false';
            }
            else {

                return result;
            }
        }
        if (ipaddr.indexOf("/") != -1) {
            //地址段格式
            result = checkipmask(ipaddr);
            if (result == "false") {

                return 'false';
            }
            else {

                return result;
            }
        }
    }
}

//检查地址/段，输入部分IP地址时，格式是否正确
function checkpartip(ipaddr) {
    var result = split(ipaddr, ".");

    var len = result.length;

    if (len < 4) {
        //输入了部分IP地址
        var inetnum = "";
        var beginip = "";
        var endip = "";
        var i = 0;
        for (i = 0; i < len; i++) {
            var partip = result[i].trim();
            if (!isNumber(partip, "int")) {
                alert(ipaddr + "地址错误，应填写数字!");
                return "false";
            }
            //判断每一位的数字是否为0-255间的数字，且第一位数字不能为0
            if (parseInt(partip) > 255 || parseInt(partip) < 0 || (parseInt(partip) == 0 && i == 0)) {
                alert(ipaddr + "地址,应为0-255间的数字!");
                return "false";
            }

            beginip += partip + ".";
            endip += partip + ".";
        }//end of for( i = 0; i < len; i++ )

        var surplus = 4 - parseInt(len);
        for (i = 0; i < surplus; i++) {
            beginip += "0" + ".";
            endip += "255" + ".";
        }

        beginip = beginip.substring(0, beginip.length - 1);
        endip = endip.substring(0, endip.length - 1);

        inetnum = beginip + "-" + endip;

        return inetnum;
    }
    else {
        //判断地址格式是否合法
        if (IPFormatting(ipaddr) == "Error") {
            alert(ipaddr + "地址格式非法，请重新填写!");
            return "false";
        }

        return ipaddr + "-" + ipaddr;
    }
}

//判断两段地址是不是有交叉
function ipv4AddrCross(ipv4AddrS1, ipv4AddrE1, ipv4AddrS2, ipv4AddrE2) {
    // IP1:A-B     IP2:C-D     B大于等于C && A小于等于D 算是交叉
    var ipv4AddrStart1 = dealIpv4ToAll(ipv4AddrS1).split('.') //A
    var ipv4AddrEnd1 = dealIpv4ToAll(ipv4AddrE1).split('.') //B
    var ipv4AddrStart2 = dealIpv4ToAll(ipv4AddrS2).split('.') //C
    var ipv4AddrEnd2 = dealIpv4ToAll(ipv4AddrE2).split('.') //D
    var count1 = 0
    var count2 = 0
    if (ipv4AddrStart1.toString() == ipv4AddrEnd2.toString()) {
        count1++
    } else {
        for (var i = 0; i < ipv4AddrStart1.length; i++) {
            if (parseInt(ipv4AddrStart1[i]) > parseInt(ipv4AddrEnd2[i])) {
                break;
            } else if (parseInt(ipv4AddrStart1[i]) < parseInt(ipv4AddrEnd2[i])) {
                count1++
                break;
            }
        }
    }
    if (ipv4AddrStart2.toString() == ipv4AddrEnd1.toString()) {
        count2++
    } else {
        for (var i = 0; i < ipv4AddrStart2.length; i++) {
            if (parseInt(ipv4AddrEnd1[i]) < parseInt(ipv4AddrStart2[i])) {
                break;
            } else if (parseInt(ipv4AddrEnd1[i]) > parseInt(ipv4AddrStart2[i])) {
                count2++;
                break
            }
        }
    }
    if (count1 > 0 && count2 > 0) {
        return true
    } else {
        return false
    }
}

//查询地址段的地址格式是否正确
function checkipaddr(ipaddr) {
    var loc = ipaddr.indexOf("-");
    var beginip = Trim(ipaddr.substring(0, loc));//起始地址
    var endip = Trim(ipaddr.substring(loc + 1, ipaddr.length));//终止地址

    //判断地址格式是否合法
    if (IPFormatting(beginip) == "Error") {
        alert(ipaddr + "地址段起始地址格式非法，请重新填写!");
        return "false";
    }
    if (IPFormatting(endip) == "Error") {
        alert(ipaddr + "地址段终止地址格式非法，请重新填写!");
        return "false";
    }

    //将地址转换为标准格式
    var formatbeginip = formatIP(beginip);
    var formatendip = formatIP(endip);

    if (formatbeginip > formatendip) {
        alert(ipaddr + "地址段中的起始地址大于终止地址，请重新填写！");
        return "false";
    }

    var inetnum = beginip + "-" + endip;

    return inetnum;
}

//查询掩码格式的地址是否正确
function checkipmask(ipaddr) {
    var loc = ipaddr.indexOf("/");
    var ip = Trim(ipaddr.substring(0, loc));
    var mask = Trim(ipaddr.substring(loc + 1, ipaddr.length));//地址掩码，去掉前后多余空格

    //判断地址格式是否合法
    if (IPFormatting(ip) == "Error") {
        alert(ipaddr + "地址中，IP地址格式非法，请重新填写!");
        return "false";
    }
    if (!isNumber(mask, "int")) {
        alert(ipaddr + "地址中，掩码格式非法，请重新填写!");
        return "false";
    }
    if (parseInt(mask) <= 0 || parseInt(mask) > 32) {
        alert(ipaddr + "地址中，掩码位数超过32，请重新填写!");
        return "false";
    }

    var inetnum = getIpRange(ip, parseInt(mask));

    return inetnum;
}

//ip地址转数字
function ipToNumber(ip) {
    var num = 0;
    if (ip == "") {
        return num;
    }
    var aNum = ip.split(".");
    if (aNum.length != 4) {
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
    if (number <= 0) {
        return ip;
    }
    var ip3 = (number << 0) >>> 24;
    var ip2 = (number << 8) >>> 24;
    var ip1 = (number << 16) >>> 24;
    var ip0 = (number << 24) >>> 24

    ip += ip3 + "." + ip2 + "." + ip1 + "." + ip0;

    return ip;
}


//-----------------------------------------------------------------------------------

function ipStrToInt(ipString) {
    var begin = 0;
    var end = 0, segValue = 0, returnValue = 0;
    for (var i = 0; i < 3; i++) {
        end = ipString.indexOf(".", begin);
        if (end == -1) return 0;
        segValue = parseInt(ipString.substring(begin, end));
        if ((segValue < 0) || (segValue > 255)) return 0;
        returnValue = (returnValue << 8) | segValue;
        begin = end + 1;
    }
    segValue = parseInt(ipString.substring(begin));
    if ((segValue < 0) || (segValue > 255)) return 0;
    returnValue = (returnValue << 8) | segValue;
    return returnValue;
}
function ipIntToStr(intIpString) {
    var retValue = "";
    var intValue = 0;
    intValue = (intIpString & 0xff000000) >>> 24
    retValue += intValue;
    retValue += ".";
    intValue = (intIpString & 0x00ff0000) >>> 16;
    retValue += intValue;
    retValue += ".";
    intValue = (intIpString & 0x0000ff00) >>> 8;
    retValue += intValue;
    retValue += ".";
    intValue = (intIpString & 0x000000ff);
    retValue += intValue;
    return retValue;
}
//IP转成整型
function ip2int(ip) {
    var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
}

function Trim(Liter) {
    return Liter.trim();
}

function isNumber(inputstr, mode) {
    var str = " " + inputstr + " ";
    var startindex, endindex;
    var returnbool = true, tag = true;
    var i;
    var firstchar;
    var negative = false, positive = false, unuse = false, zero = false;
    startindex = str.indexOf(" ")
    endindex = str.lastIndexOf(" ")
    while (tag) {
        tag = false
        firstchar = str.substring(startindex, startindex + 1)
        if (firstchar == " " && !zero) {
            startindex++
            tag = true
            unuse = true
        }
        else if (firstchar == "0") {
            startindex++
            tag = true
            zero = true
        }
        else if (firstchar == "-") {
            if (negative || positive || zero) {
                returnbool = false
            }
            else {
                startindex++
                tag = true
                negative = true
            }
        }
        else if (firstchar == "+") {
            if (negative || positive || zero) {
                returnbool = false
            }
            else {
                startindex++
                tag = true
                positive = true
            }
        }
        if (str.substring(endindex, endindex + 1) <= " ") {
            endindex--
            tag = true
        }
        if (endindex <= startindex) tag = false
    }
    str = str.substring(startindex, endindex + 1)
    if (returnbool) {
        if (mode.toLowerCase() == "int") {
            if (str.indexOf(".") != -1)
                returnbool = false;
            else {
                if (negative)
                    str = "-" + str
                i = parseInt(str)
            }
        }
        else if (mode.toLowerCase() == "float") {
            if (str.substring(0, 1) == ".")
                str = "0" + str
            if (negative)
                str = "-" + str
            i = parseFloat(str)
        }
        else i = parseFloat(str)
        if (i == str) {
            returnbool = true
        }
        else returnbool = false
    }
    return returnbool
}

function split(str, sep) {
    //alert("str"+str);
    if (sep == null || sep == "")
        sep = ' ';
    //alert("2");
    var result = new Array();

    var r = 0;

    if (sep != null) {
        var start = 0, count = 0;

        //alert("3");

        while (start + count < str.length) {
            if (sep.indexOf(str.charAt(start + count)) == -1) {
                //alert("count++:"+str.charAt(start+count));
                count++;
            }
            else {
                if (count == 0)
                    start++;
                else {
                    result[r++] = str.substring(start, start + count);
                    //alert("str:"+str.substring(start,start+count));
                    start += count;
                    count = 0;
                }
            }
        }

        //alert("4");
        if (count != 0) {
            result[r++] = str.substring(start, start + count);
        }
    }
    return result;
}

function getIpRange(strIpAddr, strBitNumber) {
    var mask = getMaskIntValue(strBitNumber);
    var minip = ipStrToInt(strIpAddr) & mask;
    var maxip = minip | (mask ^ 0xffffffff);
    return ipIntToStr(minip) + "-" + ipIntToStr(maxip);
}

function getMaskIntValue(bitNumber) {
    var maskIntValue = 0x80000000;
    if ((bitNumber <= 0) || (bitNumber > 32)) return 0;
    maskIntValue >>= (bitNumber - 1);
    return maskIntValue;
}
function ipStrToInt(ipString) {
    var begin = 0;
    var end = 0, segValue = 0, returnValue = 0;
    for (var i = 0; i < 3; i++) {
        end = ipString.indexOf(".", begin);
        if (end == -1) return 0;
        segValue = parseInt(ipString.substring(begin, end));
        if ((segValue < 0) || (segValue > 255)) return 0;
        returnValue = (returnValue << 8) | segValue;
        begin = end + 1;
    }
    segValue = parseInt(ipString.substring(begin));
    if ((segValue < 0) || (segValue > 255)) return 0;
    returnValue = (returnValue << 8) | segValue;
    return returnValue;
}
function ipIntToStr(intIpString) {
    var retValue = "";
    var intValue = 0;
    intValue = (intIpString & 0xff000000) >>> 24
    retValue += intValue;
    retValue += ".";
    intValue = (intIpString & 0x00ff0000) >>> 16;
    retValue += intValue;
    retValue += ".";
    intValue = (intIpString & 0x0000ff00) >>> 8;
    retValue += intValue;
    retValue += ".";
    intValue = (intIpString & 0x000000ff);
    retValue += intValue;
    return retValue;
}