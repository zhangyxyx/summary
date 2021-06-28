//定义基础URL
var jcObj = {
    getajaxUrl: $.ITE.getajaxUrlIpv4(),
    userId: jQuery.ITE.getCookieValue('loginName') ? jQuery.ITE.getCookieValue('loginName') : '',
    //userId: 'adminmg',
    dzTypeData: "",
    xztreeVal: [],
    xgtreeVal: [],
    zIndex: 0
}
//接收的参数
var getParam = {};
//地址类型是否必填写
var istypenull = ''
//v4地址规划树查询Data
var AddrPlanV4 = {}
//上级组织树
var nodetreeData = []
//点击左侧树（未规划的地址）得到的数据 ----
var unplannode = {}
//点击左侧树（已规划的地址）得到的数据 ----
var planNode = {}
//点击生成规划地址 生成的数据
var newplanaddr = []
var newplanaddr1 = []
//点击生成规划的id
var tableidx = 0
//规划起始地址为空时，默认值
var panstartipdefult = ""
//掩码
var ipmasknumif = ""
//表格列
var relatedColumns1 = [
    [
        {
            field: 'allS', title: '', align: 'center',
            formatter: function (value, row, index) {
                if (row.isAllocated == '0') {
                    return '<input type="checkbox" name ="ckbxo" class="ckbox" onclick="checkedsingle()"/><input type="hidden" value="' + (row.stratFullIp + '-' + row.endFullIp) + '">';
                } else {
                    return ' '
                }
            },
            width: '3%',

        },
        {
            field: 'inetnum', title: 'IP地址', align: 'center',
            formatter: function (value, row, index) {
                if (row.isAllocated == '0') {
                    return '<span style="color:green" title="' + value + '">' + value + '</span>'
                }
                else {
                    return '<span title="' + value + '">' + value + '</span>'
                }
            },
            width: '19%',
        },
        {
            field: 'isAllocated', title: '地址状态', align: 'center',
            formatter: function (value, row, index) {
                if (value == '0') {
                    return '空闲'
                }
                else {
                    return '分配';
                }
            },
            width: '6%',
        },
        {
            field: 'nodeName', title: '分配组织', align: 'center',
            formatter: function (value, row, index) {
                if (row.isAllocated == '0') {
                    return ''
                }
                else {
                    return value
                }
            },
            width: '9%',
        },
        {
            field: 'nextNodeName', title: '申请组织', align: 'center',
            width: '9%',
        },
        {
            field: 'ipTypeName', title: '新地址类型', align: 'center',
            formatter: function (value, row, index) {
                if (row.isAllocated == '0') {
                    return ''
                }
                else {
                    return value
                }
            },
            width: '10%',
        },
        {
            field: 'oriIpTypeName', title: '原地址类型', align: 'center',
            width: '10%',
        },
        {
            field: 'replyMan', title: '分配人', align: 'center',
            width: '10%',
        },
        {
            field: 'allotDate', title: '分配时间', align: 'center',
            width: '14%',

            formatter: function (value, row, index) {
                return '<span title="' + value + '">' + value + '</span>'
            },
        },
        {
            field: ' 1', title: '操作 ', align: 'center',
            formatter: function (value, row, index) {
                if (row.isAllocated == '0') {
                    return '<a style="color:#4477ee; font-weight:bold" onclick="planRecover(this)"><span>回收规划地址</span><input id="yanma" type="hidden" value="' + row.inetnum + '"><input id="ipfullip" type="hidden" value="' + (row.stratFullIp + '-' + row.endFullIp) + '"></button>'
                }
                else {
                    return '';
                }
            },
            width: '12%',
        }

    ]
];
//表格
function relatedTable(id, data, columnsData) {

    var data = data.planAddrAllocatedList
    var total = data.total

    if (data.length != 0) {
        data.forEach(function (item, index) {
            fullip = nozero(item.stratFullIp) + '-' + nozero(item.endFullIp)
            item.fullip = fullip
        })
    }
    var datagridOpt = {
        headerCls: 'weasyui-datagrid-header',
        bodyCls: 'weasyui-datagrid-body',
        striped: true,
        pagination: data.length == 0 ? false : true, //分页控件
        pageList: [20, 50], //可以设置每页记录条数的列表
        pageSize: 20,
        fitColumns: false,
        showRefresh: false, //是否显示刷新按钮       
        columns: columnsData,
        singleSelect: false,
        selectOnCheck: true,
        checkOnSelect: true,
        //checkOnSelect: false,
        // onClickRow: function (rowIndex, rowData) {
        //     $(this).datagrid('unselectRow', rowIndex);
        // },
        data: data,
        onLoadSuccess: function (data) {
            if (data.total == 0) {
                var body = $(this).data().datagrid.dc.body2;
                body.find('table tbody').append('<tr><td width="' + body.width() + '" style="height: 35px; text-align: center; ">暂无数据</td></tr>');
            }
        }
    };
    $("#" + id).datagrid(datagridOpt);
    $('.datagrid-sort-icon').remove()
    //添加分页控件
    var pager = $("#" + id).datagrid("getPager");
    pager.pagination(
        {
            total: total,
            onSelectPage: function (pageNo, pageSize) {
                node = planallownode
                planedDetailAddr(node, pageSize, pageNo)
            }
        });
}
//查询
$('#search').on('click', function () {
    //getSearcLeftNode()
    getSearcLeftNode('all')
})
//左侧树形段
function getSearcLeftNode(param) {

    //校验
    var flag = checkParam();
    if (!flag) {
        loadinghid()
        return;
    }

    var OriNodeCode = $('#OriNodeCodehid').val() //上级组织编码
    var PlanNodeCode = $('#PlanNodeCode option:selected').val() //规划组织编码
    var PlanIpType = $('#PlanIpTypehid').val() //规划地址类型编码
    var StartTime = $('#StartTime').parent().find('input[type=hidden]').val() //规划终止日期
    var EndTime = $('#EndTime').parent().find('input[type=hidden]').val() //规划终止日期
    var Inetnum = $('#Inetnum').val()//IP地址段
    if (StartTime != "") {
        var startarray = StartTime.split('-')
        StartTime = startarray[0] + startarray[1] + startarray[2]
    }
    if (EndTime != "") {
        var endarray = EndTime.split('-')
        EndTime = endarray[0] + endarray[1] + endarray[2]
    }

    var $data = {
        oriNodeCode: OriNodeCode,
        planNodeCode: PlanNodeCode,
        planIpType: PlanIpType,
        startTime: StartTime,
        endTime: EndTime,
        inetnum: Inetnum //IP地址段
    };
    $.ajax({
        //url: 'assets/module/ipv4addrPlan/json/GetAddrPlanV4.json',
        type: "post",
        url: jcObj.getajaxUrl + '/ipaddrmodule/IpAddressPlan/GetAddrPlanV4',
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        data: $data,
        beforeSend: function () {
            loading()
        },
        success: function (data) {

            loadinghid()
            //清空左侧树以及右侧内容          
            if (data.code != '0000') {
                $.messager.alert('提示', data.tip)
            }
            if (data.code == '0000' && data.data.length == 0) {
                initTreeXz([]);
                $.messager.alert('提示', '没有数据')
                return;
            }
            var thisData = data.data.planAddrSumList
            thisData = iteration(thisData, "", param);
            //是否折叠
            thisData.forEach(function (item, index) {

                if (item.unFold == 'Y') {
                    thisData[index].state = 'open'
                }
                else {
                    thisData[index].state = 'closed'
                }


            })
            initTreeXz(thisData);


        },
        error: function (err) {

        }
    })
}
//上级组织
function GetNodeList() {
    if (!getParam.OriNodeCode || getParam.OriNodeCode == "") {
        var nodeCode = $('#nodeCode').val()
    }
    else {
        var nodeCode = getParam.OriNodeCode
    }
    var $data = {
        userName: jcObj.userId,
        nodeCode: nodeCode
    };
    $data = JSON.stringify($data);
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + '/ipaddrmodule/NodeManage/GetNodeList',
        dataType: "json",
        contentType: "application/json",
        data: $data,
        beforeSend() {
            loading();
        },
        success: function (data) {
            var thisData = data.data;
            nodetreeData = deepClone(data.data);
            // if (!getParam.OriNodeCode) {
            //     var thisData1 = []
            //     thisData.forEach(function (item) {
            //         if (item.fatherNodeCode == "") {
            //             if (item.children.length != 0) {
            //                 item.children = []
            //             }

            //             thisData1.push(item)
            //         }
            //     })
            //     thisData = iterationup(thisData1);
            //     initTree(thisData1, 'OriNodeCode');

            // }
            // else {
            thisData = iterationup(thisData);
            initTree(thisData, 'OriNodeCode');
            //}
            //自动查询  --- 左侧树形段
            getSearcLeftNode('all')
            // if (!getParam.AutoQuery) {
            //     getSearcLeftNode('all')
            // }
            // else {
            //     if (getParam.AutoQuery.toUpperCase() == 'Y') {
            //         getSearcLeftNode('all')
            //     }
            //     else {
            //         getSearcLeftNode('one')
            //     }
            // }
            //规划地址类型
            var id = $('#OriNodeCodehid').val()
            GetIPTypeV4List(id, 'PlanIpType')


        },
        error: function (error) {

        }
    })
}
//上级组积联动 规划组织
function changenodeCode(data, nodeid) {
    //当上级组织改变时，清空规划组织，规划类型
    $('#PlanNodeCode').html('')
    $('#PlanNodeCode').html('<option value=""></option>')

    $('#PlanIpTypehid').val("")
    var childlist = data
    Getguihua(childlist)
}

