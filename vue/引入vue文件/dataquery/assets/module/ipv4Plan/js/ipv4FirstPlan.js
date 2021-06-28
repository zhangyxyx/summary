$(function () {
    getNodeList();
    initBtnClickEvent();
    initLayuiObj();
    initClearBtnEvent();
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
                width: 220,
                panelHeight: 'auto',//高度自适应
                multiple: false,
                editable: false,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    $("#nodeList").combotree('tree').tree("collapseAll");
                },
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
                    getIpTypeList(row.nodeCode);
                    //规划组织
                    getManOrgList(row.nodeCode)
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

//获取地址类型
function getIpTypeList(nodeCode) {
    $('.clearBtn').css('display', 'none')
    let params = {
        userName: userName,
        nodeCode: nodeCode,
        ipType: "",
        authType: "",
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpAddrType/GetIPTypeV4List'),
        type: 'post',
        cache: false,
        data: JSON.stringify(params),
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
            let ipTypeList = obj.data;
            $("#ipTypeList").combotree({
                idField: 'id',
                textField: 'text',
                data: ipTypeList,
                width: 220,
                panelHeight: 'auto',//高度自适应
                multiple: false,
                editable: false,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    $("#ipTypeList").combotree('tree').tree("collapseAll");
                },
                filter: function (q, row) {
                    var opts = $(this).combobox('options');
                    return row[opts.textField].indexOf(q) == 0;
                    // return row.textField.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function (q, e) {
                        $('#ipTypeList').combotree('tree').tree('doFilter', q)
                    }
                },
                onBeforeSelect: function (row) { //节点被选中前触发，返回 false 则取消选择动作(但是返回false，下拉选项依旧会关闭)
                   console.log(row)
                    if (row.click == "N") {//标签不可选
                        return false;
                    } else {
                        $('.clearBtn').css('display', 'block');
                        return true;
                    }
                },
            });

        }
    });
}
//获取规划组织
function getManOrgList(nodeCode) {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/NodeManage/GetNodeList'),
        type: 'post',
        cache: false,
        data: JSON.stringify({ userName: userName, nodeCode: nodeCode }),
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
            obj.data[0].click ='N'
            let nodeList = obj.data;
            $("#orgList").combotree({
                idField: 'nodeCode',
                textField: 'nodeName',
                data: nodeList,
                width: 220,
                panelHeight: 'auto',//高度自适应
                multiple: false,
                editable: false,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    $("#orgList").combotree('tree').tree("collapseAll");
                },
                filter: function (q, row) {
                    return row.text.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function (q, e) {
                        $('#nodeList').combotree('tree').tree('doFilter', q)
                    }
                },
                onSelect: function (row) {

                },
                onBeforeSelect: function (row) { //节点被选中前触发，返回 false 则取消选择动作(但是返回false，下拉选项依旧会关闭)
                    if (row.click == "N") {//标签不可选
                        return false;
                    } else {
                        $('.clearBtnOrg').css('display', 'block');
                        return true;
                    }
                },
            });
        }
    });
}
// //获取规划组织
// function getManOrgList(nodeCode) {
//     $.ajax({
//         url: encodeURI(bathPath + '/ipaddrmodule/NodeManage/GetNodeList'),
//         type: 'post',
//         cache: false,
//         data: JSON.stringify({ userName: userName, nodeCode: nodeCode }),
//         dataType: 'json',
//         contentType: "application/json",
//         success: function (obj) {
//             let nodeList = obj.data[0].children;
//             if(nodeList.length==0) return;
//             var str ='<option value=""></option>'
//             nodeList.forEach(item=>{
//                 str +='<option value="'+item.nodeCode+'">'+item.nodeName+'</option>'
//             })
//             $("#orgList").html(str)
            
//         }
//     });
// }

