$(function() {
    SyncNodeToBranch();
    getCodeBook()
    
    
});
var noClick = true
var _urlList = []
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
var userName = jQuery.ITE.getLoginName('loginName'); //登录用户
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
            var nodeList = obj.data;
            readTree(nodeList[0])
            $('#tree').tree({
                data: nodeList,
                onClick: function(node) {
                    // console.info(node)
                    if (noClick) {
                        pageList(node.nodeCode,node.nodeName)
                    }

                }
            })
            var n = $('#tree').tree('find', nodeList[0].nodeCode);
            $('#tree').tree('select', n.target);
            pageList(nodeList[0].nodeCode,nodeList[0].nodeName)
        }
    });
}

function noClickNode(fg) {
    // noClick = fg
    if (fg) {
        $('#tree').css('pointer-events', 'initial')
    } else {
        $('#tree').css('pointer-events', 'none')
    }
}

function readTree(node) {
    node.id = node.nodeCode
    node.text = node.nodeName
    var children = node.children;
    if (children && children.length) {
        for (var i = 0; i < children.length; i++) {
            readTree(children[i]);
        }
    }
}

function pageList(nodecode,nodename) {
	var tab = $('#tabsPlan').tabs('getSelected');
	var index = $('#tabsPlan').tabs('getTabIndex',tab)<0?0:$('#tabsPlan').tabs('getTabIndex',tab);
    _urlList.forEach(function(q, w, e) {
        $('#tabsPlan').tabs('close', q.CODE);
        $('#tabsPlan').tabs('add', {
            title: q.CODE,
            content: '<iframe name="' + q.CODE + '" src="' + q.VALUE + '?nodecode=' + nodecode+ '&nodename=' + nodename + '" frameborder="0" style="height:100%;width:100%;" "></iframe>',
            closable: true,
            selected: w == index?true:false
        })
    })
}
//自动同步节点维护branch表接口
function SyncNodeToBranch() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/NodeManage/SyncNodeToBranch'),
        type: 'get'
    });
};

// 获取codebook系统配置信息接口
function getCodeBook() {
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/SysCommon/getCodeBook?tablename=virtualtable&&columnname=nodecfgtabfunc'),
        type: 'get',
        dataType: 'json',
        success: function(res) {
            if (res.code == '0000') {
                _urlList = res.data
                getNodeList();
                    // datalist.forEach(function(q, w, e) {
                    //     $('#tabsPlan').tabs('close', q.CODE);
                    //     $('#tabsPlan').tabs('add', {
                    //         title: q.CODE,
                    //         content: '<iframe name="' + q.CODE + '" src="' + q.VALUE + '?nodecode=' + nodecode + '" frameborder="0" style="height:100%;width:100%;" "></iframe>',
                    //         closable: true,
                    //         selected: true
                    //     })
                    // })
            } else {
                $.messager.alert('Warning', 'The warning message');
            }
        }
    });
};