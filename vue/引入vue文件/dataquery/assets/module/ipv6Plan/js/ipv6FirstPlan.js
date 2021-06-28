$(function() {
    GetIpTypeSchemeList();
    getNodeList();
    initBtnClickEvent();
    initLayuiObj();
    initClearBtnEvent();
    // getOneIpTypeScheme('IPT028')
    // GetIpTypeSchemeList();

});
var IpTypeList = {}
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
let userName = jQuery.ITE.getLoginName('loginName'); //登录用户
let queryAllPage = { //汇总查询
    pageSize: 20,
    pageNum: 1,
    total: 0,
}

//初始化layui对象
function initLayuiObj() {
    layui.use('laydate', function() {
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
        data: JSON.stringify({ userName: userName, nodeCode: $("#nodeCode").val() }),
        dataType: 'json',
        contentType: "application/json",
        success: function(obj) {
            let nodeList = obj.data;
            $("#nodeList").combotree({
                idField: 'nodeCode',
                textField: 'nodeName',
                data: nodeList,
                width: 220,
                panelHeight: 'auto', //高度自适应
                multiple: false,
                editable: false, //定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function() {
                    $("#nodeList").combotree('tree').tree("collapseAll");
                },
                filter: function(q, row) {
                    return row.text.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function(q, e) {
                        $('#nodeList').combotree('tree').tree('doFilter', q)
                    }
                },
                onSelect: function(row) { //点击节点联动地址类型
                    getIpTypeList(row.nodeCode);
                }
            });
            //初始化显示权限节点
            $('#nodeList').combotree('setValue', nodeList[0].nodeCode);
            //getIpTypeList($("#nodeList").combotree('getValue'));
            //页面初始化的时候默认触发汇总查询事件
            $("#queryAll").click();
        }
    });
}

function readTree(node) {
    node.id = node.ipTypeId
    node.text = node.ipTypeName
    var children = node.children;
    if (children && children.length) {
        for (var i = 0; i < children.length; i++) {
            readTree(children[i]);
        }
    }
}
//获取地址类型
function getIpTypeList(nodeCode) {
    $('.clearBtn').css('display', 'none')
    let params = {
        userName: userName,
        nodeCode: nodeCode,
        ipType: "",
        authType: "",
        nodeIsNull: "Y"
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IPV6/IpAddrType/GetIPTypeV6List'),
        type: 'post',
        cache: false,
        data: JSON.stringify(params),
        dataType: 'json',
        contentType: "application/json",
        success: function(obj) {
            var thisData = obj.data;
            readTree(thisData[0])
            $('#ipTypeList').combotree({
                idField: 'id',
                textField: 'text',
                width: 220,
                lines: true,
                animate: true,
                data: thisData,
                onClick: function(node) {},
                onLoadSuccess: function(node, data) {},
                onChange: function(newValue, oldValue) {

                }
            });
            // $("#ipTypeList").combotree({
            //     idField: 'id',
            //     textField: 'text',
            //     data: ipTypeList,
            //     width: 220,
            //     panelHeight: 'auto', //高度自适应
            //     multiple: false,
            //     editable: false, //定义用户是否可以直接往文本域中输入文字
            //     //直接过滤，数据太多时不行，太卡了，放弃
            //     onLoadSuccess: function() {
            //         $("#ipTypeList").combotree('tree').tree("collapseAll");
            //     },
            //     filter: function(q, row) {
            //         var opts = $(this).combobox('options');
            //         return row[opts.textField].indexOf(q) == 0;
            //         // return row.textField.indexOf(q) >= 0;
            //     },
            //     //本地过滤，根据输入关键字的值调用tree的过滤方法
            //     keyHandler: {
            //         query: function(q, e) {
            //             $('#ipTypeList').combotree('tree').tree('doFilter', q)
            //         }
            //     },
            //     onBeforeSelect: function(row) { //节点被选中前触发，返回 false 则取消选择动作(但是返回false，下拉选项依旧会关闭)
            //         if (row.click == "N") { //标签不可选
            //             return false;
            //         } else {
            //             $('.clearBtn').css('display', 'block');
            //             return true;
            //         }
            //     },
            // });

        }
    });
}
//初始化地址类型清空按钮事件
function initClearBtnEvent() {
    $(".clearBtn").click(function() {
        $('#ipTypeList').combotree("clear")
        if ($("#ipTypeList").combotree('getValue') == "") {
            $('.clearBtn').css('display', 'none')
        } else {
            $('.clearBtn').css('display', 'block')
        }
    })
}