//规划组织
function Getguihua(list) {
    var str = ''
    if (list != "" && list.length !== 0) {

        str = '<option value=""></option>'
        list.forEach(function (item) {
            str = str + '<option value="' + item.nodeCode + '">' + item.nodeName + '</option>'
        })
        $('#PlanNodeCode').html(str)
        $('#PlanNodeCode1').html(str)
    }
}
// //规划组织联动 规划类型（查询中的）
// $('#PlanNodeCode').on('change', function () {
//     var id = $('#PlanNodeCode option:selected').val()
//     GetIPTypeV4List(id, 'PlanIpType')
// })
//规划组织联动 规划类型（右侧中的）
$('#PlanNodeCode1').on('change', function () {
    var id = $('#PlanNodeCode1 option:selected').val()
    GetIPTypeV4List(id, 'addPlanIpTypeName')
})
//地址类型
function GetIPTypeV4List(id, htmlId) {
    var authType
    if (htmlId == 'addPlanIpTypeName') {
        authType = unplannode.oriIpType
    }
    else {
        authType = ""
    }
    var $data = {
        userName: jcObj.userId,
        nodeCode: id,
        ipType: authType,
        authType: ""
    };
    $data = JSON.stringify($data);
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/IpAddrType/GetIPTypeV4List",
        dataType: "json",
        contentType: "application/json",
        data: $data,
        success: function (data) {
            if (data.code == '0000') {
                var thisData = data.data;
                thisData.forEach(function (item, index) {
                    item.parentNd = 'true'

                })
                initTree(thisData, htmlId);
            }
            else {
                $.messager.alert('提示', data.tip)
            }
        },
        error: function () {

        }
    })
}
//初始化tree节点树
function initTreeXz(treeDate) {

    $('#xzNodeTree').tree({
        multiple: false,
        width: 140,
        lines: true,
        animate: true,
        data: treeDate,
        cascadeCheck: false,
        checkbox: false,
        lines: false,
        onLoadSuccess: function (node, data) {
            $('#plan1').css('display', 'none')
            $('#plan2').css('display', 'none')
            if (treeDate.length == 0) return;
            //判读是否有展开节点
            var flag = 1;
            data.forEach(function (item) {
                if (item.unfold == 'Y') {
                    flag = 0;

                }
            })
            ///没有默认展开的，展开第一个节点
            if (flag == 1 && data.length != 0) {
                $(this).tree('collapseAll');
                $(this).tree('expand', $(this).tree('getRoot').target);
            }

            //选中搜索的地址
            var id = ""
            var isfirstcom = 0
            var issearchedCount = 0 //查看是否有选中的节点
            data.forEach(function (item) {
                if (item.children.length !== 0) {
                    //将isSearched=Y的选中
                    item.children.forEach(function (citem, cindex) {
                        if (citem.isSearched == 'Y') {
                            issearchedCount++
                            id = citem['id']
                            var n = $('#xzNodeTree').tree('find', id);
                            //$('#xzNodeTree').tree('select', n.target);
                            $(n.target).addClass('tree-node-selected')
                            if (isfirstcom == 0) {
                                //空闲
                                if (citem.isPlanAddr == 0) {
                                    $('#plan2').css('display', 'block')
                                    unplanedAddr(citem)
                                }
                                //已规划
                                else if (citem.isPlanAddr == 1) {
                                    $('#plan1').css('display', 'block')
                                    //将点击的值存起来
                                    planNode = citem;
                                    //基本信息、详细信息
                                    planedAddr(citem)
                                }
                            }
                            isfirstcom++

                        }
                    })
                }
            })
            //若没有搜索的地址，默认展第一条的第一个子元素
            if (issearchedCount == 0 && data[0].length != 0) {
                if (data[0].children.length !== 0) {
                    //将isSearched=Y的选中
                    data[0].children.forEach(function (citem, cindex) {
                        if (cindex > 0) return;
                        id = citem['id']
                        var n = $('#xzNodeTree').tree('find', id);
                        $(n.target).addClass('tree-node-selected')
                        //空闲
                        if (citem.isPlanAddr == 0) {
                            $('#plan2').css('display', 'block')
                            unplanedAddr(citem)
                        }
                        //已规划
                        else if (citem.isPlanAddr == 1) {
                            $('#plan1').css('display', 'block')
                            //将点击的值存起来
                            planNode = citem;
                            //基本信息、详细信息
                            planedAddr(citem)
                        }
                    })
                }
            }

        },
        onClick: function (node) {
            $('.ckboxall').removeAttr('checked')
            //子节点击获取数据           
            if ($("#xzNodeTree").tree('isLeaf', node.target)) {
                if(node.isPlanAddr == 2) return;
                //右侧显示
                $('#plan1').css('display', 'none')
                $('#plan2').css('display', 'none')
                //空闲
                if (node.isPlanAddr == 0) {
                    $('#plan2').css('display', 'block')
                    unplanedAddr(node)
                }
                //已规划
                else if (node.isPlanAddr == 1) {
                    $('#plan1').css('display', 'block')
                    //将点击的值存起来
                    planNode = node;
                    //基本信息、详细信息
                    planedAddr(node)


                }
            }
            else {
                //刷新左侧树
                //clearcontent()
                $('#plan1').css('display', 'none')
                $('#plan2').css('display', 'none')
                //清空规划地址的数据
                newplanaddr1 = []
                newplanaddr = []

            }

        },

    });
}
//初始化地址类型树tree
function initTree(treeDate, id) {
    $('#' + id).combotree({
        multiple: false,
        width: 140,
        panelHeight: 'auto',//宽度自适应
        lines: true,
        animate: true,
        data: treeDate,
        cascadeCheck: false,
        checkbox: false,
        onLoadSuccess: function (node, data) {
            $("#" + id).combotree('tree').tree("collapseAll")
            //上级组织默认显示第一个节点
            if (id == 'OriNodeCode') {
                $('#OriNodeCode').combotree('setValue', data[0].id);
                $('#OriNodeCode').val(data[0].text);
                $('#OriNodeCodehid').val(data[0].id);
                //将node.id传给规划组织
                changenodeCode(data[0].children, data[0].id)
                if (data[0].fatherNodeCode == "") {
                    changenodeCode(nodetreeData[0].children, data[0].id)
                }
                else {
                    changenodeCode(data[0].children, data[0].id)
                }

            }

        },
        onExpand: function (node) {
            if (id == 'OriNodeCode') {
                $('#OriNodeCode').combobox('panel').height(300);
            }
        },

        onClick: function (node) {

            if (id == 'OriNodeCode') {
                //将node.id传给规划组织
                if (node.fatherNodeCode == "") {
                    changenodeCode(nodetreeData[0].children, node.id)
                }
                else {
                    changenodeCode(node.children, node.id)
                }
                //赋值
                $('#OriNodeCode').val(node.text)
                $('#OriNodeCodehid').val(node.id)
                //规划组织
                //规划地址类型
                GetIPTypeV4List(node.id, 'PlanIpType')

                //查询左侧树并清空右侧内容              
                clearcontent()

            }
            if (id == 'PlanIpType') {
                $("#typeshowip1").css('display', 'block')
                //赋值
                $('#PlanIpType').val(node.text)
                $('#PlanIpTypehid').val(node.id)
            }
            if (id == 'addPlanIpTypeName') {
                $("#typeshowip2").css('display', 'block')
                //赋值
                $('#addPlanIpTypeName').val(node.text)
                $('#addPlanIpTypeNamehid').val(node.id)
            }
            //地址类型
            if (id == 'PlanIpType' || id == "addPlanIpTypeName") {
                if (node.parentNd) {
                    $('#' + id).combotree('clear')
                    //赋值
                    $('#PlanIpType').val("")
                    $('#PlanIpTypehid').val("")
                    //赋值
                    $('#addPlanIpTypeName').val("")
                    $('#addPlanIpTypeNamehid').val("")
                    $('#' + id).combo('showPanel')
                    if (id == 'PlanIpType') {
                        $("#typeshowip1").css('display', 'none')
                    }
                    if (id == 'addPlanIpTypeName') {
                        $("#typeshowip2").css('display', 'none')
                    }
                }
            }
        },
        //面板展开时触发
        onShowPanel: function () {
            if(id !=='OriNodeCode') return;
            //获取当前combotree的tree对象
             var tree = $('#OriNodeCode').combotree('tree'); 
             //获取当前选中的节点
             var data = tree.tree('getSelected'); 
             if(data.nodeCode!==treeDate[0].nodeCode){
                 $('#OriNodeCode').combobox('panel').height('300');
             }
             else{
                 $('#OriNodeCode').combotree('tree').tree("collapseAll")
                 $('#OriNodeCode').combobox('panel').height('auto');
             }
        }

    });
}
/**************************右侧内容---已规划***************************/
var planallownode;
function planedAddr(node) {
    $("#ipAddr").html(node.inetnum) //IP地址
    $("#addrNum").html(formatterAddrnum(node.inetnumSum)) //地址数量
    $("#planNodeName").html(node.planNodeName) //规划组织
    $("#planOriNodeNam").html(node.oriNodeName) //上级组织
    $("#PlanIpTypeName").html(node.planIpTypeName) //地址类型
    $("#OriIpTypeName").html(node.oriIpTypeName) //原地址类型
    $("#planman").html(node.planMan) //规划人
    $("#plantime").html(node.planTime) //规划时间
    $('#remark').html(node.remark ? node.remark : '') //备注
    //规划地址详细地址
    planallownode = node
    planedDetailAddr(node, 20, 1)
}
//规划地址详细地址
function planedDetailAddr(node, pagesize, pageno) {
    var $data = {
        oriNodeCode: node.oriNodeCode,
        planNodeCode: node.planNodeCode,
        inetnum: node.inetnum,
        pagesize: pagesize,
        pageno: pageno
    };
    //$data = JSON.stringify($data);

    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + '/ipaddrmodule/IpAddressPlan/GetPlanAddrAllocatedListV4',
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        data: $data,
        beforeSend: function () {
            loading();
        },
        success: function (data) {
            loadinghid()
            if (data.code != '0000') {
                $.messager.alert('提示', data.tip)
                return;
            }
            if (typeof data == 'string') {
                data = JSON.parse(data)
            }
            var data1 = data.data
            //判断 批量规划按钮是否显示
            var isflag = false
            data.data.planAddrAllocatedList.forEach(function (item) {
                if (item.isAllocated == 0) {
                    isflag = true
                }
            })
            if (isflag) {
                $('#planAddrRecV4').css('display', 'block')
                $('#ckalldisp').css('display', 'block')

            } else {
                $('#planAddrRecV4').css('display', 'none')
                $('#ckalldisp').css('display', 'none')
            }
            // data1.forEach(function(item,index){
            //     var fullip = nozero(item.stratFullIp) + '-' + nozero(item.endFullIp)
            //     console.log(fullip)
            // })
            //渲染表格
            relatedTable("userList", data1, relatedColumns1);
        },
        error: function (err) { }
    })
}
//批量规划回收
$('#planAddrRecV4').on('click', planRecoverAll)
function planRecoverAll() {
    var id = "";
    $('.ckbox').each(function (index, item) {
        if ($(item).prop('checked')) {

            id = id + ',' + $(item).parent().find('input[type="hidden"]').val()
        }
    })
    if (id == "") {
        $.messager.alert('提示', '请选择要规划回收的地址！')
    }
    else {
        planNode.recInetNum = id.substring(1)
        PlanAddrRec('all');
    }

}
//规划回收
function planRecover(ts) {
    $('#reciveinput').val("")
    $('#modalpop').css('display', 'block')
    $('#modalpop').window('open')
    //var ip = $.trim($(ts).find('input').val())
    var ip = $.trim($(ts).find('#yanma').val())
    var fullip = $.trim($(ts).find('#ipfullip').val())
    // var iparr = ip.split('-')
    // var startip = nozero(iparr[0])
    // var endip = nozero(iparr[1])

    //planNode.oldRecInetNum = startip + '-' + endip
    planNode.oldRecInetNum = ip
    planNode.oldRecfullip1 = fullip
    $('#reciveinput').val(planNode.oldRecInetNum)
}
//确认回收
function PlanAddrRec(param) {


    if (param == 'one') {
        var recInetNum = $.trim($('#reciveinput').val())
        planNode.recInetNum = recInetNum
        // //验证回收的地址段是否在空闲范围之内
        //1.校验IP
        // 验证子网掩码的正则

        if (ckyanma(recInetNum)) {
            var flag1 = true
            var flag2 = true
            //得到掩码中的终止ip
            var iparrrec = $.trim(recInetNum).split('/')
            var zwym = iparrrec[1]
            var hostip = iparrrec[0]
            var endzwip = getIPs(hostip, zwym).split('-')[0]
            var iparr = []
            endzwip = int2iP(ip2int(endzwip) + 1)
            iparr.push(hostip)
            iparr.push(endzwip)
        }
        else {
            var iparr = recInetNum.split('-')
            if (iparr.length > 2) {
                $.messager.alert('提示', '地址段格式不正确')
                return false;
            }
            if (iparr.length == 1) {
                var flag1 = ckIPV4($.trim(iparr[0]))
                if (!flag1) {
                    $.messager.alert('提示', '地址段格式不正确')
                    return false
                }
                else {
                    var flag1 = true;
                    var flag2 = true
                    iparr.push(iparr[0])
                }
            }
            else {
                var flag1 = ckIPV4($.trim(iparr[0]))
                var flag2 = ckIPV4($.trim(iparr[1]))
            }
        }

        if (flag1 && flag2) {
            var startIp = iparr[0]
            var endIp = iparr[1]
            if (ip2int(startIp) > ip2int(endIp)) {
                $.messager.alert('提示', '回收的地址段的起始地址不能大于终止地址！')
                return false;
            }
            var oldarr = planNode.oldRecfullip1.split('-')
            var oldStartIP = oldarr[0]
            var oldEndIP = oldarr[1]
            if (ip2int(startIp) >= ip2int(oldStartIP) && ip2int(endIp) <= ip2int(oldEndIP)) {

            }
            else {
                $.messager.alert('提示', '回收的地址段是不在空闲地址范围内！')
                return;
            }
        }
        else {
            $.messager.alert('提示', '地址段格式不正确')
            return;
        }

    }
    if (planNode.recInetNum.indexOf('-') === -1 && planNode.recInetNum.indexOf('/') === -1) {

        planNode.recInetNum = planNode.recInetNum + '-' + planNode.recInetNum
    }
    var arr_addr = planNode.recInetNum.split(',')
    var arr_addr1 = []
    arr_addr.forEach(item => {
        arr_addr1.push({
            recInetNum: item,
        })
    })
    var $data = {
        inetnumid: planNode.inetnumId,
        oriNodeCode: planNode.oriNodeCode,
        planNodeCode: planNode.planNodeCode,
        inetnum: planNode.startipself + '-' + planNode.endipself,
        recAddrList: arr_addr1
    };
    $data = JSON.stringify($data);
    // 接口
    $.ajax({
        url: jcObj.getajaxUrl + '/ipaddrmodule/IpAddressPlan/PlanAddrRecV4',
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: $data,
        success: function (data) {
            if (param == 'one') {
                $('#modalpop').window('close')
            }
            if (data.code == '0000') {
                $.messager.alert('提示', data.tip == "" ? '回收成功' : data.tip)
                //调左侧树接口并将右侧内容清空
                clearcontent()
            }
            else {
                $.messager.alert('提示', data.tip)
            }
        },
        error: function (err) {
            if (param == 'one') {
                $('#modalpop').window('close')
            }
        }
    })
}
//格式化地址数量
function formatterAddrnum(num) {
    if (parseInt(num) < 256) {
        return num
    }
    else {
        if (parseInt(num) % 256 == 0) {
            return (parseInt(num) / 256 + 'C')
        }
        else {
            return ((parseInt(num) / 256).toFixed(2) + 'C')
        }

    }
}
/*******************************右侧内容---未规划********************************/
function unplanedAddr(node) {
    unplannode = node
    /**清空已生成的规划 */
    $('#addrlist').css('display', 'none')
    $('#addtobdy').html("")
    newplanaddr1 = []
    newplanaddr = []
    /*****清空输入框**********/
    $('#PlanNodeCode1 option:first').prop('selected', 'selected'); //规划组织选中项为空
    $('#addinetnumsum').val("");//地址数量
    //规划类型
    $('#addPlanIpTypeNamehid').val('');
    initTree([], 'addPlanIpTypeName');
    //备注
    $('#addremark').val("")
    $('#addselfaddr').val('');

    $('#freeAddr').html(node.inetnum) //空闲地址
    $('#freeAddrNum').html(formatterAddrnum(node.inetnumSum)) //地址数量
    $('#freeIpTypeName').html(todou(node.oriIpTypeName)) //地址类型
    $('#freePlanNodeName').html(todou(node.oriNodeName)) //所属组织
    isTypeNull()
}
function todou(value) {
    if (value == '' || !value) {
        return ''
    }
    return value
}
//验证地址类型是否能为空
function isTypeNull() {
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/SysCommon/getSysPara",
        dataType: "json",
        data: {
            ParaName: "IsIPtypeNull"
        },
        success: function (data) {

            if (data.code == "0000") {

                if (data.data.PARAVALUE == 'N') {
                    $('#typeshow').css('display', 'inline-block')
                }
                else {
                    $('#typeshow').css('display', 'none')

                }
                istypenull = data.data.PARAVALUE
            } else {
                $.messager.alert('提示:', data.tip, 'warning');
            }
        },
        error: function () {
            $.messager.alert('提示:', "加载数据失败！", 'warning');
        }
    })
}
//点击生成规划地址
function PlanAddrAddV4() {
    var PlanNodeName = $('#PlanNodeCode1 option:selected').text() //规划组积名称
    var PlanNodeCode = $('#PlanNodeCode1 option:selected').val() //规划组积编码
    var inetnumsum = $('#addinetnumsum').val() //地址数量
    var PlanIpTypeName = $('#addPlanIpTypeName').val() //规划地址类型名称   
    var planIpType = $('#addPlanIpTypeNamehid').val()  //规划地址类型编码
    var addremark = $('#addremark').val();//备注
    var addselfaddr = $('#addselfaddr').val() //自定义规划起始地址
    var OriNodeCode = $('#OriNodeCodehid').val() ////上级组织编码
    var OriIpType = $('#PlanIpTypehid').val(); ////上级地址类型编码(查询中的规划类型)

    //校验
    var flag = ckPlanaddr()
    if (flag) {
        if (addselfaddr == "") {
            addselfaddr = panstartipdefult
        }
        //生成oldendip
        inetnumsum = inetnumsum.toUpperCase();
        var inx = inetnumsum.indexOf('C')
        if (inx == -1) {
            var num = parseInt(inetnumsum)
        }
        else {
            var num = inetnumsum.substr(0, inx) * 256
        }
        var oldEndip = int2iP(ip2int(addselfaddr) + num - 1)
        addInetNum = addselfaddr + '-' + oldEndip
        if (check2n(num)) {
            ipmasknumif = ""
            if (num == 1) {
                addInetNum = addselfaddr + '/32'
            }
            else {
                var ismask = isipnummaskfor(addselfaddr, oldEndip)
                if (ipmasknumif == "") {
                    // $.messager.alert('提示', '该段地址不可掩码,请重新输入')
                    // return false
                }
                else {
                    addInetNum = ipmasknumif
                    addInetNum = ipmasknumif
                    addselfaddr = ipmasknumif.split('/')[0]
                    oldEndip = int2iP(ip2int(addselfaddr) + num - 1)
                }
            }
        }
        //addInetNum = ipnumtoym(addselfaddr, oldEndip)

        tableidx++
        newplanaddr.push({
            id: tableidx,
            addInetNum: addInetNum,//地址段
            oldStartIp: addselfaddr, //规划起始地址
            oldendIp: oldEndip, //规划起始地址
            planNodeName: PlanNodeName,//规划组积名称
            planNodeCode: PlanNodeCode,////规划组积编码
            inetnumSum: inetnumsum, //地址数量
            planIpTypeName: PlanIpTypeName, //规划地址类型名称
            planIpType: planIpType,//规划地址类型编码
            OriNodeCode: OriNodeCode,//上级组织编码
            OriIpType: OriIpType, //上级地址类型编码(查询中的规划类型),
            remark: addremark
        })
        newplanaddr1.push({
            id: tableidx,
            addInetNum: addInetNum,//地址段
            planNodeCode: PlanNodeCode,////规划组积编码
            planIpType: planIpType,//规划地址类型编码
            oriNodeCode: OriNodeCode,//上级组织编码
            oriIpType: OriIpType, //上级地址类型编码(查询中的规划类型)
            remark: addremark
        })
        //显示表格
        $('#addtobdy').html("")
        $('#addrlist').css('display', 'block')
        var str = ""
        newplanaddr.forEach(function (item) {

            str +=
                '<tr class="tablebodytr">' +
                '<td>' + item.addInetNum + '</td>' +
                '<td>' + item.inetnumSum + '</td>' +
                '<td>' + item.planNodeName + '</td>' +
                '<td>' + item.planIpTypeName + '</td>' +
                '<td style="max-width:150px; white-space: nowrap;   text-overflow: ellipsis;   overflow: hidden;   word-break: break-all;" title="' + item.remark + '" >' + item.remark + '</td>' +
                '<td>' +
                '<button class="delePlanArr" onclick="delerow(this)" style="cursor:pointer">删除<input type="hidden" value="' + item.id + '"></button>' +
                '</td>' +
                '</tr>'
        })

        $('#addtobdy').append(str)
    }
}
//删除
function delerow(ts) {
    var id = $(ts).find('input').val()
    newplanaddr.forEach(function (item, index) {
        if (item.id == id) {
            newplanaddr.splice(index, 1)
        }
    })
    newplanaddr1.forEach(function (item, index) {
        if (item.id == id) {
            newplanaddr1.splice(index, 1)
        }
    })
    if (newplanaddr.length == 0) {
        $('#addtobdy').html("")
        $('#addrlist').css('display', 'none')
        return;
    }
    $(ts).parent().parent().remove()

}
$('#itebtn').on('click', surePlanAddrAddV4)
//点击确定----生成规划地址
function surePlanAddrAddV4() {
    var planAddrList = []

    newplanaddr1.forEach(function (item) {
        planAddrList.push({
            addInetNum: item.addInetNum,
            oriNodeCode: item.oriNodeCode,
            planNodeCode: item.planNodeCode,
            oriIpType: unplannode.oriIpType,
            planIpType: item.planIpType,
            remark: item.remark
        })
    })
    var $data = {
        planman: jcObj.userId,
        planAddrList: planAddrList
    }
    $data = JSON.stringify($data)

    //接口
    $.ajax({
        url: jcObj.getajaxUrl + '/ipaddrmodule/IpAddressPlan/PlanAddrAddV4',
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: $data,
        success: function (data) {
            if (data.code == '0000') {
                $.messager.alert('提示', data.tip == "" ? '规划地址生成成功！' : data.tip);
                //刷新左侧树
                clearcontent()
                //清空规划地址的数据
                newplanaddr1 = []
                newplanaddr = []

            }
            else {
                $.messager.alert('提示', data.tip);

            }

        },
        error: function (err) {

        }
    })
}
//校验 ----生成规划地址
function ckPlanaddr() {
    var PlanNodeName = $('#PlanNodeCode1 option:selected').text() //规划组积名称
    var inetnumsum = $('#addinetnumsum').val() //地址数量
    var PlanIpTypeName = $('#addPlanIpTypeName').val() //规划地址类型名称   
    var addremark = $('#addremark').val();//备注
    var addselfaddr = $('#addselfaddr').val() //自定义规划起始地址

    //规划组织
    var flag1 = true
    if (PlanNodeName == "") {
        $.messager.alert('提示', '请选择规划组织');
        flag1 = false
        return false
    }

    //校验地址数量
    var flag2 = checkaddrnum(inetnumsum)

    if (!flag2) {
        return false
    }
    //规划地址类型
    var flag3 = false;
    if (PlanIpTypeName == "") {
        if (istypenull == 'N') {

            $.messager.alert('提示', '规划地址类型不能为空')
            return;
        }
        else {
            flag3 = true
        }
    }
    else {
        flag3 = true
    }
    if (!flag3) return false;
    //校验备注<=255
    var flag4 = true
    if (addremark.length > 255) {
        $.messager.alert('提示', '备注不能超过255个字符');
        flag4 = false
        return false
    }
    /******************校验规划起始地址*****************************/
    var flag5 = true;
    //自定义起始地址不为空
    if (addselfaddr != "") {
        //校验地址
        var flag5 = ckIPV4(addselfaddr)
        if (!flag5) {
            $.messager.alert('提示', '自定义规划起始地址格式不正确')
            return false;
        }
        var flag51 = panduanIp(inetnumsum, addselfaddr)
        if (flag51) {
            return true
        }
    }
    //自定义规划起始地址　为空时
    else {
        //如果还没有生成规划列表
        if (newplanaddr.length == 0) {
            // console.log(unplannode.startipself)
            // $.messager.alert('提示', '请输入规划起始地址');
            // return false
            var flag52 = panduanIp(inetnumsum, unplannode.startipself)
            if (flag52) {
                panstartipdefult = unplannode.startipself
                return true
            }

        }
        else {
            var nnewdata = deepClone(newplanaddr)
            nnewdata.sort(function (n1, n2) {
                if (ip2int(n1.oldendIp) - ip2int(n2.oldendIp) > 0) {
                    return -1
                }
                else {
                    return 0;
                }
            })
            var old = int2iP(ip2int(nnewdata[0].oldendIp) + 1)
            var flag52 = panduanIp(inetnumsum, old)
            if (flag52) {
                panstartipdefult = old //为空时 默认的起始地址
                return true
            }

        }

    }

}
//判断新的始地址与结束地址是否在空闲地址范围内
function panduanIp(inetnumsum, addselfaddr) {
    inetnumsum = inetnumsum.toUpperCase();
    var inx = inetnumsum.indexOf('C')
    if (inx == -1) {
        var num = parseInt(inetnumsum)
    }
    else {
        var num = inetnumsum.substr(0, inx) * 256
    }

    var newStartip = ip2int(addselfaddr)
    var newEndip = ip2int(addselfaddr) + num - 1
    var kStartip = ip2int(unplannode.startipself)
    var kEndip = ip2int(unplannode.endipself)
    //新地址与空闲地址比较
    if (newStartip >= kStartip && newEndip <= kEndip) {
        //新地址与规划列表中的地址比较，看是否有重叠          
        if (newplanaddr.length == 0) {
            return true
        }
        //已存在列表
        else {
            var repeatFlag = true
            newplanaddr.forEach(function (item) {
                if (newStartip <= ip2int(item.oldendIp) && newEndip >= ip2int(item.oldStartIp)) {
                    $.messager.alert('提示', '新规划地址和列表中计划规划地址有重叠部分，请重新规划！');
                    repeatFlag = false
                }
            })
            return repeatFlag
        }

    }
    else {
        $.messager.alert('提示', '超出空闲地址范围，请重新输入！');
        return false
    }
}
//校验-----地址数量
function checkaddrnum(nm) {
    var nm = nm.toUpperCase()
    var idx = nm.indexOf('C')
    if (nm != "") {
        if (idx === -1) {
            var re = /^\+?[1-9]\d*$/;
            if (!re.test(nm)) {
                $.messager.alert('提示', '请输入正确的地址数量！');
                return false;
            } else {
                return true
            }
        }

        else if (idx != -1) {
            var re = /^\+?[1-9]\d*$/;
            // var re =  /^[+]?(0|([1-9]\d*))(\.\d+)?$/
            var value = nm.substring(0, idx)
            if (!re.test(value * 256)) {
                $.messager.alert('提示', '请输入正确的地址数量！');
                return false;
            }
            else {
                return true
            }
        }
        else {
            $.messager.alert('提示', '请输入正确的地址数量！');
            return false;
        }
    }
    else {
        $.messager.alert('提示', '地址数量不能为空！');
        return false;
    }
}
/*******************************右侧内容---未规划 over********************************/

