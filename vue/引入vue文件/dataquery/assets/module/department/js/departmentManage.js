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
var thisData = []
var curlPath = window.document.location.href;
var pathName = window.document.location.pathname;
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var userName = jQuery.ITE.getLoginName('loginName');//登录用户
var tempName = "/ipaddrmodule";//当前文件的跟目录
var bathPath = "";
if (projectName == tempName) {
    projectName = "";
} else {
    bathPath = curlPath.substring(0, pathName.indexOf('/')) + projectName;
}

//地址类型节点树 
function nodeTree(){
    var $data={
        netuserid:jcObj.userId,
        departmentcode:"",
        departmentname:"",
    };
    $data=JSON.stringify($data);
    $.ajax({
        type:"post",
        url:bathPath+"/ipaddrmodule/departmentManage/queryTree",
        dataType:"json",
        contentType:"application/json",
        data:$data,
        success: function(res){
            if(res.code=="0000"){
                thisData=res.data;
                // thisData = [{
                //     "netuserid": null,
                //     "departmentcode": "DEP99999",
                //     "departmentname": "重庆电信",
                //     "fatherdepartmentcode": null,
                //     "departmentlevel": "1",
                //     "departmentisleaf": "0",
                //     "departmentfullcode": "DEP99999",
                //     "departmentpermissionList": [{
                //         "netuserid": "admin",
                //         "manageflag": "Y",
                //         "username": "admin管理员",
                //         "usertype": "OPERATOR",
                //         "usertypename": "网络操作员",
                //         "mobile": null
                //     },{
                //         "netuserid": "test",
                //         "manageflag": "N",
                //         "username": "test",
                //         "usertype": "OPERATOR",
                //         "usertypename": "网络操作员",
                //         "mobile": "18261932223@163.com"
                //     }],
                //     children:[{
                //         id:'DEP0000000l',
                //         text:'部门1',
                //         "departmentpermissionList": [{
                //             "netuserid": "adminming",
                //             "manageflag": "Y",
                //             "username": "adminming",
                //             "usertype": "OPERATOR",
                //             "usertypename": "网络操作员",
                //             "mobile": null
                //         }],
                //     }]
                // }]
                thisData.forEach((item)=>{
                    item.click = "Y"
                    item.addclick = 'SY'
                    item.children.forEach((val)=>{
                        val.click = "Y"
                    })
                })
                thisData = JSON.parse(
                    JSON.stringify(thisData).replace(/departmentname/g, "text")
                );
                thisData = JSON.parse(
                    JSON.stringify(thisData).replace(/departmentcode/g, "id")
                );
                thisData = JSON.parse(
                    JSON.stringify(thisData).replace(/departmentisleaf/g, "pId")
                );
                for(var i=0;i<thisData.length;i++){
                    var childrenData=thisData[i].children;
                    for(var j=0;j<childrenData.length;j++){
                        childrenData[j].fatherTypeCode=thisData[i].id;
                    }
                }
                initTree(thisData); 
            }else{
                jQuery.messager.alert('提示:',res.tip,'warning');
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
                var aObj = $("#" + node.domId);
                if ($("#diyBtn_"+node.id+"add").length>0) return;
                if(node.addclick == 'SY'){
                    var editStr = "<span class='fonts'> "
                    + "<a  id='diyBtn_" + node.id+"add"
                    + "' class='fa fa-plus' style='color:#0f0' title='新增'> </a>"
                    + "</span>";
                }else{
                    var editStr = "<span class='fonts'> "
                    + "<a  id='diyBtn_" + node.id+"add"
                    + "' class='fa fa-plus' title='新增'> </a>"
                    + "<a  id='diyBtn_" + node.id+"upd"
                    + "' class='fa fa-pencil' title='修改' > </a>"
                    + "<a  id='diyBtn_" + node.id+"del"
                    + "' class='fa fa-trash-o' title='删除' > </a>"
                    + "</span>";
                }
                $("#nodeTree").find('.fonts').remove()
                aObj.append(editStr);
                var btnadd = $("#diyBtn_"+node.id+"add");
                var btnupd = $("#diyBtn_"+node.id+"upd");
                var btndel = $("#diyBtn_"+node.id+"del");
                
                //给三个按钮注册事件在对应的页面中写对应的函数即可
                if (btnadd) btnadd.bind("click", function(){insertNode(node);});
                if (btnupd) btnupd.bind("click", function(){updateNode(node);});
                if (btndel) btndel.bind("click", function(){deleteNode(node);});

                getcodebook(node)

            }else{
                $("#nodeTree").find('.fonts').remove()
            }
        },
        onLoadSuccess:function(node, data) {},
        onChange:function(newValue, oldValue) {}
    });
}