//初始化按钮点击事件
function initBtnClickEvent() {
    $(".btnItem").click(function() {
        //ip地址段不为空时校验
        let Inetnum = $("#Inetnum").val();
        //获取当前点击的按钮
        let btnType = $(this).val();
        if (btnType == "汇总查询" || btnType == "明细查询") {
            if (Inetnum != "") {
                if (Inetnum.indexOf("/") != -1) { //地址段
                    var IPAddrArr = Inetnum.split("/");
                    if (IPAddrArr.length != 2) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return false;
                    }
                    if(!ckIPV6($.trim(IPAddrArr[0]))){
                    // if ("IPv6" != validIPAddress(IPAddrArr[0])) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return false;
                    } else {
                        //在IP地址后加上"/"符号以及1-128的数字
                        if (!(IPAddrArr[1] >= 1 && IPAddrArr[1] <= 128)) {
                            $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                            return false;
                        }
                    }
                } else if (Inetnum.indexOf("-") != -1) {
                    var IPAddrArr = Inetnum.split("-");
                    if (IPAddrArr.length != 2) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return false;
                    }
                    if(!ckIPV6($.trim(IPAddrArr[0])) || !ckIPV6($.trim(IPAddrArr[1]))){
                    // if ("IPv6" != validIPAddress(IPAddrArr[0]) || "IPv6" != validIPAddress(IPAddrArr[1])) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return false;
                    }
                    //起始地址不能大于终止地址
                    // var addr1 = IPAddrArr[0].split(".");
                    // var addr2 = IPAddrArr[1].split(".");
                    // if (Number(addr1[0]) > Number(addr2[0]) || Number(addr1[1]) > Number(addr2[1]) || Number(addr1[2]) > Number(addr2[2]) || Number(addr1[3]) > Number(addr2[3])) {
                    //     $.messager.alert('提示', '起始地址不能大于终止地址！', 'warning');
                    //     return false;
                    // }
                } 
                // else { //掩码
                //     if ("IPv6" != validIPAddress(Inetnum)) {
                //         $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                //         return;
                //     }
                // }
            }
            //备注信息校验
            let remark = $("#remark").val();
            if (remark != "" && remark.length > 100) {
                $.messager.alert('提示', '备注长度不能超过100', 'warning');
                return;
            }
        }
        switch (btnType) {
            case "汇总查询":
                //点击按钮式分页初始化
                queryAllPage.pageSize = 20;
                queryAllPage.pageNum = 1;
                getPlanAddrSumV6();
                break;
            case "明细查询":
                queryAllPage.pageSize = 20;
                queryAllPage.pageNum = 1;
                getPlanAddrDetail();
                break;
            case "导入":
                importPlanAddrInfo()
                break;
            case "地址规划":
                let OriNodeCode = $("#nodeList").combotree('getValue')
                    //window.open('views/jsp/ipv6addrPlan/ipv6addrPlan.jsp?OriNodeCode='+OriNodeCode+'&AutoQuery=Y');
                window.top.$vm.$openTab({
                    name: '地址规划',
                    path: bathPath + '/ipaddrmodule/views/jsp/ipv6Plan/ipv6addrPlan.jsp?OriNodeCode=' + OriNodeCode + '&AutoQuery=Y'
                })
        }
    });
}

//初始化表格分页
function initClickPageEvent(falg) {
    $('#pagination').pagination({
        total: queryAllPage.total,
        pageSize: queryAllPage.pageSize,
        pageNumber: queryAllPage.pageNum,
        pageList: [20, 30, 40, 50],
        onSelectPage: function(pageNumber, pageSize) {
            queryAllPage.pageSize = pageSize;
            queryAllPage.pageNum = pageNumber;
            if (falg) { //汇总
                getPlanAddrSumV6(); //请求数据
            } else { //详细
                getPlanAddrDetail();
            }
        }
    });
}

//操作类地址规划点击事件
function openAddrPlanPage(IsPlanAddr, OriNodeCode, Inetnum) {
    let AutoQuery = "Y";
    let username = userName;
    //带参数跳转到规划页面
    //window.open('views/jsp/ipv6addrPlan/ipv6addrPlan.jsp?OriNodeCode='+OriNodeCode+'&Inetnum='+Inetnum+'&AutoQuery='+AutoQuery+'&username='+username);
    window.top.$vm.$openTab({
        name: '地址规划',
        path: bathPath + '/ipaddrmodule/views/jsp/ipv6Plan/ipv6addrPlan.jsp?OriNodeCode=' + OriNodeCode + '&Inetnum=' + Inetnum + '&AutoQuery=' + AutoQuery + '&username=' + username
    })
}