//校验查询条件
function checkParam() {
    var OriNodeCode = $('#OriNodeCode').val() //上级组织编码   
    var StartTime = $('#StartTime').parent().find('.textbox-value').val() //规划终止日期
    var EndTime = $('#EndTime').parent().find('.textbox-value').val() //规划终止日期
    var Inetnum = $.trim($('#Inetnum').val())//IP地址段
    var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
    if (OriNodeCode == "") {
        $.messager.alert('提示', '上级组织不能为空!');
        return false;
    }
    if (Inetnum != "") {
        //如果地址段和传过来的一致则不进行校验   
        if (Inetnum != getParam.Inetnum) {
            if (Inetnum.indexOf('-') === -1 && Inetnum.indexOf('/') == -1) {
                if (!reg.test(Inetnum)) {
                    $.messager.alert('提示', '地址段格式不正确！');
                    return false;
                }
            }
            else {
                if (Inetnum.indexOf('-') !== -1) {
                    //验证地址段
                    var arripduan = Inetnum.split('-')

                    if (!reg.test(arripduan[0]) || !reg.test(arripduan[1])) {
                        $.messager.alert('提示', '地址段格式不正确！');
                        return false;
                    }
                    else {
                        if (ip2int(arripduan[1]) < ip2int(arripduan[0])) {
                            $.messager.alert('提示', '地址段格式不正确！');
                            return false;
                        }
                    }
                }
                else if (Inetnum.indexOf('/') !== -1) {
                    //验证掩码
                    var ymafalg = ckyanma(Inetnum)
                    if (!ymafalg) {
                        $.messager.alert('提示', '地址段格式不正确！');
                        return false;
                    }
                }
            }

        }
    }
    // if (EndTime < StartTime) {
    //     $.messager.alert('提示', '结束时间不能小于开始时间!');
    //     return false;
    // }
    // else if (EndTime > StartTime) {
    //     if (StartTime == "") {
    //         $.messager.alert('提示', '请输入开始时间!');
    //         return false;
    //     }
    // }
    if ((EndTime != '' && StartTime != '')) {
        if (EndTime < StartTime) {
            $.messager.alert('提示', '结束时间不能小于开始时间!');
            return false;
        }
    }
    return true
}
//得到链接中的参数并处理
function getParmdata() {
    //用户名称username，地址段Inetnum，上级组织OriNodeCode，自动查询AutoQuery    
    getParam.username = getUrlParam('username')
    getParam.Inetnum = getUrlParam('Inetnum')
    getParam.OriNodeCode = getUrlParam('OriNodeCode')
    getParam.AutoQuery = getUrlParam('AutoQuery')
    $('#Inetnum').val(getParam.Inetnum ? getParam.Inetnum : "") //地址段赋值

}
//获取对应参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURI(r[2]);
    return null; //返回参数值
}
//处理左侧树节点树数据
function iteration(data, planstr, param) {
    if (typeof data == 'string') {
        data = JSON.parse(data)
    }
    for (var j = 0; j < data.length; j++) {
        if (planstr == '子节点') {
            var str;
            if (data[j].isPlanAddr == 1) {
                str = '<span style="color:#009dd9; text-indent:1em; display:inline-block">已规划</span>'
            }
            else if (data[j].isPlanAddr == 0){
                str = '<span style="color:green; text-indent:1em;display:inline-block">空闲</span>'
            }
            else if (data[j].isPlanAddr == 2){
                str = '<span style="color:#ccc; text-indent:1em;display:inline-block; cursor:not-allowed">已注册</span>'
            }
            var addrnum = nozero(data[j].stratFullIp) + '-' + nozero(data[j].endFullIp)
            data[j].id = data[j].inetnum + 'c';
            if (data[j].isPlanAddr == 1) {
                data[j].text = data[j].inetnum + str
            }  else if (data[j].isPlanAddr == 0){
                data[j].text = data[j].inetnum + str
            }else if (data[j].isPlanAddr == 2){
                data[j].text = '<span style="cursor:not-allowed">'+data[j].inetnum+'</span>' + str
            }
            data[j].startipself = nozero(data[j].stratFullIp)
            data[j].endipself = nozero(data[j].endFullIp)
        }
        else {
            var addrnum = nozero(data[j].stratFullIp) + '-' + nozero(data[j].endFullIp)
            data[j].id = data[j].sumInetNum + 'p';
            data[j].text = data[j].sumInetNum
            data[j].startipself = nozero(data[j].stratFullIp)
            data[j].endipself = nozero(data[j].endFullIp)
        }
        if (param == 'one') {
            data[j].children = []
        }
        else {
            data[j].children = data[j].addrDetailList
        }


        if (data[j].children != undefined && data[j].children.length > 0) {

            iteration(data[j].children, '子节点', param);
        }
    }
    return data;
}
//处理上级组织节点
function iterationup(data) {
    for (var j = 0; j < data.length; j++) {
        data[j].id = data[j].nodeCode;
        data[j].text = data[j].nodeName;
        if (data[j].children != undefined && data[j].children.length > 0) {
            iterationup(data[j].children);
        }
    }
    return data;
}
//校验IP
function ckIPV4(ip) {
    var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/

    if (!reg.test(ip)) {
        //$.messager.alert('提示', '地址格式不正确！');
        return false;
    }
    return true

}
//验证掩码
function ckyanma(ip) {
    var iparr = $.trim(ip).split('/')
    var flag = ckIPV4($.trim(iparr[0]))
    if (!flag) {
        return false
    }
    else {
        if (!(/(^[1-9]\d*$)/.test(iparr[1]))) {

            return false
        }
        if (parseInt(iparr[1]) > 32) {
            return false
        }
        else {
            return true

        }
    }


}
//IP转成整型
function ip2int(ip) {
    var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
}

