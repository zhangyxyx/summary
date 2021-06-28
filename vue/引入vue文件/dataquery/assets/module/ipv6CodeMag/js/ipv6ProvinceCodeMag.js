$(function(){
    //url参数处理
    var urlObj = new UrlSearch();
    LableId = urlObj.LableId;
    getProvinceCodeList();//初始化查询信息
    initInquireBtnEvent();//查询点击事件初始化
    initAddProvinceCodeBtnEvent();//新增按钮初始化
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
//初始化查询按钮事件
function initInquireBtnEvent(){
    $("#codeInquireBtn").click(function(){
        getProvinceCodeList();
    })
}

//初始化新增按钮事件
function initAddProvinceCodeBtnEvent(){
    $("#addProvinceCodeBtn").click(function(){
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
function initSubmitEvent(){
    $("#submitBtn").click(function(){
        var areaCode = $("#areaList").combobox('getValue');
        var editHexadecimalCode = $("#editHexadecimalCode").val();
        var editRemarks = $("#editRemarks").val();
        if(areaCode == ""){
            $.messager.alert('提示','请选择或者输入省份信息！','error');
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
        var flag = checkHexCode(editHexadecimalCode);
        if(!flag){
            return
        }
        if(areaCode == undefined){//省份不存在，需要先新增省份信息
            //随机生成一个省份编码
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/createProvAreaCode'),
                type:'POST',
                async:false,//同步
                data:{},
                dataType:'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function () {

                },
                success:function(obj){
                    var newAreaCode = obj.data;
                    let addParams = {
                        AreaCode:newAreaCode,
                        AreaName:$(".textbox-text").val(),
                        FatherAreaCode:'',
                        AreaFullCode:newAreaCode,
                        LevelFlag:1,
                    }
                    //调用省区域新增接口
                    $.ajax({
                        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/AddProvinceArea'),
                        type:'POST',
                        async:false,//同步
                        data:JSON.stringify(addParams),
                        dataType:'json',
                        contentType: 'application/json;chartset=UTF-8',
                        beforeSend: function () {
        
                        },
                        success:function(obj){
                            if(obj.code != "0000"){
                                $.messager.alert('提示','新增省区域信息失败，'+obj.tip,'error');
                                return;
                            }
                            //新增编码
                            addCodeInfo(newAreaCode);
                        },
                        error:function(error){
                            $.messager.alert('提示','接口调用失败','error');
                        },
                        complete:function(){
                        }
                    });
                },
                error:function(error){
                    $.messager.alert('提示','接口调用失败!','error');
                },
                complete:function(){
                }
            });
        }else{//选择已有省份
            addCodeInfo();
        }
    })
}
//新增编码
function addCodeInfo(newAreaCode){
    var areaCode = $("#areaList").combobox('getValue');
    var editHexadecimalCode = $("#editHexadecimalCode").val();
    var editRemarks = $("#editRemarks").val();
    //拆分十六进制编码
    var hexCodeArr = hexCodeFormat(editHexadecimalCode);
    var dataList = [];
    for(var i = 0;i < hexCodeArr.length;i++){
        dataList.push({
            AreaCode:newAreaCode?newAreaCode:areaCode,
            CountyHexadecimal:hexCodeArr[i].toUpperCase(),
            CountyBinary:hex_to_bin(hexCodeArr[i]),
            LableId:LableId,
            Remarks:editRemarks
        })
    }
    var params = {
        LableId:LableId,
        dataList:dataList
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/AddCountyCodeList'),
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
                getProvinceCodeList();//刷新数据
            }else{
                $.messager.alert('提示','新增失败，'+obj.tip,'error');
                initProvinceInfoList()
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

//关闭
function initCloseEvent(){
    $("#closeBtn").click(function(){
        $(".layui-layer-close").click();
    })
}

//获取省份编码数据
function getProvinceCodeList(){
    var AreaName = $("#areaName").val();
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetProvinceCodeMngList?AreaName='+AreaName),
        type:'POST',
        data:{},
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            let tableData = obj.data;
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
        {field:'AreaName', title: '省份名称',align:'center',width:100},
        {field:'CountyHexadecimal',  title: '十六进制编码',align:'center',width:100},
        {field:'CountyBinary', title: '二进制编码',align:'center',width:100},
        {field:'Remarks', title: '描述',align:'center',width:150},
        {field:'operate',title: '操作',align:'center',width:50,
        formatter:function(value,row,index){
            return "<a style='color:#f40' class='operateBtn' onclick=delProvinceCodeInfoEvent(\'"+row.AreaCode+"\',\'"+row.CountyHexadecimal+"\',\'"+row.CountyBinary+"\',\'"+row.Remarks+"\')>删除</a>";
        }}
    ]];
    var tableId="dataList";
    var tableH='auto';
    var opt={
        columnsData:columnsData,
        data:tableData,
        tableH:tableH,
        NofilterRow:true,
        tableOpt:{
            pagination:false//分页
        }
    };
    relatedTable(tableId,opt);
}

//编辑状态下弹出层信息
function editLabelInfo(){
    //打开弹出层
    var layer = layui.layer;
    layer.open({
        type: 1, 
        title:["新增省份编码", 'text-align: center;'],
        area: ['40%', 'auto'],
        offset: '150px',
        content: initLayerContent(),
        cancel: function(index, layero){ 
           
        }
    });
    //初始化编辑按钮事件
    initSubmitEvent();
    initCloseEvent();
    initProvinceInfoList();//省份信息
}

//初始化省份信息
function initProvinceInfoList(){
    let params = {
        AreaCode:'',
        LevelFlag:1,
        FatherAreaCode:'',
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetProvinceInfoList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
    
        },
        success:function(obj){
            var areaList = obj.data;
            var length = $(".length").width();
            $("#areaList").combobox({
                valueField:'AreaCode',
                textField:'AreaName',
                data:areaList,
                width:length,
                panelHeight: 'auto',//高度自适应
                multiple: false,
                editable:true,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    
                },
                filter: function(q, row){
                    var opts = $('#areaList').combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){//点击节点联动地址类型
                   
                }
            });
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//新增、修改弹出层内容
function initLayerContent(){
    //动态生成弹出层元素
    let content = '';
    content += ' <form class="layui-form" action="">';
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label layui-required">省份</label>'
    content += '<div class="layui-input-inline">'
    content += ' <input class="easyui-combobox"  id="areaList"/>'
    content += '</div>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label layui-required">十六进制编码</label>'
    content += '<div class="layui-input-inline length">'
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
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label">说明</label>'
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

//十六进制编码输入框失去焦点事件
function inputBlurEvent(){
    var flag = checkHexCode($("#editHexadecimalCode").val());
    if(flag){//十六进制转二进制
        $("#editBinaryCode").val(hex_to_bin($("#editHexadecimalCode").val()))
    }
}

//删除省份编码信息
function delProvinceCodeInfoEvent(AreaCode,CountyHexadecimal,CountyBinary,Remarks){
    $.messager.confirm('省份编码删除', '是否确认删除当前的省份编码信息?', function(flag){
        if (flag){
            var dataList = [];
            //拆分十六进制编码
            var hexCodeArr = hexCodeFormat(CountyHexadecimal);
            for(var i = 0;i < hexCodeArr.length;i++){
                dataList.push({
                    AreaCode:AreaCode,
                    CountyHexadecimal:hexCodeArr[i].toUpperCase(),
                    CountyBinary:hex_to_bin(hexCodeArr[i]),
                    LableId:LableId,
                    Remarks:Remarks
                })
            }
            var params = {
                LableId:LableId,
                dataList:dataList
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/DelCountyCodeList'),
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
                        getProvinceCodeList();//刷新数据
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
    var num = 2;
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