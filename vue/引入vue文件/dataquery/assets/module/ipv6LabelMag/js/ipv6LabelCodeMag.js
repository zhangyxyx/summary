$(function(){
    //url参数处理
    var urlObj = new UrlSearch();
    LableId = urlObj.LableId;
    BitLength = urlObj.BitLength;
    $("#labelName").val(urlObj.LableName);
    $("#bitLength").val(urlObj.BitLength);
    getlabelCodeList();//初始化查询信息
    initInquireBtnEvent();//查询点击事件初始化
    initAddLabelCodeBtnEvent();//新增按钮初始化
    // $(window.parent.$(".iframecontainer").eq(1).find('iframe'))[0].contentWindow.getlabelList
});
var curlPath = window.document.location.href;
var pathName=window.document.location.pathname;
var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1); 
var tempName = "/ipaddrmodule";//当前文件的跟目录
var bathPath = "";
if(projectName == tempName){
	projectName = "";
}else{
	bathPath = curlPath.substring(0, pathName.indexOf('/'))+projectName;
}
//bathPath = "";//环境上需要注释掉
var LableId = '';//标签标识
var BitLength = '';
var isEdit = false;//是否是修改状态
var LableCodeNameOld = '';//修改前的编码名称
//初始化查询按钮事件
function initInquireBtnEvent(){
    $("#codeInquireBtn").click(function(){
        getlabelCodeList();
    })
}

