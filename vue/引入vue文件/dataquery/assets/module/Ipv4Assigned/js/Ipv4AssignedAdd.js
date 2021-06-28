$(function () {
    loadIpYyfwlxData();
    getIpTypeList($("#NodeCode").val());
    if (urlObj.type == 'mod') {
        queryAllocatedlist(urlObj.InetnumID)
        $("#dzfp").hide()
    } else {
        changebaktab("NetAssigned"); //修改页面建议新写一个和这个一样的页面，用户和网络那俩建议共用一个，用js控制对应的地址类型和IP
    }
    $("#save").on('click', function () {
        if (urlObj.type == 'mod') {
            save()
        } else {
            beforeSave();
        }

    });
    ArchFlagChange()
});
var curlPath = window.document.location.href;
var pathName = window.document.location.pathname;
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var tempName = "/ipaddrmodule"; //当前文件的跟目录
var bathPath = "";
if (projectName == tempName) {
    projectName = "";
} else {
    bathPath = curlPath.substring(0, pathName.indexOf('/')) + projectName;
}
// bathPath = "";//环境上需要注释掉
let userName = jQuery.ITE.getLoginName('loginName'); //登录用户
let queryAllPage = { //汇总查询
    pageSize: 20,
    pageNum: 1,
    total: 0,
}
var ipclasstypelist;
var IpYyfwlxnet = [];
var IpYyfwlxuser = [];
var BackData = {};
var urlObj = new UrlSearch();
var AssigendUP = {};
$.ajaxSetup({
    async: false
});
var deviceNameList = []

//查询设备
function getDeviceList() {
    let params = {
        nodescope: "all",
        nodeCode: "NOD999",
        devscope: 'indistinct',
        changeType: "0",
        pagesize: '0',
        pageno: '0'
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/device/DeviceVindicate/queryDeviceList'),
        type: 'POST',
        data: JSON.stringify(params),
        dataType: 'json',
        async: false,
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success: function (obj) {
            if (obj.code == "0000") {
                deviceNameList = obj.data.result
                deviceNameList.unshift({
                    "deviceName":'请选择设备',
                    "deviceId":''
                })
                for (let i = 0, len = $(".devItem").length; i < len; i++) {
                    let domId = "#DeviceName" + i
                    $(domId).combobox({
                        valueField: 'deviceId',
                        textField: 'deviceName',
                        data: obj.data.result,
                        width: 220,
                        panelHeight: 'auto', //高度自适应
                        multiple: false,
                        editable: true, //定义用户是否可以直接往文本域中输入文字
                        //直接过滤，数据太多时不行，太卡了，放弃
                        onLoadSuccess: function () {
                            // console.log(deviceName)
                            // if(deviceName){
                            //     $(domId).combobox('setValue', deviceName)
                            // }
                        },
                        filter: function (q, row) {
                            var opts = $(domId).combobox('options');
                            return row[opts.textField].indexOf(q) != -1;
                        },
                        onSelect: function (row) { //点击节点联动地址类型
                            // console.log("#DeviceLoopback"+i)
                            $("#DeviceLoopback" + i).val(row.loopAddress ? row.loopAddress : "")
                        }
                    })
                }
            } else {
                $.messager.alert('提示', obj.tip, 'error');
            }

        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function () {

        }
    });
}

function loadBack() { //加载默认备案信息
    var nodeCode = $("#NodeCode").val();
    //获取当前combotree的tree对象
    var tree = $('#IpClassType').combotree('tree');
    //获取当前选中的节点
    var data = tree.tree('getSelected');
    //查看当前选中节点的id
    var ipTypeCode = data.id
    var ipTypeCodeIsnull = "";
    if (!ipTypeCode) {
        ipTypeCodeIsnull = "Y";
    }
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=UTF-8",
        url: bathPath + "/ipaddrmodule/DefaultFiling/queryFiling?nodeCode=" + nodeCode + "&ipTypeCode=" + ipTypeCode + "&ipTypeCodeIsnull=" + ipTypeCodeIsnull + "&ipVersion=IPV4",
        dataType: "json",
        multiple: true,
        success: function (msg) {
            var code = msg.code;
            if (code == "0000") {
                if (msg.data.length > 0) {
                    BackData = msg.data[0];
                    setBack()
                } 
                // else {
                //     BackData = {};
                //     setBack()
                // }
            } else {
                jQuery.messager.alert('提示:', msg.tip, 'warning');
            }
        }

    });
}

function loadIpYyfwlxData() { //加载应用服务类型
    $.ajax({
        type: "get",
        async: false,
        contentType: "application/json; charset=UTF-8",
        url: bathPath + "/ipaddrmodule/IpPublicInterface/IpYyfwlx",
        dataType: "json",
        success: function (obj) {
            if (obj.code == '0000') {
                $.each(obj.data, function (index, temp) {
                    switch (temp.FLID) {
                        case "501":
                            temp["groupField"] = "接入点(网络位置)";
                            IpYyfwlxnet.push(temp);
                            break;
                        case "502":
                            temp["groupField"] = "接入方式";
                            IpYyfwlxuser.push(temp);
                            break;
                        case "503":
                            temp["groupField"] = "业务服务";
                            IpYyfwlxuser.push(temp);
                            break;
                        case "504":
                            temp["groupField"] = "应用类型";
                            IpYyfwlxuser.push(temp);
                            break;
                    }
                });
            } else {
                jQuery.messager.alert('提示:', obj.tip, 'warning');
            }
        },
        complete: function () {},
        error: function () {
            $.messager.alert('警告', '查询失败！', 'info');
        }
    });
}

function getIpTypeList(nodeCode) { //加载地址类型
    $('.clearBtn').css('display', 'none')
    let params = {
        userName: $("#LoginName").val(),
        nodeCode: nodeCode,
        ipType: "",
        authType: "CFG",
    }
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=UTF-8",
        url: bathPath + "/ipaddrmodule/IpAddrType/GetIPTypeV4List",
        data: JSON.stringify(params),
        dataType: "json",
        success: function (obj) {
            ipclasstypelist = obj.data;
            ipclasstypelist.unshift({
                id: "",
                text: "请选择"
            });
        },
        complete: function () {},
        error: function () {
            $.messager.alert('警告', '查询失败！', 'info');
        }
    });
}

function changebaktab(status) { //切换地址状态
    var url;
    switch (status) {
        case "UserAssigned":
            url = bathPath + "/ipaddrmodule/views/jsp/Ipv4Assigned/UserAssigend.jsp";
            break;
        default:
            url = bathPath + "/ipaddrmodule/views/jsp/Ipv4Assigned/NetAssigend.jsp";
    }
    $("#showIpStatus").load(url, {
        NodeName: $("#NodeName").val()
    }, function () {
        loadPanel(); //初始化面板
        getDeviceList()
        addDev()
        layui.use('form', function () {
            var form = layui.form;
            form.on('radio(level)', function (data) { //绑定单选框事件
                changebaktab(data.value);
            });

            // if(urlObj.type == 'mod'){
            //     $("#ArchFlag").val(1);
            //     selArchFlag();
            // }
            // form.on('select(ArchFlag)', function (data) {//绑定单选框事件
            //     selArchFlag();
            // });
            $("#ArchFlag").val(1)
            ArchFlagChange()
            form.render();
        });
        //子页面初始化的内容在此处做
        initLayuiObj();
        initCombobox();
        loadBackAreaCode("ProvinceID", "", "1");
        loadBackAreaCode("CityID", AssigendUP.ProvinceID, "2");
        loadBackAreaCode("CountyID", AssigendUP.CityID, "3");
        loadBackAreaCode("WgShengId", "", "1");
        loadBackAreaCode("WgShiId", AssigendUP.WgShengId, "2");
        loadBackAreaCode("WgXianId", AssigendUP.WgShiId, "3");
        IpBacksydwzjlx(AssigendUP.UseUnitFlag)
        CustIndustry()
        getCodeBook("BackClass", 'inetnum', 'BackClass');
        getCodeBook("UseUnitLevel", 'inetnum', 'UseUnitLevel');
        getCodeBook("UseUnitFlag", 'inetnum', 'UseUnitFlag');
        IpBackIsp()
        if (urlObj.type == 'mod') {
            $("#dzfp").on('click', function () {
                autoallot($("#NodeCode").val(), "single", "mod");
            });
        } else {
            $("#dzfp").on('click', function () {
                autoallot($("#NodeCode").val(), "single", "add");
            });
        }
        setIpClassType(status);

        switch (status) {
            case "UserAssigned":
                loadYyfwlx(IpYyfwlxuser);
                break;
            default:
                loadYyfwlx(IpYyfwlxnet);
        }
        loadBack();
    });
    //  console.log(111)
}