//整型解析为IP地址
function int2iP(num) {
    var str;
    var tt = new Array();
    tt[0] = (num >>> 24) >>> 0;
    tt[1] = ((num << 8) >>> 24) >>> 0;
    tt[2] = (num << 16) >>> 24;
    tt[3] = (num << 24) >>> 24;
    str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
    return str;
}
//深拷贝
function deepClone(obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                //判断ojb子元素是否为对象，如果是，递归复制
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}
//加载
function loading() {
    var loadHtml = "<div class='loading1' style='display:none'></div><div style='display:none' class='loadingcnt'><div><span>正在加载中....</span></div></div>"
    $("body").append(loadHtml);
    var dHeight = $(document).height();
    var dWidth = $(document).width();
    $(".loading1").css({
        "height": dHeight,
        "width": dWidth,
        "color": '#fff',
    })
    $('.loading1').show();
    $('.loadingcnt').show();
}
function loadinghid() {
    $('.loading1').hide();
    $('.loadingcnt').hide();
    $('.loading1').remove();
    $('.loadingcnt').remove();

}
//全选
function checkedAll() {
    $('.ckboxall').each(function (index, item) {
        if ($(this).prop('checked')) {
            $('.ckbox').prop('checked', 'checked')
        }
        else {
            $('.ckbox').removeAttr('checked')
        }
    })
}