//初始化加减号按钮点击事件
function initClickTableEvent() {
    $(".icon").click(function() {
        if ($(this).hasClass("icon-jiahao")) { //打开
            //点击当前加号，遍历所有的图标，如有减号图标，关闭响应的详细信息并改变图标状态
            let iconArr = $(".icon");
            for (j = 0; j < iconArr.length; j++) {
                if ($(".icon").eq(j).hasClass("icon-jianhao3")) {
                    $(".icon").eq(j).click()
                }
            }
            $(this).removeClass("icon-jiahao");
            $(this).addClass("icon-jianhao3");
            //获取到当前点击图标所对应的tr
            let trP = $(this).parent().parent().parent();
            let index = trP.attr("datagrid-row-index");
            //如果已经加载过地址详细信息，只需要显示
            if (trP.next().hasClass("trAdd" + index)) {
                $(".trAdd" + index).show();
                return;
            }
            //获取v4规划地址明细
            let params = {
                    oriNodeCode: $("#nodeList").combotree('getValue'),
                    planIpType: $("#ipTypeList").combotree('getValue'),
                    startTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[0].replace(/[-:/ ]/g, ""),
                    endTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[1].replace(/[-:/ ]/g, ""),
                    inetnum: $("#Inetnum").val(),
                    sumInetNum: $(this).next().html(),
                    remark: $("#remark").val(),
                    prefix: $("#prefix").val(),
                    isPlanAddr: 0,
                    pagesize: 1000,
                    pageno: 1
                }
                //请求详细信息
            $.ajax({
                url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/IpAddressPlan/GetPlanAddrDetailV6'),
                type: 'get',
                data: params,
                cache: false,
                dataType: 'json',
                beforeSend: function() {
                    $.messager.progress({
                        title: '提示',
                        msg: '正在加载数据，请稍候...',
                        text: ''
                    });
                },
                success: function(obj) {
                    let detailsData = obj.data.planAddrSumList;
                    for (let i = 0; i < detailsData.length; i++) { //倒序追加
                        var _data = detailsData[detailsData.length - 1 - i]
                        var _d = IpTypeList[_data.planIpType]
                        var _div = ''
                        if (_d && _d.schemelist.length > 0) {
                            var txt = loadCodePlanContentTable(_d.schemelist);
                            var fullIp = _data.stratFullIp + '-' + _data.endFullIp
                            _div += '<div class="listrow" sumInetNum="' + _data.inetnum + '" fullIp="' + fullIp + '" planIpTypeName="' + _data.planIpTypeName + '" planIpType="' + _data.planIpType + '"><div class="planItemBox">' + txt + '</div></div>'
                        }
                        let content = '';
                        content += '<tr class="trAdd trAdd' + index + '">';
                        content += '<td style="text-align: center;padding-left: 15px;">' + detailsData[detailsData.length - 1 - i].inetnum + '</td>';
                        content += '<td style="padding: 0 4px;">' + _div + '</td>';
                        content += '<td>' + detailsData[detailsData.length - 1 - i].planIpTypeName + '</td>';
                        content += '<td>' + detailsData[detailsData.length - 1 - i].planNodeName + '</td>';
                        content += '<td>' + detailsData[detailsData.length - 1 - i].oriIpTypeName + '</td>';
                        if (detailsData[detailsData.length - 1 - i].isPlanAddr == 0) { //未规划
                            content += '<td></td>';
                        } else {
                            content += '<td>' + detailsData[detailsData.length - 1 - i].oriNodeName + '</td>';
                        }
                        content += '<td>' + detailsData[detailsData.length - 1 - i].planTime + '</td>';
                        if (detailsData[detailsData.length - 1 - i].isPlanAddr == 0) { //未规划
                            content += '<td>未规划</td>';
                        } else {
                            content += '<td>' + detailsData[detailsData.length - 1 - i].allocatedRatio + '</td>';
                        }
                        //备注信息过长处理
                        var remarkTdLen = trP.find('td').eq(7).width();
                        var remarkLen = (detailsData[detailsData.length - 1 - i].remark.length) * 13;
                        var remark = '';
                        if (remarkTdLen > remarkLen) {
                            content += '<td>' + detailsData[detailsData.length - 1 - i].remark + '</td>';
                        } else {
                            remark = detailsData[detailsData.length - 1 - i].remark.slice(0, Math.ceil(remarkTdLen / 13)) + '...';
                            content += '<td title=' + detailsData[detailsData.length - 1 - i].remark + '>' + remark + '</td>';
                        }
                        content += '<td style="padding-right: 18px;"><a class="operateBtn" onclick="openAddrPlanPage(\'' + detailsData[detailsData.length - 1 - i].isPlanAddr + '\',\'' + detailsData[detailsData.length - 1 - i].oriNodeCode + '\',\'' + detailsData[detailsData.length - 1 - i].inetnum + '\')">地址规划</a></td>';
                        content += '</tr>'
                        trP.after(content);
                    }
                },
                error: function(error) {
                    $.messager.alert('提示', '接口调用失败!', 'error');
                },
                complete: function() {
                    $.messager.progress('close');
                }
            });
        } else { //关闭
            $(this).removeClass("icon-jianhao3");
            $(this).addClass("icon-jiahao");
            //获取到当前点击图标所对应的tr
            let trP = $(this).parent().parent().parent();
            let index = trP.attr("datagrid-row-index");
            //隐藏当前地址信息的详细信息
            $(".trAdd" + index).hide();
        }
    });
}

//v4规划地址汇总列表查询
function getPlanAddrSumV6() {
    if($("#prefix").val()!=''&&(Number($("#prefix").val()).toString()=='NaN' || Number($("#prefix").val())>128 || Number($("#prefix").val())<1)) return $.messager.alert('提示', '地址前缀的范围需要大于等于1小于等于128', 'warning');
    let params = {
        oriNodeCode: $("#nodeList").combotree('getValue'),
        planIpType: $("#ipTypeList").combotree('getValue'),
        startTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[0].replace(/[-:/ ]/g, ""),
        endTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[1].replace(/[-:/ ]/g, ""),
        inetnum: $("#Inetnum").val(),
        remark: $("#remark").val(),
        prefix: $("#prefix").val(),
        pagesize: queryAllPage.pageSize,
        pageno: queryAllPage.pageNum,
    }
    console.log(params);
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/IpAddressPlan/GetPlanAddrSumV6'),
        type: 'get',
        data: params,
        cache: false,
        dataType: 'json',
        beforeSend: function() {

        },
        success: function(obj) {
            if (obj.code == '0000') {
                let tableData = obj.data.planAddrSumList;
                queryAllPage.total = obj.data.total;
                loadTable(tableData);
                initClickPageEvent(true);
            } else {
                $.messager.alert('提示', obj.msg, 'error');
            }
        },
        error: function(error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function() {

        }
    });
}