function loadPanel() { //加载面板
    $('#base').panel({
        collapsible: true,
        title: '基本信息'
    });
    $("#Detailed").panel({
        collapsible: true,
        collapsed: true,
        title: '详细信息'
    });
    $("#ipback").panel({
        collapsible: true,
        collapsed: true,
        title: '备案信息',
        onBeforeExpand: function () {
            //   setBack();
        }
    });

}

function setBack() { //添加默认备案信息
    if (!$.isEmptyObject(BackData)) {
        var fields = $(".layui-form").serializeArray();
        let YyfwlxArr = []
        let dataArr1 = $("#Yyfwlx").combobox('getData')
        let dataArr2 = BackData.backYyfwlx ? BackData.backYyfwlx.split(',') : []
        for (let i = 0, len = dataArr1.length; i < len; i++) {
            for (let j = 0, length = dataArr2.length; j < length; j++) {
                if (dataArr1[i].APPSERVID === dataArr2[j] && dataArr2[j] != '') {
                    YyfwlxArr.push(dataArr2[j])
                }
            }
        }
        $("#Yyfwlx").combobox('setValues', YyfwlxArr ? YyfwlxArr : [])
        $.each(fields, function (i, field) {
            // if($("#"+field.name).hasClass('layui-input')){
            //     $("#"+field.name).val(BackData['back'+field.name])
            // }else if($("#"+field.name).hasClass('easyui-combobox')){
            //     $("#"+field.name).combobox('setValue',BackData['back'+field.name])
            // }else{
            //     $("#"+field.name).val(BackData['back'+field.name])
            // }
            switch (field.name) {
                case "NodeCode":
                    $("#NodeCode").val(BackData.nodeCode)
                    break;
                case "NodeName":
                    $("#NodeName").val(BackData.nodeName)
                    break;
                case "ProvinceID":
                    if (!$("#ProvinceID").combobox('getValue')) {
                        $("#ProvinceID").combobox('setValue', BackData.backProvince);
                    };
                    break;
                case "CityID":
                    if (!$("#CityID").combobox('getValue')) {
                        if (BackData.backProvince) {
                            loadBackAreaCode("CityID", BackData.backProvince, "2");
                            $("#CityID").combobox('setValue', BackData.backCity);
                        }
                    };
                    break;
                case "CountyID":
                    if (!$("#CountyID").combobox('getValue')) {
                        if (BackData.backProvince && BackData.backCity) {
                            loadBackAreaCode("CountyID", BackData.backCity, "3");
                            $("#CountyID").combobox('setValue', BackData.backCounty);
                        }
                    };
                    break;
                case "WgShengId":
                    if (!$("#WgShengId").combobox('getValue')) {
                        $("#WgShengId").combobox('select', BackData.backWgShengId)
                    };
                    break;
                case "WgShiId":
                    if (!$("#WgShiId").combobox('getValue')) {
                        $("#WgShiId").combobox('select', BackData.backWgShiId)
                    };
                    break;
                case "WgXianId":
                    if (!$("#WgXianId").combobox('getValue')) {
                        $("#WgXianId").combobox('setValue', BackData.backWgXianId)
                    };
                    break;
                case "UseUnitFlag":
                    // IpBacksydwzjlx(BackData.UseUnitFlag)
                    if (!$("#UseUnitFlag").combobox('getValue')) {
                        $("#UseUnitFlag").combobox('setValue', BackData.backUnitFlag)
                    };
                    break;
                case "Sydwzjlx":
                    if (!$("#Sydwzjlx").combobox('getValue')) {
                        $("#Sydwzjlx").combobox('setValue', BackData.backSydwzjlx)
                    };
                    break;
                case "Yyfwlx":
                    if ($("#Yyfwlx").combobox('getValues').length) {
                        let YyfwlxArr = []
                        let dataArr1 = $("#Yyfwlx").combobox('getData')
                        let dataArr2 = BackData.backYyfwlx ? BackData.backYyfwlx.split(',') : []
                        for (let i = 0, len = dataArr1.length; i < len; i++) {
                            for (let j = 0, length = dataArr2.length; j < length; j++) {
                                if (dataArr1[i].APPSERVID === dataArr2[j]) {
                                    YyfwlxArr.push(dataArr2[j])
                                }
                            }
                        }
                        //   console.log(YyfwlxArr)                
                        $("#Yyfwlx").combobox('setValues', YyfwlxArr)
                    };
                    break;
                case "Syqy":
                    if (!$("#Syqy").val()) {
                        $("#Syqy").val(BackData.backSyqy)
                    };
                    break;
                case "Sydwzjhm":
                    if (!$("#Sydwzjhm").val()) {
                        $("#Sydwzjhm").val(BackData.backSydwzjhm)
                    };
                    break;
                case "GatewayIP":
                    if (!$("#GatewayIP").val()) {
                        $("#GatewayIP").val(BackData.backGatewayIP)
                    };
                    break;
                case "GatewayLocation":
                    if (!$("#GatewayLocation").val()) {
                        $("#GatewayLocation").val(BackData.backGatewayLocation)
                    };
                    break;
                case "IndustryID":
                    if (!$("#IndustryID").combobox('getValue')) {
                        CustIndustry()
                        $("#IndustryID").combobox('setValue', BackData.backIndustryID);
                    };
                    break;
                case "Phone":
                    if (!$("#Phone").val()) {
                        $("#Phone").val(BackData.backTel)
                    };
                    break;
                case "Email":
                    if (!$("#Email").val()) {
                        $("#Email").val(BackData.backEMail)
                    };
                    break;
                case "Contact":
                    if (!$("#Contact").val()) {
                        $("#Contact").val(BackData.backContact)
                    };
                    break;
                case "BackUnit":
                    if (!$("#BackUnit").val()) {
                        $("#BackUnit").val(BackData.backUnit)
                    };
                    break;
                case "BackAddress":
                    if (!$("#BackAddress").val()) {
                        $("#BackAddress").val(BackData.backAddress)
                    };
                    break;
                case "BackClass":
                    if (!$("#BackClass").combobox('getValue')) {
                        // getCodeBook("BackClass",'inetnum', 'BackClass');
                        $("#BackClass").combobox('setValue', BackData.backClass);
                    };
                    break;
                case "UseUnitLevel":
                    if (!$("#UseUnitLevel").combobox('getValue')) {
                        // getCodeBook("UseUnitLevel",'inetnum', 'UseUnitLevel');
                        $("#UseUnitLevel").combobox('setValue', BackData.backUnitLevel);
                    };
                    break;

                case "TelecomLicense":
                    if (!$("#TelecomLicense").val()) {
                        $("#TelecomLicense").val(BackData.backLicenseCode)
                    };
                    break;
                case "IndustryID":
                    if (!$("#IndustryID").combobox('getValue')) {
                        $("#IndustryID").combobox('setValue', BackData.backIndustryID);
                    };
                    break;
                case "ReAllocateUnitID":
                    if (!$("#ReAllocateUnitID").combobox('getValue')) {
                        IpBackIsp()
                        $("#ReAllocateUnitID").combobox('setValue', BackData.reAllocateUnitID);
                    };
                    break;
                case "IfReAllocation":
                    $("#IfReAllocation").val(BackData.ifReAllocation);
                    break;
                default:
            }
        });
        $("#ArchFlag").val(1)
        if ($('#ArchFlag').val() == '1') {
            $("#ipback").find('.tip').show();
        } else {
            $("#ipback").find('.tip').hide();
            // form.render('select');//select是固定写法 不是选择器
        }
        if ($('#IfReAllocation').val() == '1') {
            $(".IfReAllocationFlag").show();
        } else {
            $(".IfReAllocationFlag").hide();
            // form.render('select');//select是固定写法 不是选择器
        }
        layui.form.render()
    } else {
        var fields = $('#ipback .layui-input-inline').children();
        // console.log(fields)
        $.each(fields, function (i, field) {
            // console.log($(this).hasClass('layui-input'))
            if ($(this).hasClass('layui-input')) {
                $(this).val('')
            } else if ($(this).hasClass('easyui-combobox')) {
                $(this).combobox('setValue', '')
            } else {
                $(this).val('')
            }
            $("#Yyfwlx").combobox('setValues', [])
            $("#ArchFlag").val(1)
            if ($('#ArchFlag').val() == '1') {
                $("#ipback").find('.tip').show();
            } else {
                $("#ipback").find('.tip').hide();
                // form.render('select');//select是固定写法 不是选择器
            }
            if ($('#IfReAllocation').val() == '1') {
                $(".IfReAllocationFlag").show();
            } else {
                $(".IfReAllocationFlag").hide();
                // form.render('select');//select是固定写法 不是选择器
            }
            layui.form.render()
        })
    }
}