function checkedsingle() {
    var flag = true
    $('.ckbox').each(function (index, item) {
        if (!$(item).is(':checked')) {
            flag = false
        }
    })
    if (flag) {
        $('.ckboxall').prop('checked', 'checked')
    }
    else {
        $('.ckboxall').removeAttr('checked')
    }
}
function clearcontent() {
    //调左侧树接口并将右侧内容清空
    getSearcLeftNode('all')
    $('#plan1').css('display', 'none')
    $('#plan2').css('display', 'none')
    $('#addrlist').css('display', 'none')
    $('#addtobdy').html("")
}
//全编码前面的去掉0
function nozero(num) {

    var numarry = num.split('.')
    var ip1 = numarry[0].replace(/\b(0+)/gi, "") == "" ? '0' : numarry[0].replace(/\b(0+)/gi, "")
    var ip2 = numarry[1].replace(/\b(0+)/gi, "") == "" ? '0' : numarry[1].replace(/\b(0+)/gi, "")
    var ip3 = numarry[2].replace(/\b(0+)/gi, "") == "" ? '0' : numarry[2].replace(/\b(0+)/gi, "")
    var ip4 = numarry[3].replace(/\b(0+)/gi, "") == "" ? '0' : numarry[3].replace(/\b(0+)/gi, "")
    return ip1 + '.' + ip2 + '.' + ip3 + '.' + ip4
}
/*********根据起始地址与子网掩码得到终止ip*************/
function getIPs(ip, ymws) {
    var zjip = ip
    var zjdz = ''
    var ymws = ymws

    //显示主机IP得二进制
    var ipaddress = zjip.split(".");
    var intipaddress = new Array(4);
    intipaddress[0] = Number(ipaddress[0]);
    intipaddress[1] = Number(ipaddress[1]);
    intipaddress[2] = Number(ipaddress[2]);
    intipaddress[3] = Number(ipaddress[3]);

    var zjip_e = left0(intipaddress[0].toString(2)) + left0(intipaddress[1].toString(2)) + left0(intipaddress[2].toString(2)) + left0(intipaddress[3].toString(2));
    zjdz = zjip_e;

    //显示子网掩码

    var ym = maskNum(parseInt(ymws));
    var zwym = ym;

    var zwdz = getzwdz(zjip_e, ym);

    //起始IP
    var qsip1 = left0((parseInt(zwdz.substr(0, 8), 2)).toString(2));
    var qsip2 = left0((parseInt(zwdz.substr(8, 8), 2)).toString(2));
    var qsip3 = left0((parseInt(zwdz.substr(16, 8), 2)).toString(2));
    var qsip4 = left0((parseInt(zwdz.substr(24, 8), 2)).toString(2));

    var IP1 = int2iP(ip2int(parseInt(qsip1, 2).toString(10) + "." + parseInt(qsip2, 2).toString(10) + "." + parseInt(qsip3, 2).toString(10) + "." + parseInt(qsip4, 2).toString(10)) + 1);

    var gb = gbdz(zwdz, ym);
    var zzip1 = left0((parseInt(gb.substr(0, 8), 2)).toString(2));
    var zzip2 = left0((parseInt(gb.substr(8, 8), 2)).toString(2));
    var zzip3 = left0((parseInt(gb.substr(16, 8), 2)).toString(2));
    var zzip4 = left0((parseInt(gb.substr(24, 8), 2)).toString(2));

    var IP2 = int2iP(ip2int(parseInt(zzip1, 2).toString(10) + "." + parseInt(zzip2, 2).toString(10) + "." + parseInt(zzip3, 2).toString(10) + "." + parseInt(zzip4, 2).toString(10)) - 1);

    return IP2 + '-' + IP1 + '-' + towtoip(zwdz)
}