//初始化新增按钮事件
function initAddLabelCodeBtnEvent(){
    $("#addLabelCodeBtn").click(function(){
        isEdit = false;
        editLabelInfo();
    })
}
// 判断数组中是否有重复
function isRepeat(arr) {
    var hash = {};
    for (var i in arr) {
        if (hash[arr[i]]){
            return true; 
        }
        hash[arr[i]] = true;
    }
    return false;
}
//确认
function initSubmitEvent(LableCodeName){
    $("#submitBtn").click(function(){
        //调用接口
        if(isEdit){//修改
            var LableCodeName = $("#editLableCodeName").val(); 
            if(LableCodeName == ""){
                $.messager.alert('提示','标识编码名称不能为空!','error');
                return;
            }
            var params = {
                LableCodeNameOld:LableCodeNameOld,
                LableCodeName:LableCodeName,
                LableId:LableId,
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/ModNormalCodeName'),
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
                        getlabelCodeList();//刷新数据
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
            var LableCodeName = $("#editLableCodeName").val(); 
            var editHexadecimalCode = $("#editHexadecimalCode").val();
            //校验
            if(LableCodeName == ""){
                $.messager.alert('提示','标识编码名称不能为空!','error');
                return;
            }
            if(editHexadecimalCode == ""){
                $.messager.alert('提示','十六进制编码名称不能为空!','error');
                return;
            }
            if(isRepeat(editHexadecimalCode.split(','))){
                $.messager.alert('提示','十六进制编码不能输入相同的!','error');
                return;
            }
            //判断十六进制编码是否符合要求
            var flag = checkHexCode(editHexadecimalCode.replace(":",""));
            if(!flag){
                return
            }
            //拆分十六进制编码
            var hexCodeArr = hexCodeFormat(editHexadecimalCode);
            var dataList = [];
            for(var i = 0;i < hexCodeArr.length;i++){
                dataList.push({
                    SeqId:'',
                    LableCodeName:LableCodeName,
                    HexadecimalCode:hexCodeArr[i].toUpperCase(),
                    BinaryCode:hex_to_bin(hexCodeArr[i]),
                    LableId:LableId,
                    Remarks:''
                })
            }
            var params = {
                LableId:LableId,
                dataList:dataList
            }
            console.log(params);
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/AddNormalCodeList'),
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
                        $.messager.alert('提示','新增成功！','success');
                        $(".layui-layer-close").click();
                        getlabelCodeList();//刷新数据
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

//获取标识编码数据
function getlabelCodeList(){
    let params = {
        LableId:LableId,
        LableCodeName:$("#labelCodeName").val(),    
    };
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/GetNormalCodeMngList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            let tableData = obj.data?obj.data:[];
            //数据处理，根据十六进制编码生成二进制编码
            for(var i = 0;i < tableData.length;i++){
                // tableData[i].HexadecimalCode = dealHex(tableData[i].HexadecimalCode,BitLength/4)
                tableData[i].BinaryCode = hex_to_bin(tableData[i].HexadecimalCode);
            }
            loadLabelCodeTable(tableData);
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//加载标识表格数据
function loadLabelCodeTable(tableData){
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData=[[
        // {field:'ck',checkbox:true},
        {field:'LableCodeName', title: '编码名称',align:'center',width:100},
        {field:'HexadecimalCode',  title: '十六进制编码',align:'center',width:100},
        {field:'BinaryCode', title: '二进制编码',align:'center',width:100},
        {field:'operate',title: '操作',align:'center',width:50,
        formatter:function(value,row,index){
            return "<a class='operateBtn' onclick=\"editLabelCodeInfoEvent(\'"+row.LableCodeName+"\')\">修改</a><a style='color:#f40;margin-left:15px' class='operateBtn' onclick=\"delLabelCodeInfoEvent(\'"+row.LableCodeName+"\',\'"+row.HexadecimalCode+"\',\'"+row.BinaryCode+"\',\'"+row.Remarks+"\')\">删除</a>";
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

//修改标识编码
function editLabelCodeInfoEvent(LableCodeName){
    isEdit = true;
    LableCodeNameOld = LableCodeName;
    editLabelInfo(LableCodeName);
}

//编辑状态下弹出层信息
function editLabelInfo(LableCodeName){
    //打开弹出层
    var layer = layui.layer;
    var layerTitle = '';
    if(LableCodeName){//修改
        layerTitle = "修改标识编码名称";
    }else{//新增
        layerTitle = "新增标识编码";
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
    if(LableCodeName){//修改时赋值
        $("#editLableCodeName").val(LableCodeName);
    }else{//新增
        $("#editBitLength").val(BitLength);
    }
    //初始化编辑按钮事件
    initSubmitEvent(LableCodeName);
    initCloseEvent();
}

//新增、修改弹出层内容
function initLayerContent(){
    //动态生成弹出层元素
    let content = '';
    content += ' <form class="layui-form" action="">';
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label layui-required">编码名称</label>'
    content += '<div class="layui-input-inline">'
    content += '<input type="text"  placeholder="请输入" class="layui-input" id="editLableCodeName">'
    content += '</div>'
    content += '</div>'
    content += '</div>'
    if(!isEdit){//新增
        content += '<div class="layui-form-item">'
        content += '<div class="layui-inline editItem">'
        content += '<label class="layui-form-label">bit长度</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text"  placeholder="请输入" class="layui-input" id="editBitLength" readonly>'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-form-item">'
        content += '<div class="layui-inline editItem">'
        content += '<label class="layui-form-label layui-required">十六进制编码</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text"  placeholder="请输入" class="layui-input" id="editHexadecimalCode" onblur="inputBlurEvent()">'
        content += '</div>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-form-item">'
        content += '<div class="layui-inline editItem">'
        content += '<label class="layui-form-label layui-required">二进制编码</label>'
        content += '<div class="layui-input-inline">'
        content += '<input type="text"  placeholder="先输入十六进制编码，依据其自动生成" class="layui-input" id="editBinaryCode" readonly>'
        content += '</div>'
        content += '</div>'
        content += '</div>'
    }
    content += '</form>'
    content += '<div class="editBtnBox">'
    content += '<button class="btnItem" id="submitBtn">确定</button>'
    content += '<button class="closeBtn" id="closeBtn">关闭</button>'
    content += '</div>';
    return content;
}

//十六进制编码输入框失去焦点事件
function inputBlurEvent(){
    var flag = checkHexCode($("#editHexadecimalCode").val().replace(":",""));
    if(flag){//十六进制转二进制
        $("#editBinaryCode").val(hex_to_bin($("#editHexadecimalCode").val()))
    }
}

//删除标识编码信息
function delLabelCodeInfoEvent(LableCodeName,HexadecimalCode,BinaryCode,Remarks){
    $.messager.confirm('标识删除', '是否确认删除当前的标识信息?', function(flag){
        if (flag){
            var dataList = [];
            //拆分十六进制编码
            var hexCodeArr = hexCodeFormat(HexadecimalCode);
            for(var i = 0;i < hexCodeArr.length;i++){
                dataList.push({
                    LableCodeName:LableCodeName,
                    HexadecimalCode:hexCodeArr[i].toUpperCase(),
                    BinaryCode:hex_to_bin(hexCodeArr[i]),
                    LableId:LableId,
                    Remarks:Remarks
                })
            }
            var params = {
                LableId:LableId,
                dataList:dataList
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/DelNormalCodeList'),
                type:'POST',
                data:JSON.stringify(params),
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
                        getlabelCodeList();//刷新数据
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

//JS获取url地址栏参数值
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
// 十六进制补0 
function dealHex(str,len) {
    let value=""
    if(str.indexOf(",") == -1&&str.indexOf("-") == -1){//十六进制不存在英文逗号和-
        console.log((Array(len).join(0) + str).slice(-len))
       
        return (Array(len).join(0) + str).slice(-len)  
    }else if(str.indexOf(",") != -1&&str.indexOf("-") == -1){//十六进制存在英文逗号,不存在-
        var codeArr = str.split(',');
        for(var k = 0 ;k < codeArr.length;k ++){
            value += (Array(len).join(0) + codeArr[k]).slice(-len)
            if(k < codeArr.length-1){//最后一个不用拼接逗号
                value += ',';
            }
        }
        console.log(value)
        return value
    }else if(str.indexOf(",") == -1&&str.indexOf("-") != -1){//十六进制存-,不存在英文逗号
        var codeArr = str.split('-');
        for(var k = 0 ;k < codeArr.length;k ++){
            value += (Array(len).join(0) + codeArr[k]).slice(-len)
            if(k < codeArr.length-1){//最后一个不用拼接逗号
                value += '-';
            }
        }
        
        return value
    }else{//都存在
        //首先根据英文逗号分隔
        var codeArr = str.split(',');
        for(var k = 0 ;k < codeArr.length;k ++){
            if(codeArr[k].indexOf('-') != -1){//存在-
                var codeItem = codeArr[k].split('-');//拆分成两块
                for(var h = 0;h < codeItem.length;h++){
                    value += (Array(len).join(0) + codeItem[h]).slice(-len)
                    if(h < codeItem.length-1){//最后一个不用拼接-
                        value += '-';
                    }
                }
            }else{
                value += (Array(len).join(0) + codeArr[k]).slice(-len)
            }
            if(k < codeArr.length-1){//最后一个不用拼接逗号
                value += ',';
            }
        }
        return value
    }
}
//十六进制转二进制
function hex_to_bin(str) {
    let hex_array = [{key:0,val:"0000"},{key:1,val:"0001"},{key:2,val:"0010"},{key:3,val:"0011"},{key:4,val:"0100"},{key:5,val:"0101"},{key:6,val:"0110"},{key:7,val:"0111"},
        {key:8,val:"1000"},{key:9,val:"1001"},{key:'a',val:"1010"},{key:'b',val:"1011"},{key:'c',val:"1100"},{key:'d',val:"1101"},{key:'e',val:"1110"},{key:'f',val:"1111"}]

    let value=""
    if(str.indexOf(",") == -1&&str.indexOf("-") == -1){//十六进制不存在英文逗号和-
        for(let i=0;i<str.length;i++){
            for(let j=0;j<hex_array.length;j++){
                if(str.charAt(i).toLowerCase()== hex_array[j].key){
                    value = value.concat(hex_array[j].val)
                    break
                }
            }
        }
        return value
    }else if(str.indexOf(",") != -1&&str.indexOf("-") == -1){//十六进制存在英文逗号,不存在-
        var codeArr = str.split(',');
        for(var k = 0 ;k < codeArr.length;k ++){
            for(let i=0;i<codeArr[k].length;i++){
                for(let j=0;j<hex_array.length;j++){
                    if(codeArr[k].charAt(i).toLowerCase()== hex_array[j].key){
                        value = value.concat(hex_array[j].val)
                        break
                    }
                }
            }
            if(k < codeArr.length-1){//最后一个不用拼接逗号
                value += ',';
            }
        }
        return value
    }else if(str.indexOf(",") == -1&&str.indexOf("-") != -1){//十六进制存-,不存在英文逗号
        var codeArr = str.split('-');
        for(var k = 0 ;k < codeArr.length;k ++){
            for(let i=0;i<codeArr[k].length;i++){
                for(let j=0;j<hex_array.length;j++){
                    if(codeArr[k].charAt(i).toLowerCase()== hex_array[j].key){
                        value = value.concat(hex_array[j].val)
                        break
                    }
                }
            }
            if(k < codeArr.length-1){//最后一个不用拼接逗号
                value += '-';
            }
        }
        return value
    }else{//都存在
        //首先根据英文逗号分隔
        var codeArr = str.split(',');
        for(var k = 0 ;k < codeArr.length;k ++){
            if(codeArr[k].indexOf('-') != -1){//存在-
                var codeItem = codeArr[k].split('-');//拆分成两块
                for(var h = 0;h < codeItem.length;h++){
                    for(let i=0;i<codeItem[h].length;i++){
                        for(let j=0;j<hex_array.length;j++){
                            if(codeItem[h].charAt(i).toLowerCase()== hex_array[j].key){
                                value = value.concat(hex_array[j].val)
                                break
                            }
                        }
                    }
                    if(h < codeItem.length-1){//最后一个不用拼接-
                        value += '-';
                    }
                }
            }else{
                for(let i=0;i<codeArr[k].length;i++){
                    for(let j=0;j<hex_array.length;j++){
                        if(codeArr[k].charAt(i).toLowerCase()== hex_array[j].key){
                            value = value.concat(hex_array[j].val)
                            break
                        }
                    }
                }
            }
            if(k < codeArr.length-1){//最后一个不用拼接逗号
                value += ',';
            }
        }
        return value
    }
}

//拆分十六进制编码
function hexCodeFormat(str){
    var codeArr = [];
    if(str.indexOf(",") == -1&&str.indexOf("-") == -1){//十六进制不存在英文逗号和-
        codeArr.push(str);
    }else if(str.indexOf(",") != -1&&str.indexOf("-") == -1){//十六进制存在英文逗号,不存在-
        codeArr = str.split(",");
    }else if(str.indexOf(",") == -1&&str.indexOf("-") != -1){//十六进制存-,不存在英文逗号
        var strArr = str.split('-').map(item=>{//转化为十进制
            return parseInt(item,16);
        })
        var startCode = strArr[0];
        var endCode = strArr[1];
        var zero = '0000000000000000';//补0
        //遍历生成所有的十六进制
        for(var i = startCode;i <= endCode;i ++){
            var hexCode = i.toString(16).toUpperCase();
            var tmp = str.split("-")[0].length - hexCode.length;
            codeArr.push(zero.substr(0,tmp) + hexCode);
        }
    }else{//都存在
       var strArr = str.split(',');
       for(var i = 0 ;i < strArr.length;i ++){
            if(strArr[i].indexOf("-") != -1){
                var strItem = strArr[i].split("-").map(item=>{//转化为十进制
                    return parseInt(item,16);
                })
                var startCode = strItem[0];
                var endCode = strItem[1];
                var zero = '0000000000000000';//补0
                //遍历生成所有的十六进制
                for(var j = startCode;j <= endCode;j ++){
                    var hexCode = j.toString(16).toUpperCase();
                    var tmp = strArr[i].split("-")[0].length - hexCode.length;
                    codeArr.push(zero.substr(0,tmp) + hexCode);
                }
            }else{
                codeArr.push(strArr[i])
            }
       }
    }
    return codeArr;
}

//十六进制编码校验
function checkHexCode(str){
    var num = BitLength/4;
    var flag = true;//判断校验是否正确
    // 创建正则表达式
    var regExp = new RegExp(eval("/^[0-9a-fA-F]$/"));
    if(str.indexOf(",") == -1&&str.indexOf("-") == -1){//单个编码
        //先判断编码是否正确
        for(var i = 0;i < str.length;i++){
            if(!regExp.test(str.charAt(i))){
                $.messager.alert('提示','请输入正确的十六进制编码!','error');
                flag = false;
                return flag;
            }
        }
        if(str.length != num ){
            $.messager.alert('提示','十六进制编码需要符合bit长度!','error');
            flag = false;
            return flag;
        }
    }else if(str.indexOf(",") != -1&&str.indexOf("-") == -1){//多个编码
        let strArr = str.split(',');
        for(var i = 0;i < strArr.length;i++){
            for(var j = 0;j < strArr[i].length;j++){
                if(!regExp.test(strArr[i].charAt(j))){
                    $.messager.alert('提示','请输入正确的十六进制编码!','error');
                    flag = false;
                    return flag;
                }
            }
            if(strArr[i].length != num ){
                $.messager.alert('提示','十六进制编码需要符合bit长度!','error');
                flag = false;
                return flag;
            }
        }
    }else if(str.indexOf(",") == -1&&str.indexOf("-") != -1){//连续编码段
        let strArr = str.split('-');
        var strItem = strArr.map(item=>{//转化为十进制
            return parseInt(item,16);
        })
        var start = strItem[0];
        var end = strItem[1];
        if(start >= end){
            $.messager.alert('提示','连续编码段中结束编码需要大于起始编码!','error');
            flag = false;
            return flag;
        }
        for(var i = 0;i < strArr.length;i++){
            for(var j = 0;j < strArr[i].length;j++){
                if(!regExp.test(strArr[i].charAt(j))){
                    $.messager.alert('提示','请输入正确的十六进制编码!','error');
                    flag = false;
                    return flag;
                }
            }
            if(strArr[i].length != num ){
                $.messager.alert('提示','十六进制编码需要符合bit长度!','error');
                flag = false;
                return flag;
            }
        }
    }
    return flag;
}