//明细查询
function getPlanAddrDetail() {
    if($("#prefix").val()!=''&&(Number($("#prefix").val()).toString()=='NaN' || Number($("#prefix").val())>128 || Number($("#prefix").val()))<1) return $.messager.alert('提示', '地址前缀的范围需要大于等于1小于等于128', 'warning');
    let params = {
        oriNodeCode: $("#nodeList").combotree('getValue'),
        planIpType: $("#ipTypeList").combotree('getValue'),
        startTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[0].replace(/[-:/ ]/g, ""),
        endTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[1].replace(/[-:/ ]/g, ""),
        inetnum: $("#Inetnum").val(),
        sumInetNum: '',
        remark: $("#remark").val(),
        prefix: $("#prefix").val(),
        isPlanAddr: 0,
        pagesize: queryAllPage.pageSize,
        pageno: queryAllPage.pageNum
    }
    console.log(params)
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/IpAddressPlan/GetPlanAddrDetailV6'),
        type: 'get',
        data: params,
        cache: false,
        dataType: 'json',
        beforeSend: function() {

        },
        success: function(obj) {
            let tableData = obj.data.planAddrSumList;
            queryAllPage.total = obj.data.total;
            loadDetailTable(tableData);
            initClickPageEvent(false)
        },
        error: function(error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function() {

        }
    });
}

//加载汇总表格数据
function loadTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [
        [{
                field: 'sumInetNum',
                title: 'IP地址段',
                align: 'center',
                width: 260,
                formatter: function(value, row, index) {
                    return '<span class="icon iconfont icon-jiahao" style="margin-right:4px"></span><span>' + value + '</span>'
                }
            },
            {
                field: 'codingScheme',
                title: '编码方案',
                align: 'center',
                width: 320,
                formatter: function(value, row, index) {
                    var _d = IpTypeList[row.planIpType]
                    var _div = ''
                    if (_d && _d.schemelist.length > 0) {
                        var txt = loadCodePlanContentTable(_d.schemelist);
                        var fullIp = row.stratFullIp + '-' + row.endFullIp
                        _div += '<div class="listrow" sumInetNum="' + row.sumInetNum + '" fullIp="' + fullIp + '" planIpTypeName="' + row.planIpTypeName + '" planIpType="' + row.planIpType + '"><div class="planItemBox">' + txt + '</div></div>'
                    }
                    return _div
                }
            },
            { field: 'planIpTypeName', title: '地址类型', align: 'center', width: 140 },
            { field: 'planNodeName', title: '规划组织', align: 'center', width: 100 },
            {
                field: 'oriIpTypeName',
                title: '原地址类型',
                align: 'center',
                width: 80,
                formatter: function(value, row, index) {
                    return ''
                }
            },
            {
                field: 'oriNodeName',
                title: '上级组织',
                align: 'center',
                width: 80,
                formatter: function(value, row, index) {
                    return ''
                }
            },
            {
                field: 'planTime',
                title: '规划日期',
                align: 'center',
                width: 140,
                formatter: function(value, row, index) {
                    return ''
                }
            },
            {
                field: 'usedStat',
                title: '使用情况',
                align: 'center',
                width: 80,
                formatter: function(value, row, index) {
                    if (value == 0) {
                        return '有空闲';
                    } else {
                        return '已规划';
                    }
                }
            },
            {
                field: 'remark',
                title: '备注',
                align: 'center',
                width: 140,
                formatter: function(value, row, index) {
                    return ''
                }
            },
            {
                field: 'operate',
                title: '操作',
                align: 'center',
                width: 100,
                formatter: function(value, row, index) {
                    let IsPlanAddr = row.isPlanAddr;
                    let OriNodeCode = row.oriNodeCode;
                    let Inetnum = row.sumInetNum;
                    return "";
                }
            }
        ]
    ];
    var tableId = "dataList";
    var tableH = $(".tablePanel").height();
    var opt = {
        columnsData: columnsData,
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false //分页
        }
    };
    relatedTable(tableId, opt);
    initClickTableEvent();
    $(".datagrid-row td").css("background-color", "#EBF0FD");
    // $(".datagrid-row :nth-child(1) div").css("cssText", "text-align: left !important;");
}

