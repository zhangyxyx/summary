$(function(){
    getlabelList();//初始化查询信息
    initInquireBtnEvent();
    initAddLabelBtnEvent();
});
var curlPath = window.document.location.href;
var pathName=window.document.location.pathname;
var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1); 
var tempName="/ipaddrmodule";//当前文件的跟目录
var bathPath="";
if(projectName==tempName){
	projectName="";
}else{
	bathPath=curlPath.substring(0, pathName.indexOf('/'))+projectName;
}
//bathPath = "";//环境上需要注释掉
var isEdit = false;//是否是修改状态
//初始化查询按钮事件
function initInquireBtnEvent(){
    $("#inquireBtn").click(function(){
        getlabelList();
    })
}

//初始化新增按钮事件
function initAddLabelBtnEvent(){
    $("#addLabelBtn").click(function(){
        editLabelInfo();
        isEdit = false;
    })
}
//确认
function initSubmitEvent(row){
    $("#submitBtn").click(function(){
        var LableName = $("#editLabelName").val();
        var BitLength = $("#editBitLength").val();
        var LableColor = $("#editLableColor").val();
        var Remarks = $("#editRemarks").val();
        var isRelatedNode =$("input[name='nodeRelated']:checked").val();
        if(LableName == ""){
            $.messager.alert('提示','标识名称不能为空!','error');
            return;
        }
        if(BitLength == ""){
            $.messager.alert('提示','bit长度不能为空!','error');
            return;
        }
        //bit长度校验
        if(!(/(^[1-9]\d*$)/.test(BitLength))){
            $.messager.alert('提示','bit长度必须为正整数!','error');
            return;
        }
        if(BitLength%4 != 0){
            $.messager.alert('提示','bit长度必须为4的倍数!','error');
            return;
        }
        if(BitLength > 44){
            $.messager.alert('提示','bit长度不得大于44!','error');
            return;
        }
        if(LableColor == ""){
            $.messager.alert('提示','标识颜色不能为空!','error');
            return;
        }
        if(LableColor.indexOf("#") == -1||LableColor.length != 7){
            $.messager.alert('提示','标识颜色不正确!','error');
            return;
        }
        //调用接口
        if(isEdit){//修改
            var params = {
                LableId:row.LableId,//新增时为空
                LableName:LableName,
                BitLength:BitLength,
                LableColor:LableColor.toUpperCase(),
                Remarks:Remarks,
                isModify:row.isModify,
                isDelete:row.isDelete,
                isNecessary:row.isNecessary,
                CodeTableName:row.CodeTableName,
                isRelatedNode:isRelatedNode,
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableMng/ModIpv6Lable'),
                type:'POST',
                data:JSON.stringify(params),
                dataType:'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '加载中...',
                        text: ''
                    });
                },
                success:function(obj){
                    if(obj.code == "0000"){
                        $.messager.alert('提示','修改成功！','success');
                        $(".layui-layer-close").click();
                        getlabelList();//刷新数据
                    }else{
                        $.messager.alert('提示','修改失败!'+obj.tip,'error');
                    }
                },
                error:function(error){
                    $.messager.progress('close');
                    $.messager.alert('提示','接口调用失败!','error');
                },
                complete:function(){
                    $.messager.progress('close');
                }
            });
        }else{//新增
            var params = {
                LableId:'',//新增时为空
                LableName:LableName,
                BitLength:BitLength,
                LableColor:LableColor.toUpperCase(),
                Remarks:Remarks,
                isModify:1,
                isDelete:1,
                isNecessary:1,
                CodeTableName:'IPv6LableCode',
                isRelatedNode:isRelatedNode,
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableMng/AddIpv6Lable'),
                type:'POST',
                data:JSON.stringify(params),
                dataType:'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '加载中...',
                        text: ''
                    });
                },
                success:function(obj){
                    if(obj.code == "0000"){
                        // getlabelList();//刷新数据
                        $.messager.progress('close');
                        $.messager.alert('提示','新增成功！','success', function () {
                            getlabelList()
                        });
                        $(".layui-layer-close").click();
                        // window.open('views/jsp/ipv6LabelMag/ipv6LabelCodeMag.jsp?LableId='+obj.data.LableId+'&LableName='+obj.data.LableName+'&BitLength='+obj.data.BitLength);
                        window.top.$vm.$openTab({
                            name: 'IPv6通用标识编码管理',
                            path:bathPath+'/ipaddrmodule/views/jsp/ipv6LabelMag/ipv6LabelCodeMag.jsp?LableId='+obj.data.LableId+'&LableName='+obj.data.LableName+'&BitLength='+obj.data.BitLength
                        }) 
                        
                    }else{
                        $.messager.alert('提示','新增失败!'+obj.tip,'error');
                    }
                },
                error:function(error){
                    $.messager.progress('close');
                    $.messager.alert('提示','接口调用失败!','error');
                },
                complete:function(){
                    $.messager.progress('close');
                }
            });
        }
    })
}
//关闭
function initCloseEvent(){
    $("#closeBtn").click(function(){
        $(".layui-layer-close").click();
    })
}