function autoallot(nodecode, allotType, opertype) { //点击分配按钮
    var ipaddrs = "";
    if ($("#ipRangeArea").length > 0) {
        ipaddrs = $.trim($("#ipRangeArea").val());
    } else {
        ipaddrs = $.trim($("#ipRange").val());
    }
    var allotClassType = "";
    var IpClassType = $("#IpClassType").combotree('getValue');
    if (opertype == "add") {
        allotClassType = getAllotClassType();
    } else if (opertype == "mod") {
        var oldStatus = $("#oldStatus").val();
        if ("NetAssigned" == oldStatus) {
            allotClassType = "net";
        } else if ("UserAssigned" == oldStatus) {
            allotClassType = "user";
        } else {
            allotClassType = getAllotClassType();
        }
    }
    var tmpstr = bathPath + "/nos/ipaddrmanage/unusedipalloc/unusedIpAllotCondition.jsp?IpClassType=" + IpClassType + "&NodeCode=" + nodecode + "&allotType=" + allotType + "&ipRange=" + ipaddrs + "&allotClassType=" + allotClassType;
    window.open(tmpstr, '', 'toolbar=yes,directories=no,menubar=no,scrollbars=yes,resizable=yes,width=1200,height=500,left=0,top=0');
}

function getAllotClassType() { //获取分配类型
    var allotClassType = "";
    var ipstatus = $('input[name="Status"]:checked').val();
    if (ipstatus == "UserAssigned") {
        allotClassType = "user";
    } else {
        allotClassType = "net";
    }
    return allotClassType;
}

function setIpClassType(type) { //初始化地址类型
    var temparray = [{
        id: "",
        text: "请选择"
    }];
    for (var i = 0; i < ipclasstypelist.length; i++) {
        var temp = ipclasstypelist[i];
        var id = temp.id;
        if (type == 'NetAssigned') {
            if (id == 'ipclass01' || id == 'ipclass02') {
                temparray.push(temp);
            }
        } else {
            if (id == 'ipclass03') {
                temparray.push(temp);
            }
        }
    }
    $('#IpClassType').combotree({
        data: temparray,
        editable: false,
        height: 25,
        width: 220,
        onSelect: function (record) {
            loadBack();
            var cli = record.click;
            if (cli == 'N') {
                $("#IpClassType").combotree('setValue', "");
            } else {
                if ($("[name='Status']:radio").val() == 'NetAssigned') {
                    getUseTypeInfo(record.id);
                }
            }
        }
    });
}
//使用方式与网络类型关联
function getUseTypeInfo(typeid) { //切换使用方式
    $.ajax({
        url: bathPath + "/nos/ipaddrmanage/ipaddress/getUseTypeInfo.jsp?typeid=" + typeid,
        cache: false,
        async: false,
        success: function (data) {
            if (jQuery.trim(data) != "") {
                data = jQuery.trim(data);
                if (data == "01") {
                    $("#useTypeName").html("动态");
                    $("#UseTypeID").val("2");
                } else if (data == "02" || data == "04") {
                    $("#useTypeName").html("静态");
                    $("#UseTypeID").val("1");
                }
            }
        }
    });
}

function beforeSave() {
    if (check()) {
        // console.log($("#NodeCode").val())
        // var nodecode = $("#NodeCode").val();
        var ipresult = $("#ipRangeArea").val();
        //获取当前combotree的tree对象
        var tree = $('#IpClassType').combotree('tree');
        //获取当前选中的节点
        var data = tree.tree('getSelected');
        //查看当前选中节点的id
        var IPClassType = data.id
        var oldtypeid = "";
        let flag = true
        $.ajax({
            type: "post",
            url: bathPath + "/ipaddrmodule/IpAllocateCondition/getCheckIpunusedipalloc",
            dataType: "json",
            async: false,
            data: {
                'nodecode': urlObj.NodeCode,
                'ip': ipresult
            },
            success: function (data) {
                if (data.code == "0000") {
                    var thisData = data.data;
                    if (thisData.IPTYPEID != undefined || thisData.IPTYPEID != null) {
                        oldtypeid = thisData.IPTYPEID;
                    }
                } else {
                    alert(data.tip);
                    flag = false
                }
            }
        });

        var IPTypeCheck;
        var msgs = "确定注册地址吗？";
        if (flag) {
            $.ajax({
                type: "POST",
                async: false,
                url: bathPath + "/ipaddrmodule/IpAddrType/getIPTypeCheck",
                success: function (msg) {
                    IPTypeCheck = $.trim(msg);
                }
            });

            if (IPTypeCheck && IPTypeCheck != 'Y') {
                if (IPClassType != oldtypeid) {
                    msgs = "地址类型和分配地址类型不一致,确定注册地址吗？";
                }
            } else {
                if (oldtypeid && IPClassType != oldtypeid) {
                    alert("地址类型和分配地址类型不一致,请修改！");
                    return false;
                } else {

                }
            }
            if (confirm(msgs)) {
                save();
            }
        }
    }
}