//加载明细表格数据
function loadDetailTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [
        [
            { field: 'inetnum', title: 'IP地址段', align: 'center', width: 260 },
            {
                field: 'codingScheme',
                title: '编码方案',
                align: 'center',
                width: 320,
                formatter: function(value, row, index) {
                    var _d = IpTypeList[row.planIpType]
                    var _div = ''
                    if (_d && _d.schemelist.length > 0) {
                        var txt = loadCodePlanContentTable(_d.schemelist);
                        var fullIp = row.stratFullIp + '-' + row.endFullIp
                        _div += '<div class="listrow" sumInetNum="' + row.inetnum + '" fullIp="' + fullIp + '" planIpTypeName="' + row.planIpTypeName + '" planIpType="' + row.planIpType + '" ><div class="planItemBox">' + txt + '</div></div>'
                    }
                    return _div
                }
            },
            { field: 'planIpTypeName', title: '地址类型', align: 'center', width: 140 },
            { field: 'planNodeName', title: '规划组织', align: 'center', width: 100 },
            { field: 'oriIpTypeName', title: '原地址类型', align: 'center', width: 80 },
            {
                field: 'oriNodeName',
                title: '上级组织',
                align: 'center',
                width: 80,
                formatter: function(value, row, index) {
                    if (row.isPlanAddr == 0) {
                        return '';
                    } else {
                        return value;
                    }
                }
            },
            { field: 'planTime', title: '规划日期', align: 'center', width: 140 },
            {
                field: 'isPlanAddr',
                title: '使用情况',
                align: 'center',
                width: 80,
                formatter: function(value, row, index) {
                    if (value == 0) {
                        return '未规划';
                    } else {
                        return row.allocatedRatio;
                    }
                }
            },
            { field: 'remark', title: '备注', align: 'center', width: 140 },
            {
                field: 'operate',
                title: '操作',
                align: 'center',
                width: 100,
                formatter: function(value, row, index) {
                    let IsPlanAddr = row.isPlanAddr;
                    let OriNodeCode = row.oriNodeCode;
                    let Inetnum = row.inetnum;
                    return "<a class='operateBtn' onclick=openAddrPlanPage(\'" + IsPlanAddr + "\',\'" + OriNodeCode + "\',\'" + Inetnum + "\')>地址规划</a>";
                }
            }
        ]
    ];
    var tableId = "dataList";
    var tableH = $(".tablePanel").height();
    var opt = {
        columnsData: columnsData,
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false //分页
        }
    };
    relatedTable(tableId, opt);
    $(".datagrid-row td").css("background-color", "#fff");
}

//初始化导入按钮点击事件
function initImportBtnClickEvent() {
    $(".importBtn").click(function() {
        if ($(this).val() == "导入") {
            //判断是否选择了需要导入的文件
            if ($("input[name='impfilename']").val() == "") {
                alert("请选择需要导入的文件！");
                return;
            }
            //调用批量导入接口
            $("#importForm").ajaxSubmit({
                url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/ImpPlanAddrV6'),
                type: 'POST',
                data: { planman: userName },
                dataType: 'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function() {
                    $.messager.progress({
                        title: '提示',
                        msg: '数据正在导入中，请稍候...',
                        text: ''
                    });
                },
                success: function(obj) {
                    if (obj.code == "0000") {
                        $.messager.progress('close');
                        setTimeout(() => {
                            alert("v6规划地址批量导入成功!");
                            $(".importTablePanel").show();
                            $(".layui-layer-content").css("height", 'auto');
                            let tableData = obj.data;
                            loadImportTable(tableData)
                        }, 100);
                    } else {
                        $.messager.alert('提示', obj.msg, 'error');
                        $.messager.progress('close');
                    }
                },
                error: function(error) {
                    $.messager.alert('提示', '接口调用失败!', 'error');
                    $.messager.progress('close');
                },
                complete: function() {

                }
            });
        } else if ($(this).val() == "模板下载") {
            window.open(bathPath + "/ipaddrmodule/itep/var/config/ipaddr/v6/addrv6Plan.xls");
        }
    });
}

//导入信息
function importPlanAddrInfo() {
    //动态生成弹出层元素
    let content = '';
    content += '<div class="importPanel">';
    content += '<form  id="importForm" class="importForm" method="post">'
    content += '<input type="file" name="impfilename" required="required"/>'
    content += '<input type="button" class="importBtn" id="btnSubmit" value="导入"/>'
    content += '<input type="button" class="importBtn" id="importBtn" value="模板下载"/>'
    content += '<span style="color:#f40">注释：导入文件请保存为97-2003版后再做上传</span>';
    content += '</form>'
    content += '<div class= "importTablePanel">'
    content += '<div class="importList" id="importList"></div>'
    content += '</div>'
    content += '</div>'
        //打开弹出层
    var layer = layui.layer;
    layer.open({
        type: 1,
        title: ['IPV6地址规划批量导入', 'text-align: center;'],
        area: ['70%', 'auto'],
        offset: '150px',
        content: content,
        cancel: function(index, layero) {

        }
    });
    initImportBtnClickEvent();
}

//加载批量导入表格数据
function loadImportTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [
        [
            { field: 'addInetNum', title: 'IP地址段', align: 'center', width: 180 },
            { field: 'planIpTypeName', title: '地址类型', align: 'center', width: 120 },
            { field: 'planNodeName', title: '规划组织', align: 'center', width: 120 },
            { field: 'oriIpTypeName', title: '原地址类型', align: 'center', width: 120 },
            { field: 'oriNodeName', title: '上级组织', align: 'center', width: 120 },
            { field: 'remark', title: '备注', align: 'center', width: 120 },
            { field: 'errormsg', title: '错误原因', align: 'center', width: 180 }
        ]
    ];
    var tableId = "importList";
    var tableH = $(".importTablePanel").height();
    var opt = {
        columnsData: columnsData,
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false //分页
        }
    };
    relatedTable(tableId, opt);
}

