$(function() {
    var mapHeight = $(window).height() - 372;
    $(".chartDiv").height(mapHeight);
    $(".tableDiv").height(mapHeight);

    window.addEventListener('resize', function() {
        var mapHeight = $(window).height() - 372;
        $(".chartDiv").height(mapHeight);
        $(".tableDiv").height(mapHeight);
    })

    //获取分配组织和申请组织
    openWeb();

    //获取系统参数--IsIPtypeNull
    getSysPara();

    //获取系统参数--ipPlanV4
    getSysPara2();

    //获取系统参数--ipPlanCheck
    getSysPara3();

    //获取系统参数--IPTypeCheck
    IPTypeCheck();
    var data = JSON.stringify({
        userName: jcObj.userId,
        nodeCode: "",
        ipType: "",
        authType: ""
    });
    //获取新地址类型
    loadNewDzType(data);
});

//定义基础URL
var jcObj = {
    getajaxUrl: $.ITE.getajaxUrlIpv4(),
    userId: jQuery.ITE.getCookieValue('loginName'),
    ipTypeCheck: "",
    isipTypeNull: "",
    sqzzCode: "",
    sqzzName: "",
    newDzTypeCode: "",
    newDzTypeName: "",
    tableData: [],
    fpAddressOld: "",
    ipPlanV4: "",
    ipPlanCheck: "",
    ziOrsdFlag: 1
}

$(".radio").on("click", function() {
    $(this).toggleClass("yesradio", true).toggleClass("noradio", false).siblings(".radio").toggleClass("yesradio", false).toggleClass("noradio", true);
    var value = $(this).data("value");
    if (value == 'zdfp') {
        $(".fpAddress").attr("disabled", "disabled");
        $(".fpdzBtn").show();
        jcObj.ziOrsdFlag = 1;
    } else {
        $(".fpAddress").removeAttr("disabled");
        $(".fpdzBtn").hide();
        jcObj.ziOrsdFlag = 0;
    }
    $(".fpAddress").val("");
    $(".ydzType").val("");
    $(".ydzType").attr("data-index", "");
    $(".ydzType").attr("data-index2", "");
    $('#newDzType').combotree('setValues', [""]);
    jcObj.newDzTypeCode = "";
    jcObj.newDzTypeName = "";
    $(".beiZhu").val("");
});

//点击地址分配按钮
$(".fpdzBtn").on("click", function() {
    if (jcObj.sqzzCode == "") {
        jQuery.messager.alert('提示:', "请先选择申请组织!", 'warning');
        return false;
    } else {
        var nodeCode = $(".nodeTree").attr("data-index");
        var nextNodeCode = jcObj.sqzzCode;
        var url = "";
        if (jcObj.ipPlanV4 == "Y") {
            url = "/ipmanage/nos/ipaddrmanage/unusedipalloc/unusedIpAllotCondition.jsp?title=分配&ANodeCode=" + nextNodeCode + "&NodeCode=" + nodeCode + "&NextNodeCode=" + nextNodeCode + "&prenodecode=" + nextNodeCode + "&ipplancheck=" + jcObj.ipPlanCheck + "&ipRange=&allotClassType=all&allotType=single";
        } else {
            url = "/ipmanage/nos/ipaddrmanage/unusedipalloc/unusedIpAllotCondition.jsp?title=分配&ANodeCode=" + nextNodeCode + "&NodeCode=" + nodeCode + "&NextNodeCode=" + nextNodeCode + "&ipRange=&allotClassType=all&allotType=single";
        }

        window.open(url, "", 'toolbar=yes,directories=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600,left=0,top=0');
    }
})

//鼠标选中地址框校验地址
$(".fpAddress").on("focus", function() {
    if (jcObj.sqzzCode == "") {
        jQuery.messager.alert('提示:', "请先选择申请组织!", 'warning');
        return false;
    }
})

//鼠标离开地址框校验地址
$(".fpAddress").on("blur", function() {
    var thisVal = $(this).val();
    if (thisVal == "") {
        jQuery.messager.alert('提示:', "请先输入分配地址!", 'warning');
        return false;
    }

    if (thisVal != "" && ipjy1(thisVal) == true && jcObj.fpAddressOld != thisVal) {
        jcObj.fpAddressOld = thisVal;
        $('#newDzType').combotree('setValues', [""]);
        jcObj.newDzTypeCode = "";
        jcObj.newDzTypeName = "";
        $(".ydzType").val("");
        $(".ydzType").attr("data-index", "");
        $(".ydzType").attr("data-index2", "");

        var flag = 0;
        //获取空闲地址
        getCheckIpunusedipalloc(flag);
    }
})