function save() { //保存
    if (check()) {
        let params = {};
        var fields = $('.layui-form').serializeArray();
        $.each(fields, function (i, field) {
            //  if (field.value) {
            switch (field.name) {
                case "IpClassType":
                    //获取当前combotree的tree对象
                    var tree = $('#IpClassType').combotree('tree');
                    //获取当前选中的节点
                    var data = tree.tree('getSelected');
                    //查看当前选中节点的id
                    params.IpTypeCode = data.id
                    break;
                case "ProvinceID":
                    params[field.name] = $("#ProvinceID").combobox('getValue');
                    break;
                case "CityID":
                    params[field.name] = $("#CityID").combobox('getValue');
                    break;
                case "CountyID":
                    params[field.name] = $("#CountyID").combobox('getValue');
                    break;
                case "WgShengId":
                    params[field.name] = $("#WgShengId").combobox('getValue');
                    break;
                case "WgShiId":
                    params[field.name] = $("#WgShiId").combobox('getValue');
                    break;
                case "WgXianId":
                    params[field.name] = $("#WgXianId").combobox('getValue');
                    break;
                case "UseUnitFlag":
                    params[field.name] = $("#UseUnitFlag").combobox('getValue');
                    break;
                case "Sydwzjlx":
                    params[field.name] = $("#Sydwzjlx").combobox('getValue');
                    break;
                case "Yyfwlx":
                    params[field.name] = $("#Yyfwlx").combobox('getValues').join(',');
                    break;
                case "IndustryID":
                    params[field.name] = $("#IndustryID").combobox('getValue');
                    break;
                case "BackClass":
                    params[field.name] = $("#BackClass").combobox('getValue');
                    break;
                case "UseUnitLevel":
                    params[field.name] = $("#UseUnitLevel").combobox('getValue');
                    break;
                case "ReAllocateUnitID":
                    params[field.name] = $("#ReAllocateUnitID").combobox('getValue');
                    break;
                    a
                    //修改入参名称
                case "ipRangeArea":
                    params.inetnum = $("#ipRangeArea").val();
                    params.inetnumStart = formatIP(checkInetnum($("#ipRangeArea").val()).split('-')[0]);
                    params.inetnumEnd = formatIP(checkInetnum($("#ipRangeArea").val()).split('-')[1]);
                    break;
                default:
                    params[field.name] = field.value;
            }
            //  }
        });
        params.Yyfwlx = $("#Yyfwlx").combobox('getValues').join(',')
        params.ReplyMan = userName
        params.IPVersion = 'IPv4'
        params.PrivateFlag = '0'
        params.NextNodeCode = params.NodeCode
        params.LYsystem = $("#LYsystem").val()
        params.SecurityResponseUnit = $("#SecurityResponseUnit").val()
        params.SecurityResponsePerson = $("#SecurityResponsePerson").val()
        params.SecurityResponsePersonTel = $("#SecurityResponsePersonTel").val()
        params.gmBusiapproveNo = $("#gmBusiapproveNo").val()
        params.InterPurpose = $("#InterPurpose").val()
        let url = '/ipaddrmodule/IpAssigned/BathIpAssignedAdd'
        if (urlObj.type == 'mod') {
            params.InetnumID = urlObj.InetnumID
            url = '/ipaddrmodule/IpAssigned/BathIpAssignedUp'
        }
        if (params.Status == "NetAssigned") {
            params.NetTypeId = params.IpTypeCode
        } else {
            params.UserTypeId = params.IpTypeCode
        }
        let DeviceLoopbackArr = []
        let DeviceNameArr = []
        let PortNameArr = []
        let portSpeedArr = []
        let ippoolnameArr = []
        let vpnnameArr = []
        let UseDescrArr = []
        let cvlanArr = []
        let svlanArr = []
        for (var i = 0, len = $(".devItem").length; i < len; i++) {
            if($(".DeviceLoopback")[i].value || $("#DeviceName" + i).combobox('getText') || $(".PortName")[i].value || $(".portSpeed")[i].value || $(".ippoolname")[i].value || $(".vpnname")[i].value || $(".UseDescr")[i].value || $(".cvlan")[i].value || $(".svlan")[i].value ){
                DeviceLoopbackArr.push($(".DeviceLoopback")[i].value)
                DeviceNameArr.push($("#DeviceName" + i).combobox('getText') == '请选择设备'?"":$("#DeviceName" + i).combobox('getText'))
                PortNameArr.push($(".PortName")[i].value)
                portSpeedArr.push($(".portSpeed")[i].value)
                ippoolnameArr.push($(".ippoolname")[i].value)
                vpnnameArr.push($(".vpnname")[i].value)
                UseDescrArr.push($(".UseDescr")[i].value)
                cvlanArr.push($(".cvlan")[i].value)
                svlanArr.push($(".svlan")[i].value)
            }else{
               
            }
        }
        //如果最后一个为空，不拼接
        for(var i=DeviceLoopbackArr.length-1; i>=0 ; i-- ){
            if (DeviceLoopbackArr[i] == "") {
                DeviceLoopbackArr.splice(i, 1);
            }else{
                break;
            }
        }
        for(var i=DeviceNameArr.length-1; i>=0 ; i-- ){
            if (DeviceNameArr[i] == "") {
                DeviceNameArr.splice(i, 1);
            }else{
                break;
            }
        }
        for(var i=PortNameArr.length-1; i>=0 ; i-- ){
            if (PortNameArr[i] == "") {
                PortNameArr.splice(i, 1);
            }else{
                break;
            }
        }
        for(var i=portSpeedArr.length-1; i>=0 ; i-- ){
            if (portSpeedArr[i] == "") {
                portSpeedArr.splice(i, 1);
            }else{
                break;
            }
        }
        for(var i=ippoolnameArr.length-1; i>=0 ; i-- ){
            if (ippoolnameArr[i] == "") {
                ippoolnameArr.splice(i, 1);
            }else{
                break;
            }
        }
        for(var i=vpnnameArr.length-1; i>=0 ; i-- ){
            if (vpnnameArr[i] == "") {
                vpnnameArr.splice(i, 1);
            }else{
                break;
            }
        }
        for(var i=UseDescrArr.length-1; i>=0 ; i-- ){
            if (UseDescrArr[i] == "") {
                UseDescrArr.splice(i, 1);
            }else{
                break;
            }
        }
        for(var i=cvlanArr.length-1; i>=0 ; i-- ){
            if (cvlanArr[i] == "") {
                cvlanArr.splice(i, 1);
            }else{
                break;
            }
        }
        for(var i=svlanArr.length-1; i>=0 ; i-- ){
            if (svlanArr[i] == "") {
                svlanArr.splice(i, 1);
            }else{
                break;
            }
        }
        params.DeviceLoopback = DeviceLoopbackArr.join('##')
        params.DeviceName = DeviceNameArr.join('##')
        params.PortName = PortNameArr.join('##')
        params.portSpeed = portSpeedArr.join('##')
        params.ippoolname = ippoolnameArr.join('##')
        params.vpnname = vpnnameArr.join('##')
        params.UseDescr = UseDescrArr.join('##')
        params.cvlan = cvlanArr.join('##')
        params.svlan = svlanArr.join('##')
        // console.log(params)
        let paramsList = []
        paramsList.push(params)
        $.ajax({
            url: encodeURI(bathPath + url),
            type: 'POST',
            data: JSON.stringify(paramsList),
            dataType: 'json',
            contentType: 'application/json;chartset=UTF-8',
            success: function (res) {
                if (res.code == '0000') {
                    let errorArr = res.data.filter((item, index) => {
                        return item.errormsg != null
                    })
                    let content = ''
                    if (errorArr.length) {
                        res.data.forEach(function (item, index) {
                            content += item.errormsg + '<br/>'
                        })
                        $.messager.alert('提示', content, 'error').window({
                            width: 600,
                            left: 300,
                            top: 200
                        });
                    } else {
                        if (urlObj.type == 'mod') {
                            $.messager.alert('提示', '更新成功！', 'success');
                        } else {
                            $.messager.alert('提示', '新增成功！', 'success');
                        }
                        const ifrs = window.top.$vm.$('iframe')
                        for (const item of ifrs) {
                            if (item.src.indexOf('/ipmanage/ipaddrmodule/views/jsp/Ipv4Assigned/Ipv4Assigned.jsp') != -1) {
                                item.contentWindow.location.reload(true)
                                item.contentWindow.location.reload(true)
                                item.contentWindow.location.reload(true)
                                // item.contentWindow.queryAllocatedlist()

                                setTimeout(function () {
                                    window.top.$vm.$closeTab()
                                }, 1000);
                            }
                        }
                    }
                } else {
                    jQuery.messager.alert('提示:', res.tip, 'warning');
                }
            }
        });

    }
}

