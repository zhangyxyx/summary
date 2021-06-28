$(function () {
    var urlObj = new UrlSearch();
    InetnumID = urlObj.InetnumID
    showReport = urlObj.showReport
    if (urlObj.showReport == 'Y') {
        $("#reportDiv").show()
        $("#reportDiv1").show()
    } else if (urlObj.showReport == 'N') {
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


//点击新增按钮
$(".btnItem").on("click", function () {
    console.log("新增点击按钮")
    //所属网络不为空时校验
    let netcode = $("#netCodeList").val();
    //ip地址段不为空时校验
    let address = $("#inetnumtep").val();
    if (netcode == "") {
        jQuery.messager.alert('提示:', "所属网络不能为空!", 'warning');
        return false;
    }
    if (address == "") {
        jQuery.messager.alert('提示:', "地址段不能为空!", 'warning');
        return false;
    } else {
        if (checkInetnum(adress) == 'false') {
            return
        } else {
            var inetnum = checkInetnum(adress)
            // this.insertData.scope = inetnum
            beginip = inetnum.split('-')[0]
            endip = inetnum.split('-')[1]
            var count = 0
            var addBigIpArr = this.insertDataList
            for (var i = 0; i < addBigIpArr.length; i++) {
                if (beginip == addBigIpArr[i].scope.split('-')[0] && endip == addBigIpArr[i].scope.split('-')[1]) {
                    this.$alert("新增加的地址跟列表地址重叠！")
                    count++;
                    break;
                }
                if (this.Ipv4Repeat(addBigIpArr[i].scope.split('-')[0], addBigIpArr[i].scope.split('-')[1], beginip, endip)) {
                    this.$alert("新增加的地址跟列表地址有交叉！")
                    count++;
                    break;
                }
            }
        }
    }
    if (count == 0) {
        // 往表格中push数据
        this.insertDataList.push(
            {

                id: this.id,
                // ... : 展开insertData,效果如下方注释
                ...this.insertData,
                isEffective: '',
                coReason: '',
                // scope:this.insertData.scope,
                // this.insertData.netname,
                // this.insertData.iptypename,
                // this.insertData.remarks,
            }
        )
    }
})





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