//点击添加分配记录按钮
$(".addFpjlBtn").on("click", function() {
    var ipdz = $(".fpAddress").val();
    var thisrownum = jcObj.tableData.length + 1;
    var thisIpTypeCode = $(".ydzType").attr("data-index");
    var thisIpTypeName = $(".ydzType").val();
    var thisGhAddresCode = $(".ydzType").attr("data-index2");
    var thisRemark = $(".beiZhu").val();
    var thisipNum = "";
    var newIpDz = "";
    if (jcObj.sqzzCode == "") {
        jQuery.messager.alert('提示:', "申请组织不得为空!", 'warning');
        return false;
    }
    if (ipdz == "") {
        jQuery.messager.alert('提示:', "分配地址不得为空!", 'warning');
        return false;
    }
    //如果为空开关开启新地址类型可以为空
    if (jcObj.isipTypeNull != "Y" && jcObj.newDzTypeCode == "") {
        jQuery.messager.alert('提示:', "新地址类型不得为空!", 'warning');
        return false;
    } else if (jcObj.isipTypeNull == "Y" && jcObj.newDzTypeCode == "") {

    }
    if (jcObj.ipPlanV4 == "Y" && jcObj.ipPlanCheck == "Y") {
        if (thisGhAddresCode == undefined || thisGhAddresCode == null || thisGhAddresCode == "") {
            jQuery.messager.alert('提示:', "选择的地址不再规划地址范围内!", 'warning');
            return false;
        } else if (thisGhAddresCode != jcObj.sqzzCode) {
            jQuery.messager.alert('提示:', "选择的地址不再规划地址范围内!", 'warning');
            return false;
        }
    }

    //    if(jcObj.ziOrsdFlag==0&&thisGhAddresCode==""){
    //        jQuery.messager.alert('提示:',"无符合条件的空闲地址,请修改分配地址!",'warning');
    //        return false;
    //    }

    //如果地址类型校验开关开启强校验
    if (jcObj.ipTypeCheck && jcObj.ipTypeCheck == "Y") {
        if (thisIpTypeCode && jcObj.newDzTypeCode) {
            //如果原地址类型存在校验当前新地址类型是否为原地址类型或子类型
            var flag = false;
            $.ajax({
                type: "post",
                url: jcObj.getajaxUrl + "/ipaddrmodule/IpAllocateCondition/CheckBelongSonType",
                async: false,
                data: {
                    fathertype: thisIpTypeCode,
                    sontype: jcObj.newDzTypeCode
                },
                success: function(data) {
                    if ($.trim(data) != 'Y') {
                        jQuery.messager.alert('提示:', "新地址类型不是原地址类型本身或子类型,请确认选择的地址对应地址类型!", 'warning');
                        flag = true;
                    }
                }
            });
            if (flag) {
                return false;
            }
        }
    } else {
        //如过有原地址类型,那选择的新地址类型必须是原类型本身或者是子类型,无需校验开关
        if (thisIpTypeCode && jcObj.newDzTypeCode) {
            //如果原地址类型存在校验当前新地址类型是否为原地址类型或子类型
            var flag = false;
            $.ajax({
                type: "post",
                url: jcObj.getajaxUrl + "/ipaddrmodule/IpAllocateCondition/CheckBelongSonType",
                async: false,
                data: {
                    fathertype: thisIpTypeCode,
                    sontype: jcObj.newDzTypeCode
                },
                success: function(data) {
                    if ($.trim(data) != 'Y') {
                        jQuery.messager.alert('提示:', "新地址类型不是原地址类型本身或子类型,请确认选择的地址对应地址类型!", 'warning');
                        flag = true;
                    }
                }
            });
            if (flag) {
                return false;
            }
        }
    }

    if (ipdz.indexOf("-") > -1) {
        var startIp = (ipdz.split("-"))[0];
        var endIp = (ipdz.split("-"))[1];
        thisipNum = listIP(startIp, endIp);
        newIpDz = ipdz;
    } else if (ipdz.indexOf("/") > -1) {
        var ipdzD = subnet_mask_change_ip_segment(ipdz);
        newIpDz = ipdzD;
        var startIp = (ipdzD.split("-"))[0];
        var endIp = (ipdzD.split("-"))[1];
        thisipNum = listIP(startIp, endIp);
    } else {
        thisipNum = 1;
        newIpDz = ipdz + "-" + ipdz;
    }

    if (jcObj.tableData.length > 0) {
        var newStartIp = (newIpDz.split("-"))[0];
        var newEndIp = (newIpDz.split("-"))[1];

        var oldIpArr = [];
        for (var i = 0; i < jcObj.tableData.length; i++) {
            var oldIp = (jcObj.tableData)[i].inetnum;
            if (oldIp.indexOf("-") > -1) {
                oldIp = oldIp;
            } else if (oldIp.indexOf("/") > -1) {
                oldIp = subnet_mask_change_ip_segment(oldIp);
            } else {
                oldIp = oldIp + "-" + oldIp;
            }
            oldIpArr.push(oldIp);
        }

        for (var i = 0; i < oldIpArr.length; i++) {
            var oldIpStart = (oldIpArr[i].split("-"))[0];
            var oldIpEnd = (oldIpArr[i].split("-"))[1];
            if (ip2int(newStartIp) <= ip2int(oldIpEnd) && ip2int(newEndIp) >= ip2int(oldIpStart)) {
                jQuery.messager.alert('提示:', "地址和列表中地址重复,请重新分配!", 'warning');
                return false;
            }
        }
    }


    var obj = {
        rownum: thisrownum,
        inetnum: ipdz,
        ipNum: thisipNum,
        NextNodeCode: jcObj.sqzzCode,
        NextNodeName: jcObj.sqzzName,
        NewIpTypeCode: jcObj.newDzTypeCode,
        NewIpTypeName: jcObj.newDzTypeName,
        IpTypeCode: thisIpTypeCode,
        IpTypeName: thisIpTypeName,
        PreNodeCode: thisGhAddresCode,
        Remark: thisRemark
    }
    jcObj.tableData.push(obj);

    //生成地址表
    getipdetaillists(jcObj.tableData);
})