function check() { //校验
    var flag = true;
    // console.log($("[data-checkname]"))
    $("[data-checkname]").each(function () {
        //  if(){
        {
            var val = $(this).val();
            if ($(this).is("#ipRange")) {
                val = $("#ipRangeArea").val();
            }
            if ($(this).is("#IpClassType")) {
                val = $("#IpClassType").combotree('getValue')
            }
            if ($(this).is("#ProvinceID")) {
                val = $("#ProvinceID").combobox('getValue');
            }
            if ($(this).is("#CityID")) {
                val = $("#CityID").combobox('getValue');
            }
            if ($(this).is("#CountyID")) {
                val = $("#CountyID").combobox('getValue');
            }
            if ($(this).is("#WgShengId")) {
                val = $("#WgShengId").combobox('getValue');
            }
            if ($(this).is("#WgShiId")) {
                val = $("#WgShiId").combobox('getValue');
            }
            if ($(this).is("#WgXianId")) {
                val = $("#WgXianId").combobox('getValue');
            }
            if ($(this).is("#UseUnitFlag")) {
                val = $("#UseUnitFlag").combobox('getValue');
            }
            if ($(this).is("#Sydwzjlx")) {
                val = $("#Sydwzjlx").combobox('getValue');
            }
            if ($(this).is("#Yyfwlx")) {
                val = $("#Yyfwlx").combobox('getValues').join(',');
            }
            if ($(this).is("#IndustryID")) {
                val = $("#IndustryID").combobox('getValue');
            }
            if ($(this).is("#BackClass")) {
                val = $("#BackClass").combobox('getValue');
            }
            if ($(this).is("#UseUnitLevel")) {
                val = $("#UseUnitLevel").combobox('getValue');
            }
            if ($(this).is("#UseUnitFlag")) {
                val = $("#UseUnitFlag").combobox('getValue');
            }
            if ($(this).is("#Syqy")) {
                val = $("#Syqy").combobox('getValue');
            }
            if ($(this).is("#ReAllocateUnitID")) {
                val = $("#ReAllocateUnitID").combobox('getValue');
            }

            if ($(this).parent().find('.tip').css("display") && $(this).parent().find('.tip').css("display") != "none" && !val) {
                var backcheck = "true";
                if ($(this).data("backcheck")) {
                    backcheck = $(this).data("backcheck");
                }
                if (backcheck == 'true') {
                    alert($(this).data("checkname") + ":不能为空！");
                    flag = false;
                    return false;
                }

                //var ipresult = chargeIPAddress(ipRangeArea); 校验地址格式
                //参考ipassigned.js中的校验，看看有没有拉的，另外地址类型校验逻辑别忘了
            } else {
                // 用户名称不能超过255个字符长度（一个汉字为2个字符长度）
                // 用户地址不能超过512个字符长度（一个汉字为2个字符长度）
                // 网关所在地址不能超过512个字符长度（一个汉字为2个字符长度
                // 使用单位证件号码不能超过128个字符长度（一个汉字为2个字符长度）
                let Inetnum = $("#ipRangeArea").val(); //地址范围
                let Contractinfo = $('#Contractinfo').val(); // 联系方式
                let Phone = $('#Phone').val(); // 客户联系电话
                let Email = $('#Email').val(); //客户电子邮件
                let UserSubject = $('#UserSubject').val() //用户名称
                let UserAddress = $('#UserAddress').val() //用户地址
                let GatewayLocation = $('#GatewayLocation').val() //网关所在地址
                let Sydwzjhm = $('#Sydwzjhm').val() //使用单位证件号码
                let SLSpeed = $('#SLSpeed').val() //受理速率


                if (Inetnum != "") {
                    if (Inetnum.indexOf("/") != -1) { //地址段
                        var IPAddrArr = Inetnum.split("/");
                        if (IPAddrArr.length != 2) {
                            $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                            flag = false;
                            return false;
                        }
                        if ("IPv4" != validIPAddress(IPAddrArr[0])) {
                            $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                            flag = false;
                            return false;
                        } else {
                            //在IP地址后加上"/"符号以及1-32的数字
                            if (!(IPAddrArr[1] >= 1 && IPAddrArr[1] <= 32)) {
                                $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                                flag = false;
                                return false;
                            }
                        }
                    } else if (Inetnum.indexOf("-") != -1) {
                        var IPAddrArr = Inetnum.split("-");
                        if (IPAddrArr.length != 2) {
                            $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                            flag = false;
                            return false;
                        }
                        if ("IPv4" != validIPAddress(IPAddrArr[0]) || "IPv4" != validIPAddress(IPAddrArr[1])) {
                            $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                            flag = false;
                            return false;
                        }
                        //起始地址不能大于终止地址
                        var addr1 = IPAddrArr[0].split(".");
                        var addr2 = IPAddrArr[1].split(".");
                        if (ip2int(IPAddrArr[0]) > ip2int(IPAddrArr[1])) {
                            $.messager.alert('提示', '起始地址不能大于终止地址！', 'warning');
                            flag = false;
                            return false;
                        }
                    } else { //掩码
                        if ("IPv4" != validIPAddress(Inetnum)) {
                            $.messager.alert('提示', '请输入正确的地址段格式！', 'warning');
                            flag = false;
                            return false;
                        }
                    }
                }
                // if(Contractinfo != "" && $(this).is("#Contractinfo")){
                //     var errstr = checkPhone(Contractinfo);
                //     if(errstr!=""){
                //         $.messager.alert('提示', '联系格式为：0951-4078160 或者 13209517747;电话只能写一个，中间不能有空格、分号[;]、逗号[,]', 'warning');
                //             flag=false;
                //             return false;
                //     }
                // }
                if (Phone != "" && $(this).is("#Phone")) {
                    var errstr = checkPhone(Phone);
                    if (errstr != "") {
                        $.messager.alert('提示', '客户联系电话格式为：0951-4078160 或者 13209517747;电话只能写一个，中间不能有空格、分号[;]、逗号[,]！', 'warning');
                        flag = false;
                        return false;
                    }
                }
                if (Email != "" && $(this).is("#Email")) {
                    let rule = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
                    if (!rule.test(Email)) {
                        $.messager.alert('提示', '客户电子邮件：格式错误！', 'warning');
                        flag = false;
                        return false;
                    }
                }
                if (UserSubject != "" && $(this).is("#UserSubject")) {
                    if (getByteLen(UserSubject) > 255) {
                        $.messager.alert('提示', '用户名称不能超过255个字符长度！', 'warning');
                        flag = false;
                        return false;
                    }
                }
                if (UserAddress != "" && $(this).is("#UserAddress")) {
                    if (getByteLen(UserAddress) > 512) {
                        $.messager.alert('提示', '用户地址不能超过512个字符长度！', 'warning');
                        flag = false;
                        return false;
                    }
                }
                if (GatewayLocation != "" && $(this).is("#GatewayLocation")) {
                    if (getByteLen(GatewayLocation) > 512) {
                        $.messager.alert('提示', '网关所在地址不能超过512个字符长度！', 'warning');
                        flag = false;
                        return false;
                    }
                }
                if (Sydwzjhm != "" && $(this).is("#Sydwzjhm")) {
                    if (getByteLen(Sydwzjhm) > 128) {
                        $.messager.alert('提示', '使用单位证件号码不能超过128个字符长度！', 'warning');
                        flag = false;
                        return false;
                    }
                }
                if (SLSpeed != '' && $(this).is("#SLSpeed")) {
                    if (!(/(^[1-9]\d*$)/.test(SLSpeed))) {
                        $.messager.alert('提示', '受理速率必须为正整数！', 'warning');
                        flag = false;
                        return false;
                    }
                }
            }
            //  }
        }
    });
    return flag;
}

function ArchFlagChange() { //是否备案修改
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(ArchFlag)', function (data) {
            if (data.value == 1) {
                $("#ipback").find('.tip').show();
            } else {
                $("#ipback").find('.tip').hide();
            }
            if ($("#IfReAllocation").val() == 1) {
                $(".IfReAllocationFlag").show();
            } else {
                $(".IfReAllocationFlag").hide();
            }
            if ($("#BackClass").combobox('getValue') == '11') {
                $(".TelecomLicenseFlag").show();
            } else {
                $(".TelecomLicenseFlag").hide();
            }
        });
        form.on('select(IfReAllocation)', function (data) {
            if (data.value == 1) {
                $(".IfReAllocationFlag").show();
            } else {
                $(".IfReAllocationFlag").hide();
                // form.render('select');//select是固定写法 不是选择器
            }
        });
        form.on('select(IsSelfUse)', function (data) {
            if (data.value == 1) {
                $("#InterPurpose").removeAttr("disabled")
                $("#SecurityResponseUnit").removeAttr("disabled")
                $("#SecurityResponsePerson").removeAttr("disabled")
                $("#SecurityResponsePersonTel").removeAttr("disabled")
                $("#gmBusiapproveNo").removeAttr("disabled")
                $("#InterPurpose").parent().parent().find('.layui-form-label').css('color', "#000")
                $("#SecurityResponseUnit").parent().parent().find('.layui-form-label').css('color', "#000")
                $("#SecurityResponsePerson").parent().parent().find('.layui-form-label').css('color', "#000")
                $("#SecurityResponsePersonTel").parent().parent().find('.layui-form-label').css('color', "#000")
                $("#gmBusiapproveNo").parent().parent().find('.layui-form-label').css('color', "#000")
            } else {
                $("#InterPurpose").val('')
                $("#SecurityResponseUnit").val('')
                $("#SecurityResponsePerson").val('')
                $("#SecurityResponsePersonTel").val('')
                $("#gmBusiapproveNo").val('')
                $("#InterPurpose").attr("disabled", "disabled")
                $("#SecurityResponseUnit").attr("disabled", "disabled")
                $("#SecurityResponsePerson").attr("disabled", "disabled")
                $("#SecurityResponsePersonTel").attr("disabled", "disabled")
                $("#gmBusiapproveNo").attr("disabled", "disabled")
                $("#InterPurpose").parent().parent().find('.layui-form-label').css('color', "#999")
                $("#SecurityResponseUnit").parent().parent().find('.layui-form-label').css('color', "#999")
                $("#SecurityResponsePerson").parent().parent().find('.layui-form-label').css('color', "#999")
                $("#SecurityResponsePersonTel").parent().parent().find('.layui-form-label').css('color', "#999")
                $("#gmBusiapproveNo").parent().parent().find('.layui-form-label').css('color', "#999")
            }
        });
    });
}
//校验电话格式是否合法
//联系人电话：最小长度要11位，格式为：0951-4078160 或者 13209517747;电话只能写一个，中间不能有空格、分号[;]、逗号[,]
function checkPhone(phone) {
    var errstr = "";

    if (phone.length < 11) {
        errstr = ";客户联系电话必须大于11位";
    } else if (phone.indexOf(";") != -1 || phone.indexOf(",") != -1 || phone.indexOf(" ") != -1) {
        errstr = ";只能填写一个客户联系电话";
    } else if (phone.indexOf("+86") != -1) {
        errstr = ";客户联系电话不需要填写+86";
    } else if (phone.indexOf("-") != -1) {
        var loc = phone.indexOf("-");
        var firststr = phone.substring(0, loc);
        var otherstr = phone.substring(loc + 1);

        if (firststr.length > 4 || firststr.length < 3) {
            //区号必须为3或4位
            errstr += ";客户联系电话区号错误";
        }
        if (otherstr.length < 7 || otherstr.length > 8) {
            //电话号码必须为7或8位
            errstr += ";客户联系电话号码错误";
        }
    } else {
        //认为该电话为手机
        var firststr = phone.substring(0, 2);
        if (firststr != "13" && firststr != "15" && firststr != "18") {
            errstr += ";客户联系电话号码为手机号，应以13、15、18开头";
        } else {
            if (phone.length > 11) {
                errstr += ";客户联系电话号码超长,手机号应为11位";
            }
        }
    }

    if (errstr != "") {
        errstr = errstr.substring(1);
    }

    return errstr;
}

