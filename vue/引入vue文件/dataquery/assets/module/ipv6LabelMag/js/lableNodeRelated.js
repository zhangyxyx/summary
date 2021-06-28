$(function() {
    //url参数处理
    var urlObj = new UrlSearch();
    LableId = urlObj.LableId;
    LableName = urlObj.LableName
    BitLength = urlObj.BitLength
    $("#lableText").text(LableName)
    $("#labelLen").text(BitLength)
    getNodeList();

});

var LableId = '';//标签标识
var LableName = '';
var BitLength = '';
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

// bathPath = "";//环境上需要注释掉
var userName = jQuery.ITE.getLoginName('loginName');//登录用户
console.log(userName)
var nodeCode = ''
var tableData = []
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
                        nodeCode = node.nodeCode
                        $("#nodeText").text(node.nodeName)
                        lableNodeRelatedList(node)
                    }

                }
            })
            var n = $('#tree').tree('find', nodeList[0].nodeCode);
            $('#tree').tree('select', n.target);

            nodeCode = nodeList[0].nodeCode
            $("#nodeText").text(nodeList[0].nodeName)
            lableNodeRelatedList()
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
//右侧IPv6标识编码与组织节点关联内容展示
function lableNodeRelatedList(){
    
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/Ipv6/Ipv6LableNodeRelated/queryLableNodeRelatedList'),
        type: 'post',
        cache: false,
        data: JSON.stringify({ LableId: LableId}),
        dataType: 'json',
        contentType: "application/json",
        success: function(obj) {
            console.log(obj.data)
            tableData = obj.data
            loadLabelTable(tableData);
        }
    });
}