//删除地址列表
$(document).on("click", ".deletBtn", function() {
    if (jcObj.tableData.length > 1) {
        var index = parseInt($(this).attr("data-index")) - 1;

        jcObj.tableData.splice(index, 1);

        for (var i = 0; i < jcObj.tableData.length; i++) {
            jcObj.tableData[i].rownum = i + 1;
        }
    } else {
        jcObj.tableData = [];
    }

    //生成地址表
    getipdetaillists(jcObj.tableData);
})

//点击确定按钮，提交新增ip地址
$(".sureBtn").on("click", function() {
    if (jcObj.tableData.length > 0) {
        var addData = [];
        var thisNodeCode = $(".nodeTree").attr("data-index");
        for (var i = 0; i < jcObj.tableData.length; i++) {
            var obj = {};
            obj = {
                rownum: jcObj.tableData[i].rownum,
                inetnum: jcObj.tableData[i].inetnum,
                PrivateFlag: "0",
                IPVersion: "IPv4",
                Status: "Allocated",
                ReportFlag: "U",
                NodeCode: thisNodeCode,
                NextNodeCode: jcObj.tableData[i].NextNodeCode,
                AllotDate: "",
                Remarks: jcObj.tableData[i].Remark,
                ReplyMan: jcObj.userId,
                NewIpTypeCode: jcObj.tableData[i].NewIpTypeCode,
                IpTypeCode: jcObj.tableData[i].IpTypeCode,
                PreNodeCode: jcObj.tableData[i].PreNodeCode
            }
            addData.push(obj);
        }
        $(".bgDiv").show();
        //新增ip地址
        BatchAdd(addData);
    }
})

//点击关闭按钮
$(".closeBtn").on("click", function() {
    window.close();
})

//提示框转义为中文
$.messager.defaults = { ok: "是", cancel: "否" };

//获取系统参数--IsIPtypeNull
function getSysPara() {
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/SysCommon/getSysPara",
        dataType: "json",
        data: {
            ParaName: "IsIPtypeNull"
        },
        success: function(data) {
            if (data.code == "0000") {
                jcObj.isipTypeNull = data.data.PARAVALUE;

                if (jcObj.isipTypeNull == "Y") {
                    $(".newDzTypeSpan").hide();
                } else {
                    $(".newDzTypeSpan").show();
                }
            } else {
                jQuery.messager.alert('提示:', data.tip, 'warning');
            }
        },
        error: function() {
            jQuery.messager.alert('提示:', "加载数据失败！", 'warning');
        }
    });
}