function getByteLen(val) { //判断字符长度 汉字算两个字符
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
        } else {
            len += 1;
        }
    }
    return len;
}

function initLayuiObj() { //初始化实际使用实际
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //日期范围
        laydate.render({
            elem: '#RealUseDate'
        });
    })
}

function initCombobox() { //初始化所有可选下拉框
    $('#ProvinceID').combobox({
        textField: 'AREANAME',
        valueField: 'AREACODE',
        data: [{
            AREANAME: '请选择',
            AREACODE: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#ProvinceID').combobox('setValue', '');
        },
        onSelect: function (record) {
            loadBackAreaCode("CityID", record.AREACODE, "2");
            $("#CountyID").combobox('clear');
            $("#CountyID").combobox('loadData', [{
                AREANAME: '请选择',
                AREACODE: ''
            }]);
            if (!$('#WgShengId').combobox("getValue")) {
                $('#WgShengId').combobox('select', record.AREACODE);
            }

        }
    });
    $('#CityID').combobox({
        textField: 'AREANAME',
        valueField: 'AREACODE',
        data: [{
            AREANAME: '请选择',
            AREACODE: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#CityID').combobox('setValue', '')
        },
        onSelect: function (record) {
            loadBackAreaCode("CountyID", record.AREACODE, "3");
            if (!$('#WgShiId').combobox("getValue")) {
                $('#WgShiId').combobox('select', record.AREACODE);
            }
        }
    })
    $('#CountyID').combobox({
        textField: 'AREANAME',
        valueField: 'AREACODE',
        data: [{
            AREANAME: '请选择',
            AREACODE: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#CountyID').combobox('setValue', '')
        },
        onSelect: function (record) {
            if (!$('#WgXianId').combobox("getValue")) {
                $('#WgXianId').combobox('setValue', record.AREACODE);
            }
        }
    })
    $('#WgShengId').combobox({
        textField: 'AREANAME',
        valueField: 'AREACODE',
        data: [{
            AREANAME: '请选择',
            AREACODE: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#WgShengId').combobox('setValue', '')
        },
        onSelect: function (record) {
            $("#WgXianId").combobox('clear');
            $("#WgXianId").combobox('loadData', [{
                AREANAME: '请选择',
                AREACODE: ''
            }]);
            loadBackAreaCode("WgShiId", record.AREACODE, "2");
        }
    });
    $('#WgShiId').combobox({
        textField: 'AREANAME',
        valueField: 'AREACODE',
        data: [{
            AREANAME: '请选择',
            AREACODE: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#WgShiId').combobox('setValue', '')
        },
        onSelect: function (record) {
            loadBackAreaCode("WgXianId", record.AREACODE, "3");
        }
    })
    $('#WgXianId').combobox({
        textField: 'AREANAME',
        valueField: 'AREACODE',
        data: [{
            AREANAME: '请选择',
            AREACODE: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#WgXianId').combobox('setValue', '')
        },
        onSelect: function (record) {}
    })
    $('#UseUnitFlag').combobox({
        textField: 'VALUE',
        valueField: 'CODE',
        data: [{
            CODE: '请选择',
            VALUE: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#UseUnitFlag').combobox('setValue', '')
        },
        onSelect: function (record) {
            IpBacksydwzjlx(record.CODE);
        }
    })
    $('#Sydwzjlx').combobox({
        textField: 'ZJLXMC',
        valueField: 'ZJLXID',
        data: [{
            ZJLXMC: '请选择',
            ZJLXID: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#backSydwzjlx').combobox('setValue', '')
        },
        onSelect: function (record) {}
    })
    $('#Yyfwlx').combobox({
        textField: 'APPSERVNAME',
        valueField: 'APPSERVID',
        groupField: 'groupField',
        data: [{
            APPSERVNAME: '请选择',
            APPSERVID: '',
            groupField: ''
        }],
        width: 220,
        multiple: true,
        onLoadSuccess: function () {
            //    $('#Yyfwlx').combobox('setValues', [])
        },
        onSelect: function (record) {}
    })
    $('#IndustryID').combobox({
        textField: 'INDUSTRYNAME',
        valueField: 'INDUSTRYID',
        data: [{
            INDUSTRYNAME: '请选择',
            INDUSTRYID: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#IndustryID').combobox('setValue', '')
        },
        onSelect: function (record) {}
    })
    $('#BackClass').combobox({
        textField: 'VALUE',
        valueField: 'CODE',
        data: [{
            VALUE: '请选择',
            CODE: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#BackClass').combobox('setValue', '')
        },
        onSelect: function (record) {
            if (record.CODE == '11') {
                $(".TelecomLicenseFlag").show();
            } else {
                $(".TelecomLicenseFlag").hide();
            }
        }
    })
    $('#UseUnitLevel').combobox({
        textField: 'VALUE',
        valueField: 'CODE',
        data: [{
            VALUE: '请选择',
            CODE: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#UseUnitLevel').combobox('setValue', '')
        },
        onSelect: function (record) {}
    })
    $('#ReAllocateUnitID').combobox({
        textField: 'ISPNAME',
        valueField: 'ISPID',
        data: [{
            ISPNAME: '请选择',
            ISPID: ''
        }],
        width: 220,
        onLoadSuccess: function () {
            $('#ReAllocateUnitID').combobox('setValue', '')
        },
        onSelect: function (record) {}
    })
}

function loadYyfwlx(data) { //加载应用服务类型
    $("#Yyfwlx").combobox('clear');
    $("#Yyfwlx").combobox('loadData', data);
}

function loadBackAreaCode(id, fatherareacode, levelflag) { //加载省市县信息
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/IpBackAreaCode'),
        type: 'get',
        cache: false,
        async: false,
        data: {
            fatherareacode: fatherareacode,
            levelflag: levelflag
        },
        dataType: 'json',
        success: function (res) {
            if (res.code == '0000') {
                res.data.unshift({
                    AREANAME: '请选择',
                    AREACODE: ''
                });
                $("#" + id).combobox('clear');
                $("#" + id).combobox('loadData', res.data);

            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}

function IpBacksydwzjlx(dwflid, code) { //加载证件类型信息
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/IpBacksydwzjlx'),
        data: {
            dwflid: dwflid
        },
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function (res) {
            if (res.code == '0000') {
                res.data.unshift({
                    ZJLXMC: '请选择',
                    ZJLXID: ''
                })
                $("#Sydwzjlx").combobox('clear');
                $("#Sydwzjlx").combobox('loadData', res.data);
                if (code) {
                    $('#Sydwzjlx').combobox('setValue', code)
                } else {
                    $('#Sydwzjlx').combobox('setValue', '')
                }

            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}

function getCodeBook(id, tablename, columnname) { //加载对应codebook相关下拉框
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/SysCommon/getCodeBook'),
        type: 'get',
        cache: false,
        data: {
            tablename: tablename,
            columnname: columnname
        },
        dataType: 'json',
        success: function (res) {
            if (res.code == '0000') {
                res.data.unshift({
                    VALUE: '请选择',
                    CODE: ''
                });
                $("#" + id).combobox('clear');
                $("#" + id).combobox('loadData', res.data);
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}

function selArchFlag() {
    if ($("#ArchFlag").val() == '1') {
        $("[data-checkname]").each(function () {
            $(this).data("backcheck", "true");
        });
        // alert($("[data-checkname]").map(function(){return $(this).data("backcheck");}).get().join(","));
    } else {
        $("[data-checkname]").each(function () {
            $(this).data("backcheck", "false");
        });
        // alert($("[data-checkname]").map(function(){return $(this).data("backcheck");}).get().join(","));
    }
}

// 再分配对象单位
function IpBackIsp() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/IpBackIsp'),
        type: 'get',
        cache: false,
        // data: {
        //     nodecode: jcObj.nodeCode
        // },
        dataType: 'json',
        success: function (res) {
            if (res.code == '0000') {
                res.data.unshift({
                    ISPNAME: '请选择',
                    ISPID: ''
                });
                $("#ReAllocateUnitID").combobox('clear');
                $("#ReAllocateUnitID").combobox('loadData', res.data);
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}
// 获取所属行业信息
function CustIndustry() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpPublicInterface/CustIndustry'),
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function (res) {
            if (res.code == '0000') {
                res.data.unshift({
                    INDUSTRYNAME: '请选择',
                    INDUSTRYID: ''
                })
                $("#IndustryID").combobox('clear');
                $("#IndustryID").combobox('loadData', res.data);
            } else {
                jQuery.messager.alert('提示:', res.tip, 'warning');
            }
        }
    });
}

//增加设备
function addDev() {
    $("#addDev").click(function () {
        let count = $('.devItem').length
        let content = '';
        content += '<hr>';
        content += '<div class="devItem">'
        content += '<div class="layui-form-item">';
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">使用设备名称 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text" class="easyui-combobox DeviceName" name="DeviceName" id="DeviceName' + count + '">'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">注册地址的设备[输入loopback] :</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text" class="layui-input DeviceLoopback" name="DeviceLoopback" id="DeviceLoopback' + count + '">'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-form-item">';
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">端口名称 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text" class="layui-input PortName" name="PortName" id="PortName' + count + '">'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">端口速率 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text" class="layui-input portSpeed" name="portSpeed" id="portSpeed' + count + '">'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-form-item">';
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">地址池名称 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text" class="layui-input ippoolname" name="ippoolname" id="ippoolname' + count + '">'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">VPN实例 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text" class="layui-input vpnname" name="vpnname" id="vpnname' + count + '">'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-form-item">';
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label" style="margin-top:25px;">使用描述 :</label>'
        content += '<div class="layui-input-inline">'
        content += '<textarea rows="5" cols="100" class="UseDescr" name="UseDescr" id="UseDescr' + count + '"></textarea>'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-form-item">';
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">CVLAN :</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text" class="layui-input cvlan" name="cvlan" id="cvlan' + count + '">'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-inline">';
        content += '<label class="layui-form-label">SVLAN :</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text" class="layui-input svlan" name="svlan" id="svlan' + count + '">'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        // console.log(content)
        $("#Detailed #addDev").before(content)
        $('#DeviceName' + count).combobox({
            valueField: 'deviceId',
            textField: 'deviceName',
            data: deviceNameList,
            width: 220,
            onLoadSuccess: function () {
                $('#DeviceName' + count).combobox('setValue', '');
            },
            onSelect: function (row) {
                $("#DeviceLoopback" + count).val(row.loopAddress ? row.loopAddress : "")
            }
        });
        // getDeviceList()
    })
}

//修改时获取详细信息
function queryAllocatedlist(InetnumID) {
    let params = {
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString(),
        InetnumID: InetnumID
    }
    // console.log(params)
    $.ajax({
        url: encodeURI(bathPath + "/ipaddrmodule/IpAssigned/queryIpAssignedIpv4list"),
        type: 'POST',
        data: JSON.stringify(params),
        dataType: 'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {

        },
        success: function (obj) {
            if (obj.code == "0000") {
                if (obj.data.result.length == 1) {
                    AssigendUP = obj.data.result[0];
                    $("#NodeCode").val(AssigendUP.NodeCode)
                    $("#NodeName").val(AssigendUP.NodeName)
                    changebaktab(AssigendUP.Status); //先加载页面然后在对应页面加载后的回调函数中调用下面赋值才做其他 js实际不用动
                    if (AssigendUP.IpTypeCode) {
                        $("#IpClassType").combotree('setValue', AssigendUP.IpTypeCode)
                    };
                    loadBackAreaCode("ProvinceID", "", "1");
                    loadBackAreaCode("CityID", AssigendUP.ProvinceID, "2");
                    loadBackAreaCode("CountyID", AssigendUP.CityID, "3");
                    loadBackAreaCode("WgShengId", "", "1");
                    loadBackAreaCode("WgShiId", AssigendUP.WgShengId, "2");
                    loadBackAreaCode("WgXianId", AssigendUP.WgShiId, "3");
                    IpBacksydwzjlx(AssigendUP.UseUnitFlag)
                    CustIndustry()
                    getCodeBook("BackClass", 'inetnum', 'BackClass');
                    getCodeBook("UseUnitLevel", 'inetnum', 'UseUnitLevel');
                    getCodeBook("UseUnitFlag", 'inetnum', 'UseUnitFlag');
                    IpBackIsp()
                    setTimeout(setValue(), 5000)

                }
                // console.log(AssigendUP)

            } else {
                $.messager.alert('提示', obj.tip, 'error');
            }

        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function () {

        }
    });
}

function setValue() {
    if (!$.isEmptyObject(AssigendUP)) {
        var fields = $(".layui-form").serializeArray();
        // console.log(fields)
        // $("#Yyfwlx").combobox('setValues',AssigendUP.Yyfwlx.split(','));
        $.each(fields, function (i, field) {
            if ($("#" + field.name).hasClass('layui-input')) {
                $("#" + field.name).val(AssigendUP[field.name])
            } else if ($("#" + field.name).hasClass('easyui-combobox')) {
                $("#" + field.name).combobox('setValue', AssigendUP[field.name])
            } else {
                $("#" + field.name).val(AssigendUP[field.name])
            }
            switch (field.name) {
                case "ipRangeArea":
                    if (AssigendUP.inetnum) {
                        $("#ipRangeArea").val(formatIpMask(AssigendUP.inetnumStart, AssigendUP.inetnumEnd));
                    };
                    break;
                case "Contact":
                    if (AssigendUP.ContactPerson) {
                        $("#Contact").val(AssigendUP.ContactPerson)
                    }
                    break;
                    // case "Yyfwlx":
                    //     if(AssigendUP.Yyfwlx){
                    //         $("#Yyfwlx").combobox('setValues',['9'])
                    //     };
                    //     break;
                case "ArchFlag":
                    if (AssigendUP.ArchFlag && AssigendUP.ArchFlag == '1') {
                        $("#ipback").find('.tip').show();
                    } else {
                        $("#ipback").find('.tip').hide();
                        // form.render('select');//select是固定写法 不是选择器
                    }
                    break;
                case "IfReAllocation":
                    if (AssigendUP.IfReAllocation && AssigendUP.IfReAllocation == '1') {
                        $(".IfReAllocationFlag").show();
                    } else {
                        $(".IfReAllocationFlag").hide();
                        // form.render('select');//select是固定写法 不是选择器
                    }
                    break;
                case "BackClass":
                    if (AssigendUP.BackClass && AssigendUP.BackClass == '11') {
                        $(".TelecomLicenseFlag").show();
                    } else {
                        $(".TelecomLicenseFlag").hide();
                        // form.render('select');//select是固定写法 不是选择器
                    }
                    break;
                default:
            }
            layui.form.render()
        });
        let YyfwlxArr = []
        let dataArr1 = $("#Yyfwlx").combobox('getData')
        let dataArr2 = AssigendUP.Yyfwlx ? AssigendUP.Yyfwlx.split(',') : []
        for (let i = 0, len = dataArr1.length; i < len; i++) {
            for (let j = 0, length = dataArr2.length; j < length; j++) {
                if (dataArr1[i].APPSERVID === dataArr2[j] && dataArr2[j] != '') {
                    YyfwlxArr.push(dataArr2[j])
                }
            }
        }
        $("#Yyfwlx").combobox('setValues', YyfwlxArr)
        $("#LYsystem").val(AssigendUP.LYsystem ? AssigendUP.LYsystem : '')
        $("#SecurityResponseUnit").val(AssigendUP.SecurityResponseUnit ? AssigendUP.SecurityResponseUnit : '')
        $("#SecurityResponsePerson").val(AssigendUP.SecurityResponsePerson ? AssigendUP.SecurityResponsePerson : '')
        $("#SecurityResponsePersonTel").val(AssigendUP.SecurityResponsePersonTel ? AssigendUP.SecurityResponsePersonTel : '')
        $("#gmBusiapproveNo").val(AssigendUP.gmBusiapproveNo ? AssigendUP.gmBusiapproveNo : '')
        $("#InterPurpose").val(AssigendUP.InterPurpose ? AssigendUP.InterPurpose : '')

        //详细信息
        if (AssigendUP.DeviceLoopback) {
            $('#Detailed').children().remove(".devItem")
            let DeviceLoopbackArr = AssigendUP.DeviceLoopback.split('##')
            let content = '';
            DeviceLoopbackArr.forEach(function (item, index) {
                if (index != 0) {
                    content += '<hr>';
                }
                let DeviceId = ''
                if(AssigendUP.DeviceName){
                    deviceNameList.forEach(function(item1,index1){
                        if(item1.deviceName == AssigendUP.DeviceName.split('##')[index]){
                            DeviceId = item1.deviceId
                        }
                    })
                    
                }
                content += '<div class="devItem">'
                content += '<div class="layui-form-item">';
                content += '<div class="layui-inline">';
                content += '<label class="layui-form-label">使用设备名称 :</label>'
                content += '<div class="layui-input-inline">'
                content += '<input type="text" class="easyui-combobox DeviceName" name="DeviceName" id="DeviceName' + index + '" value="' + (AssigendUP.DeviceName ? DeviceId : '') + '">'
                content += '</div>'
                content += '</div>'
                content += '<div class="layui-inline">';
                content += '<label class="layui-form-label">注册地址的设备[输入loopback] :</label>'
                content += '<div class="layui-input-inline">'
                content += '<input type="text" class="layui-input DeviceLoopback" name="DeviceLoopback" id="DeviceLoopback' + index + '" value="' + (AssigendUP.DeviceLoopback ? (AssigendUP.DeviceLoopback.split('##')[index]?AssigendUP.DeviceLoopback.split('##')[index]:'') : '') + '">'
                content += '</div>'
                content += '</div>'
                content += '</div>'
                content += '<div class="layui-form-item">';
                content += '<div class="layui-inline">';
                content += '<label class="layui-form-label">端口名称 :</label>'
                content += '<div class="layui-input-inline">'
                content += '<input type="text" class="layui-input PortName" name="PortName" id="PortName' + index + '" value="' + (AssigendUP.PortName ? (AssigendUP.PortName.split('##')[index]?AssigendUP.PortName.split('##')[index]:"") : '') + '">'
                content += '</div>'
                content += '</div>'
                content += '<div class="layui-inline">';
                content += '<label class="layui-form-label">端口速率 :</label>'
                content += '<div class="layui-input-inline">'
                content += '<input type="text" class="layui-input portSpeed" name="portSpeed" id="portSpeed' + index + '" value="' + (AssigendUP.portSpeed ? (AssigendUP.portSpeed.split('##')[index]?AssigendUP.portSpeed.split('##')[index]:'') : '') + '">'
                content += '</div>'
                content += '</div>'
                content += '</div>'
                content += '<div class="layui-form-item">';
                content += '<div class="layui-inline">';
                content += '<label class="layui-form-label">地址池名称 :</label>'
                content += '<div class="layui-input-inline">'
                content += '<input type="text" class="layui-input ippoolname" name="ippoolname" id="ippoolname' + index + '" value="' + (AssigendUP.ippoolname ? (AssigendUP.ippoolname.split('##')[index]?AssigendUP.ippoolname.split('##')[index]:'') : '') + '">'
                content += '</div>'
                content += '</div>'
                content += '<div class="layui-inline">';
                content += '<label class="layui-form-label">VPN实例 :</label>'
                content += '<div class="layui-input-inline">'
                content += '<input type="text" class="layui-input vpnname" name="vpnname" id="vpnname' + index + '" value="' + (AssigendUP.vpnname ? (AssigendUP.vpnname.split('##')[index]?AssigendUP.vpnname.split('##')[index]:'') : '') + '">'
                content += '</div>'
                content += '</div>'
                content += '</div>'
                content += '<div class="layui-form-item">';
                content += '<div class="layui-inline">';
                content += '<label class="layui-form-label" style="margin-top:25px;">使用描述 :</label>'
                content += '<div class="layui-input-inline">'
                content += '<textarea rows="5" cols="100" class="UseDescr" name="UseDescr" id="UseDescr' + index + '">' + (AssigendUP.UseDescr ? (AssigendUP.UseDescr.split('##')[index]?AssigendUP.UseDescr.split('##')[index]:'') : '') + '</textarea>'
                content += '</div>'
                content += '</div>'
                content += '</div>'
                content += '<div class="layui-form-item">';
                content += '<div class="layui-inline">';
                content += '<label class="layui-form-label">CVLAN :</label>'
                content += '<div class="layui-input-inline">'
                content += '<input type="text" class="layui-input cvlan" name="cvlan" id="cvlan' + index + '" value="' + (AssigendUP.cvlan ? (AssigendUP.cvlan.split('##')[index]?AssigendUP.cvlan.split('##')[index]:'') : '') + '">'
                content += '</div>'
                content += '</div>'
                content += '<div class="layui-inline">';
                content += '<label class="layui-form-label">SVLAN :</label>'
                content += '<div class="layui-input-inline">'
                content += '<input type="text" class="layui-input svlan" name="svlan" id="svlan' + index + '" value="' + (AssigendUP.svlan ? (AssigendUP.svlan.split('##')[index]?AssigendUP.svlan.split('##')[index]:'') : '') + '">'
                content += '</div>'
                content += '</div>'
                content += '</div>'
                content += '</div>'
            })
            // console.log(content)
            $("#Detailed #addDev").before(content)
            getDeviceList();
        }
    }
    $("#ipRangeArea").attr("disabled", true)
    $("#IpClassType").combobox('disable');
    $("input[name = 'Status']").attr("disabled", true)
}

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

//检查IP地址/段的地址是否正确
function checkInetnum(ipaddr) {
    var result = "";
    if (ipaddr.indexOf("-") == -1 && ipaddr.indexOf("/") == -1) {
        //判断单独地址是否正确
        result = checkpartip(ipaddr);
        if (result == "false") {
            return 'false';
        } else {
            return result;
        }
    } else {
        if (ipaddr.indexOf("-") != -1) {
            //地址段格式
            result = checkipaddr(ipaddr);
            if (result == "false") {
                return 'false';
            } else {
                return result;
            }
        }
        if (ipaddr.indexOf("/") != -1) {
            //地址段格式
            result = checkipmask(ipaddr);
            if (result == "false") {
                return 'false';
            } else {
                return result;
            }
        }
    }
}