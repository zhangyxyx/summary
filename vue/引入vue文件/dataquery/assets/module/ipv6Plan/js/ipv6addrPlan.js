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
var schemelistArr= []
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
    //表格列
var relatedColumns1 = [
    [{
            field: 'allS',
            title: '',
            align: 'center',
            formatter: function(value, row, index) {
                if (row.isAllocated == '0') {
                    return '<input type="checkbox" name ="ckbxo" class="ckbox" onclick="checkedsingle()"/><input type="hidden" value="' + (row.stratFullIp + '-' + row.endFullIp) + '">';
                } else {
                    return ' '
                }
            },
            width: '3%',

        },
        {
            field: 'inetnum',
            title: 'IP地址',
            align: 'center',
            formatter: function(value, row, index) {
                if (row.isAllocated == '0') {
                    return '<span style="color:green" title="' + value + '">' + value + '</span>'
                } else {
                    return '<span title="' + value + '">' + value + '</span>'
                }
            },
            width: '15%',
        },
        {
            field: 'codingScheme',
            title: '编码方案',
            align: 'center',
            width: 400,
            formatter: function(value, row, index) {
                var _d = IpTypeList[row.ipType]
                var _div = ''
                if (_d && _d.schemelist.length > 0) {
                    var txt = loadCodePlanContentTable(_d.schemelist);
                    var fullIp = row.stratFullIp + '-' + row.endFullIp
                    _div += '<div class="listrow" sumInetNum="' + row.inetnum + '" fullIp="' + fullIp + '" planIpTypeName="' + row.ipTypeName + '" planIpType="' + row.ipType + '"><div class="planItemBox">' + txt + '</div></div>'
                }
                return _div
            }
        },
        {
            field: 'isAllocated',
            title: '地址状态',
            align: 'center',
            formatter: function(value, row, index) {
                if (value == '0') {
                    return '空闲'
                } else if(value == '1'){
                    return '分配';
                } else{
                    return '已注册';
                }
            },
            width: '5%',
        },
        {
            field: 'nodeName',
            title: '分配组织',
            align: 'center',
            formatter: function(value, row, index) {
                if (row.isAllocated == '0') {
                    return ''
                } else {
                    return value
                }
            },
            width: '8%',
        },
        {
            field: 'nextNodeName',
            title: '申请组织',
            align: 'center',
            width: '8%',
        },
        {
            field: 'ipTypeName',
            title: '地址类型',
            align: 'center',
            formatter: function(value, row, index) {
                if (row.isAllocated == '0') {
                    return ''
                } else {
                    return value
                }
            },
            width: '9%',
        },

        {
            field: 'replyMan',
            title: '分配人',
            align: 'center',
            width: '10%',
        },
        {
            field: 'allotDate',
            title: '分配时间',
            align: 'center',
            width: '14%',

            formatter: function(value, row, index) {
                return '<span title="' + value + '">' + value + '</span>'
            },
        },
        {
            field: ' 1',
            title: '操作 ',
            align: 'center',
            formatter: function(value, row, index) {
                if (row.isAllocated == '0') {
                    return '<a style="color:#4477ee; font-weight:bold" onclick="planRecover(this)"><span>回收规划地址</span><input id="yanma" type="hidden" value="' + row.inetnum + '"><input id="ipfullip" type="hidden" value="' + (row.stratFullIp + '-' + row.endFullIp) + '"></button>'
                } else {
                    return '';
                }
            },
            width: '12%',
        }

    ]
];
var IpTypeList = {}
GetIpTypeSchemeList();