//获取系统参数--IPTypeCheck
function IPTypeCheck() {
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/IpAddrType/getIPTypeCheck",
        dataType: "text",
        success: function(data) {
            jcObj.ipTypeCheck = data;
        },
        error: function() {
            jQuery.messager.alert('提示:', "加载数据失败！", 'warning');
        }
    })
}

//获取系统参数--IPPlanV4
function getSysPara2() {
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/SysCommon/getSysPara",
        dataType: "json",
        data: {
            ParaName: "IPPlanV4"
        },
        success: function(data) {
            if (data.code == "0000") {
                jcObj.ipPlanV4 = data.data.PARAVALUE;
            } else {
                jQuery.messager.alert('提示:', data.tip, 'warning');
            }
        },
        error: function() {
            jQuery.messager.alert('提示:', "加载数据失败！", 'warning');
        }
    });
}

//获取系统参数--IPPlanCheck
function getSysPara3() {
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/SysCommon/getSysPara",
        dataType: "json",
        data: {
            ParaName: "IPPlanCheck"
        },
        success: function(data) {
            if (data.code == "0000") {
                jcObj.ipPlanCheck = data.data.PARAVALUE;
            } else {
                jQuery.messager.alert('提示:', data.tip, 'warning');
            }
        },
        error: function() {
            jQuery.messager.alert('提示:', "加载数据失败！", 'warning');
        }
    });
}

//获取链接参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//获取页面默认信息
function openWeb() {
    var nodeCode = GetQueryString("NodeCode");
    nodeTreeXz(nodeCode);
    $(".nodeTree").val("");
    $(".nodeTree").attr("data-index", "");
}

//申请组织
function nodeTreeXz(nodecode) {
    var $data = {
        userName: jcObj.userId,
        nodeCode: nodecode
    };
    $data = JSON.stringify($data);
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/NodeManage/GetNodeList",
        dataType: "json",
        contentType: "application/json",
        data: $data,
        success: function(data) {
            if (data.code == "0000") {
                var thisData = data.data;
                $(".nodeTree").val(thisData[0].nodeName);
                $(".nodeTree").attr("data-index", thisData[0].nodeCode);
                thisData = iteration(thisData);
                thisData.forEach(function(v) {
                    v.children.forEach(function(s) {
                        s.children = []
                    })
                })
                initTreeXz(thisData);
            } else {
                jQuery.messager.alert('提示:', data.tip, 'warning');
            }
        },
        error: function() {
            jQuery.messager.alert('提示:', "获取节点加载数据失败!", 'warning');
        }
    })
}

//申请组织--生成节点树
function initTreeXz(treeDate) {
    $('#sqNodeTree').combotree({
        width: 140,
        lines: true,
        animate: true,
        data: treeDate,
        onLoadSuccess: function(node, data) {},
        onClick: function(node) {
            jcObj.sqzzCode = node.nodeCode;
            jcObj.sqzzName = node.nodeName;
        },
        onBeforeSelect: function(node) {
            if (!$(this).tree('isLeaf', node.target)) {
                return false;
            }
        },
        onChange: function(newValue, oldValue) {
            $('#newDzType').combotree('setValues', [""]);
            jcObj.newDzTypeCode = "";
            jcObj.newDzTypeName = "";
            var data = JSON.stringify({
                userName: jcObj.userId,
                nodeCode: newValue,
                ipType: "",
                authType: ""
            });
            loadNewDzType(data);
        }
    });
}

//递归处理节点树数据
function iteration(data) {
    for (var j = 0; j < data.length; j++) {
        data[j].id = data[j].nodeCode;
        data[j].text = data[j].nodeName;
        if (data[j].children != undefined && data[j].children.length > 0) {
            iteration(data[j].children);
        }
    }
    return data;
}

