$(function(){
    var mapHeight=$(window).height()-62;
    $(".mainDiv").height(mapHeight);

    window.addEventListener('resize',function () {
        var mapHeight=$(window).height()-62;
        $(".mainDiv").height(mapHeight);
    })

    nodeTree();
});

//定义基础URL
var jcObj={
    getajaxUrl:$.ITE.getajaxUrlIpv4(),
    userId:jQuery.ITE.getCookieValue('loginName'),
    dzTypeData:"",
    xztreeVal:[],
    xgtreeVal:[],
    zIndex:0
}

//提示框转义为中文
$.messager.defaults = { ok: "是", cancel: "否" };

//点击新增IP地址按钮
$(".addnode").on("click",function (){
    $(".xzipdzDiv").show();
    $(".bgDiv").show();
    
    //新增页面恢复原始信息
    xzfy();
})

//点击新增IP地址确定按钮
$(".xzSure").on("click",function (){
    var addIptypeName=$(".xzddTypeName").val();
    var addFatherIPClassType=jcObj.dzTypeData.ipClassType;
    var addFatherTypecode=jcObj.dzTypeData.ipTypeId;
    var addFatherTypeName=jcObj.dzTypeData.ipTypeName;
    var addFullNodecode=jcObj.xztreeVal.toString();
    if(addIptypeName==""){
        jQuery.messager.alert('提示:',"地址类型名称不得为空!",'warning');
        return false; 
    }else{
        var xzData={
            fatherIpClassType:addFatherIPClassType,
            fatherTypecode:addFatherTypecode,
            fatherTypeName:addFatherTypeName,
            fullNodeCode:addFullNodecode,
            ipTypeName:addIptypeName
        };

        //新增IP地址
        AddIPTypeV4(xzData);
    }
})

//点击新增IP地址关闭按钮
$(".xzClose").on("click",function (){
    $(".xzipdzDiv").hide();
    $(".bgDiv").hide();
})

//点击修改IP地址按钮
$(".xgnode").on("click",function (){
    $(".xgipdzDiv").show();
    $(".bgDiv").show();
    
    //修改页面添加原始信息
    xgfy();
})

//点击修改IP地址确定按钮
$(".xgSure").on("click",function (){
    var xgIptypeName=$(".xgddTypeName").val();
    var xgIPClassType=jcObj.dzTypeData.ipClassType;
    var xgfullTypecode=jcObj.dzTypeData.fullTypeCode;
    var xgIptypeID=jcObj.dzTypeData.ipTypeId;
    var xgFullNodecode=jcObj.xgtreeVal.toString();
    if(xgIptypeName==""){
        jQuery.messager.alert('提示:',"地址类型名称不得为空!",'warning');
        return false; 
    }else{
        $.messager.confirm("提示", "您确定修改该条V4地址类型？", function (data) {
            if (data) {
                var xgData={
                    ipClassType:xgIPClassType,
                    ipTypeId:xgIptypeID,
                    fullNodeCode:xgFullNodecode,
                    ipTypeName:xgIptypeName,
                    fullTypeCode:xgfullTypecode
                };

                //修改IP地址
                ModIPTypeV4(xgData);
            }
        });
    }
})

//点击修改IP地址关闭按钮
$(".xgClose").on("click",function (){
    $(".xgipdzDiv").hide();
    $(".bgDiv").hide();
})

//点击删除IP地址确定按钮
$(".delnode").on("click",function (){
    var delIPClassType=jcObj.dzTypeData.ipClassType;
    var delIptypeID=jcObj.dzTypeData.ipTypeId;

    $.messager.confirm("提示", "您确定删除该条V4地址类型？", function (data) {
        if (data) {
            var delData={
                ipClassType:delIPClassType,
                ipTypeId:delIptypeID,
            };
            //删除V4地址
            DelIPTypeV4(delData);
        }
    });
})

//地址类型节点树 
function nodeTree(){
    var $data={
            userName:jcObj.userId,
            nodeCode:"",
            ipType:"",
            authType:"",
            nodeisnull:"Y"
        };
    $data=JSON.stringify($data);
    $.ajax({
        type:"post",
        url:jcObj.getajaxUrl+"/ipaddrmodule/IpAddrType/GetIPTypeV4List",
        dataType:"json",
        contentType:"application/json",
        data:$data,
        success: function(data){
            if(data.code=="0000"){
                var thisData=data.data;
                for(var i=0;i<thisData.length;i++){
                    var childrenData=thisData[i].children;
                    for(var j=0;j<childrenData.length;j++){
                        childrenData[j].fatherTypeCode=thisData[i].id;
                    }
                }
                initTree(thisData);   
            }else{
                jQuery.messager.alert('提示:',data.tip,'warning');
            }
        },
        error:function(){
            jQuery.messager.alert('提示:',"获取节点加载数据失败!",'warning');
        }           
    })
}