//表格
function relatedTable(id, data, columnsData) {

    var data = data.planAddrAllocatedList
    var total = data.total

    if (data.length != 0) {
        data.forEach(function(item, index) {
            fullip = item.stratFullIp + '-' + item.endFullIp
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
        onLoadSuccess: function(data) {
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
    pager.pagination({
        total: total,
        onSelectPage: function(pageNo, pageSize) {
            node = planallownode
            planedDetailAddr(node, pageSize, pageNo)
        }
    });
}
//查询
$('#search').on('click', function() {
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
    var Inetnum = $('#Inetnum').val() //IP地址段
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
        url: jcObj.getajaxUrl + '/ipaddrmodule/Ipv6/IpAddressPlan/GetAddrPlanV6',
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        data: $data,
        beforeSend: function() {
            loading()
        },
        success: function(data) {

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
            thisData.forEach(function(item, index) {

                if (item.unFold == 'Y') {
                    thisData[index].state = 'open'
                } else {
                    thisData[index].state = 'closed'
                }


            })
            initTreeXz(thisData);


        },
        error: function(err) {

        }
    })
}
//上级组织
function GetNodeList() {
    if (!getParam.OriNodeCode || getParam.OriNodeCode == "") {
        var nodeCode = $('#nodeCode').val()
    } else {
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
        success: function(data) {
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
            GetIPTypeV6List(id, 'PlanIpType')


        },
        error: function(error) {

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
        list.forEach(function(item) {
            str = str + '<option value="' + item.nodeCode + '">' + item.nodeName + '</option>'
        })
        $('#PlanNodeCode').html(str)
        $('#PlanNodeCode1').html(str)
    }
}
// //规划组织联动 规划类型（查询中的）
// $('#PlanNodeCode').on('change', function () {
//     var id = $('#PlanNodeCode option:selected').val()
//     GetIPTypeV6List(id, 'PlanIpType')
// })
//规划组织联动 规划类型（右侧中的）
$('#PlanNodeCode1').on('change', function() {
        var id = $('#PlanNodeCode1 option:selected').val()
        GetIPTypeV6List(id, 'addPlanIpTypeName')
    })
    //地址类型
function GetIPTypeV6List(id, htmlId) {
    var authType
    if (htmlId == 'addPlanIpTypeName') {
        authType = unplannode.oriIpType
    } else {
        authType = ""
    }
    var $data = {
        userName: jcObj.userId,
        nodeCode: id,
        ipType: authType,
        authType: "",
        nodeIsNull: "Y"
    };
    $data = JSON.stringify($data);
    $.ajax({
        type: "post",
        url: jcObj.getajaxUrl + "/ipaddrmodule/IPV6/IpAddrType/GetIPTypeV6List",
        dataType: "json",
        contentType: "application/json",
        data: $data,
        success: function(data) {
            if (data.code == '0000') {
                var thisData = data.data;
                thisData.forEach(function(item, index) {
                    item.parentNd = 'true'

                })
                readTree(thisData[0])
                initTree(thisData, htmlId);
            } else {
                $.messager.alert('提示', data.tip)
            }
        },
        error: function() {

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
        onLoadSuccess: function(node, data) {
            $('#plan1').css('display', 'none')
            $('#plan2').css('display', 'none')
            if (treeDate.length == 0) return;
            //判读是否有展开节点
            var flag = 1;
            data.forEach(function(item) {
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
            data.forEach(function(item) {
                    if (item.children.length !== 0) {
                        //将isSearched=Y的选中
                        item.children.forEach(function(citem, cindex) {
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
                    data[0].children.forEach(function(citem, cindex) {
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
        onClick: function(node) {
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
            } else {
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
    // console.log(treeDate)
    $('#' + id).combotree({
        multiple: false,
        width: 140,
        panelHeight: 'auto', //宽度自适应
        lines: true,
        animate: true,
        data: treeDate,
        cascadeCheck: false,
        checkbox: false,
        onLoadSuccess: function(node, data) {
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
                } else {
                    changenodeCode(data[0].children, data[0].id)
                }

            }

        },

        onClick: function(node) {

            if (id == 'OriNodeCode') {
                //将node.id传给规划组织
                if (node.fatherNodeCode == "") {
                    changenodeCode(nodetreeData[0].children, node.id)
                } else {
                    changenodeCode(node.children, node.id)
                }
                //赋值
                $('#OriNodeCode').val(node.text)
                $('#OriNodeCodehid').val(node.id)
                    //规划组织
                    //规划地址类型
                GetIPTypeV6List(node.id, 'PlanIpType')

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
        onShowPanel: function() {
            // $(this).combobox('panel').height(200);
        }

    });
}
/**************************右侧内容---已规划***************************/
var planallownode;

function planedAddr(node) {
    $('.bmgh').empty()
    var _d = IpTypeList[node.planIpType]
    var _div = ''
    if (_d && _d.schemelist.length > 0) {
        var txt = loadCodePlanContentTable(_d.schemelist);
        var fullIp = node.stratFullIp + '-' + node.endFullIp
        _div += '<div class="listrow" sumInetNum="' + node.inetnum + '" fullIp="' + fullIp + '" planIpTypeName="' + node.planIpTypeName + '" planIpType="' + node.planIpType + '"><div class="planItemBox">' + txt + '</div></div>'
    }
    $('.bmgh').append(_div)
    $("#ipAddr").html(node.inetnum) //IP地址
    $("#addrNum").html(formatterAddrnum(node.inetnumSum)) //地址数量
    $("#planNodeName").html(node.planNodeName) //规划组织
    $("#planOriNodeNam").html(node.oriNodeName) //上级组织
    $("#PlanIpTypeName").html(node.planIpTypeName) //地址类型
    $("#OriIpTypeName").html(node.oriIpTypeName) //原地址类型
    $("#planman").html(node.planMan) //规划人
    $("#plantime").html(node.planTime) //规划时间
    $("#remark").html(node.remark)//备注
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
        url: jcObj.getajaxUrl + '/ipaddrmodule/Ipv6/IpAddressPlan/GetPlanAddrAllocatedListV6',
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        data: $data,
        beforeSend: function() {
            loading();
        },
        success: function(data) {
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
            data.data.planAddrAllocatedList.forEach(function(item) {
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
        error: function(err) {}
    })
}
//批量规划回收
$('#planAddrRecV4').on('click', planRecoverAll)

function planRecoverAll() {
    var id = "";
    $('.ckbox').each(function(index, item) {
        if ($(item).prop('checked')) {

            id = id + ',' + $(item).parent().find('input[type="hidden"]').val()
        }
    })
    if (id == "") {
        $.messager.alert('提示', '请选择要规划回收的地址！')
    } else {
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
    $('#reciveinput').attr('readonly',true)
}
//确认回收
function PlanAddrRec(param) {


    if (param == 'one') {
        var recInetNum = $.trim($('#reciveinput').val())
        planNode.recInetNum = recInetNum
            // //验证回收的地址段是否在空闲范围之内
            //1.校验IP
            // 验证子网掩码的正则

        if (recInetNum.indexOf("/") != -1) { //地址段
            var IPAddrArr = recInetNum.split("/");
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
        } else if (recInetNum.indexOf("-") != -1) {
            var IPAddrArr = recInetNum.split("-");
            if (IPAddrArr.length != 2) {
                $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                return false;
            }
            if(!ckIPV6($.trim(IPAddrArr[0])) || !ckIPV6($.trim(IPAddrArr[1]))){
            // if ("IPvIPv64" != validIPAddress(IPAddrArr[0]) || "IPv6" != validIPAddress(IPAddrArr[1])) {
                $.messager.alert('提示', '请输入正确的ip地址段格式！', 'warning');
                return false;
            }
        } 

    }
    if (planNode.recInetNum.indexOf('-') === -1 && planNode.recInetNum.indexOf('/') === -1) {

        planNode.recInetNum = planNode.recInetNum + '-' + planNode.recInetNum
    }
    var $data = {}
    if (param == 'one'){
        $data = {
        inetnumid: planNode.inetnumId,
        oriNodeCode: planNode.oriNodeCode,
        planNodeCode: planNode.planNodeCode,
        inetnum: planNode.startipself + '-' + planNode.endipself,
            recAddrList: [{
                recInetNum: planNode.recInetNum
            }]
        };
    }else{
        var _recInetNumlist = []
        planNode.recInetNum.split(',').forEach(function(v){
            _recInetNumlist.push({recInetNum:v})
        })
        $data = {
        inetnumid: planNode.inetnumId,
        oriNodeCode: planNode.oriNodeCode,
        planNodeCode: planNode.planNodeCode,
        inetnum: '',
        recAddrList: _recInetNumlist
        };
    }
    
    $data = JSON.stringify($data);
    // 接口
    $.ajax({
        url: jcObj.getajaxUrl + '/ipaddrmodule/Ipv6/PlanAddrRecV6',
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: $data,
        success: function(data) {
            if (param == 'one') {
                $('#modalpop').window('close')
            }
            if (data.code == '0000') {
                $.messager.alert('提示', data.tip == "" ? '回收成功' : data.tip)
                    //调左侧树接口并将右侧内容清空
                clearcontent()
            } else {
                $.messager.alert('提示', data.tip)
            }
        },
        error: function(err) {
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
    } else {
        if (parseInt(num) % 256 == 0) {
            return (parseInt(num) / 256 + 'C')
        } else {
            return ((parseInt(num) / 256).toFixed(2) + 'C')
        }

    }
}
/*******************************右侧内容---未规划********************************/
function unplanedAddr(node) {
    // console.log(node)
    var OriIpType = node.planIpType, //原地址类型编码
        OriIpTypeName = node.planIpTypeName, //原地址类型名称
        topNodeCode = node.oriNodeCode, //上级组织编码
        topNodeName = node.oriNodeName, //上级组织名称
        freeAddr = node.inetnum //空闲地址
    var _u = '/ipmanage/ipaddrmodule/views/jsp/ipv6CodePlanApply/ipv6AddrPlanning.html?OriIpType=' + OriIpType + '&OriIpTypeName=' + OriIpTypeName + '&topNodeCode=' + topNodeCode + '&topNodeName=' + topNodeName + '&freeAddr=' + freeAddr
    $('#plan2Iframe').attr('src', _u)
    var _h = $('.search-cont').height()
    $('#plan2Iframe').height(_h)
        // unplannode = node
        // /**清空已生成的规划 */
        // $('#addrlist').css('display', 'none')
        // $('#addtobdy').html("")
        // newplanaddr1 = []
        // newplanaddr = []
        // /*****清空输入框**********/
        // $('#PlanNodeCode1 option:first').prop('selected', 'selected'); //规划组织选中项为空
        // $('#addinetnumsum').val("");//地址数量
        // //规划类型
        // $('#addPlanIpTypeNamehid').val('');
        // initTree([], 'addPlanIpTypeName');
        // //备注
        // $('#addremark').val("")
        // $('#addselfaddr').val('');

    // $('#freeAddr').html(node.inetnum) //空闲地址
    // $('#freeAddrNum').html(formatterAddrnum(node.inetnumSum)) //地址数量
    // $('#freeIpTypeName').html(todou(node.oriIpTypeName)) //地址类型
    // $('#freePlanNodeName').html(todou(node.oriNodeName)) //所属组织
    // isTypeNull()
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
        success: function(data) {

            if (data.code == "0000") {

                if (data.data.PARAVALUE == 'N') {
                    $('#typeshow').css('display', 'inline-block')
                } else {
                    $('#typeshow').css('display', 'none')

                }
                istypenull = data.data.PARAVALUE
            } else {
                $.messager.alert('提示:', data.tip, 'warning');
            }
        },
        error: function() {
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
    var planIpType = $('#addPlanIpTypeNamehid').val() //规划地址类型编码
    var addremark = $('#addremark').val(); //备注
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
        } else {
            var num = inetnumsum.substr(0, inx) * 256
        }
        var oldEndip = int2iP(ip2int(addselfaddr) + num - 1)
            //addInetNum = ipnumtoym(addselfaddr, oldEndip)
        addInetNum = addselfaddr + '-' + oldEndip
        tableidx++
        newplanaddr.push({
            id: tableidx,
            addInetNum: addInetNum, //地址段
            oldStartIp: addselfaddr, //规划起始地址
            oldendIp: oldEndip, //规划起始地址
            planNodeName: PlanNodeName, //规划组积名称
            planNodeCode: PlanNodeCode, ////规划组积编码
            inetnumSum: inetnumsum, //地址数量
            planIpTypeName: PlanIpTypeName, //规划地址类型名称
            planIpType: planIpType, //规划地址类型编码
            OriNodeCode: OriNodeCode, //上级组织编码
            OriIpType: OriIpType, //上级地址类型编码(查询中的规划类型),
            remark: addremark
        })
        newplanaddr1.push({
                id: tableidx,
                addInetNum: addInetNum, //地址段
                planNodeCode: PlanNodeCode, ////规划组积编码
                planIpType: planIpType, //规划地址类型编码
                oriNodeCode: OriNodeCode, //上级组织编码
                oriIpType: OriIpType, //上级地址类型编码(查询中的规划类型)
                remark: addremark
            })
            //显示表格
        $('#addtobdy').html("")
        $('#addrlist').css('display', 'block')
        var str = ""
        newplanaddr.forEach(function(item) {

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
    newplanaddr.forEach(function(item, index) {
        if (item.id == id) {
            newplanaddr.splice(index, 1)
        }
    })
    newplanaddr1.forEach(function(item, index) {
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

    newplanaddr1.forEach(function(item) {
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
        success: function(data) {
            if (data.code == '0000') {
                $.messager.alert('提示', data.tip == "" ? '规划地址生成成功！' : data.tip);
                //刷新左侧树
                clearcontent()
                    //清空规划地址的数据
                newplanaddr1 = []
                newplanaddr = []

            } else {
                $.messager.alert('提示', data.tip);

            }

        },
        error: function(err) {

        }
    })
}
//校验 ----生成规划地址
function ckPlanaddr() {
    var PlanNodeName = $('#PlanNodeCode1 option:selected').text() //规划组积名称
    var inetnumsum = $('#addinetnumsum').val() //地址数量
    var PlanIpTypeName = $('#addPlanIpTypeName').val() //规划地址类型名称   
    var addremark = $('#addremark').val(); //备注
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
        } else {
            flag3 = true
        }
    } else {
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
        var flag5 = ckIPV6(addselfaddr)
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

        } else {
            var nnewdata = deepClone(newplanaddr)
            nnewdata.sort(function(n1, n2) {
                if (ip2int(n1.oldendIp) - ip2int(n2.oldendIp) > 0) {
                    return -1
                } else {
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
    } else {
        var num = inetnumsum.substr(0, inx) * 256
    }
    // console.log(num)
    var newStartip = ip2int(addselfaddr)
    var newEndip = ip2int(addselfaddr) + num - 1
    // console.log(newStartip, newEndip)
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
            newplanaddr.forEach(function(item) {
                if (newStartip <= ip2int(item.oldendIp) && newEndip >= ip2int(item.oldStartIp)) {
                    $.messager.alert('提示', '新规划地址和列表中计划规划地址有重叠部分，请重新规划！');
                    repeatFlag = false
                }
            })
            return repeatFlag
        }

    } else {
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
            }
            if (nm % 256 == 0) {
                return true
            } else {
                $.messager.alert('提示', '请输入正确的地址数量！');
                return false;
            }
        } else if (idx != -1) {
            var re = /^\+?[1-9]\d*$/;
            // var re =  /^[+]?(0|([1-9]\d*))(\.\d+)?$/
            var value = nm.substring(0, idx)
            if (!re.test(value)) {
                $.messager.alert('提示', '请输入正确的地址数量！');
                return false;
            } else {
                return true
            }
        } else {
            $.messager.alert('提示', '请输入正确的地址数量！');
            return false;
        }
    } else {
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
    var Inetnum = $.trim($('#Inetnum').val()) //IP地址段
    var reg = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/

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
            } else {
                if (Inetnum.indexOf('-') !== -1) {
                    //验证地址段
                    var arripduan = Inetnum.split('-')

                    if (!reg.test(arripduan[0]) || !reg.test(arripduan[1])) {
                        $.messager.alert('提示', '地址段格式不正确！');
                        return false;
                    } else {
                        if (ip2int(arripduan[1]) < ip2int(arripduan[0])) {
                            $.messager.alert('提示', '地址段格式不正确！');
                            return false;
                        }
                    }
                } else if (Inetnum.indexOf('/') !== -1) {
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
    // } else if (EndTime > StartTime) {
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
            } else if (data[j].isPlanAddr == 0){
                str = '<span style="color:green; text-indent:1em;display:inline-block">空闲</span>'
            } else{
                str = '<span style="color:#555; text-indent:1em;display:inline-block;cursor: not-allowed;">已注册</span>'
            }
            var addrnum = data[j].stratFullIp + '-' + data[j].endFullIp
            data[j].id = data[j].inetnum + 'c';
            if (data[j].isPlanAddr == 1 || data[j].isPlanAddr == 0) {
                data[j].text = data[j].inetnum + str
            } else {
                data[j].text = '<span style="cursor:not-allowed;">'+data[j].inetnum+'</span>' + str
            }
            data[j].startipself = data[j].stratFullIp
            data[j].endipself = data[j].endFullIp
        } else {
            var addrnum = data[j].stratFullIp + '-' + data[j].endFullIp
            data[j].id = data[j].sumInetNum + 'p';
            data[j].text = data[j].sumInetNum
            data[j].startipself = data[j].stratFullIp
            data[j].endipself = data[j].endFullIp
        }
        if (param == 'one') {
            data[j].children = []
        } else {
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
    var iparr = $.trim(ip).split('/')
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
    $('.ckboxall').each(function(index, item) {
        if ($(this).prop('checked')) {
            $('.ckbox').prop('checked', 'checked')
        } else {
            $('.ckbox').removeAttr('checked')
        }
    })
}

function checkedsingle() {
    var flag = true
    $('.ckbox').each(function(index, item) {
        if (!$(item).is(':checked')) {
            flag = false
        }
    })
    if (flag) {
        $('.ckboxall').prop('checked', 'checked')
    } else {
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
    var zjdz
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
    var qsip4 = left0((parseInt(zwdz.substr(24, 8), 2) + 1).toString(2));

    var IP1 = parseInt(qsip1, 2).toString(10) + "." + parseInt(qsip2, 2).toString(10) + "." + parseInt(qsip3, 2).toString(10) + "." + parseInt(qsip4, 2).toString(10);

    var gb = gbdz(zwdz, ym);
    var zzip1 = left0((parseInt(gb.substr(0, 8), 2)).toString(2));
    var zzip2 = left0((parseInt(gb.substr(8, 8), 2)).toString(2));
    var zzip3 = left0((parseInt(gb.substr(16, 8), 2)).toString(2));
    var zzip4 = left0((parseInt(gb.substr(24, 8), 2) - 1).toString(2));

    var IP2 = parseInt(zzip1, 2).toString(10) + "." + parseInt(zzip2, 2).toString(10) + "." + parseInt(zzip3, 2).toString(10) + "." + parseInt(zzip4, 2).toString(10);
    return IP2



}

function getzwdz(strZJ, strYM) {
    var i = 0;
    var zwdz = "";
    while (i != 32) {
        if (strZJ.substr(i, 1) == strYM.substr(i, 1) && strZJ.substr(i, 1) == "1") {
            zwdz = zwdz + "1";
        } else {
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
        } else {
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

    var aIp1 = ip1.split("."),
        aIp2 = ip2.split(".");
    for (var i = 0, ip1 = 0, ip2 = 0; i < 4; i++) {
        ip1 = (ip1 << 8) + parseInt(aIp1[i]);
        ip2 = (ip2 << 8) + parseInt(aIp2[i]);
    }
    result = 0xFFFFFFFF & (ip2 - ip1);
    subCode = aIp1.join(".") + "/" + (32 - result.toString(2).length);
    return subCode
}
$(function() {
    //处理链接中的入参
    getParmdata()
        //上级组织
    GetNodeList()
})

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
//查询对应地址类型的编码方案
function GetIpTypeSchemeList() {
    $.ajax({
        url: jcObj.getajaxUrl + '/ipaddrmodule/Ipv6/Ipv6SchemeMng/GetIpTypeSchemeList',
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
        url: jcObj.getajaxUrl + '/ipaddrmodule/Ipv6/Ipv6SchemeMng/GetOneIpTypeScheme?IpTypeCode=' + IpTypeCode,
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
                content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'" title='+schemelist[i].LableCodeName+'>'+schemelist[i].LableCodeName+'</div>'
            }else if(isChinese(schemelist[i].LableCodeName.split('-').join(''))){
                content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'"title='+schemelist[i].LableCodeName+'>'+schemelist[i].LableCodeName.substr(0, 2)+'</div>'
            }else{
                content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'" title='+schemelist[i].LableCodeName+'>'+schemelist[i].LableCodeName.substr(0, 3)+'</div>'
            }    
        }else{
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'" title='+schemelist[i].LableName+'>'+schemelist[i].LableName.substr(0, 2)+'</div>'
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