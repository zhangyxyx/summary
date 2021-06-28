$(function(){
    //url参数处理
    var urlObj = new UrlSearch();
    LableId = urlObj.LableId;
    getCountyCodeList();//初始化查询信息
    initInquireBtnEvent();//查询点击事件初始化
    initAddCountyCodeBtnEvent();//新增按钮初始化
    initImportBtnEvent();//导入
    exportCodeInfo();//导出
    freeCodeBtnClickEvent();//预留
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
var pagesize = 20;
var pageno = 1;
var total = 0;

//初始化查询按钮事件
function initInquireBtnEvent(){
    $("#codeInquireBtn").click(function(){
        getCountyCodeList();
    })
}

//初始化新增按钮事件
function initAddCountyCodeBtnEvent(){
    $("#addCountyCodeBtn").click(function(){
        editLabelInfo();
    })
}

//初始化表格分页
function initClickPageEvent(falg){
    $('#pagination').pagination({
        total:total,
        pageSize:pagesize,
        pageNumber:pageno,
        pageList:[20,30,40,50],
        onSelectPage:function(pageNumber, pageSize){
            pagesize = pageSize;
            pageno = pageNumber;
            getCountyCodeList();
        }
    });
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
        var provinceCode = $("#provinceList").combobox('getValue');
        var countyCode = $("#countyList").combobox('getValue');
        var areaCode = $("#areaList").combobox('getValue');
        var editHexadecimalCode = $("#editHexadecimalCode").val();
        if(provinceCode == ""){
            $.messager.alert('提示','请选择省份信息！','error');
            return;
        }
        if(countyCode == ""){
            $.messager.alert('提示','请选择或者输入地市信息！','error');
            return;
        }
        if(areaCode == ""){
            $.messager.alert('提示','请选择或者输入区县信息！','error');
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
        if(countyCode == undefined || areaCode == undefined){//地市区县不存在，需要先新增信息
            if(countyCode == undefined){//地市需要新增，区县也要新增
                //随机生成一个地市编码
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
                        var newCountyCode = obj.data;
                        let addCountyParams = {
                            AreaCode:newCountyCode,
                            AreaName:$(".textbox-text").eq(1).val(),
                            FatherAreaCode:provinceCode,
                            AreaFullCode:provinceCode+'.'+newCountyCode,
                            LevelFlag:2,
                        }
                        //调用省区域新增接口
                        $.ajax({
                            url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/AddProvinceArea'),
                            type:'POST',
                            async:false,//同步
                            data:JSON.stringify(addCountyParams),
                            dataType:'json',
                            contentType: 'application/json;chartset=UTF-8',
                            beforeSend: function () {
            
                            },
                            success:function(obj){
                                if(obj.code != "0000"){
                                    $.messager.alert('提示','新增地市信息失败，'+obj.tip,'error');
                                    return;
                                }else{
                                    //生成区县编码信息
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
                                            let addAreaParams = {
                                                AreaCode:newAreaCode,
                                                AreaName:$(".textbox-text").eq(2).val(),
                                                FatherAreaCode:newCountyCode,
                                                AreaFullCode:provinceCode+'.'+newCountyCode+'.'+newAreaCode,
                                                LevelFlag:3,
                                            }
                                            //调用省区域新增接口
                                            $.ajax({
                                                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/AddProvinceArea'),
                                                type:'POST',
                                                async:false,//同步
                                                data:JSON.stringify(addAreaParams),
                                                dataType:'json',
                                                contentType: 'application/json;chartset=UTF-8',
                                                beforeSend: function () {
                                
                                                },
                                                success:function(obj){
                                                    if(obj.code != "0000"){
                                                        $.messager.alert('提示','新增区县信息失败，'+obj.tip,'error');
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
                                }
                        
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
            }else{//地市存在，区县需要增加
                //随机生成一个区县编码
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
                            AreaName:$(".textbox-text").eq(2).val(),
                            FatherAreaCode:countyCode,
                            AreaFullCode:provinceCode+'.'+countyCode+'.'+newAreaCode,
                            LevelFlag:3,
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
                                    $.messager.alert('提示','新增区县信息失败，'+obj.tip,'error');
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
            }
        }else{//地市区县信息都是选择的
            addCodeInfo();
        }
    })
}

//新增编码
function addCodeInfo(newAreaCode){
    var areaCode = $("#areaList").combobox('getValue');
    var editHexadecimalCode = $("#editHexadecimalCode").val();
    //拆分十六进制编码
    var hexCodeArr = hexCodeFormat(editHexadecimalCode);
    var dataList = [];
    for(var i = 0;i < hexCodeArr.length;i++){
        dataList.push({
            AreaCode:newAreaCode?newAreaCode:areaCode,
            CountyHexadecimal:hexCodeArr[i].toUpperCase(),
            CountyBinary:hex_to_bin(hexCodeArr[i]),
            LableId:LableId,
            Remarks:''
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
                getCountyCodeList();//刷新数据
            }else{
                $.messager.alert('提示','新增失败，'+obj.tip,'error');
                // initProvinceInfoList("free");//省份信息
                var provinceCode = $("#provinceList").combobox('getValue')
                initCountyInfoList(provinceCode,2)
                initAreaInfoList('','')
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

//初始化导入按钮事件
function initImportBtnEvent(){
    $("#importCountyCodeBtn").click(function(){
        importCodeInfo();
    })
}

//初始化导入文件事件
function initImportBtnSubmitEvent(){
    $(".importBtn").click(function(){
        if($(this).val() == "导入"){
            //判断是否选择了需要导入的文件
            if($("input[name='FileName']").val()==""){
                $.messager.alert('提示','请选择需要导入的文件！','error');
                return;
            }
            //调用批量导入接口
            $("#importForm").ajaxSubmit({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/ImportCountyCodeFile'),
                type:'post',            
                datatype:'json',
                beforeSend: function () {
                    $.messager.progress({
                        title: '提示',
                        msg: '数据正在导入中，请稍候...',
                        text: ''
                    });
                },
                success:function(obj){  
                    if(obj.code == "0000"){
                        $.messager.progress('close');
                        $(".layui-layer-close").click();
                        $.messager.alert('提示',"导入成功！",'success');
                        getCountyCodeList();//刷新数据
                    }else{
                        $.messager.alert('提示',obj.msg,'error');
                        $.messager.progress('close');
                    }
                },
                error:function(error){
                    $.messager.alert('提示','接口调用失败!','error');
                    $.messager.progress('close');
                },
                complete:function(){
                    
                }
            });
        }else if($(this).val() == "模板下载"){
            window.open(bathPath+"/ipaddrmodule/itep/var/config/ipaddr/v6/Ipv6CountyCodeImportTemplate.xls");
        }else if($(this).val() == "关闭"){
            $(".layui-layer-close").click();
        }
    });
}

//导入展示信息
function importCodeInfo(){
    //动态生成弹出层元素
    let content = '';
    content += '<div class="importPanel">';
    content += '<form  id="importForm" class="importForm" method="post" enctype= "multipart/form-data">'
    content += '<input type="file" name="file" required="required"/>'
    content += '<input type="button" class="importBtn" id="btnSubmit" value="导入"/>'
    content += '<input type="button" class="importBtn" id="importBtn" value="模板下载"/>'
    content += '<input type="button" class="importBtn importCloseBtn" id="importCloseBtn" value="关闭"/>'
    content += '<span style="color:#f40">注释：导入文件请保存为97-2003版后再做上传</span>';
    content += '</form>'
    content += '</div>'
    //打开弹出层
    var layer = layui.layer;
    layer.open({
        type: 1, 
        title:['导入区县编码', 'text-align: center;'],
        area: ['70%', 'auto'],
        offset: '150px',
        content: content,
        cancel: function(index, layero){ 
           
        }
    });
    initImportBtnSubmitEvent();
}

//导出区县编码详细信息
function exportCodeInfo(){
    $("#exportCountyCodeBtn").click(function(){
        $.ajax({
            url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/ExportCountyCodeFile'),
            type:'get',
            data:{},
            cache:false,
            dataType:'json',
            beforeSend: function () {
                $.messager.progress({
                    title: '提示',
                    msg: '数据正在导出中，请稍候...',
                    text: ''
                });
            },
            success:function(obj){
                if(obj.code == "0000"){
                    let fileName = obj.data.split('IpManageCP-0.0.1')[1]
                    // let fileName = obj.data.replace('/slview/resinB3.1.6/webapps/IpManageCP-0.0.1', "");
                    console.log(fileName)
                    window.open(encodeURI(bathPath+fileName));
                }else{
                    $.messager.alert('提示',obj.tip,'error');
                }
            },
            error:function(error){
                $.messager.alert('提示','接口调用失败!','error');
            },
            complete:function(){
                $.messager.progress('close');
            }
        });
    })
}

//初始化预留编码按钮点击事件
function freeCodeBtnClickEvent(){
    $("#freeCountyInquireBtn").click(function(){
        //动态生成弹出层元素
        let content = '';
        content += ' <form class="layui-form" action="">';
        content += '<div class="layui-form-item">'
        content += '<div class="layui-inline freeItem">'
        content += '<label class="layui-form-label">省份</label>'
        content += '<div class="layui-input-inline length">'
        content += ' <input class="easyui-combobox"  id="provinceList"/>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-inline freeItem">'
        content += '<button type="button" class="btnItem" id="freeCodeInquireBtn">查询</button>'
        content += '</div>'
        content += '</div>'
        content += '</form>'
        content += '<div class="freeCodeBox">'
        content += '<table cellspacing="0" cellpadding="0" class="freeTable">'
        content += '<tbody class="tbody"></tbody>'
        content += '</table>'
        content += '</div>';

        //打开弹出层
        var layer = layui.layer;
        layer.open({
            type: 1, 
            title:['区县预留空编码', 'text-align: center;'],
            area: ['70%', 'auto'],
            offset: '80px',
            content: content,
            cancel: function(index, layero){ 
                
            }
        });
        initProvinceInfoList("free");//省份信息
        getCountyFreeCodeList();
    })
}

//区县编码新增页面初始化预留编码按钮点击事件(新增时，点击预留按钮)
function freeCodeEvent(){
    $("#freeCodeInuqireBtn").click(function(){
        var provinceCode = $("#provinceList").combobox('getValue');
        if(provinceCode == ""){
            $.messager.alert('提示','请先选择省份信息！','error');
            return;
        }
        //动态生成弹出层元素
        let content = '';
        content += ' <form class="layui-form" action="">';
        content += '<div class="layui-form-item">'
        content += '<div class="layui-inline freeItem">'
        content += '<label class="layui-form-label">省份</label>'
        content += '<div class="layui-input-inline freeLength">'
        content += ' <input class="easyui-combobox"  id="freeProvinceList"/>'
        content += '</div>'
        content += '</div>'
        content += '<div class="layui-inline freeItem">'
        content += '<button type="button" class="btnItem" id="freeCodeBtn">查询</button>'
        content += '</div>'
        content += '</div>'
        content += '</form>'
        content += '<div class="freeCodeBox">'
        content += '<table cellspacing="0" cellpadding="0" class="freeTable">'
        content += '<tbody class="tbody"></tbody>'
        content += '</table>'
        content += '</div>';

        //打开弹出层
        var layer = layui.layer;
        layer.open({
            type: 1, 
            title:['区县预留空编码', 'text-align: center;'],
            area: ['70%', 'auto'],
            offset: '150px',
            content: content,
            cancel: function(index, layero){ 
                
            }
        });
        initFreeProvinceInfoList(provinceCode);//省份信息
        getFreeCodeList();
    })
}

//获取区县预留空编码数据
function getCountyFreeCodeList(){
    $("#freeCodeInquireBtn").click(function(){
        var AreaCode = $("#provinceList").combobox('getValue');
        if(AreaCode == ""){
            $.messager.alert('提示','请选择省份信息！','error');
            return;
        }
        $.ajax({
            url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetFreeCountyCodeList?AreaCode='+AreaCode),
            type:'POST',
            data:{},
            dataType:'json',
            contentType: 'application/json;chartset=UTF-8',
            beforeSend: function () {
                
            },
            success:function(obj){
                var freeCodeList = obj.data;
                var rows = Math.ceil(freeCodeList.length/10);
                $('.tbody').html('');//清空
                for(var i = 0;i < rows;i++){
                    $('.tbody').append('<tr class="freeCodeItem"></tr>') //加一行
                    for(var j = 0;j < freeCodeList.length;j ++){
                        if(j >= i*20 && j < (i+1)*20){
                            $('.freeCodeItem').eq(i).append('<td>'+freeCodeList[j]+'</td>') //加一列
                        }
                    }
                }
                $(".layui-layer-content").css("height",'auto');
                if($(".freeCodeBox").height() > 320){
                    $(".freeCodeBox").addClass("overFlow")
                }
            },
            error:function(error){
                $.messager.alert('提示','接口调用失败!','error');
            },
            complete:function(){
            }
        });
    })
}

//获取区县预留空编码数据(新增时，点击预留按钮)
function getFreeCodeList(){
    $("#freeCodeBtn").click(function(){
        var AreaCode = $("#freeProvinceList").combobox('getValue');
        if(AreaCode == ""){
            $.messager.alert('提示','请选择省份信息！','error');
            return;
        }
        $.ajax({
            url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetFreeCountyCodeList?AreaCode='+AreaCode),
            type:'POST',
            data:{},
            dataType:'json',
            contentType: 'application/json;chartset=UTF-8',
            beforeSend: function () {
                
            },
            success:function(obj){
                var freeCodeList = obj.data;
                var rows = Math.ceil(freeCodeList.length/10);
                $('.tbody').html('');//清空
                for(var i = 0;i < rows;i++){
                    $('.tbody').append('<tr class="freeCodeItem"></tr>') //加一行
                    for(var j = 0;j < freeCodeList.length;j ++){
                        if(j >= i*10 && j < (i+1)*10){
                            $('.freeCodeItem').eq(i).append('<td>'+freeCodeList[j]+'</td>') //加一列
                        }
                    }
                }
                $(".layui-layer-content").css("height",'auto');
                if($(".freeCodeBox").height() > 250){
                    $(".freeCodeBox").addClass("overFlow")
                }
            },
            error:function(error){
                $.messager.alert('提示','接口调用失败!','error');
            },
            complete:function(){
            }
        });
    })
}

//获取区县编码数据
function getCountyCodeList(){
    var params = {
        AreaName:$("#areaName").val(),
        pagesize:pagesize,
        pageno:pageno
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetCountyCodeMngList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            let tableData = obj.data.rows;
            total = obj.data.total;
            //动态加区县序号
            var count = 0;
            for(var i = 0;i < tableData.length;i++){
                if(i < tableData.length-1){
                    if(tableData[i].FatherAreaName == tableData[i+1].FatherAreaName){
                        count ++;
                        tableData[i].num = count ;
                    }else{
                        count ++;
                        tableData[i].num = count ;
                        count = 0;
                    }
                }else{
                    count ++;
                    tableData[i].num = count ;
                }
            }
            loadLabelCodeTable(tableData);
            initClickPageEvent();
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
        {field:'ProvinceName', title: '省份名称',align:'center',width:100},
        {field:'FatherAreaName', title: '地市名称',align:'center',width:100},
        {field:'num', title: '序号',align:'center',width:30},
        {field:'AreaName', title: '区县名称',align:'center',width:100},
        {field:'CountyHexadecimal',  title: '十六进制编码',align:'center',width:100},
        {field:'CountyBinary', title: '二进制编码',align:'center',width:120},
        {field:'operate',title: '操作',align:'center',width:50,
        formatter:function(value,row,index){
            return "<a style='color:#f40' class='operateBtn' onclick=delCountyCodeInfoEvent(\'"+row.AreaCode+"\',\'"+row.CountyHexadecimal+"\',\'"+row.CountyBinary+"\')>删除</a>";
        }}
    ]];
    var tableId="dataList";
    var tableH=$(".tablePanel").height();;
    var opt={
        columnsData:columnsData,
        data:tableData,
        tableH:tableH,
        NofilterRow:true,
        tableOpt:{
            pagination:false//分页
        }
    };
    relatedTableFormat(tableId,opt);
}

//编辑状态下弹出层信息
function editLabelInfo(){
    //打开弹出层
    var layer = layui.layer;
    layer.open({
        type: 1, 
        title:["新增区县编码", 'text-align: center;'],
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
    // initCountyInfoList('','');//地市,无数据状态
    // initAreaInfoList('','');//区县,无数据状态
    var countyList = [];
    var length = $(".length").width();
    $("#countyList").combobox({
        valueField:'AreaCode',
        textField:'AreaName',
        data:countyList,
        width:length,
        panelHeight: 'auto',//高度自适应
        multiple: false,
        editable:true,//定义用户是否可以直接往文本域中输入文字
        //直接过滤，数据太多时不行，太卡了，放弃
        onLoadSuccess: function () {
            
        },
        filter: function(q, row){
            var opts = $('#countyList').combobox('options');
            return row[opts.textField].indexOf(q) != -1;
        },
        onSelect:function(row){//点击节点联动地址类型
        }
    })
    var areaList = [];
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
    freeCodeEvent();//查询预留
}

//初始化省份信息
function initProvinceInfoList(free){
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
            var provinceList = obj.data;
            var length = $(".length").width();
            $("#provinceList").combobox({
                valueField:'AreaCode',
                textField:'AreaName',
                data:provinceList,
                width:length,
                panelHeight: 'auto',//高度自适应
                multiple: false,
                editable:false,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    
                },
                filter: function(q, row){
                    if(!free){
                        initCountyInfoList('','');//省份信息过滤的时候，需要清空地市区县的信息
                        initAreaInfoList('','');
                    }
                    var opts = $('#provinceList').combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){//点击节点联动地址类型
                    if(!free){
                        initCountyInfoList(row.AreaCode,2);//联动对应地市信息
                    }
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

//初始化省份信息(新增时，点击预留按钮)
function initFreeProvinceInfoList(provinceCode){
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
            var provinceList = obj.data;
            var length = $(".freeLength").width();
            $("#freeProvinceList").combobox({
                valueField:'AreaCode',
                textField:'AreaName',
                data:provinceList,
                width:length,
                panelHeight: 'auto',//高度自适应
                multiple: false,
                editable:true,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    
                },
                filter: function(q, row){
                    
                    var opts = $('#freeProvinceList').combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){//点击节点联动地址类型
                    
                }
            });
            //默认值
            $('#freeProvinceList').combobox('setValue',provinceCode);
            $("#freeCodeBtn").click();
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//初始化地市信息
function initCountyInfoList(FatherAreaCode,LevelFlag){
    let params = {
        LevelFlag:2,
        FatherAreaCode:FatherAreaCode,
        AreaCode:'',
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetCityCountyInfoList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
    
        },
        success:function(obj){
            if(obj.data == undefined){
                var countyList = [];
            }else{
                var countyList = obj.data;
            }
            
            var length = $(".length").width();
            $("#countyList").combobox({
                valueField:'AreaCode',
                textField:'AreaName',
                data:countyList,
                width:length,
                panelHeight: 'auto',//高度自适应
                multiple: false,
                editable:true,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    
                },
                filter: function(q, row){
                    initAreaInfoList('','');//地市信息过滤的时候，需要清空区县的信息
                    var opts = $('#countyList').combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){//点击节点联动地址类型
                    initAreaInfoList(row.AreaCode,3);//联动对应区县信息
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

//初始化区县信息
function initAreaInfoList(FatherAreaCode,LevelFlag){
    let params = {
        LevelFlag:3,
        FatherAreaCode:FatherAreaCode,
        AreaCode:'',
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetCityCountyInfoList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
    
        },
        success:function(obj){
            if(obj.data == undefined){
                var areaList = [];
            }else{
                var areaList = obj.data;
            }
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
    content += ' <input class="easyui-combobox"  id="provinceList"/>'
    content += '</div>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label layui-required">地市</label>'
    content += '<div class="layui-input-inline">'
    content += ' <input class="easyui-combobox"  id="countyList"/>'
    content += '</div>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label layui-required">区县</label>'
    content += '<div class="layui-input-inline">'
    content += ' <input class="easyui-combobox"  id="areaList"/>'
    content += '</div>'
    content += '</div>'
    content += '<div class="layui-form-item">'
    content += '<div class="layui-inline editItem">'
    content += '<label class="layui-form-label layui-required">十六进制编码</label>'
    content += '<div class="layui-input-inline length">'
    content += '<input type="text"  placeholder="请输入" class="layui-input" id="editHexadecimalCode" onblur="inputBlurEvent()">'
    content += '<button type="button" class="freeCountyInquireBtn" id="freeCodeInuqireBtn">查询预留</button>'
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
//删除区县信息
function delCountyCodeInfoEvent(AreaCode,CountyHexadecimal,CountyBinary,Remarks){
    $.messager.confirm('区县删除', '是否确认删除当前的区县信息?', function(flag){
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
                    Remarks:''
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
                async:false,//同步
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
                        //删除区县信息
                        $.ajax({
                            url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/delProvinceArea?AreaCode='+AreaCode),
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
                                    getCountyCodeList();//刷新数据
                                }else{
                                    $.messager.alert('提示','编码删除失败!'+obj.tip,'error');
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
                    }else{
                        $.messager.progress('close');
                        $.messager.alert('提示','编码删除失败!'+obj.tip,'error');
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

/**
 * easyui表格--修改参考 https://coding.net/u/zhangyu911013/p/easyuiClientSideFilter/git
 * desc：
 * //easyui必须是1.4以上,引入jquery.easyui.min.js,
 * //该方法前台操作返回的数据；
 * //如果要实现前台分页，必须引入datagrid-filter.js，加上筛选，把筛选行手动隐藏。
 */
function relatedTableFormat(tableId,opt){

    var columnsData = opt.columnsData?opt.columnsData:[];//必须存在
    var data = opt.data?opt.data:[];
    var tableH = opt.tableH?opt.tableH:300;
    var tableOpt = opt.tableOpt?opt.tableOpt:{};//扩展的表格的属性

    var NofilterRow = opt.NofilterRow?opt.NofilterRow:false;//是否有筛选行，true表示没有;

    var defautls = {//表格默认的属性
        height:tableH,
        nowrap:false,//不换行
        fitColumns: true,//列宽度自适应table宽度
        remoteFilter: false,//禁止远程筛选
        remoteSort: false,//禁止远程排序
        striped : true,//奇偶行
        pagination: true,//分页
        pageSize:20,
        pageList: [20, 30, 50, 100],//可以设置每页记录条数的列表
        pageNumber:1,//初始化，在翻页后重新加载数据时会显示第一页
        showRefresh: false, //是否显示刷新按钮
        singleSelect: false,//是否单选
        scrollbarSize:1,
        columns:columnsData,
        sortable: true,
        sorter: function (a, b) {
            if (!isNaN(a[sort])) {
                a = parseFloat(a[sort]);
                b = parseFloat(b[sort]);
                if (a >= b) {
                    return 1;
                } else if (a < b) {
                    return -1;
                } else {
                    return 0;
                }
            } else {
                return a[sort].localeCompare(b[sort]);
            }
        },
        onLoadSuccess: function () {
            // 合并单元格(省份)
            var colStr = "ProvinceName,FatherAreaName";
            mergeCellsByField(tableId,colStr);
            formatLongString();

            if(NofilterRow){
                $(".datagrid-filter-row").hide();
            }
        }
    };

    var obj =  $.extend({},defautls, tableOpt);

    $("#"+tableId).datagrid(obj);

    $('#'+tableId).datagrid('enableFilter').datagrid('loadData', data);//必须先初始化过滤，再加载数据，插件自带排序筛选分页

    if (data.length < 1) {
        var noDataHtml = '<div class="noData"><span>暂无数据！</span></div>';
        $("#" + tableId).parent().prepend(noDataHtml);
        $(".noData").css({
            "position": "absolute",
            "width": "100%",
            "height": 250,
            "z-index": 100,
            "text-align": "center",
            "margin-top": 100
        });
    }

    $(window).resize(function () {
        $("#" + tableId).datagrid("resize", {width: $("#" + tableId).width()});
    });
}