//地址类型--生成节点树
function initTree(treeDate) {
    $('#nodeTree').tree({
        width:140,
        lines:true,
        animate:true,
        data:treeDate,
        onClick:function(node){
            jcObj.dzTypeData=node;
            if(node.click=="Y"){
                var treeSpanX = $("#"+node.domId).children(".tree-title").offset().left;
                var treeSpanY = $("#"+node.domId).children(".tree-title").offset().top;
                var treeSpanWidth = $("#"+node.domId).children(".tree-title").width();
                var tooptipX=treeSpanX+treeSpanWidth+30;
                var tooptipY=treeSpanY;
                $(".tooptip").offset({top: tooptipY, left: tooptipX});
                if(node.typeLevel=="1"){
                    $(".xgnode").addClass("tooptipHide");
                    $(".delnode").addClass("tooptipHide");
                }else{
                    $(".xgnode").removeClass("tooptipHide");
                    $(".delnode").removeClass("tooptipHide");
                }
                $(".tooptip").show();
            }else{
                //需要先设置，后隐藏，否则无法情况位置数据
                $(".tooptip").offset({top: 0, left: 0});
                $(".tooptip").hide();
            }
        },
        onLoadSuccess:function(node, data) {
        },
        onChange:function(newValue, oldValue) {
            
        }
    });
}

//点击取消工作框
$(document).on("click","body",function (){
    $(".tooptip").offset({top: 0, left: 0});
    $(".tooptip").hide();
})

//管理组织-新增
function nodeTreeXz(thisTreeVal){
    var nodeCodeStr=thisTreeVal.toString();
    var $data={
            userName:jcObj.userId,
            nodeCode:nodeCodeStr
        };
    $data=JSON.stringify($data);
    $.ajax({
        type:"post",
        url:jcObj.getajaxUrl+"/ipaddrmodule/NodeManage/GetNodeList",
        dataType:"json",
        contentType:"application/json",
        data:$data,
        success: function(data){
            if(data.code=="0000"){
                var thisData=data.data;
                thisData=iteration(thisData);
                initTreeXz(thisData);
            }else{
                jQuery.messager.alert('提示:',data.tip,'warning');
            }
        },
        error:function(){
            jQuery.messager.alert('提示:',"获取节点加载数据失败!",'warning');
        }           
    })
}

//管理组织-新增--生成节点树
function initTreeXz(treeDate) {
    $('#xzNodeTree').combotree({
        multiple:true,
        width:140,
        lines:true,
        animate:true,
        data:treeDate,
        cascadeCheck:true,
        checkbox:true,
        onLoadSuccess:function(node, data) {
        },
        onCheck:function(node){
            getValue();
            /*var selectVal=$("#xzNodeTree").combotree("getValues"); 
            jcObj.xztreeArr.push(node)
            jcObj.xztreeVal=[];

            jcObj.xztreeArr = jcObj.xztreeArr.filter((x, index,self)=>{
              var arrids = []
              jcObj.xztreeArr.forEach((item,i) => {
                arrids.push(item.id)
              })
              return arrids.indexOf(x.id) === index
            })

            for(var i=0;i<selectVal.length;i++){
                if(jcObj.xztreeArr[i].id==selectVal[i]){
                    jcObj.xztreeVal.push(jcObj.xztreeArr[i].nodeFullCode)
                }
            }*/
        }
    });
}

//管理组织-修改
function nodeTreeXg(thisTreeVal,childNodeArr){
    var nodeCodeStr=thisTreeVal.toString();
    var $data={
            userName:jcObj.userId,
            nodeCode:nodeCodeStr
        };
    $data=JSON.stringify($data);
    $.ajax({
        type:"post",
        url:jcObj.getajaxUrl+"/ipaddrmodule/NodeManage/GetNodeList",
        dataType:"json",
        contentType:"application/json",
        data:$data,
        success: function(data){
            if(data.code=="0000"){
                var thisData=data.data;
                thisData=iteration(thisData);
                initTreeXg(thisData,childNodeArr);
            }else{
                jQuery.messager.alert('提示:',data.tip,'warning');
            }
        },
        error:function(){
            jQuery.messager.alert('提示:',"获取节点加载数据失败!",'warning');
        }           
    })
}