//校验输入的IP地址是合法的ipv4或ipv6
//校验IP
function ckIPV6(ip) {
    var reg = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/

    if (!reg.test(ip)) {
        //$.messager.alert('提示', '地址格式不正确！');
        return false;
    }
    return true

}
//验证掩码
function ckyanma(ip) {
    var iparr=''
    if(ip.indexOf("-") != -1){
        iparr = $.trim(ip).split('-')
    }else{
        iparr = $.trim(ip).split('/')
    }
    // var iparr = $.trim(ip).split('/')
    var flag = ckIPV6($.trim(iparr[0]))
    if (!flag) {
        return false
    } else {
        if (!(/(^[1-9]\d*$)/.test(iparr[1]))) {

            return false
        }
        if (parseInt(iparr[1]) > 128) {
            return false
        } else {
            return true

        }
    }


}
function validIPAddress(IP) {
    //按"."进行分割
    var parts = IP.split(".");
    //IPv4由4个部分组成
    if (parts.length === 4) {
        for (var i = 0; i < parts.length; i++) {
            var cur = parts[i];
            //空字符串或当前部分不是数字
            //那么肯定不合法
            if (!cur || isNaN(cur)) {
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
//查询对应地址类型的编码方案
function GetIpTypeSchemeList() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/Ipv6SchemeMng/GetIpTypeSchemeList'),
        type: 'POST',
        data: {},
        dataType: 'json',
        async: false,
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function() {

        },
        success: function(obj) {
            schemelist = obj.data
            readNodes(schemelist, IpTypeList)
        },
        error: function(error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function() {}
    });
}
//查询对应地址类型的编码方案
function getOneIpTypeScheme(IpTypeCode) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/Ipv6SchemeMng/GetOneIpTypeScheme?IpTypeCode=' + IpTypeCode),
        type: 'POST',
        data: {},
        dataType: 'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function() {

        },
        success: function(obj) {
            scheme = obj.data[0].scheme
            var _obj = loadCodePlanContent(scheme);
            $(".planItemBox").append(_obj.content)
            $(".planItemValue").append(_obj.value)
        },
        error: function(error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function() {}
    });
}
//编码方案内容(本身)
function loadCodePlanContentTable(schemelist) {
    var len = 0;
    var content = '';
    var itemWidth = "itemWidth"+schemelist.length;//宽度均分
    for(var i = 0;i < schemelist.length;i++){
        len += Number(schemelist[i].BitLength);
    }
    spaceLen = 64 - len;
    if(spaceLen == 0){
        itemWidth = "itemWidthDeal"+schemelist.length;
    }
    for(var i = 0;i < schemelist.length;i++){
        if(schemelist[i].LableCodeName != undefined && schemelist[i].LableCodeName != ''){
            if(schemelist[i].LableCodeName=='240E:0'){
                content += '<div class="schemeItem '+itemWidth+'" style="text-overflow: initial;background-color:'+schemelist[i].LableColor+'" title='+schemelist[i].LableCodeName+'>'+schemelist[i].LableCodeName+'</div>'
            }else if(isChinese(schemelist[i].LableCodeName.split('-').join(''))){
                content += '<div class="schemeItem '+itemWidth+'" style="text-overflow: initial;background-color:'+schemelist[i].LableColor+'"title='+schemelist[i].LableCodeName+'>'+schemelist[i].LableCodeName.substr(0, 2)+'</div>'
            }else{
                content += '<div class="schemeItem '+itemWidth+'" style="text-overflow: initial;background-color:'+schemelist[i].LableColor+'" title='+schemelist[i].LableCodeName+'>'+schemelist[i].LableCodeName.substr(0, 3)+'</div>'
            }    
        }else{
            content += '<div class="schemeItem '+itemWidth+'" style="text-overflow: initial;background-color:'+schemelist[i].LableColor+'" title='+schemelist[i].LableName+'>'+schemelist[i].LableName.substr(0, 2)+'</div>'
        }      
        
    }
    if(schemelist.length != 0){
        if(spaceLen == 0){
            content += '<div class="schemeItem interfaceAddr">接口</div>';
        }else{
            content += '<div class="schemeItem subnetSpace">子网</div>';
            content += '<div class="schemeItem interfaceAddr">接口</div>';
        }
    }
    return content;
}
function isChinese(temp){
    var re=/[^\u4E00-\u9FA5]/;
    if (re.test(temp)) return false ;
    return true ;
}
function loadCodePlanContent(schemelist,fullip) {
    var len = 0;
    var content = '';
    var _valueS = '',_valueE = ''
    var itemWidth = "itemWidth" + schemelist.length; //宽度均分
    var _index = 0
    var _startip = fullip.split('-')[0],
        _endip = fullip.split('-')[1]
    for (var i = 0; i < schemelist.length; i++) {
        var _bit = schemelist[i].BitLength/4
        var _txtS = _startip.substr(_index,_bit).indexOf(':')>-1?_startip.substr(_index,_bit+1):_startip.substr(_index,_bit)
        var _txtE = _endip.substr(_index,_bit).indexOf(':')>-1?_endip.substr(_index,_bit+1):_endip.substr(_index,_bit)
        var _txtT = 1
        if(_txtS.charAt(0)==":") _txtS = _txtS.substr(1,_txtS.length-1)
        if(_txtS.charAt(_txtS.length-1)==":") _txtS = _txtS.substr(0,_txtS.length-1)
        if(_txtE.charAt(0)==":") _txtE = _txtE.substr(1,_txtE.length-1)
        if(_txtE.charAt(_txtE.length-1)==":") _txtE = _txtE.substr(0,_txtE.length-1)
        if(_txtS == _txtE) _txtT = 0
        var _name = schemelist[i].LableCodeName?schemelist[i].LableCodeName:schemelist[i].LableName
        content += '<div class="schemeItem schemeItemCombo ' + itemWidth + '" style="text-indent:1em;background-color:' + schemelist[i].LableColor + '"><span class="easyui-combobox"  id="labelCodeList' + schemelist[i].LableId + '">' + _name +'('+schemelist[i].BitLength+')'+ '</span></div>'
        _valueS += '<div class="schemeItem schemeItemCombo ' + itemWidth + '" style="text-indent:1em;background-color:' + schemelist[i].LableColor + '"><span class="easyui-combobox"  id="labelCodeValue' + schemelist[i].LableId + '">' + _txtS + '</span></div>'
        _valueE += '<div class="schemeItem schemeItemCombo ' + itemWidth + '" style="text-indent:1em;background-color:' + schemelist[i].LableColor + '"><span class="easyui-combobox"  id="labelCodeValue' + schemelist[i].LableId + '" style="opacity:'+_txtT+';">' + _txtE + '</span></div>'
        // len += Number(schemelist[i].BitLength);
        _index += _startip.substr(_index,_bit).indexOf(':')>-1?_bit+1:_bit
    }
    // spaceLen = 64 - len;
    if (schemelist.length != 0) {
        var _s = _startip.substr(_index,_startip.length - _index-16-3),
        _sl = _s.replace(/:/g,'').length*4
        var _e = _endip.substr(_index,_endip.length - _index-16-3)

        if(_s.charAt(0)==":") _s = _s.substr(1,_s.length-1)
        if(_s.charAt(_s.length-1)==":") _s = _s.substr(0,_s.length-1)
        if(_e.charAt(0)==":") _e = _e.substr(1,_e.length-1)
        if(_e.charAt(_e.length-1) == ':') _e = _e.substr(0,_e.length-1)

        content += '<div class="schemeBox" style="display: flex;flex-direction: row;">';
        content += '<div class="schemeItem subnetSpace" style="text-indent:1em;"><span>子网空间（' + _sl + '）</span></div>';
        content += '<div class="schemeItem interfaceAddr" style="text-indent:1em;">接口地址（64）</div>';
        content += '</div>';
        _valueS += '<div class="schemeBox" style="display: flex;flex-direction: row;">';
        _valueS += '<div class="schemeItem subnetSpace" style="text-indent:1em;"><span>'+_s+'</span></div>';
        _valueS += '<div class="schemeItem interfaceAddr" style="text-indent:1em;">'+_startip.substr(_startip.length-16-3)+'</div>';
        _valueS+= '</div>';
        _valueE += '<div class="schemeBox" style="display: flex;flex-direction: row;">';
        _valueE += '<div class="schemeItem subnetSpace" style="text-indent:1em;"><span>'+_e+'</span></div>';
        _valueE += '<div class="schemeItem interfaceAddr" style="text-indent:1em;">'+_endip.substr(_endip.length-16-3)+'</div>';
        _valueE+= '</div>';
    }
    var obj = {
        content: content,
        valueS: _valueS,
        valueE: _valueE
    }
    return obj;
}

