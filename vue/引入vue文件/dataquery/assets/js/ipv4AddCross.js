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