//管理组织-修改--生成节点树
function initTreeXg(treeDate,thisTreeVal) {
    $('#xgNodeTree').combotree({
        multiple:true,
        width:140,
        lines:true,
        animate:true,
        data:treeDate,
        cascadeCheck:true,
        checkbox:true,
        onLoadSuccess:function(node, data) {
            $('#xgNodeTree').combotree('setValues', thisTreeVal);
        },
        onCheck:function(node){
            getValue2();
            /*var selectVal=$("#xgNodeTree").combotree("getValues"); 
            jcObj.xgtreeArr.push(node)
            jcObj.xgtreeVal=[];

            jcObj.xgtreeArr = jcObj.xgtreeArr.filter((x, index,self)=>{
              var arrids = []
              jcObj.xgtreeArr.forEach((item,i) => {
                arrids.push(item.id)
              })
              return arrids.indexOf(x.id) === index
            })

            for(var i=0;i<selectVal.length;i++){
                if(jcObj.xgtreeArr[i].id==selectVal[i]){
                    jcObj.xgtreeVal.push(jcObj.xgtreeArr[i].nodeFullCode)
                }
            }*/
        }
    });
}

//新增页面恢复原始信息
function xzfy(){
    $(".xzddTypeName").val("");
    jcObj.zIndex=0;
    var xztreeData={
        iptypecode:jcObj.dzTypeData.ipTypeId
    };
    getIPTypeNode(xztreeData,jcObj.dzTypeData.ipTypeId);
    jcObj.xztreeVal=[];
}

//修改页面恢复原始信息
function xgfy(){
    $(".xgddTypeName").val(jcObj.dzTypeData.ipTypeName);
    jcObj.zIndex=1;

    var thisIptypecode="";
    var thisFatherTypeCode=jcObj.dzTypeData.fatherTypeCode;
    if(thisFatherTypeCode=="ipclass01"||thisFatherTypeCode=="ipclass02"||thisFatherTypeCode=="ipclass03"){
        thisIptypecode=jcObj.dzTypeData.ipTypeId;
    }else{
        thisIptypecode=jcObj.dzTypeData.fatherTypeCode;
    }
    var xgtreeData={
        iptypecode:thisIptypecode
    };
    getIPTypeNode(xgtreeData,thisIptypecode,jcObj.dzTypeData.ipTypeId);
}

//获取修改页面默认节点
function getIPTypeNode(xzData,treeid,childId){
    $.ajax({
        type:"post",
        url:jcObj.getajaxUrl+"/ipaddrmodule/IpAddrType/getIPTypeNode",
        dataType:"json",
        data:xzData,
        success: function(data){
            if(data.code=="0000"){
                var thisdata=data.data;
                var thisTreeVal=[];
                if(thisdata.length==0){
                    var fullCode=jcObj.dzTypeData.fullTypeCode;
                    var fullCodeArr=fullCode.split(".");
                    var thisIndex=parseInt(getArrayIndex(fullCodeArr,treeid));
                    var prevIndex=thisIndex - 1;
                    var thisIptypecode=fullCodeArr[prevIndex];

                    var getIpData={
                        iptypecode:thisIptypecode
                    }
                    getIPTypeNode(getIpData,thisIptypecode,childId);
                }else{
                    if(jcObj.zIndex==0){
                        for(var i=0;i<thisdata.length;i++){
                            thisTreeVal.push(thisdata[i].NODECODE);
                        }
                        nodeTreeXz(thisTreeVal);
                    }else{
                        for(var i=0;i<thisdata.length;i++){
                            thisTreeVal.push(thisdata[i].NODECODE);
                        }

                        var xgtreeData={
                            iptypecode:childId
                        };

                        getIPTypeNode2(xgtreeData,thisTreeVal);
                    }
                }
            }else{
               jQuery.messager.alert('提示:',data.tip,'warning'); 
            }
        },
        error:function(){
            jQuery.messager.alert('提示:',"加载数据失败！",'warning');
        }           
    })
}

//获取修改页面本身节点
function getIPTypeNode2(xzData,nodeArr){
    $.ajax({
        type:"post",
        url:jcObj.getajaxUrl+"/ipaddrmodule/IpAddrType/getIPTypeNode",
        dataType:"json",
        data:xzData,
        success: function(data){
            if(data.code=="0000"){
                var thisdata=data.data;
                jcObj.xgtreeVal=[];
                var childNodeArr=[];
                if(thisdata.length>0){
                    for(var i=0;i<thisdata.length;i++){
                        jcObj.xgtreeVal.push(thisdata[i].NODEFULLCODE);
                        childNodeArr.push(thisdata[i].NODECODE);       
                    }
                }
                
                nodeTreeXg(nodeArr,childNodeArr);
            }else{
               jQuery.messager.alert('提示:',data.tip,'warning'); 
            }
        },
        error:function(){
            jQuery.messager.alert('提示:',"加载数据失败！",'warning');
        }           
    })
}

