var Syspara;
$(function() {
    $.messager.progress({　　　　　　　　 title: '提示', 　　　　　　　　msg: '', 　　　　　　　　text: "初始化页面加载中。。。。。。。", 　　　　　　　　interval: '600'　　　　 });
    initButton(); //初始化按钮
    Syspara = getSysPara(); //初始化系统参数，同步处理
    initIpNumInApply(); //初始化单位转换后地址数量，异步就行了速度很快
    initIpClassType(); //初始化地址类型，同步处理
    $.messager.progress('close');

});
//初始化地址数量
function initIpNumInApply() {
    $.post("ipaddrmodule/SysCommon//ipNumFormatToBCUpt/" + $.trim($("#IpNumber").val()), function(data) { $("#IpNumInApply").html($.trim(data)); });
}
//初始化参数
function initButton() {
    $(".fpdzBtn").bind('click', function() {
        fpdz();
    });
    $(".closeBtn").bind('click', function() {
        $.messager.confirm('确认', '您确认想要关闭窗口？', function(r) {
            if (r) {
                window.close();
            }
        });
    });
    $(".sureBtn").bind('click', function() {
        sub();
    });
}
//初始化地址类型
function initIpClassType() {
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=UTF-8",
        url: "ipaddrmodule/IpAddrType/GetIPTypeV4List",
        data: JSON.stringify({ "userName": $("#LoginName").val(), "authType": "CFG", "nodeCode": $("#NextNodeCode").val() }),
        dataType: "json",
        success: function(msg) {
            if (msg.code == "0000") {
                var thisData = msg.data;
                $('#IpClassType').combotree({
                    data: thisData,
                    editable: false,
                    value: $("#oldIPClassType").val(),
                    height: 25,
                    onSelect: function(record) {
                        console.log(JSON.stringify(record));
                        var cli = record.click;
                        if (cli && cli == 'N') {
                            $("#IpClassType").combotree('setValue', "");
                            $(this).combo("showPanel");
                        }
                    },
                    onChange: function(newValue, oldValue) {
                        //changeAppointDev();
                    }
                });

            } else {
                jQuery.messager.alert('提示:', msg.tip, 'warning');
            }
        },
        complete: function() {},
        error: function() {
            $.messager.alert('警告', '查询失败！', 'info');
        }
    });
}
//获取系统参数
function getSysPara() {
    var keys = ['IsIPtypeNull', 'IPPlanV4', 'IPPlanCheck', 'IPTypeCheck'];
    var para = {};
    $.each(keys, function(i, n) {
        $.ajax({
            type: "post",
            url: "ipaddrmodule/SysCommon/getSysPara",
            dataType: "json",
            async: false,
            data: {
                ParaName: n
            },
            success: function(data) {
                if (data.code == "0000") {
                    para[n] = data.data.PARAVALUE;
                    if (n == 'IsIPtypeNull') {
                        if (data.data.PARAVALUE == 'Y') {
                            $(".newDzTypeSpan").hide();
                        } else {
                            $(".newDzTypeSpan").show();

                        }
                    }
                } else {
                    para[n] = "";
                }
            },
            error: function() {
                para[n] = "";
            }
        });
    });
    return para;
}
//分配地址按钮
function fpdz() {
    if (!$("#NextNodeCode").val()) {
        jQuery.messager.alert('提示:', "申请组织不存在，异常进入", 'warning');
        window.close();
    } else {
        var nodeCode = $("#NodeCode").val();
        var nextNodeCode = $("#NextNodeCode").val();
        var IpClassType = $("#IpClassType").combotree('getValue');
        var IpNumber = $("#IpNumber").val();
        if (Syspara.IsIPtypeNull == 'N' && !IpClassType) {
            jQuery.messager.alert('提示:', "请先选择地址类型", 'warning');
            return false;
        }
        var url = "";
        if (Syspara.IPPlanV4 == "Y") {
            url = "nos/ipaddrmanage/unusedipalloc/unusedIpAllotCondition.jsp?title=分配&IpClassType=" + IpClassType + "&ANodeCode=" + nextNodeCode + "&NodeCode=" + nodeCode + "&NextNodeCode=" + nextNodeCode + "&prenodecode=" + nextNodeCode + "&ipplancheck=" + Syspara.IPPlanCheck + "&ipRange=&allotClassType=all&allotType=single" + "&IpNumber=" + IpNumber + "&showFatherType=" + IpClassType;
        } else {
            url = "nos/ipaddrmanage/unusedipalloc/unusedIpAllotCondition.jsp?title=分配&IpClassType=" + IpClassType + "&ANodeCode=" + nextNodeCode + "&NodeCode=" + nodeCode + "&NextNodeCode=" + nextNodeCode + "&ipRange=&allotClassType=all&allotType=single" + "&IpNumber=" + IpNumber + "&showFatherType=" + IpClassType;
        }

        window.open(url, "", 'toolbar=yes,directories=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600,left=0,top=0');
    }
}
//保存操作
function sub() {
    var fields = $('#formSub').serializeArray();
    var result = {};
    if (Syspara.IsIPtypeNull == 'N' && $("#IpClassType").combotree('getValue') == '') jQuery.messager.alert('提示:', "新地址类型不能为空!", 'warning');
    $.each(fields, function(i, field) {
        if (field.value) {
            if (field.name == 'IPClassType') {
                result[field.name] = $("#IpClassType").combotree('getValue');
            } else {
                result[field.name] = field.value;
            }
        }
    });
    if (!result.inetnum) return jQuery.messager.alert('提示:', "分配地址不能为空!", 'warning');
    if (!result.IPClassType && Syspara.IsIPtypeNull == 'N') return jQuery.messager.alert('提示:', "新地址类型不能为空!", 'warning');
    result.NewIpTypeCode = result.IPClassType
    result.IpTypeCode = $("input[name='IpTypeCode']").val()
    var $data = JSON.stringify([result]);
    $.ajax({
        type: "post",
        url: "ipaddrmodule/IpAllocateCondition/BatchAdd",
        dataType: "json",
        contentType: "application/json",
        data: $data,
        beforeSend: function(XMLHttpRequest) {
            $.messager.progress({　　　　　　　　 title: '提示', 　　　　　　　　msg: '', 　　　　　　　　text: "比准进行中。。。。。。。", 　　　　　　　　interval: '600'　　　　 });
        },
        success: function(data) {
            console.log(data); /*[{rownum:'行号',msg:'错误描述'}]*/
            if (data.length == 0) {
                //jQuery.messager.alert('提示:', "批准成功！", 'warning');
                //window.opener.parent.queryFormCheck();
                //window.close();
                //分配成功，后修改申请单状态
                result.ApplyRemarksInPermit = result.inetnum;
                result.ApplyState = '02';
                $.ajax({
                        type: "post",
                        url: "ipaddrmodule/Ipv4/Approval/Ratify",
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(result),
                        success: function(data) {
                            window.opener.parent.queryFormCheck();
                            jQuery.messager.alert('提示:', "分配成功！", 'warning');
                            $('.closeBtn').trigger('click')
                        }
                    })
                    // $.post("ipaddrmodule/Ipv4/Approval/Ratify", { data: JSON.stringify(result) }, function(json) {
                    //     window.opener.parent.queryFormCheck();
                    // }, "json");
            } else {
                var str = "";
                for (var i = 0; i < data.length; i++) {
                    str += data[i].rownum + "." + data[i].msg + "<br/>";
                }
                jQuery.messager.alert('提示:', str, 'warning');
            }

        },
        error: function() {
            jQuery.messager.alert('提示:', "分配地址失败!", 'warning');
        },
        complete: function(XMLHttpRequest, textStatus) {
            $.messager.progress('close');
        }
    });
}
//地址自动分配回调函数
function xgIp() {
    var flag = 1;
    //获取空闲地址
    getCheckIpunusedipalloc(flag);
}
//获取空闲地址
function getCheckIpunusedipalloc(flag) {
    var nodeCode = $.trim($("#NodeCode").val());
    var IP = $(".fpAddress").val();
    var $data = {
        ip: IP,
        nodecode: nodeCode,
        prenodecode: '',
        ipplancheck: ''
    };
    if (Syspara.IPPlanV4 && Syspara.IPPlanV4 == "Y") {
        $data.prenodecode = $("#NextNodeCode").val();
        $data.ipplancheck = Syspara.IPPlanCheck;
    }
    $.ajax({
        type: "post",
        url: "ipaddrmodule/IpAllocateCondition/getCheckIpunusedipalloc",
        dataType: "json",
        data: $data,
        success: function(data) {
            if (data.code == "0000") {
                var thisData = data.data;
                var oldDzTypeCode = "";
                var oldDzTypeName = "";
                var ghAddresCode = "";
                if (Syspara.IPPlanV4 == "Y" && Syspara.IPPlanCheck == "Y") {
                    if (thisData.PRENODECODE == undefined || thisData.PRENODECODE == null || thisData.PRENODECODE == "") {
                        jQuery.messager.alert('提示:', "无符合条件的空闲地址,请修改分配地址!", 'warning');
                        cleanInetnum();
                        return false;
                    }
                }
                if (thisData.IPTYPEID != undefined || thisData.IPTYPEID != null) {
                    oldDzTypeCode = thisData.IPTYPEID;
                    oldDzTypeName = thisData.IPTYPENAME;

                }
                if (thisData.PRENODECODE != undefined || thisData.PRENODECODE != null) {
                    ghAddresCode = thisData.PRENODECODE;
                }
                $(".ydzType").val(oldDzTypeName);
                $("input[name='IpTypeCode']").val(oldDzTypeCode);
                $("#PreNodeCode").val(ghAddresCode);
                $('.IpClassTypeLi').css('pointer-events', 'none')
            } else {
                jQuery.messager.alert('提示:', data.tip, 'warning');
                cleanInetnum();
                return false;
            }
        },
        error: function() {
            jQuery.messager.alert('提示:', "校验地址信息失败!", 'warning');
            cleanInetnum();
            return false;
        }
    })
}
/**
 * 清空地址信息
 * @return
 */
function cleanInetnum() {
    $(".fpAddress").val("");
    $(".ydzType").val("");
    $("input[name='IpTypeCode']").val("");
    $("#PreNodeCode").val("");
}
$('.qkBtn').click(function() {
    $('.fpAddress').val('')
    $('.ydzType').val('')
    $('#oldIPClassType').val('')
    $("input[name='IpTypeCode']").val('')
    $("#PreNodeCode").val('');
    $('input[name="IpTypeCode"]').val('')
    $('.IpClassTypeLi').css('pointer-events', 'auto')
})