function getzwdz(strZJ, strYM) {
    var i = 0;
    var zwdz = "";
    while (i != 32) {
        if (strZJ.substr(i, 1) == strYM.substr(i, 1) && strZJ.substr(i, 1) == "1") {
            zwdz = zwdz + "1";
        }
        else {
            zwdz = zwdz + "0";
        }
        i = i + 1;
    }
    return zwdz;
}

function gbdz(strZW, strYM) {
    var i = 0;
    var gbdz = "";
    while (i != 32) {
        if (strZW.substr(i, 1) == strYM.substr(i, 1)) {
            gbdz = gbdz + "1";
        }
        else {
            gbdz = gbdz + "0";
        }
        i = i + 1;
    }
    return gbdz;
}

function left0(num) {
    while (num.length != 8) {
        num = "0" + num;
    }
    return num;
}
/*
计算子网掩码
*/
function maskNum(num) {
    var mask = "";
    while (mask.length != num) {
        mask = "1" + mask;
    }

    while (mask.length != 32) {
        mask = mask + "0";
    }
    return mask;
}
//IP地址段转掩码
function ipnumtoym(ip1, ip2) {

    var aIp1 = ip1.split("."), aIp2 = ip2.split(".");
    for (var i = 0, ip1 = 0, ip2 = 0; i < 4; i++) {
        ip1 = (ip1 << 8) + parseInt(aIp1[i]);
        ip2 = (ip2 << 8) + parseInt(aIp2[i]);
    }
    result = 0xFFFFFFFF & (ip2 - ip1);
    subCode = aIp1.join(".") + "/" + (32 - result.toString(2).length);
    return subCode
}
//二进制转IP
function towtoip(num) {
    var str = ''
    var nn = -8
    for (var i = 1; i <= 4; i++) {
        nn = nn + 8
        var num1 = num.substr(nn, 8)

        str = str + '' + parseInt(num1, 2) + '.'


    }
    return str.substr(0, str.length - 1)
}
//判读是否是2的n次方幂
function check2n(num) {
    //if (num == 1) return false
    if (num != 1) {
        while (num != 1) {
            if (num % 2 == 0) {
                num = num / 2;
            } else {
                return false;
            }

        }
        return true;
    } else {
        return true;
    }
}