//获取空闲地址
function getCheckIpunusedipalloc(flag) {
    var nodeCode = $(".nodeTree").attr("data-index");
    var IP = $(".fpAddress").val();
    var $data = {
        ip: IP,
        nodecode: nodeCode,
        prenodecode: '',
        ipplancheck: ''
    };

    if (jcObj.ipPlanV4 == "Y") {
        $data.prenodecode = jcObj.sqzzCode;
        $data.ipplancheck = jcObj.ipPlanCheck;
    }

    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/IpAllocateCondition/getCheckIpunusedipalloc",
        dataType: "json",
        data: $data,
        success: function(data) {
            if (data.code == "0000") {
                var thisData = data.data;
                var oldDzTypeCode = "";
                var oldDzTypeName = "";
                var ghAddresCode = "";

                if (jcObj.ipPlanV4 == "Y" && jcObj.ipPlanCheck == "Y") {
                    if (thisData.PRENODECODE == undefined || thisData.PRENODECODE == null || thisData.PRENODECODE == "") {
                        jQuery.messager.alert('提示:', "无符合条件的空闲地址,请修改分配地址!", 'warning');
                        return false;
                    }
                }

                //                if(flag==0){
                //                    if(thisData.PRENODECODE==undefined||thisData.PRENODECODE==null||thisData.PRENODECODE==""){
                //                        jQuery.messager.alert('提示:',"无符合条件的空闲地址,请修改分配地址!",'warning');
                //                        return false;
                //                    } 
                //                }

                if (thisData.IPTYPEID != undefined || thisData.IPTYPEID != null) {
                    oldDzTypeCode = thisData.IPTYPEID;
                    oldDzTypeName = thisData.IPTYPENAME;

                }

                if (thisData.PRENODECODE != undefined || thisData.PRENODECODE != null) {
                    ghAddresCode = thisData.PRENODECODE;
                }

                $(".ydzType").val(oldDzTypeName);
                $(".ydzType").attr("data-index", oldDzTypeCode);
                $(".ydzType").attr("data-index2", ghAddresCode);

                if (oldDzTypeCode != "") {
                    var data = JSON.stringify({
                        userName: jcObj.userId,
                        nodeCode: jcObj.sqzzCode,
                        ipType: oldDzTypeCode,
                        authType: ""
                    });
                    $('#newDzType').combotree('setValues', [""]);
                    jcObj.newDzTypeCode = "";
                    jcObj.newDzTypeName = "";
                    //获取新地址类型
                    loadNewDzType(data);
                }
            } else {
                jQuery.messager.alert('提示:', data.tip, 'warning');
            }
        },
        error: function() {
            jQuery.messager.alert('提示:', "获取节点加载数据失败!", 'warning');
        }
    })
}

//初始化新地址类型
function loadNewDzType(data) {
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/IpAddrType/GetIPTypeV4List",
        dataType: "json",
        contentType: "application/json",
        data: data,
        success: function(data) {
            if (data.code == "0000") {
                var thisData = data.data;
                for (var i = 0; i < thisData.length; i++) {
                    var childrenData = thisData[i].children;
                    for (var j = 0; j < childrenData.length; j++) {
                        childrenData[j].fatherTypeCode = thisData[i].id;
                    }
                }
                initTree(thisData);
            } else {
                jQuery.messager.alert('提示:', data.tip, 'warning');
            }
        },
        error: function() {
            jQuery.messager.alert('提示:', "获取节点加载数据失败!", 'warning');
        }
    })
}

//新地址类型--生成节点树
function initTree(treeDate) {
    $('#newDzType').combotree({
        width: 140,
        lines: true,
        animate: true,
        data: treeDate,
        onClick: function(node) {
            jcObj.dzTypeData = node;
            if (node.click == "Y") {
                jcObj.newDzTypeCode = node.id;
                jcObj.newDzTypeName = node.ipTypeName;
            } else {
                $('#newDzType').combotree('setValues', [""]);
            }
        },
        onLoadSuccess: function(node, data) {},
        onChange: function(newValue, oldValue) {}
    });
}

//生成分配记录表
function getipdetaillists(data) {
    $(".tableDiv").html("");
    $(".tableDiv").html("<ul><li>序号</li><li>分配地址</li><li>地址数量</li><li>申请组织</li><li>新地址类型</li><li>原地址类型</li><li>备注</li><li>操作</li></ul>");
    if (data.length > 0) {
        var tableHtml = "";
        for (var i = 0; i < data.length; i++) {
            tableHtml += "<ul><li>" + data[i].rownum + "</li><li>" + data[i].inetnum + "</li><li>" + data[i].ipNum + "</li><li>" + data[i].NextNodeName + "</li><li>" + data[i].NewIpTypeName + "</li><li>" + data[i].IpTypeName + "</li><li>" + data[i].Remark + "</li><li><input type='button' value='删除' class='deletBtn' data-index='" + data[i].rownum + "'></li></ul>";
        }

        $(".tableDiv").append(tableHtml);
    }
}