//加载标识表格数据
function loadLabelTable(tableData){
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData=[[
        // { field: 'op1', title: '关联:', width: 30, align: 'center'},
        {
            field: 'op11', title:'<input id=\"relatedcheckbox\" type=\"checkbox\" style="margin: 3px 0 0 12px;float: left;" ><span>关联</span>', width: 40,align: 'center',
            formatter: function (value, row, rowIndex) {
                if(row.NodeName){
                    return ''
                }else{
                    return "<input type=\"checkbox\"  name=\"GL\" value=\"" + row.LableCodeName + "\"  style='margin-top:4px'>";
                }
            }
        },
        // { field: 'op2', title: '删除:', width: 30, align: 'center'},
        {
            field: 'op22', title: '<input id=\"deletecheckbox\" type=\"checkbox\"  style="margin: 3px 0 0 12px;float: left;"><span></span>删除</span>', width: 40,align: 'center',
            formatter: function (value, row, rowIndex) {
                if(row.NodeName){
                    return "<input type=\"checkbox\"  name=\"SC\"   value=\"" + row.LableCodeName + "\"  style='margin-top:4px' >";
                }else{
                    return ''
                }
            }
        },
        {field:'LableCodeName', title: '编码名称',align:'center',width:100},
        {field:'HexadecimalCode', title: '十六进制编码',align:'center',width:100,},
        {field:'BinaryCode',  title: '二进制编码',align:'center',width:100},
        {field:'NodeName', title: '已关联节点',align:'center',width:100,
        formatter:function(value,row,index){
            if(row.NodeName){
                return "<span>"+row.NodeName+"</span>";
            }else{
                return "";
            }
            
        }},
        {field:'operate',title: '操作',align:'center',width:100,
        formatter:function(value,row,index){
            var html = '<div class="operateBtnBox">';
            if(row.NodeName){
                html += "<div class='operateItem'><a style='color:#f40' class='operateBtn' onclick=delInfo(\'"+row.LableId+"','"+row.HexadecimalCode+"','"+row.NodeCode+"\')>删除</a></div>"
            }else{
                html += "<div class='operateItem'><a class='operateBtn' onclick=relatedInfo(\'"+row.LableId+"','"+row.HexadecimalCode+"\')>关联</a></div>"
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
            fitColumns:true,
            pagination:false,//分页
            checkOnSelect: false, 
            selectOnCheck: false,
        },
    };
    relatedTable(tableId,opt);
    initCheckbox()
}


//初始化表格多选框
function initCheckbox(){
    $("#relatedcheckbox").unbind();
    $("#deletecheckbox").unbind();

    $("input[name='GL']").unbind().bind("click", function () {
        //总记录数
        var totolrows = $("input[name='GL']").length;
        //选中的记录数
        var checkrows = $("input[name='GL']:checked").length;
        //全选
        if (checkrows == totolrows) {
            $("#relatedcheckbox").prop("checked", true);
        }
        else {
            $("#relatedcheckbox").prop("checked", false);
        }
          
        
        $("#relatedlist").val("");
        var items = $("input[name='GL']:checked");
        var result = "";
        $.each(items, function (index, item) {
            if(result){
                result = result + "," + item.value;
            }else{
                result = result + item.value;
            }
            

        });
        $("#relatedlist").val(result);


    });
    $("input[name='SC']").unbind().bind("click", function () {

        //总记录数
        var totolrows = $("input[name='SC']").length;
        //选中的记录数
        var checkrows = $("input[name='SC']:checked").length;

        if (checkrows == totolrows) {
            $("#deletecheckbox").prop("checked", true);
        }
        else {
            $("#deletecheckbox").prop("checked", false);
        }

        $("#deletelist").val("");
        var items = $("input[name='SC']:checked");
        var result = "";
        $.each(items, function (index, item) {
            if(result){
                result = result + "," + item.value;
            }else{
                result = result + item.value;
            }
        });
        $("#deletelist").val(result);

    });

     //全选
     $("#relatedcheckbox").click(function () {
        if ($(this).prop("checked")) {
            $("input[name='GL']").prop("checked", true);
        } else {
            $("input[name='GL']").prop("checked", false);
        }
        $("#relatedlist").val("");
        var items = $("input[name='GL']:checked");
        var result = "";
        $.each(items, function (index, item) {
            if(result){
                result = result + "," + item.value;
            }else{
                result = result + item.value;
            }
        });
        $("#relatedlist").val(result);
    });
    $("#deletecheckbox").click(function () {
        if ($(this).prop('checked')) {
            $("input[name='SC']").prop("checked", true);
        } else {
            $("input[name='SC']").prop("checked",false);
        }

        $("#deletelist").val("");
        var items = $("input[name='SC']:checked");
        var result = "";
        $.each(items, function (index, item) {
            if(result){
                result = result + "," + item.value;
            }else{
                result = result + item.value;
            }
        });
        $("#deletelist").val(result);
    });
}

//批量删除选中行
function delInfoList(){
    console.log($("#deletelist").val().split(','))
    if($("#deletelist").val() == ''){
        $.messager.alert('提示','未选择要删除的标识编码！','error');
    }else{
        $.messager.confirm('删除', '是否确认删除当前的选中信息?', function(flag){
            if (flag){
                var relatedlistArr = [];
                var deletelist = $("#deletelist").val().split(',')
                //拆分十六进制编码
                for(var i = 0;i < deletelist.length;i++){
                    for(var j = 0;j < tableData.length;j++){
                        if(deletelist[i] == tableData[j].LableCodeName){
                            relatedlistArr.push({
                                LableId:tableData[j].LableId,
                                HexadecimalCode:tableData[j].HexadecimalCode,
                                NodeCode:tableData[j].NodeCode
                            })
                        }
                    }
                }
                var params = relatedlistArr
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableNodeRelated/batchDeleteLableNodeRelated'),
                    type:'POST',
                    data:JSON.stringify(params),
                    dataType:'json',
                    contentType: 'application/json',
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
                            lableNodeRelatedList();//刷新数据
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
}

//删除一行
function delInfo(LableId,HexadecimalCode,NodeCode){
    $.messager.confirm('删除', '是否确认删除当前行的信息?', function(flag){
        if (flag){

            var params = [{
                LableId:LableId,
                HexadecimalCode:HexadecimalCode,
                NodeCode:NodeCode
            }]
            console.log(params)
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableNodeRelated/batchDeleteLableNodeRelated'),
                type:'POST',
                data:JSON.stringify(params),
                dataType:'json',
                contentType: 'application/json',
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
                        lableNodeRelatedList();//刷新数据
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

//批量关联选中行
function relatedInfoList(){
    console.log($("#relatedlist").val().split(','))
    if($("#relatedlist").val() == ''){
        $.messager.alert('提示','未选择要关联的标识编码！','error');
    }else{
        $.messager.confirm('关联', '是否确认关联当前的选中信息?', function(flag){
            if (flag){
                var relatedlistArr = [];
                var relatedlist = $("#relatedlist").val().split(',')
                //拆分十六进制编码
                for(var i = 0;i < relatedlist.length;i++){
                    for(var j = 0;j < tableData.length;j++){
                        if(relatedlist[i] == tableData[j].LableCodeName){
                            relatedlistArr.push({
                                LableId:tableData[j].LableId,
                                HexadecimalCode:tableData[j].HexadecimalCode,
                                NodeCode:nodeCode
                            })
                        }
                    }
                }
                var params = relatedlistArr
                console.log(params)
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableNodeRelated/batchInsertLableNodeRelated'),
                    type:'POST',
                    data:JSON.stringify(params),
                    dataType:'json',
                    contentType: 'application/json',
                    beforeSend: function () {
                        $.messager.progress({
                            title: '提示',
                            msg: '正在关联中...',
                            text: ''
                        });
                    },
                    success:function(obj){
                        if(obj.code == "0000"){
                            $.messager.alert('提示','关联成功！','success');
                            lableNodeRelatedList();//刷新数据
                        }else{
                            $.messager.alert('提示','关联失败!'+obj.tip,'error');
                            lableNodeRelatedList();//刷新数据
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
}

//关联一行
function relatedInfo(LableId,HexadecimalCode){
    $.messager.confirm('删除', '是否确认关联当前行的信息?', function(flag){
        if (flag){
            var params = [{
                LableId:LableId,
                HexadecimalCode:HexadecimalCode,
                NodeCode:nodeCode
            }]
            console.log(params)
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6LableNodeRelated/batchInsertLableNodeRelated'),
                type:'POST',
                data:JSON.stringify(params),
                dataType:'json',
                contentType: 'application/json',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '正在关联中...',
                        text: ''
                    });
                },
                success:function(obj){
                    if(obj.code == "0000"){
                        $.messager.alert('提示','关联成功！','success');
                        lableNodeRelatedList();//刷新数据
                    }else{
                        $.messager.alert('提示','关联失败!'+obj.tip,'error');
                        lableNodeRelatedList();//刷新数据
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

////JS获取url地址栏参数值
function UrlSearch() {
    var name, value;
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?");
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = decodeURI(value);
        }
    }
}