//判断地址段是否可掩码
function isipnummaskfor(startip, endip) {
    var kStartip1 = ip2int(unplannode.stratFullIp)
    var kEndip1 = ip2int(unplannode.endFullIp)
    var num_for = kEndip1 - kStartip1 + 1;
    var ip1 = startip
    var ip2 = endip
    for (var i = 0; i <= num_for; i++) {
        // ip1 = ip2int(ip1 + i)
        // ip2 = ip2int(ip2 + i)
        var flag = false
        var ipmask1, ipmask2 //可用地址段
        var num1 = ip2int(ip2) - ip2int(ip1) + 1
        var num = 32
        for (var i = 1; i <= 32; i++) {
            if (Math.pow(2, (32 - i)) == num1) {
                num = i
            }
        }

        var ip = getIPs(ip1, num).split('-')
        if ((ip1 == ip[0] && ip2 == ip[1]) || (ip1 == ip[1] && ip2 == ip[0]) && (ip1 == ip[2] || ip2 == ip[2])) {
            // console.log(ip[0], ip[1])
            console.log('可掩码', i)
            flag = true
            ipmask1 = ip1
            ipmask2 = ip2

        }
        else {

            if (ip2int(ip1) <= ip2int(ip[2]) && ip2int(ip1) <= ip2int(ip[1]) && ip2int(ip[0]) <= ip2int(ip2) && ip2int(ip[0]) >= ip2int(ip1) && ip2int(ip[1]) <= ip2int(ip[0])) {
                flag = true

                ipmask1 = ip[1]
                ipmask2 = ip[0]
            }
        }


        if (!flag) {
            var ipnull = $.trim($('#addselfaddr').val())
            //1.起始地址为空时、2并且小于该地址段的结束地址、3.并且与列表中没有重叠
            ip1 = int2iP(ip2int(ip1) + 1)
            ip2 = int2iP(ip2int(ip2) + 1)
            console.log(ipnull == "" && ip2int(unplannode.endFullIp) >= ip2int(ip2))
            if (ipnull == "" && ip2int(unplannode.endFullIp) >= ip2int(ip2)) {
                let isrp = isrepeatip(ip1, ip2)

                if (!isrp) {

                    return false
                }
                else {
                    ip1 = isrp.split('-')[0]
                    ip2 = isrp.split('-')[1]
                    //isipnummaskfor(ip1, ip2)
                    //addTask(isipnummaskfor, 0, ip1, ip2);  //递归调用变成了非递归调用

                }

            }
            else {
                return false
            }

        }
        else {
            ipmasknumif = ip1 + '/' + num

            return true

        }

    }
}

