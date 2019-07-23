var setting = {
    edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeDrag: beforeDrag,
        beforeDrop: beforeDrop,
        onDrop: onDrop,
    }
};

var zNodes =[
    { id:1, pId:0, name:"服务", open:true},
    { id:11, pId:1, name:"服务"},
    { id:2, pId:0, name:"系统服务", open:true},
    { id:21, pId:2, name:"判断"},
    { id:22, pId:2, name:"并行"},
    { id:23, pId:2, name:"汇总"},

];

function beforeDrag(treeId, treeNodes) {
    for (var i=0,l=treeNodes.length; i<l; i++) {
        if (treeNodes[i].drag === false) {
            return false;
        }
    }
    return true;
}
function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    return targetNode ? targetNode.drop !== false : true;
}
function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy){
    var data={
        nodecode:treeNodes[0].id,
        nodedesc:'服务',
        nodename:treeNodes[0].name,
        posx:event.offsetX,
        posy:event.offsetY
    } 
    addNode(data)
}

function setCheck() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
    isCopy = true//$("#copy").attr("checked"),
    isMove = true//$("#move").attr("checked"),
    prev = true//$("#prev").attr("checked"),
    inner = true//$("#inner").attr("checked"),
    next = true//$("#next").attr("checked");
    zTree.setting.edit.drag.isCopy = isCopy;
    zTree.setting.edit.drag.isMove = isMove;
    showCode(1, ['setting.edit.drag.isCopy = ' + isCopy, 'setting.edit.drag.isMove = ' + isMove]);

    zTree.setting.edit.drag.prev = prev;
    zTree.setting.edit.drag.inner = inner;
    zTree.setting.edit.drag.next = next;
    showCode(2, ['setting.edit.drag.prev = ' + prev, 'setting.edit.drag.inner = ' + inner, 'setting.edit.drag.next = ' + next]);
}
function showCode(id, str) {
    var code = $("#code" + id);
    code.empty();
    for (var i=0, l=str.length; i<l; i++) {
        code.append("<li>"+str[i]+"</li>");
    }
}

$(document).ready(function(){
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    setCheck();
    $("#copy").bind("change", setCheck);
    $("#move").bind("change", setCheck);
    $("#prev").bind("change", setCheck);
    $("#inner").bind("change", setCheck);
    $("#next").bind("change", setCheck);
});