//初始化地址类型清空按钮事件 清空规划组织
function initClearBtnEvent() {
    $(".clearBtn").click(function () {
        $('#ipTypeList').combotree("clear")
        if ($("#ipTypeList").combotree('getValue') == "") {
            $('.clearBtn').css('display', 'none')
        } else {
            $('.clearBtn').css('display', 'block')
        }
    })
    //清空规划组织
    $(".clearBtnOrg").click(function () {
        $('#orgList').combotree("clear")
        if ($("#orgList").combotree('getValue') == "") {
            $('.clearBtnOrg').css('display', 'none')
        } else {
            $('.clearBtnOrg').css('display', 'block')
        }
    })
}

//初始化按钮点击事件
function initBtnClickEvent() {
    $(".btnItem").click(function () {
        //ip地址段不为空时校验
        let Inetnum = $("#Inetnum").val();
        //获取当前点击的按钮
        let btnType = $(this).val();
        console.log(btnType)
        if (btnType == "汇总查询" || btnType == "明细查询") {
            if (Inetnum != "") {
                if (Inetnum.indexOf("/") != -1) {//地址段
                    var IPAddrArr = Inetnum.split("/");
                    if (IPAddrArr.length != 2) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return false;
                    }
                    if ("IPv4" != validIPAddress(IPAddrArr[0])) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return false;
                    } else {
                        //在IP地址后加上"/"符号以及1-32的数字
                        if (!(IPAddrArr[1] >= 1 && IPAddrArr[1] <= 32)) {
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
                    if ("IPv4" != validIPAddress(IPAddrArr[0]) || "IPv4" != validIPAddress(IPAddrArr[1])) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return false;
                    }
                    //起始地址不能大于终止地址
                    var addr1 = IPAddrArr[0].split(".");
                    var addr2 = IPAddrArr[1].split(".");
                    if (ip2int(IPAddrArr[0])>ip2int(IPAddrArr[1])) {
                        $.messager.alert('提示', '起始地址不能大于终止地址！', 'warning');
                        return false;
                    }
                } else {//掩码
                    if ("IPv4" != validIPAddress(Inetnum)) {
                        $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                        return;
                    }
                }
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
                getPlanAddrSumV4();
                break;
            case "明细查询":
                queryAllPage.pageSize = 20;
                queryAllPage.pageNum = 1;
                getPlanAddrDetail();
                break;
            case "导入":
                importPlanAddrInfo()
                break;
            case "导出":
                exportAddrInfo();
                break;
            case "地址规划":
                let OriNodeCode = $("#nodeList").combotree('getValue')
                //window.open('views/jsp/ipv4addrPlan/ipv4addrPlan.jsp?OriNodeCode='+OriNodeCode+'&AutoQuery=Y');
                window.top.$vm.$openTab({
                    name: '地址规划',
                    path: bathPath + '/ipaddrmodule/views/jsp/ipv4addrPlan/ipv4addrPlan.jsp?OriNodeCode=' + OriNodeCode + '&AutoQuery=Y'
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
        onSelectPage: function (pageNumber, pageSize) {
            queryAllPage.pageSize = pageSize;
            queryAllPage.pageNum = pageNumber;
            if (falg) {//汇总
                getPlanAddrSumV4();//请求数据
            } else {//详细
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
    //window.open('views/jsp/ipv4addrPlan/ipv4addrPlan.jsp?OriNodeCode='+OriNodeCode+'&Inetnum='+Inetnum+'&AutoQuery='+AutoQuery+'&username='+username);
    window.top.$vm.$openTab({
        name: '地址规划',
        path: bathPath + '/ipaddrmodule/views/jsp/ipv4addrPlan/ipv4addrPlan.jsp?OriNodeCode=' + OriNodeCode + '&Inetnum=' + Inetnum + '&AutoQuery=' + AutoQuery + '&username=' + username
    })
}

//初始化加减号按钮点击事件
function initClickTableEvent() {
    $(".icon").click(function () {
        if ($(this).hasClass("icon-jiahao")) {//打开
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
                PlanNodeCode: $("#orgList").combotree('getValue'), //规划组织
                UsedStat: $('#usedStat option:selected').val(), //使用情况
                isPlanAddr: 0,
                pagesize: 1000,
                pageno: 1
            }
            //请求详细信息
            $.ajax({
                url: encodeURI(bathPath + '/ipaddrmodule/IpAddressPlan/GetPlanAddrDetailV4'),
                type: 'get',
                data: params,
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '正在加载数据，请稍候...',
                        text: ''
                    });
                },
                success: function (obj) {
                    let detailsData = obj.data.planAddrSumList;
                    for (let i = 0; i < detailsData.length; i++) {//倒序追加
                        let content = '';
                        content += '<tr class="trAdd trAdd' + index + '">';
                        content += '<td style="text-align: left;padding-left: 15px;">' + detailsData[detailsData.length - 1 - i].inetnum + '</td>';
                        content += '<td>' + detailsData[detailsData.length - 1 - i].planIpTypeName + '</td>';
                        content += '<td>' + detailsData[detailsData.length - 1 - i].planNodeName + '</td>';
                        content += '<td>' + detailsData[detailsData.length - 1 - i].oriIpTypeName + '</td>';
                        if (detailsData[detailsData.length - 1 - i].isPlanAddr == 0) {//未规划
                            content += '<td></td>';
                        } else {
                            content += '<td>' + detailsData[detailsData.length - 1 - i].oriNodeName + '</td>';
                        }
                        content += '<td>' + detailsData[detailsData.length - 1 - i].planTime + '</td>';
                        if (detailsData[detailsData.length - 1 - i].isPlanAddr == 0) {//未规划
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
                error: function (error) {
                    $.messager.alert('提示', '接口调用失败!', 'error');
                },
                complete: function () {
                    $.messager.progress('close');
                }
            });
        } else {//关闭
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
function getPlanAddrSumV4() {
    let params = {
        oriNodeCode: $("#nodeList").combotree('getValue'),
        planIpType: $("#ipTypeList").combotree('getValue'),
        startTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[0].replace(/[-:/ ]/g, ""),
        endTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[1].replace(/[-:/ ]/g, ""),
        inetnum: $("#Inetnum").val(),
        remark: $("#remark").val(),
        PlanNodeCode: $("#orgList").combotree('getValue'), //规划组织
        UsedStat: $('#usedStat option:selected').val(), //使用情况
        pagesize: queryAllPage.pageSize,
        pageno: queryAllPage.pageNum,
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpAddressPlan/GetPlanAddrSumV4'),
        type: 'get',
        data: params,
        cache: false,
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (obj) {
            if (obj.code == '0000') {
                let tableData = obj.data.planAddrSumList;
                queryAllPage.total = obj.data.total;
                loadTable(tableData);
                initClickPageEvent(true);
            } else {
                $.messager.alert('提示', obj.msg, 'error');
            }
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function () {

        }
    });
}

//明细查询
function getPlanAddrDetail() {
    let params = {
        oriNodeCode: $("#nodeList").combotree('getValue'),
        planIpType: $("#ipTypeList").combotree('getValue'),
        startTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[0].replace(/[-:/ ]/g, ""),
        endTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[1].replace(/[-:/ ]/g, ""),
        inetnum: $("#Inetnum").val(),
        sumInetNum: '',
        remark: $("#remark").val(),
        PlanNodeCode: $("#orgList").combotree('getValue'), //规划组织
        UsedStat: $('#usedStat option:selected').val(), //使用情况
        isPlanAddr: 0,
        pagesize: queryAllPage.pageSize,
        pageno: queryAllPage.pageNum
    }
    console.log(params)
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpAddressPlan/GetPlanAddrDetailV4'),
        type: 'get',
        data: params,
        cache: false,
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (obj) {
            let tableData = obj.data.planAddrSumList;
            queryAllPage.total = obj.data.total;
            loadDetailTable(tableData);
            initClickPageEvent(false)
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function () {

        }
    });
}

//加载汇总表格数据
function loadTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [[
        {
            field: 'sumInetNum', title: 'IP地址段', align: 'center', width: 140,
            formatter: function (value, row, index) {
                return '<span class="icon iconfont icon-jiahao" style="margin-right:4px"></span><span>' + value + '</span>'
            }
        },
        { field: 'planIpTypeName', title: '地址类型', align: 'center', width: 140 },
        { field: 'planNodeName', title: '规划组织', align: 'center', width: 100 },
        {
            field: 'oriIpTypeName', title: '原地址类型', align: 'center', width: 80,
            formatter: function (value, row, index) {
                return ''
            }
        },
        {
            field: 'oriNodeName', title: '上级组织', align: 'center', width: 80,
            formatter: function (value, row, index) {
                return ''
            }
        },
        {
            field: 'planTime', title: '规划日期', align: 'center', width: 140,
            formatter: function (value, row, index) {
                return ''
            }
        },
        {
            field: 'usedStat', title: '使用情况', align: 'center', width: 80,
            formatter: function (value, row, index) {
                if (value == 0) {
                    return '有空闲';
                } else {
                    return '已规划';
                }
            }
        },
        {
            field: 'remark', title: '备注', align: 'center', width: 140,
            formatter: function (value, row, index) {
                return ''
            }
        },
        { field: 'operate', title: '操作', align: 'center', width: 100 }
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
    initClickTableEvent();
    $(".datagrid-row td").css("background-color", "#EBF0FD");
    $(".datagrid-row :nth-child(1) div").css("cssText", "text-align: left !important;");
}

//加载明细表格数据
function loadDetailTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [[
        { field: 'inetnum', title: 'IP地址段', align: 'center', width: 140 },
        { field: 'planIpTypeName', title: '地址类型', align: 'center', width: 140 },
        { field: 'planNodeName', title: '规划组织', align: 'center', width: 100 },
        { field: 'oriIpTypeName', title: '原地址类型', align: 'center', width: 80 },
        {
            field: 'oriNodeName', title: '上级组织', align: 'center', width: 80,
            formatter: function (value, row, index) {
                if (row.isPlanAddr == 0) {
                    return '';
                } else {
                    return value;
                }
            }
        },
        { field: 'planTime', title: '规划日期', align: 'center', width: 140 },
        {
            field: 'isPlanAddr', title: '使用情况', align: 'center', width: 80,
            formatter: function (value, row, index) {
                if (value == 0) {
                    return '未规划';
                } else {
                    return row.allocatedRatio;
                }
            }
        },
        { field: 'remark', title: '备注', align: 'center', width: 140 },
        {
            field: 'operate', title: '操作', align: 'center', width: 100,
            formatter: function (value, row, index) {
                let IsPlanAddr = row.isPlanAddr;
                let OriNodeCode = row.oriNodeCode;
                let Inetnum = row.inetnum;
                return "<a class='operateBtn' onclick=openAddrPlanPage(\'" + IsPlanAddr + "\',\'" + OriNodeCode + "\',\'" + Inetnum + "\')>地址规划</a>";
            }
        }
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
    $(".datagrid-row td").css("background-color", "#fff");
}

//初始化导入按钮点击事件
function initImportBtnClickEvent() {
    $(".importBtn").click(function () {
        if ($(this).val() == "导入") {
            //判断是否选择了需要导入的文件
            if ($("input[name='impfilename']").val() == "") {
                alert("请选择需要导入的文件！");
                return;
            }
            //调用批量导入接口
            $("#importForm").ajaxSubmit({
                url: encodeURI(bathPath + '/ipaddrmodule/IpAddressPlan/ImpPlanAddrV4'),
                type: 'POST',
                data: { Planman: userName },
                dataType: 'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '数据正在导入中，请稍候...',
                        text: ''
                    });
                },
                success: function (obj) {
                    if (obj.code == "0000") {
                        $.messager.progress('close');
                        setTimeout(() => {
                            alert("v4规划地址批量导入成功!");
                            $(".importTablePanel").show();
                            $(".layui-layer-content").css("height", 'auto');                         
                            let tableData = obj.data.errorlist;
                            loadImportTable(tableData)
                            $('#insertinfo').css('display', 'block')
                            $('#totalNum').html(obj.data.TotalNum)
                            $('#succesNum').html(obj.data.SuccesNum)
                            $('#errorNum').html(obj.data.ErrorNum)
                            if (obj.data.ErrorNum != '0' && obj.data.ErrorNum) {
                                $('#erroridspan').css('display', 'inline')
                            } else {
                                $('#erroridspan').css('display', 'none')
                            }
                        }, 100);
                    } else {
                        $.messager.alert('提示', obj.msg, 'error');
                        $.messager.progress('close');
                    }
                },
                error: function (error) {
                    $.messager.alert('提示', '接口调用失败!', 'error');
                    $.messager.progress('close');
                },
                complete: function () {

                }
            });
        } else if ($(this).val() == "模板下载") {
            window.open(bathPath + "/ipaddrmodule/itep/var/config/ipaddr/v4/addrV4Plan.xls");
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
    content += '<div id="insertinfo" style="margin-top:20px; display:none; font-size:12px; color:#f00;">计划导入数：<span id="totalNum">--</span>条，成功导入：<span id="succesNum">--</span>条，失败:<span id="errorNum">xx</span>条<span id="erroridspan">，失败明细如下：</span></div>'
    content += '<div class= "importTablePanel">'
    content += '<div class="importList" id="importList"></div>'
    content += '</div>'
    content += '</div>'
    //打开弹出层
    var layer = layui.layer;
    layer.open({
        type: 1,
        title: ['IPV4地址规划批量导入', 'text-align: center;'],
        area: ['70%', 'auto'],
        offset: '150px',
        content: content,
        cancel: function (index, layero) {

        }
    });
    initImportBtnClickEvent();
}

//导出规划地址详细信息
function exportAddrInfo() {
    let params = {
        oriNodeCode: $("#nodeList").combotree('getValue'),
        planIpType: $("#ipTypeList").combotree('getValue'),
        startTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[0].replace(/[-:/ ]/g, ""),
        endTime: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[1].replace(/[-:/ ]/g, ""),
        inetnum: $("#Inetnum").val(),
        remark: $("#remark").val(),
        PlanNodeCode: $("#orgList").combotree('getValue'), //规划组织
        UsedStat: $('#usedStat option:selected').val(), //使用情况
        isPlanAddr: 0,
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/IpAddressPlan/ExpPlanAddrDetailV4'),
        type: 'get',
        data: params,
        cache: false,
        dataType: 'json',
        beforeSend: function () {
            $.messager.progress({
                title: '提示',
                msg: '数据正在导出中，请稍候...',
                text: ''
            });
        },
        success: function (obj) {
            if (obj.code == "0000") {
                let fileName = obj.data;
                window.open(encodeURI(bathPath + fileName));
            } else {
                $.messager.alert('提示', obj.tip, 'error');
            }
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function () {
            $.messager.progress('close');
        }
    });
}

//加载批量导入表格数据
function loadImportTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [[
        { field: 'startIp', title: '  起始IP地址', align: 'center', width: 100 },
        { field: 'endIp', title: '终止IP地址', align: 'center', width: 100 },
        { field: 'PlanIpTypeName', title: '地址类型', align: 'center', width: 100 },
        { field: 'PlanNodeName', title: '规划组织', align: 'center', width: 100 },
        { field: 'OriIpTypeName', title: '原地址类型', align: 'center', width: 100 },
        { field: 'OriNodeName', title: '上级组织', align: 'center', width: 100 },
        { field: 'remark', title: '备注', align: 'center', width: 100 },
        { field: 'errormsg', title: '错误原因', align: 'center', width: 180 }
    ]];
    var tableId = "importList";
    var tableH = $(".importTablePanel").height();
    var opt = {
        columnsData: columnsData,
        width:$('.importTablePanel').width(),
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false//分页
        }
    };
    relatedTable(tableId, opt);
}

//校验输入的IP地址是合法的ipv4或ipv6
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
//IP转成整型
function ip2int(ip) {
    var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
}