//是否有重叠
function isrepeatip(ip1, ip2) {
    var kStartip = ip2int(unplannode.stratFullIp)
    var kEndip = ip2int(unplannode.endFullIp)
    var num = kEndip - kStartip + 1;

    var newStartip = ip2int(ip1)
    var newEndip = ip2int(ip2)
    var flag = false
    var isp = false //无重复

    for (var i = 0; i <= num; i++) {
        flag = false
        isp = false //无重复
        newStartip = newStartip + i
        newEndip = newEndip + i

        //新地址与空闲地址比较
        if (newStartip >= kStartip && newEndip <= kEndip) {
            //新地址与规划列表中的地址比较，看是否有重叠          
            if (newplanaddr.length == 0) {
                flag = true
            }
            //已存在列表
            else {
                flag = true
                newplanaddr.forEach(function (item) {
                    if (newStartip <= ip2int(item.oldendIp) && newEndip >= ip2int(item.oldStartIp)) {
                        //新规划地址和列表中计划规划地址有重叠部分，请重新规划！ 
                        isp = true //有重复    
                    }
                })

            }

        }
        else {
            //'超出空闲地址范围，请重新输入！
            flag = false
        }



        if (flag && !isp) {
            return int2iP(newStartip) + '-' + int2iP(newEndip)
        }

    }
    return false

}
$(function () {
    //处理链接中的入参
    getParmdata()
    //上级组织
    GetNodeList()
})