//新增ip地址
function BatchAdd(xzData) {
    var $data = JSON.stringify(xzData);
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/IpAllocateCondition/BatchAdd",
        dataType: "json",
        contentType: "application/json",
        data: $data,
        success: function(data) {
            $(".bgDiv").hide();
            //console.log(data);/*[{rownum:'行号',msg:'错误描述'}]*/
            if (data.length == 0) {
                jQuery.messager.alert('提示:', "新增ip地址成功!", 'warning');
                // window.opener.parent.queryFormCheck();
                window.opener.queryAllocatedlist();
                //window.close();
            } else {
                var str = "";
                for (var i = 0; i < data.length; i++) {
                    str += data[i].rownum + "." + data[i].msg + "<br/>";
                }
                jQuery.messager.alert('提示:', str, 'warning');
            }
        },
        error: function() {
            jQuery.messager.alert('提示:', "新增ip地址加载数据失败!", 'warning');
        }
    })
}

//回填地址段，恢复地址类型信息
function xgIp() {
    $(".ydzType").val("");
    $(".ydzType").attr("data-index", "");
    $(".ydzType").attr("data-index2", "");

    var flag = 1;
    //获取空闲地址
    getCheckIpunusedipalloc(flag);
}

//校验单个ip地址
function ipjy1(ipStr) {
    //验证ipv4和ipv6
    var tel4 = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|0?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|0?[0-9]?[0-9])$/;

    if (ipStr != "") {
        if (ipStr.indexOf("-") > -1) {
            var ipdArr = ipStr.split("-");
            if (ipdArr.length > 2) {
                jQuery.messager.alert('提示:', ipStr + ":此IP地址格式错误,请修改!", 'warning');
                return false;
            } else {
                if (tel4.test(ipdArr[0]) == false || tel4.test(ipdArr[1]) == false || compareIP(ipdArr[0], ipdArr[1]) == false) {
                    jQuery.messager.alert('提示:', ipStr + ":此IP地址格式错误,请修改!", 'warning');
                    return false;
                }
            }
        } else if (ipStr.indexOf("/") > -1) {
            var arr = ipStr.split("/");
            if (arr.length > 2) {
                jQuery.messager.alert('提示:', ipStr + ":此IP地址格式错误,请修改!", 'warning');
                return false;
            } else {
                if (IPFormatting(arr[0]) == "Error" || isNaN(Number(arr[1])) || arr[1] > 32 || arr[1] < 1) {
                    jQuery.messager.alert('提示:', ipStr + ":此IP地址格式错误,请修改!", 'warning');
                    return false;
                }
            }
        } else {
            if (tel4.test(ipStr) == false) {
                jQuery.messager.alert('提示:', ipStr + ":此IP地址格式错误,请修改!", 'warning');
                return false;
            }
        }
    }

    return true;
}

//比较IP地址大小
function compareIP(ipBegin, ipEnd) {
    var temp1
    var temp2
    temp1 = ipBegin.split('.')
    temp2 = ipEnd.split('.')
    for (var i = 0; i < 4; i++) {
        if (parseInt(temp1[i]) > parseInt(temp2[i])) {
            return false;
        } else if (parseInt(temp1[i]) < parseInt(temp2[i])) {
            return true;
        }
    }

    return true;
}

/////////////////////////////////////////////////////////带掩码ip转成ip地址段
//IP转成整型
function _ip2int(ip) {
    var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
}
//整型解析为IP地址
function _int2iP(num) {
    var str;
    var tt = new Array();
    tt[0] = (num >>> 24) >>> 0;
    tt[1] = ((num << 8) >>> 24) >>> 0;
    tt[2] = (num << 16) >>> 24;
    tt[3] = (num << 24) >>> 24;
    str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
    return str;
}
//ip掩码转IP段
function subnet_mask_change_ip_segment(ip_str) {
    mark_len = 32;
    if (ip_str.search("/") != -1) {
        var strs = new Array();
        strs = ip_str.split("/");
    }
    ip = _ip2int(strs[0]);
    mark_len = strs[1];
    mark = 0xFFFFFFFF << (32 - mark_len) & 0xFFFFFFFF;
    ip_start = ip & mark;
    ip_end = ip | (~mark) & 0xFFFFFFFF;
    return _int2iP(ip_start) + '-' + _int2iP(ip_end);
}
////////////////////////////////////////////////////////////

//////////////////////////计算ip地址数量
//IP转数字
function ip2int(ip) {
    var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
}

//列出IP段内的IP,计算ip地址数量
function listIP(ip1, ip2) {
    var ipInt1 = ip2int(ip1);
    var ipInt2 = ip2int(ip2);

    var ipnum = ipInt2 - ipInt1 + 1;

    return ipnum;
}
//////////////////////////////////