//新增IP地址
function AddIPTypeV4(xzData){
    var $data=JSON.stringify(xzData);
    $.ajax({
        type:"post",
        url:jcObj.getajaxUrl+"/ipaddrmodule/IpAddrType/AddIPTypeV4",
        dataType:"json",
        contentType:"application/json",
        data:$data,
        success: function(data){
            if(data.code=="0000"){
                jQuery.messager.alert('提示:',"V4地址类型新增成功!",'warning'); 
                $(".xzipdzDiv").hide();
                $(".bgDiv").hide();
                nodeTree();
            }else{
               jQuery.messager.alert('提示:',data.tip,'warning'); 
            }
        },
        error:function(){
            jQuery.messager.alert('提示:',"加载数据失败！",'warning');
        }           
    })
}

//修改IP地址
function ModIPTypeV4(xgData){
    var $data=JSON.stringify(xgData);
    $.ajax({
        type:"post",
        url:jcObj.getajaxUrl+"/ipaddrmodule/IpAddrType/ModIPTypeV4",
        dataType:"json",
        contentType:"application/json",
        data:$data,
        success: function(data){
            if(data.code=="0000"){
                jQuery.messager.alert('提示:',"V4地址类型修改成功!",'warning'); 
                $(".xgipdzDiv").hide();
                $(".bgDiv").hide();
                nodeTree();
            }else{
               jQuery.messager.alert('提示:',data.tip,'warning'); 
            }
        },
        error:function(){
            jQuery.messager.alert('提示:',"加载数据失败！",'warning');
        }           
    })
}

//IP地址删除
function DelIPTypeV4(delData){
    var $data=JSON.stringify(delData);
    $.ajax({
        type:"post",
        url:jcObj.getajaxUrl+"/ipaddrmodule/IpAddrType/DelIPTypeV4",
        dataType:"json",
        contentType:"application/json",
        data:$data,
        success: function(data){
            if(data.code=="0000"){
                jQuery.messager.alert('提示:',"V4地址删除成功!",'warning');
                nodeTree(); 
            }else{
               jQuery.messager.alert('提示:',data.tip,'warning'); 
            }
        },
        error:function(){
            jQuery.messager.alert('提示:',"加载数据失败！",'warning');
        }           
    })
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

//获取节点的全编码
Array.prototype.contains = function ( needle ){
  for (i in this) {
    if (this[i].id == needle.id) return true;
  }
  return false;
}

//新增节点获取全编码
function getValue(){
    jcObj.xztreeVal=[];
    var nodeList=new Array();
    var t = $('#xzNodeTree').combotree('tree');//获取树
    var nodes = t.tree('getChecked', ['checked']);// t.tree('getChecked', ['checked','indeterminate']); // 获取点击的和不确定的节点
    for(var i=0;i<nodes.length;i++){
        var node=nodes[i];
        var flag= findParent(t,node);
        if(flag&&!nodeList.contains(flag)){
            nodeList.push(flag);
        }
    }
    
    for(var i=0;i<nodeList.length;i++){
        jcObj.xztreeVal.push(nodeList[i].nodeFullCode);
    }
}

//修改节点获取全编码
function getValue2(){
    jcObj.xgtreeVal=[];
    var nodeList=new Array();
    var t = $('#xgNodeTree').combotree('tree');//获取树
    var nodes = t.tree('getChecked', ['checked']);// t.tree('getChecked', ['checked','indeterminate']); // 获取点击的和不确定的节点
    for(var i=0;i<nodes.length;i++){
        var node=nodes[i];
        var flag= findParent(t,node);
        if(flag&&!nodeList.contains(flag)){
            nodeList.push(flag);
        }
    }
    
    for(var i=0;i<nodeList.length;i++){
        jcObj.xgtreeVal.push(nodeList[i].nodeFullCode);
    }
}

function findParent(t,node){
    var flag=node;
    var parent=t.tree('getParent',node.target);//获取父节点
    if(parent){
        if(parent.checked){
            flag=findParent(t,parent);
        }
    }
    return flag;
}

//获取元素在数组的下标
function getArrayIndex(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return i;
        }
    }
    return -1;
}