//点击新增IP地址按钮
function insertNode(node){
    openwin(node,'add')
}
//修改
function updateNode(node){
    openwin(node,'edit')
}
function openwin(node,type){
    $('#win').window({    
        width:1000,    
        height:500,    
        modal:true ,
        method:"post",
        async:false,
        closed:true,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        href:bathPath +'/ipaddrmodule/views/jsp/department/departmentManageAdd.jsp',
        onClose:function(){
            node={};
            $('#win').window('clear');
        },
        onLoad:function(){
            var params={"notnetuseridAll":[]};
            var userShow=[];//下面表格显示内容	
            var userSelShow=[];
            
            $.each(node.departmentpermissionList,function(index,temp){
                if(temp.manageflag=='Y'){
                    params.notnetuseridAll.push(temp.netuserid);
                    temp.notEditor="Y";
                }else{
                    userSelShow.push(temp.netuserid);
                }
                userShow.push(temp);
            });
            showUser(params,userSelShow);
            showUserListLoad(userShow)
            if(type == 'add'){
                $("#Addsave").on('click',function(){openAddSave(node)});   
            }else{
                backfill(node) 
                $("#Addsave").on('click',function(){updatetree(node)});  
            }
            
        }
    });  
    $('#win').window('open');
}
function showUser(params,userSelShow){
    $.ajax({
        url: encodeURI(bathPath +'/ipaddrmodule/IpPublicInterface/getUser'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        async:false,
        contentType: 'application/json;chartset=UTF-8',
        success: function (obj) {
            if(obj.code == "0000"){
                $("#user").combogrid({    
                    panelWidth:450,    
                    idField:'netuserid',    
                    textField:'username',    
                    data:obj.data,
                    multiple:true,
                    columns:[[    
                        {field:'ck',checkbox:true},
                        {field:'username',title:'用户名称',width:60},    
                        {field:'netuserid',title:'用户ID',width:100},    
                        {field:'usertypename',title:'用户类型',width:120},    
                        {field:'mobile',title:'电话号码',width:100}    
                    ]] ,
                    onLoadSuccess:function(rows){
                        $('#user').combogrid('setValues',userSelShow);
                    },
                    onHidePanel:function(){
                        var g = $('#user').combogrid('grid');	// 获取数据表格对象
                        var r = g.datagrid('getChecked');
                        var showUserRows=$('#showUserList').datagrid('getRows');
                        var delindexRow=[];
                        $.each(showUserRows,function(index,item){
                            if(!item.notEditor){
                                delindexRow.push(index);
                                //$('#showUserList').datagrid('deleteRow',index);
                            }
                        });
                        $.each(delindexRow.reverse(),function(index,item){
                                $('#showUserList').datagrid('deleteRow',item);
                        } );
                        $.each(r,function(index,item){
                            if(!item.manageflag){
                                item.manageflag="N";
                            }
                            $('#showUserList').datagrid('appendRow',item);
                            editIndex = $('#showUserList').datagrid('getRows').length-1;
                            $('#showUserList').datagrid('beginEdit', editIndex);
                        });
                    } 
                }); 
            }else{
                $.messager.alert('提示',obj.tip,'error');
            }
            
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        }
    }); 
}
function showUserListLoad(userShow){
    $('#showUserList').datagrid({ 
        data:userShow,
        sortName:'position',
        sortOrder:'desc',
        fitColumns:true,//宽度自适应
        onLoadSuccess:function(rows){
            var showUserRows=$('#showUserList').datagrid('getRows');
            $.each(showUserRows,function(index,item){
                if(!item.manageflag||item.manageflag=='N'){
                    //delindexRow.push(index);
                    //$('#showUserList').datagrid('deleteRow',index);
                    //editIndex = $('#showUserList').datagrid('getRows').length-1;
                    if(!item.manageflag){
                        item.manageflag='N';
                    }
                    $('#showUserList').datagrid('beginEdit', index);
                }
            });
        },
        columns:[[
            {field:'manageflag',title:'是否有部门管理权限',sortable:true, 
                width:'20%',
                sorter:function (a,b) {
                    return (a.length<b.length?1:-1);
                },
                formatter: function(value,row,index){
                    if (value=='Y'){
                        return '是';
                    } else {
                        return '否';
                    }
                },
                editor : {
                    type : 'combobox',
                    options : {
                        valueField : 'manageflagID',
                        textField : 'manageflagNAME',
                        data : [{"manageflagID":"N","manageflagNAME":"否"},{"manageflagID":"Y","manageflagNAME":"是"}],
                        readonly : false,
                        onSelect : function(data) {
                            var rowindex = $(this).closest("[datagrid-row-index]").attr("datagrid-row-index");
                            var rows = $('#showUserList').datagrid('getRows')
                            var row = rows[rowindex];
                            row.manageflag=data.manageflagID;
                        },
                        editable : false,
                    },
                }
            },
            {field:'username',title:'用户名称',width:100},    
            {field:'netuserid',title:'用户ID',width:100},    
            {field:'usertypename',title:'用户类型',width:120},    
            {field:'mobile',title:'电话号码',width:100}     
        ]],
        onSortColumn: function (sort, order) {
            console.log("sort:"+sort+",order："+order+"");
        }
    });  
}
//保存
function openAddSave(node){
    var rows=$('#showUserList').datagrid('getRows')
    var iptname = $('#departmentname').val()
    var params = {
            departmentname:iptname,
            fatherdepartmentcode:node.id,
            departmentlevel:node.departmentlevel,
            departmentisleaf:'1',
            departmentpermissionList:[],
            netuserid:jcObj.userId
        }
    $.each(rows,function(index,item){
        let departmentpermissionList = params.departmentpermissionList
        let cardNumObj = {
            netuserid:item.netuserid,
            manageflag:item.manageflag
        }
        departmentpermissionList.push(cardNumObj)
    })
    $.ajax({
        url: bathPath +'/ipaddrmodule/departmentManage/saveTree',
        type:"POST",
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        success: function (res) {
            if(res.code == "0000"){
                let msgAlter = $.messager.alert('提示', res.tip, 'success');
                msgAlter.window({modal:true,onBeforeClose:function() {
                    $('#win').window('close');
                    nodeTree()
                }})

            }else if(res.code == "0001"){
                $.messager.alert('提示', res.tip, 'error');
            }
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        }
    })
}
//确认超级管理员用户
function getcodebook(node){
    console.log(node,'node');
    console.log(22222);
    $.ajax({
        url: bathPath +'/ipaddrmodule/SysCommon/getCodeBook?tablename=userinfo&columnname=netuserid',
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        success: function (res) {
            if(res.code == "0000"){
                getusers(node,res.data)
            }
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        }
    })
}
function getusers(node,data){
    let deplist = node.departmentpermissionList

    $.each(deplist,function(index,item){
        let name = item.netuserid
        $.each(data,function(idx,val){
        let code = val.CODE
            if(name !== code){
                var params={"netuserid":code};
                $.ajax({
                    url: encodeURI(bathPath +'/ipaddrmodule/IpPublicInterface/getUser'),
                    type:'POST',
                    data:JSON.stringify(params),
                    contentType: 'application/json;chartset=UTF-8',
                    success: function (res) {
                        if(res.code == "0000"){
                            $.each(res.data,function(idx,val){
                                deplist.push(val)
                            })
                        }
                    }
                })
            }
        })
    })

    console.log(deplist,'deplist添加后');
}
//修改回填
function backfill(node){
    let urlname = node.text
    $('#departmentname').val(urlname)
};
//修改接口
function updatetree(node){
    var rows=$('#showUserList').datagrid('getRows')
    var iptname = $('#departmentname').val()
    var params = {
            departmentcode:node.id,
            departmentname:iptname,
            departmentfullcode:node.departmentfullcode,
            departmentpermissionList:[],
            netuserid:jcObj.userId
        }

    $.each(rows,function(index,item){
        let departmentpermissionList = params.departmentpermissionList
        let cardNumObj = {
            departmentcode:node.id,
            netuserid:item.netuserid,
            manageflag:item.manageflag
        }
        departmentpermissionList.push(cardNumObj)
    })
    $.ajax({
        url: bathPath +'/ipaddrmodule/departmentManage/updateTree',
        type:"POST",
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        success: function (res) {
            if(res.code == "0000"){
                let msgAlter = $.messager.alert('提示', res.tip, 'success');
                msgAlter.window({modal:true,onBeforeClose:function() {
                    $('#win').window('close');
                    nodeTree()
                }})
            }else if(res.code == "0001"){
                $.messager.alert('提示', res.tip, 'error');
            }
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        }
    })
};

//点击删除确定按钮
function deleteNode(node){
    console.log(node,'node');
    var departmentfullcode=node.departmentfullcode;   //部门全编码
    var departmentcode=node.id;
    var netuserid=jcObj.userId;
    $.messager.confirm("提示", "您确定删除该条V4地址类型？", function (data) {
        if (data) {
            var delData={
                departmentfullcode:departmentfullcode, //部门全编码
                departmentcode:departmentcode,     //部门code
                netuserid:netuserid
            };
            //删除V4地址
            let deplist = node.departmentpermissionList

            if(node.id == netuserid){
                // DelIPTypeV4(delData);
                console.log('删除节点');
            }else{
                console.log('删除用户');

                // deluser(delData)
            }

        }
    });
}
//部门节点删除
function DelIPTypeV4(delData){
    $.ajax({
        type:"post",
        url:bathPath+"/ipaddrmodule/departmentManage/delTree",
        dataType:"json",
        contentType:"application/json",
        data:JSON.stringify(delData),
        success: function(res){
            if(res.code=="0000"){
                $.messager.alert('提示', '删除'+res.tip, 'success');
            }else{
                $.messager.alert('提示', res.tip, 'error');
            }
        }
    })
}
function deluser(delData){
    $.ajax({
        type:"post",
        url:bathPath+"/ipaddrmodule/departmentManage/delUser",
        dataType:"json",
        contentType:"application/json",
        data:JSON.stringify(delData),
        success: function(res){
            if(res.code=="0000"){
                $.messager.alert('提示', '删除'+res.tip, 'success');
            }else{
                $.messager.alert('提示', res.tip, 'error');
            }
        }
    })
}

//点击取消工作框
$(document).on("click","body",function (){
    $(".tooptip").offset({top: 0, left: 0});
    $(".tooptip").hide();
})

//获取节点的全编码
Array.prototype.contains = function ( needle ){
  for (i in this) {
    if (this[i].id == needle.id) return true;
  }
  return false;
}
