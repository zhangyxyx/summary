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
    // jcObj.getajaxUrl = ''
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

var IpTypeList = {}
// GetIpTypeSchemeList();

$(function() {
    //处理链接中的入参
    // getParmdata()
        //上级组织
    GetNodeList()
})
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
function getSearcLeftNode(param,type) {

    //校验
    var flag = checkParam();
    if (!flag) {
        loadinghid()
        initTreeXz([],type);
        $('#plan2').css('display', 'none')
        return;
    }

    var OriNodeCode = $('#OriNodeCodehid').val() //管理组织编码
    var PlanIpType = $('#PlanIpTypehid').val() //地址类型编码
    var Inetnum = $('#Inetnum').val() //IP地址段
    var PrefixLen = $('#PrefixLen').val() //地址前缀长度
    var $data = {
        nodeCode: OriNodeCode,
        ipTypeCode: PlanIpType,
        inetNum: Inetnum, //IP地址段
        prefixLen:PrefixLen
    };
    $.ajax({
        //url: 'assets/module/ipv4addrPlan/json/GetAddrPlanV4.json',
        type: "post",
        url: jcObj.getajaxUrl + '/ipaddrmodule/Ipv6/allocatedipv6/queryIpv6UnusedIpTree',
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        data: JSON.stringify($data),
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
                initTreeXz([],type);
                $.messager.alert('提示', '没有数据')
                return;
            }
            var thisData = data.data
            thisData = iteration(thisData, "", param);
            //是否折叠
            thisData.forEach(function(item, index) {

                if (item.unFold == 'Y') {
                    thisData[index].state = 'open'
                } else {
                    thisData[index].state = 'closed'
                }


            })
            initTreeXz(thisData,type);


        },
        error: function(err) {

        }
    })
}
//上级组织
function GetNodeList() {
    var $data = {
        userName: jcObj.userId,
        nodeCode: ''
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

    //地址类型
function GetIPTypeV6List(id, htmlId) {
    // var authType
    // if (htmlId == 'addPlanIpTypeName') {
    //     authType = unplannode.oriIpType
    // } else {
    //     authType = ""
    // }
    var $data = {
        userName: jcObj.userId,
        nodeCode: id,
        ipType: '',
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
function initTreeXz(treeDate,type) {

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
            // $('#plan1').css('display', 'none')
            // $('#plan2').css('display', 'none')
            if (treeDate.length == 0) return;
                ///没有默认展开的，展开第一个节点
                $(this).tree('collapseAll');
                $(this).tree('expand', $(this).tree('getRoot').target);

            //选中搜索的地址
            var id = ""
            var isfirstcom = 0
            var issearchedCount = 0 //查看是否有选中的节点
                //若没有搜索的地址，默认展第一条的第一个子元素
            if (issearchedCount == 0 && data[0].length != 0) {
                if (data[0].children.length !== 0) {
                    //将isSearched=Y的选中
                    data[0].children.forEach(function(citem, cindex) {
                        if (cindex > 0) return;
                        id = citem['id']
                        var n = $('#xzNodeTree').tree('find', id);
                        if(type == undefined){
                            $(n.target).addClass('tree-node-selected')
                            $('#plan2').css('display', 'block')
                            unplanedAddr(citem)
                        }
                    })
                }
            }

        },
        onClick: function(node) {
            if (node.status == '空闲') {
                $('.ckboxall').removeAttr('checked')
                $('#plan2').css('display', 'block')
                unplanedAddr(node)
            }
            //已规划
            else  {
                $('#plan2').css('display', 'none')
                // $('#plan1').css('display', 'block')
                //     //将点击的值存起来
                // planNode = citem;
                // //基本信息、详细信息
                // planedAddr(citem)
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

            }

        },

        onClick: function(node) {

            if (id == 'OriNodeCode') {
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

// /*******************************右侧内容---未规划********************************/
function unplanedAddr(node) {
    // console.log(node)
    var OriIpType = node.ipTypeCode, //原地址类型编码
        OriIpTypeName = node.ipTypeName, //原地址类型名称
        topNodeCode = node.nodeCode, //上级组织编码
        topNodeName = node.nodeName, //上级组织名称
        freeAddr = node.inetNum //空闲地址
    var _u = 'views/jsp/ipv6CodePlanApply/ipv6AddrAllocationBatchContent.html?OriIpType=' + OriIpType + '&OriIpTypeName=' + OriIpTypeName + '&topNodeCode=' + topNodeCode + '&topNodeName=' + topNodeName + '&freeAddr=' + freeAddr
    $('#plan2Iframe').attr('src', _u)
    var _h = $('.search-cont').height()
    $('#plan2Iframe').height(_h)
}

//校验查询条件
function checkParam() {
    var OriNodeCode = $('#OriNodeCode').val() //管理组织编码   
    var Inetnum = $.trim($('#Inetnum').val()) //IP地址段
    var PrefixLen = $.trim($('#PrefixLen').val()) //地址前缀长度
    var reg = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/

    if (OriNodeCode == "") {
        $.messager.alert('提示', '上级组织不能为空!');
        return false;
    }
    if (Inetnum != "") {
        //如果地址段和传过来的一致则不进行校验   
        // if (Inetnum != getParam.Inetnum) {
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

        // }
    }
    if (PrefixLen != "") {
        if(!/^\d+$/.test(PrefixLen)){
            $.messager.alert('提示', '地址前缀长度必须为正整数!');
            return false;
        }
        if(24 <= PrefixLen && PrefixLen <= 128){
            return true
        }else{
            $.messager.alert('提示', '地址前缀长度必须为24-128范围内的正整数!');
            return false;
        }
    }
    return true
}
//处理左侧树节点树数据
function iteration(data, planstr, param) {
    if (typeof data == 'string') {
        data = JSON.parse(data)
    }
    for (var j = 0; j < data.length; j++) {
        if (planstr == '子节点') {
            var str;
            str = '<span style="color:green; text-indent:1em;display:inline-block">空闲</span>'
            var addrnum = data[j].startIp + '-' + data[j].endIp
            data[j].id = data[j].inetNum + 'c';
            data[j].text = '<span style="cursor:pointer;">'+data[j].inetNum+'</span>' + str
            data[j].startipself = data[j].startIp
            data[j].endipself = data[j].endIp
        } else {
            var str;
            str = '<span style="color:#333; text-indent:1em;display:inline-block">'+ data[j].ipTypeName+'</span>'
            var addrnum = data[j].startIp + '-' + data[j].endIp
            data[j].id = data[j].inetNum + 'p';
            data[j].text = '<span style="color:#4477ee;font-weight:bold;">'+data[j].inetNum+'</span>' +str
            data[j].startipself = data[j].startIp
            data[j].endipself = data[j].endIp
        }
        if (param == 'one') {
            data[j].children = []
        } else {
            data[j].children = data[j].unusedIpList
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

function clearcontent() {
    //调左侧树接口并将右侧内容清空
    getSearcLeftNode('all')
    $('#plan2').css('display', 'none')
    $('#addrlist').css('display', 'none')
    $('#addtobdy').html("")
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