function readNodes(nodes, obj) {
    for (let item of nodes) {
        obj[item.IpTypeCode] = item
        if (item.children && item.children.length) {
            readNodes(item.children, obj)
        }
    }
    return obj
}
$(document).on('click', '.listrow', function() {
    var planIpType = $(this).attr('planIpType')
    var fullip = $(this).attr('fullip')
    var _d = IpTypeList[planIpType]
    if (_d && _d.schemelist.length > 0) {
            var _schemelist = $.parseJSON(JSON.stringify(_d.schemelist)); 
            //切割IPV6地址对应位置编码，塞进数组
            // var ipv6Addr = InetnumID;
            var startIPv6Addr = fullip.split('-')[0];
            var endIPv6Addr = fullip.split('-')[1];
            var start = 0
            var end = 0
            var length = 0
            var spaceLength = 0
            var schemelistLength = _schemelist.length
            var startSplit= ''
            var endSplit= ''
            for(var i =0;i< _schemelist.length; i++){
                if(startIPv6Addr.substring(start,(start + _schemelist[i].BitLength/4+1)).indexOf(":") != -1){//当截取中有：多截取一位
                    end = start + _schemelist[i].BitLength/4+1
                    if(i == 0){
                         startSplit= startIPv6Addr.substring(start,end)
                         endSplit= endIPv6Addr.substring(start,end)
                    }else{
                        startSplit= startIPv6Addr.substring(start,end).split(':').join("")
                        endSplit= endIPv6Addr.substring(start,end).split(':').join("")
                    }
                    start += (_schemelist[i].BitLength/4)+1
                }else{//当截取中没有：
                    end = start + _schemelist[i].BitLength/4
                    if(i == 0){
                        startSplit= startIPv6Addr.substring(start,end)
                        endSplit= startIPv6Addr.substring(start,end)
                    }else{
                        startSplit= startIPv6Addr.substring(start,end).split(':').join("")
                        endSplit= endIPv6Addr.substring(start,end).split(':').join("")
                    }
                    start += (_schemelist[i].BitLength/4)
                } 
                // 判断起始和终点地址截取是否一样
                if(startSplit == endSplit){
                    _schemelist[i].HexadecimalCodeSplit = startSplit
                }else{
                    _schemelist[i].HexadecimalCodeSplit = startSplit + "," + endSplit
                }  
                length += Number(_schemelist[i].BitLength); 
            }
            //子网空间和接口地址
            spaceLength = 64 - length;           
            var arr =[]
            var j =1
            for( var i=startIPv6Addr.split('').length-1;i>=0;i--){
                if(i>(19-spaceLength/4-j) && i<19 ){
                    arr.push(startIPv6Addr.split('')[i])
                    if(startIPv6Addr.split('')[i] == ':'){
                        j++
                    }
                }
            }
            var arr1 =[]
            var k =1
            for( var i=endIPv6Addr.split('').length-1;i>=0;i--){
                if(i>(19-spaceLength/4-k) && i<19 ){
                    arr1.push(endIPv6Addr.split('')[i])
                    if(endIPv6Addr.split('')[i] == ':'){
                        k++
                    }
                }
            }
            var arr2 =[]
            var g =1
            for( var i=startIPv6Addr.split('').length-1;i>=0;i--){
                if(i>=20){
                    arr2.push(startIPv6Addr.split('')[i])
                    if(startIPv6Addr.split('')[i] == ':'){
                        g++
                    }
                }
            }
            var arr3 =[]
            var f =1
            for( var i=endIPv6Addr.split('').length-1;i>=0;i--){
                if(i>=20){
                    arr3.push(endIPv6Addr.split('')[i])
                    if(endIPv6Addr.split('')[i] == ':'){
                        f++
                    }
                }
            }
            if(spaceLength!=0){
                _schemelist.push({
                    'BitLength': spaceLength,
                    'CodeTableName': "",
                    'LableColor':'#f2edb5',
                    'HexadecimalCode': "",
                    'HexadecimalCode1': "",
                    'HexadecimalCodeSplit': arr.reverse().join('')+','+arr1.reverse().join(''),
                    'Ipv6Position': (length+1)+'-'+64,
                    'LableCodeName': "",
                    'LableName': "子网空间",
                },{
                    'BitLength': 64,
                    'CodeTableName': "",
                    'LableColor':'#b3c8f7',
                    'HexadecimalCode': "",
                    'HexadecimalCode1': "",
                    'HexadecimalCodeSplit':  arr2.reverse().join('')+','+arr3.reverse().join(''),
                    'Ipv6Position': '65-128',
                    'LableCodeName': "",
                    'LableName': "接口地址", 
                })
            }else{
                _schemelist.push({
                    'BitLength': 64,
                    'CodeTableName': "",
                    'LableColor':'#b3c8f7',
                    'HexadecimalCode': "",
                    'HexadecimalCode1': "",
                    'HexadecimalCodeSplit':  arr2.reverse().join('')+','+arr3.reverse().join(''),
                    'Ipv6Position': '65-128',
                    'LableCodeName': "",
                    'LableName': "接口地址", 
                })
            }
            // initTableData()
            var content = loadCodePlanContentDeatail(_schemelist);
            $("#relateContent .planItemBox").empty().append(content)
            var content1 = loadCodePlanContentIPV6(_schemelist);
            $("#relateContent .planItemBoxDetail").empty().append(content1)

        // var _obj = loadCodePlanContent(_d.schemelist,fullip);
        // $(".planItemBox").empty().append(_obj.content)
        // $(".planItemValueS").empty().append(_obj.valueS)
        // $(".planItemValueE").empty().append(_obj.valueE)
        $(".IPv6Addr").text($(this).attr('sumInetNum'))
        $(".IPv6AddrType").text($(this).attr('planIpTypeName'))
        $(".fullyCoded").text($(this).attr('fullIp'))
        $('#dlg').dialog('open')
    }
})
//详细编码方案内容
function loadCodePlanContentDeatail(_schemelist){
    var  schemelist = _schemelist
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
    return content;
}
//详细编码方案内容对应位置编码
function loadCodePlanContentIPV6(_schemelist){
    var  schemelist = _schemelist
    $(".relateContent .planItemBoxDetail").html("");//清空
    var len = 0;
    var content = '';
    var itemWidth = "itemWidth"+schemelist.length;//宽度均分
    for(var i = 0;i < schemelist.length;i++){
        if(schemelist[i].HexadecimalCodeSplit.indexOf(',') != -1){
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'">'+'<p>'+schemelist[i].HexadecimalCodeSplit.split(',')[0]+'</p>'+'<p>'+schemelist[i].HexadecimalCodeSplit.split(',')[1]+'</p>'+'</div>'
        }else{
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'">'+schemelist[i].HexadecimalCodeSplit+'</div>'
        }
        len += Number(schemelist[i].BitLength);
    }
    return content;
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