//获取标识数据
function getlabelList(){
    let params = {
        LableId:'',
        LableName:$("#labelName").val(),    
    };
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableMng/GetLableList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            let tableData = obj.data;
            if(obj.data == undefined){
                tableData = []
            }else{
                //Remarks字段处理
                for(var i = 0;i < tableData.length;i++){
                    if(tableData[i].Remarks == undefined){
                        tableData[i].Remarks = '';
                    }
                }
            }
            loadLabelTable(tableData);
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//加载标识表格数据
function loadLabelTable(tableData){
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData=[[
        {field:'LableName', title: '标识名称',align:'center',width:100},
        {field:'LableColor', title: '标识颜色',align:'center',width:100,
        formatter:function(value,row,index){
            return '<div style="height:24px;background-color:'+value+'"></div>'
        }},
        {field:'BitLength',  title: 'bit长度',align:'center',width:50},
        {field:'oriIpTypeName', title: '编码定义',align:'center',width:50,
        formatter:function(value,row,index){
            return "<a class='operateBtn' onclick=editLabelCodeEvent(\'"+row.LableId+"\',\'"+row.LableName+"\',\'"+row.BitLength+"\',\'"+row.CodeTableName+"\')>编辑</a>";
        }},
        {field:'Remarks', title: '说明',align:'left',width:140},
        {field:'operate',title: '操作',align:'center',width:50,
        formatter:function(value,row,index){
            var html = '<div class="operateBtnBox">';
            var rowStr = JSON.stringify(row);
            if(row.isModify == 1){
                html += "<div class='operateItem'><a class='operateBtn' onclick=\"editLabelInfoEvent('"+row.LableId+"','"+row.LableName+"','"+row.BitLength+"','"+row.LableColor+"','"+row.Remarks+"','"+row.isModify+"','"+row.isDelete+"','"+row.isNecessary+"','"+row.CodeTableName+"','"+row.isRelatedNode+"')\">修改</a></div>"
            }else{
                // html += "<div class='operateItem'></div>"
            }
            if(row.isDelete == 1){
                html += "<div class='operateItem'><a style='color:#f40' class='operateBtn' onclick=delLabelInfoEvent(\'"+row.LableId+"\')>删除</a></div>"
            }else{
                // html += "<div class='operateItem'></div>"
            }
            if(row.isRelatedNode == '1'){
                html += "<div class='operateItem'><a  class='operateBtn' onclick=goNodeRelated(\'"+row.LableId+"','"+row.LableName+"','"+row.BitLength+"\')>关联节点</a></div>"
            }else{
                // html += "<div class='operateItem'></div>"
            }
            html += '</div>';
            return html
        }}
    ]];
    var tableId="dataList";
    var tableH=$(".tablePanel").height();
    var opt={
        columnsData:columnsData,
        data:tableData,
        tableH:tableH,
        NofilterRow:true,
        tableOpt:{
            pagination:true//分页
        }
    };
    relatedTable(tableId,opt);
}

//编辑状态下弹出层信息
function editLabelInfo(row){
    //打开弹出层
    var layer = layui.layer;
    var layerTitle = '';
    if(row){//修改
        layerTitle = "修改标识信息";
    }else{//新增
        layerTitle = "新增标识信息";
    }
    layer.open({
        type: 1, 
        title:[layerTitle, 'text-align: center;'],
        area: ['40%', 'auto'],
        offset: '150px',
        content: initLayerContent(),
        cancel: function(index, layero){ 
           
        }
    });
    var defaultColor = '#1c97f5';
    if(row){//修改时赋值
        $("#editLabelName").val(row.LableName);
        $("#editBitLength").val(row.BitLength);
        $("#editBitLength").attr("readOnly","true");//设置为只读
        $("#editLableColor").val(row.LableColor);
        $("#editRemarks").val(row.Remarks);
        defaultColor = row.LableColor;
        $("input[name='nodeRelated']").removeAttr("checked");
        if(row.isRelatedNode == '1'){
            $("#yes").prop("checked", true);
        }else{
            $("#no").prop("checked", true);
        }
    }
    //颜色选择器初始化
    colorpicker = layui.colorpicker;
    colorpicker.render({
        elem: '#colorForm',
        color: defaultColor,
        size:'lg',
        done: function(color){
            $('#editLableColor').val(color);
        }
    });
    //初始化编辑按钮事件
    initSubmitEvent(row);
    initCloseEvent();
}

//新增、修改弹出层内容
function initLayerContent(){
    //动态生成弹出层元素
    let content = '';
    content += ' <form class="layui-form" action="">';
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label layui-required">标识名称</label>'
    content += '<div class="layui-input-inline">'
    content += '<input type="text"  placeholder="请输入" class="layui-input" id="editLabelName">'
    content += '</div>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label layui-required">bit长度</label>'
    content += '<div class="layui-input-inline">'
    content += '<input type="text"  placeholder="请输入" class="layui-input" id="editBitLength">'
    content += '</div>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editColorItem">'
    content += '<label class="layui-form-label layui-required">标识颜色</label>'
    content += '<div class="layui-input-inline">'
    content += '<input type="text" value="" placeholder="请选择颜色" class="layui-input" id="editLableColor">'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-inline editColorFrom">'
    content += '<div id="colorForm"></div>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label">是否关联组织节点</label>'
    content += '<div class="layui-input-inline" style="line-height: 30px;">'
    content += '<input type="radio" style="display:inline-block;width:21px" name="nodeRelated" checked="checked" class="nodeRelated"  id="no" value="0">否'
    content += '<input type="radio" style="display:inline-block;width:21px" name="nodeRelated"  class="nodeRelated"  id="yes" value="1">是'
    content += '</div>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label">标识说明</label>'
    content += '<div class="layui-input-inline">'
    content += '<textarea placeholder="请输入" class="layui-textarea" id="editRemarks"></textarea>'
    content += '</div>'
    content += '</div>'
    content += '</div>'
    content += '</form>'
    content += '<div class="editBtnBox">'
    content += '<button class="btnItem" id="submitBtn">确定</button>'
    content += '<button class="closeBtn" id="closeBtn">关闭</button>'
    content += '</div>';
    return content;
}

//标识编码定义
function editLabelCodeEvent(LableId,LableName,BitLength,CodeTableName){
    if(CodeTableName == "IPv6LableCode"){//通用标识
        // window.open('views/jsp/ipv6LabelMag/ipv6LabelCodeMag.jsp?LableId='+LableId+'&LableName='+LableName+'&BitLength='+BitLength);
        window.top.$vm.$openTab({
            name: 'IPv6通用标识编码管理',
            path:bathPath+'/ipaddrmodule/views/jsp/ipv6LabelMag/ipv6LabelCodeMag.jsp?LableId='+LableId+'&LableName='+LableName+'&BitLength='+BitLength
        })
    }else if(CodeTableName == "IPv6CountyCode"){
        if(LableName == "省份标识"){
            // window.open('views/jsp/ipv6CodeMag/ipv6ProvinceCodeMag.jsp?LableId='+LableId+'&LableName='+LableName+'&BitLength='+BitLength);
            window.top.$vm.$openTab({
                name: 'IPv6省份标识编码管理',
                path:bathPath+'/ipaddrmodule/views/jsp/ipv6CodeMag/ipv6ProvinceCodeMag.jsp?LableId='+LableId+'&LableName='+LableName+'&BitLength='+BitLength
            })
        }else if(LableName == "区县标识"){
            // window.open('views/jsp/ipv6CodeMag/ipv6CountyCodeMag.jsp?LableId='+LableId+'&LableName='+LableName+'&BitLength='+BitLength);
            window.top.$vm.$openTab({
                name: 'IPv6区县标识编码管理',
                path:bathPath+'/ipaddrmodule/views/jsp/ipv6CodeMag/ipv6CountyCodeMag.jsp?LableId='+LableId+'&LableName='+LableName+'&BitLength='+BitLength
            })
        }
    }
    
}

//修改标识信息
function editLabelInfoEvent(LableId,LableName,BitLength,LableColor,Remarks,isModify,isDelete,isNecessary,CodeTableName,isRelatedNode){
    var row = {
        LableId:LableId,
        LableName:LableName,
        BitLength:BitLength,
        LableColor:LableColor,
        Remarks:Remarks,
        isModify:isModify,
        isDelete:isDelete,
        isNecessary:isNecessary,
        CodeTableName:CodeTableName,
        isRelatedNode:isRelatedNode
    }
    editLabelInfo(row);
    isEdit = true;
}

//删除标识信息
function delLabelInfoEvent(LableId){
    $.messager.confirm('标识删除', '是否确认删除当前的标识信息?', function(flag){
        if (flag){
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableMng/DelIpv6Lable?LableId='+LableId),
                type:'POST',
                data:{},
                dataType:'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '正在删除中...',
                        text: ''
                    });
                },
                success:function(obj){
                    if(obj.code == "0000"){
                        $.messager.alert('提示','删除成功！','success');
                        getlabelList();//刷新数据
                    }else{
                        $.messager.alert('提示','删除失败!'+obj.tip,'error');
                    }
                },
                error:function(error){
                    $.messager.progress('close');
                    $.messager.alert('提示','接口调用失败!','error');
                },
                complete:function(){
                    $.messager.progress('close');
                }
            });
        }
    });
}
    //跳转到关联节点页面
function goNodeRelated(LableId,LableName,BitLength){
    // window.open('views/jsp/ipv6LabelMag/lableNodeRelated.jsp?LableId='+LableId+'&LableName='+LableName+'&BitLength='+BitLength);
    window.top.$vm.$openTab({
        name: 'IPv6标识编码关联节点',
        path:bathPath+'/ipaddrmodule/views/jsp/ipv6LabelMag/lableNodeRelated.jsp?LableId='+LableId+'&LableName='+LableName+'&BitLength='+BitLength
    }) 
}