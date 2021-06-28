$(function(){
     //url参数处理
     var urlObj = new UrlSearch();
     FatherTypeCode = urlObj.FatherTypeCode;
     IpTypeCode = urlObj.IpTypeCode;
     SchemId = urlObj.SchemId;
     $(".ipType").html(urlObj.IpTypeName);
     if(urlObj.topIpTypeName != ''){
        $(".topIpType").html(urlObj.topIpTypeName);
     }else{
        $(".topIpType").parent().hide();
     }
     //查询集团标准规范定义
     getIpTypeSchemeStandardList(urlObj.IpTypeCode)
     if(FatherTypeCode){//继承父节点编码方案
        getOneIpTypeScheme(FatherTypeCode);
     }else{
        getOneIpTypeScheme(urlObj.IpTypeCode);    
     }
     getlabelList();
     initDiviceCloseEvent();
     initDiviceSubmitEvent();
     initLabelBtnClickEvent();
     initClosePageClickEvent();
     initSubmitBtnClickEvent();
     
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
var FatherTypeCode = "";//父节点编码
var labelList = "";//标签信息
var schemelist = [];//编码方案数据
var Necessarylist = [];
var spaceLen = '';//剩余空间
var IpTypeCode= "";//地址类型编码
var SchemId = "";//编码方案
var countryAllList = [] //所有区县列表，为了切换省的时候联动
var IpTypeSchemeStandardList = []

//初始化页面确定按钮点击事件
function initSubmitBtnClickEvent(){
    $("#submitBtn").click(function(event){
        for(var i = 0;i < schemelist.length;i++){
            var domId = "#tablelabelCodeList" + schemelist[i].LableId;
            schemelist[i].HexadecimalCode =  $(domId).combobox('getValues').join(",")
        }
        //判断新划分的编码位置，与标准规范编码方案中对应位置标识的编码是否满足
        StandardToNew()
        let count = 0
        for(var i = 0;i < schemelist.length;i++){
            if(schemelist[i].contrastFlag == '0'){
                count++
            }
        }
        if(count > 0){
            $.messager.alert('提示','已划分标识中编码非法，请核查后再重新划分。','error');
            loadLabelCodeTable(schemelist);
        }else{
            var dataList = [];
        for(var i = 0;i < schemelist.length;i++){
            dataList.push({
                SeqId:schemelist[i].SeqId,
                LableId:schemelist[i].LableId,
                LableCodeName:schemelist[i].LableCodeName,
                LableOrder:schemelist[i].LableOrder,
                Ipv6Position:schemelist[i].Ipv6Position,
                SchemeId:schemelist[i].SchemeId,
                HexadecimalCode:schemelist[i].HexadecimalCode,
            })
        }
        if(FatherTypeCode){//新增
            var params = {
                IpTypeCode:IpTypeCode,
                SchemeId:'',
                dataList:dataList
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeMng/AddIpTypeScheme'),
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
                       for(var i = 0; i<schemelist.length;i++){
                            delete schemelist[i].del
                       }
                        loadLabelCodeTable(schemelist);
                        const ifrs = window.top.$vm.$('iframe')
                        for (const item of ifrs) {
                          if (item.src.indexOf('/ipmanage/ipaddrmodule/views/jsp/ipv6CodeMag/ipv6CodePlanMag.jsp') != -1) {
                            // item.contentWindow.getIpTypeSchemeList()
                            item.contentWindow.location.reload(true)
                          }
                        }
                        setTimeout(function(){ 
                            window.top.$vm.$closeTab(); 
                         }, 2000);
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
        }else{//修改
            var params = {
                IpTypeCode:IpTypeCode,
                SchemeId:SchemId,
                dataList:dataList
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeMng/ModIpTypeScheme'),
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
                        for(var i = 0; i<schemelist.length;i++){
                            delete schemelist[i].del
                       }
                        loadLabelCodeTable(schemelist);
                        const ifrs = window.top.$vm.$('iframe')
                        for (const item of ifrs) {
                          if (item.src.indexOf('/ipmanage/ipaddrmodule/views/jsp/ipv6CodeMag/ipv6CodePlanMag.jsp') != -1) {
                            // item.contentWindow.getIpTypeSchemeList()
                            item.contentWindow.location.reload(true)
                          }
                        }  
                        setTimeout(function(){ 
                            window.top.$vm.$closeTab(); 
                         }, 2000);
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
        }
        }
    })
}

//初始化页面页面关闭事件
function initClosePageClickEvent(){
    $("#closeBtn").click(function(event){
        //window.close();
        window.top.$vm.$closeTab();
    })
}

//初始化标识管理页面
function initLabelBtnClickEvent(){
    $(".labelBtn").click(function(event){
        // window.open('views/jsp/ipv6LabelMag/ipv6LabelMag.jsp');
        window.top.$vm.$openTab({
            name: 'IPv6标识管理',
            path:bathPath+'/ipaddrmodule/views/jsp/ipv6LabelMag/ipv6LabelMag.jsp'
        })
    })
}

//划分按钮事件初始化
function initDiviceBtnClickEvent(){
    $("#diviceBtn").click(function(event){
        $(".labelItem").remove();//刷新数据，新增标识后刷新数据
        getlabelList();
        event.stopPropagation();
        if($(".labelListBox").hasClass("labelBoxShow")){
            $(".labelListBox").removeClass("labelBoxShow");
        }else{
            $(".labelListBox").addClass("labelBoxShow");
        }
    })
}

//初始化标签划分确认按钮点击事件
function initDiviceSubmitEvent(){
    $("#diviceSubmitBtn").click(function(){
        var LableId = '';
        $(".labelRadio").each(function(index){
            if($(this).css("background-color") == "rgb(64, 158, 255)"){
                LableId = $(this).parent().attr('lableid');
            }
        })
        if(LableId == ''){
            $.messager.alert('提示','请先选择需要划分的标识!','warning');
            return;
        }else{//选中标识
            //标识不能重复添加
            for(var i = 0;i < schemelist.length;i ++){
                if(schemelist[i].LableId == LableId){
                    $.messager.alert('提示','当前标识已划分，请选择其他标识!','warning');
                    return;
                }
            }
            //获取选择的标识具体信息
            var lableItem = '';
            for(var j = 0;j < labelList.length;j ++){
                if(labelList[j].LableId == LableId){
                    lableItem = labelList[j];
                }
            }
            //子网空间需要满足条件才能添加
            if(spaceLen < lableItem.BitLength){
                $.messager.alert('提示','子网空间不足，当前标识不能划分!','warning');
                return;
            }
            
            schemelist.push({
                SeqId:'',
                LableId:LableId,
                LableName:lableItem.LableName,
                BitLength:lableItem.BitLength,
                LableColor:lableItem.LableColor,
                LableCodeName:'',
                LableOrder:schemelist.length?schemelist[schemelist.length-1].LableOrder + 1:1,
                Ipv6Position:schemelist.length?Number(schemelist[schemelist.length-1].Ipv6Position.split('-')[1]) + 1 +'-'+(Number(schemelist[schemelist.length-1].Ipv6Position.split('-')[1])+Number(lableItem.BitLength)):('1-'+Number(lableItem.BitLength)),
                SchemeId:SchemId,
                CodeTableName:lableItem.CodeTableName,
                HexadecimalCode:'',
                del:'',//划分的方案可以删除
            });
            
            loadLabelCodeTable(schemelist);//表格信息
            $(".schemeItem").remove();//情况已有编码方案
            if(FatherTypeCode){//继承父节点编码方案
                var content = loadCodePlanContentByFather(schemelist);//刷新编码方案信息
                $(".planItemBox").append(content);
                initComboboxDataByFather();//加载下拉框数据
            }else{
                var content = loadCodePlanContent(schemelist);//刷新编码方案信息
                $(".planItemBox").append(content);
                initComboboxData();//加载下拉框数据
            }
            initDiviceBtnClickEvent();//初始化划分事件
            $(".labelListBox").removeClass("labelBoxShow");
        }
    })
}

//初始化标签划分关闭按钮点击事件
function initDiviceCloseEvent(){
    $("#diviceCloseBtn").click(function(){
        $(".labelListBox").removeClass("labelBoxShow");
    })
}

//查询对应地址类型的编码方案
function getOneIpTypeScheme(IpTypeCode){
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeMng/GetOneIpTypeScheme?IpTypeCode='+IpTypeCode),
        type:'POST',
        data:{},
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            schemelist = obj.data[0].schemelist
            if(FatherTypeCode){//继承父节点
                var content = loadCodePlanContentByFather(schemelist);
                $(".planItemBox").append(content);
                initComboboxDataByFather()
                initDiviceBtnClickEvent();//初始化划分事件
            }else{//本身
                var content = loadCodePlanContent(schemelist);
                $(".planItemBox").append(content)
                initComboboxData();//下拉数据
                initDiviceBtnClickEvent();//初始化划分事件
            }
            loadLabelCodeTable(schemelist);
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//查询集团标准规范定义
function getIpTypeSchemeStandardList(IpTypeCode){
    $('.standardBox').show()
    let params = {
        ipTypeCode:IpTypeCode,
        scope:'father'
    }
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeMng/GetIpTypeSchemeStandardList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        async: false,
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(data){
            IpTypeSchemeStandardList =  data.data[0].schemelist
            if(IpTypeSchemeStandardList.length != 0){
                $('.standardBox').show()
                var content = loadStandardCodePlanContent();
                $(".planItemBoxStandard").append(content)
            }else{
                $('.standardBox').hide()
            }
            
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
};

//规范编码方案内容
function loadStandardCodePlanContent(){
    $(".planItemBoxStandard").html("");//清空
    var len = 0;
    var content = '';
    var schemelistStandard = IpTypeSchemeStandardList
    var itemWidth = "itemWidth"+schemelistStandard.length;//宽度均分
    for(var i = 0;i < schemelistStandard.length;i++){
        len += Number(schemelistStandard[i].BitLength);
    }
    spaceLen = 64 - len;
    if(spaceLen == 0){
        itemWidth = "itemWidthDeal"+schemelistStandard.length;
    }
    // console.log(schemelistStandard)
    for(var i = 0;i < schemelistStandard.length;i++){
        // console.log(schemelistStandard[i].HexadecimalCode)
        if(schemelistStandard[i].LableCodeName != undefined && schemelistStandard[i].LableCodeName != ''){
            content += '<div class="schemeItem1 '+itemWidth+'" style="background-color:'+schemelistStandard[i].LableColor+'" title='+schemelistStandard[i].LableCodeName+':'+(schemelistStandard[i].HexadecimalCode==undefined?'':schemelistStandard[i].HexadecimalCode)+'>'+schemelistStandard[i].LableCodeName+':'+(schemelistStandard[i].HexadecimalCode==undefined?'':schemelistStandard[i].HexadecimalCode)+'</div>'
        }else{
            content += '<div class="schemeItem1 '+itemWidth+'" style="background-color:'+schemelistStandard[i].LableColor+'" title='+schemelistStandard[i].LableName+':'+(schemelistStandard[i].HexadecimalCode==undefined?'':schemelistStandard[i].HexadecimalCode)+'>'+schemelistStandard[i].LableName+':'+(schemelistStandard[i].HexadecimalCode==undefined?'':schemelistStandard[i].HexadecimalCode)+'</div>'
        }        
    }
    if(schemelistStandard.length != 0){
        if(spaceLen == 0){
        content += '<div class="schemeItem1 interfaceAddr1">接口地址（64）:全0</div>';
        }else{
            content += '<div class="schemeItem1 subnetSpace1">子网空间（'+spaceLen+'）:全0</div>';
            content += '<div class="schemeItem1 interfaceAddr1">接口地址（64）:全0</div>';
        }
    }
    return content;
}

//获取标识数据
function getlabelList(){
    let params = {
        LableId:'',
        LableName:'',    
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
            labelList = obj.data;
            Necessarylist = obj.data
            //方案中已出现的标识无法选择
            for(var i = 0;i < schemelist.length;i ++){
                labelList = labelList.filter(function(ele,idx,arr){
                    return ele.LableId != schemelist[i].LableId;
                });
            }
            // labelList = labelList.filter(function(ele,idx,arr){
            //     return ele.isNecessary != "1";
            // });
            //遍历生成标识信息
            for(var j = 0;j < labelList.length;j++){
                var labelItem = '';
                labelItem += '<li class="labelItem" LableId="'+labelList[j].LableId+'">'
                labelItem += '<input type="radio" name="label" class="labelRadio" id="'+labelList[j].LableId+'"/>';
                labelItem += '<label for="'+labelList[j].LableId+'">'+labelList[j].LableName+'</label>';
                labelItem += '</li>';
                $(".labelListBox ul").append(labelItem);
            }
            $("body").click(function(event){
                if($(".labelListBox").hasClass("labelBoxShow")){
                    $(".labelListBox").removeClass("labelBoxShow");
                }
            })
            $(".labelListBox").click(function(event){//阻止事件冒泡
                event.stopPropagation();
            })
        },
        error:function(error){
            $.messager.alert('提示','接口调用失败!','error');
        },
        complete:function(){
        }
    });
}

//编码方案内容(继承父节点)
function loadCodePlanContentByFather(schemelist){
    var len = 0;
    var content = '';
    var itemWidth = "itemWidth"+schemelist.length;//宽度均分
    for(var i = 0;i < schemelist.length;i++){
        len += Number(schemelist[i].BitLength);
    }
    spaceLen = 64 - len;
    if(spaceLen == 0){
        itemWidth = "itemWidthDeal"+schemelist.length;
    }
    for(var i = 0;i < schemelist.length;i++){
        content += '<div class="schemeItem schemeItemCombo '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'"><input class="easyui-combobox"  id="labelCodeList'+schemelist[i].LableId+'"/></div>'
    }
    // for(var i = 0;i < schemelist.length;i++){
    //     if(schemelist[i].LableCodeName == ""||schemelist[i].LableCodeName == undefined ){//划分的
    //         content += '<div class="schemeItem schemeItemCombo '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'"><input class="easyui-combobox"  id="labelCodeList'+schemelist[i].LableId+'"/></div>'
    //     }else{
    //         if(schemelist[i].LableCodeName != ""&&schemelist[i].LableCodeName != undefined){
    //             content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'">'+schemelist[i].LableCodeName+'（'+schemelist[i].BitLength+'）'+'</div>'
    //         }else{
    //             content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'">'+schemelist[i].LableName+'（'+schemelist[i].BitLength+'）'+'</div>'
    //         }        
    //     }
        
    // }
    if(schemelist.length != 0){
        if(spaceLen == 0){
            content += '<div class="schemeBox">';
            content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
            content += '</div>';
        }else{
            content += '<div class="schemeBox">';
            content += '<div class="schemeItem subnetSpace"><span>子网空间（'+spaceLen+'）</span><button class="diviceBtn" id="diviceBtn">划分</button></div>';
            content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
            content += '</div>';
        }
        
    }else{
        content += '<div class="schemeBox" style="overflow:hidden;float:right">';
        content += '<div class="schemeItem subnetSpace"><span>子网空间（64）</span><button class="diviceBtn" id="diviceBtn">划分</button></div>';
        content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
        content += '</div>';
}
    return content;
}

//编码方案内容(本身)
function loadCodePlanContent(schemelist){
    
    var len = 0;
    var content = '';
    var itemWidth = "itemWidth"+schemelist.length;//宽度均分
    for(var i = 0;i < schemelist.length;i++){
        len += Number(schemelist[i].BitLength);
    }
    spaceLen = 64 - len;
    if(spaceLen == 0){
        itemWidth = "itemWidthDeal"+schemelist.length;
    }
    for(var i = 0;i < schemelist.length;i++){
        content += '<div class="schemeItem schemeItemCombo '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'"><input class="easyui-combobox"  id="labelCodeList'+schemelist[i].LableId+'"/></div>'
    }
    if(schemelist.length != 0){
        if(spaceLen == 0){
            content += '<div class="schemeBox">';
            content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
            content += '</div>';
        }else{
            content += '<div class="schemeBox">';
            content += '<div class="schemeItem subnetSpace"><span>子网空间（'+spaceLen+'）</span><button class="diviceBtn" id="diviceBtn">划分</button></div>';
            content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
            content += '</div>';
        }
    }else{
            content += '<div class="schemeBox" style="overflow:hidden;float:right">';
            content += '<div class="schemeItem subnetSpace"><span>子网空间（64）</span><button class="diviceBtn" id="diviceBtn">划分</button></div>';
            content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
            content += '</div>';
    }
    return content;
}

//初始化下拉数据(继承父节点)
function initComboboxDataByFather(){
    for(var i = 0;i < schemelist.length;i++){
        // console.log(schemelist[i])
        // if(schemelist[i].del == ""){//划分的
            if(schemelist[i].CodeTableName == "IPv6LableCode"){//通用
                var params = {
                    LableId:schemelist[i].LableId,
                    LableCodeName:''
                }
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/GetNormalCodeMngList'),
                    type:'POST',
                    data:JSON.stringify(params),
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                
                    },
                    success:function(obj){
                        var labelCodeList = []
                        if(obj.data != undefined){
                            labelCodeList = obj.data;
                            var arrList = []
                            for(var k = 0;k < labelCodeList.length;k++){
                                if(labelCodeList[k].HexadecimalCode){
                                    arrList.push(labelCodeList[k].HexadecimalCode)
                                }
                            }
                            for(var j =0;j<Necessarylist.length;j++){
                                if(Necessarylist[j].LableId == labelCodeList[0].LableId){
                                    if(Necessarylist[j].isNecessary == '1'){
                                        labelCodeList.unshift({
                                            HexadecimalCode:'',
                                            LableCodeName: "",
                                            LableId: labelCodeList[0].LableId
                                        })
                                    }
                                }
                            }
                        }else{
                            $.messager.alert('提示','先定义编码再进行划分!','error');
                        }
                        var length = $(".schemeItem").eq(0).width()*0.9;
                        var domId = "#labelCodeList" + schemelist[i].LableId;
                        $(domId).combobox({
                            valueField:'HexadecimalCode',
                            textField:'LableCodeName',
                            data:labelCodeList,
                            width:length,
                            //panelHeight: 'auto',//高度自适应
                            multiple: false,
                            editable:true,//定义用户是否可以直接往文本域中输入文字
                            //直接过滤，数据太多时不行，太卡了，放弃
                            onLoadSuccess: function () {
                                
                            },
                            filter: function(q, row){
                                var opts = $(domId).combobox('options');
                                return row[opts.textField].indexOf(q) != -1;
                            },
                            onSelect:function(row){
                                var LableCodeName = row.LableCodeName;
                                var HexadecimalCode = row.HexadecimalCode;
                                for(var j = 0;j < schemelist.length;j++){
                                    if(schemelist[j].LableId == row.LableId){
                                        schemelist[j].LableCodeName = LableCodeName;
                                        schemelist[j].HexadecimalCode = HexadecimalCode;
                                        if(LableCodeName){
                                            schemelist[j].HexadecimalCodeList = HexadecimalCode
                                        } else{
                                            schemelist[j].HexadecimalCodeList = arrList.join(',')
                                        }
                                    }
                                }
                                //刷新表格数据
                                loadLabelCodeTable(schemelist);
                            }
                        });
                        var arr = []
                        for(var k = 0;k < labelCodeList.length;k++){
                            if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == labelCodeList[k].LableCodeName)){
                                arr.push(labelCodeList[k].HexadecimalCode)
                                schemelist[i].HexadecimalCode =  arr.join(',')
                                schemelist[i].HexadecimalCodeList = arr.join(',')
                            }
                            if(schemelist[i].LableCodeName==undefined){
                                schemelist[i].HexadecimalCode = ''
                                schemelist[i].HexadecimalCodeList = arrList.join(',')
                            }
                            if(schemelist[i].LableCodeName==''){
                                schemelist[i].HexadecimalCode = ''
                                schemelist[i].HexadecimalCodeList = arrList.join(',')
                            }
                        }
                        loadLabelCodeTable(schemelist);
                        //默认显示标识名称
                        if(schemelist[i].LableCodeName){
                            $(domId).combobox('setValue',schemelist[i].LableCodeName);
                            // $(domId).combobox('disable');
                        }else{
                            $(domId).combobox('setValue',schemelist[i].LableName);
                        }
                        
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }else{
                if(schemelist[i].LableName == "省份标识"){//省份
                    $.ajax({
                        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetProvinceCodeMngList?AreaName='),
                        type:'POST',
                        data:{},
                        async: false,
                        dataType:'json',
                        contentType: 'application/json;chartset=UTF-8',
                        beforeSend: function () {
                    
                        },
                        success:function(obj){
                            //数据合并，根据AreaCode相同
                            var labelCodeList = mergeCodeByAreaCode(obj.data);
                            var arrList = []
                            for(var k = 0;k < labelCodeList.length;k++){
                                if(labelCodeList[k].CountyHexadecimal){
                                    arrList.push(labelCodeList[k].CountyHexadecimal)
                                }
                            }
                            for(var j =0;j<Necessarylist.length;j++){
                                if(Necessarylist[j].LableId == labelCodeList[0].LableId){
                                    if(Necessarylist[j].isNecessary == '1'){
                                        labelCodeList.unshift({
                                            HexadecimalCode:'',
                                            LableCodeName: "",
                                            LableId: labelCodeList[0].LableId
                                        })
                                    }
                                }
                            }
                            var length = $(".schemeItem").eq(0).width()*0.9;
                            var domId = "#labelCodeList" + schemelist[i].LableId;
                            $(domId).combobox({
                                valueField:'CountyHexadecimal',
                                textField:'AreaName',
                                data:labelCodeList,
                                width:length,
                                //panelHeight: 'auto',//高度自适应
                                multiple: false,
                                editable:true,//定义用户是否可以直接往文本域中输入文字
                                //直接过滤，数据太多时不行，太卡了，放弃
                                onLoadSuccess: function () {
                                    
                                },
                                filter: function(q, row){
                                    var opts = $(domId).combobox('options');
                                    return row[opts.textField].indexOf(q) != -1;
                                },
                                onSelect:function(row){
                                    var LableCodeName = row.AreaName;
                                    var HexadecimalCode = row.CountyHexadecimal;
                                    for(var j = 0;j < schemelist.length;j++){
                                        if(schemelist[j].LableId == row.LableId){
                                            schemelist[j].LableCodeName = LableCodeName;
                                            schemelist[j].HexadecimalCode = HexadecimalCode;
                                            if(LableCodeName){
                                                schemelist[j].HexadecimalCodeList = HexadecimalCode
                                            } else{
                                                schemelist[j].HexadecimalCodeList = arrList.join(',')
                                            }
                                        }
                                        if(schemelist[j].LableName == '区县标识'){
                                            schemelist[j].LableCodeName = '';
                                            schemelist[j].HexadecimalCode = '';
                                        }
                                    }
                                    var province=row.AreaName;
                                    var labelCodeList = []
                                     labelCodeList = JSON.parse(JSON.stringify(countryAllList))
                                    if(labelCodeList !=''){
                                        for(var j =0;j<Necessarylist.length;j++){
                                            if(Necessarylist[j].LableId == labelCodeList[0].LableId){
                                                if(Necessarylist[j].isNecessary == '1'){
                                                    labelCodeList.unshift({
                                                        HexadecimalCode:'',
                                                        LableCodeName: "",
                                                        LableId: labelCodeList[0].LableId,
                                                        FatherAreaName:'',
                                                        AreaName:''
                                                    })
                                                }
                                            }
                                        }
                                        if(province!=''){
                                            for(let j=labelCodeList.length-1; j>=0; j--){
                                                if(j != 0){
                                                if(labelCodeList[j].ProvinceName != province){
                                                    labelCodeList.splice(j,1);
                                                }
                                                } 
                                            }
                                        }
                                        var arrListCounty = []
                                    for(var k = 0;k < labelCodeList.length;k++){
                                        if(labelCodeList[k].CountyHexadecimal){
                                            arrListCounty.push(labelCodeList[k].CountyHexadecimal)
                                        }
                                    }
                                    var LableId ='';
                                    for(let j=schemelist.length-1; j>=0; j--){
                                        if(schemelist[j].LableName == '区县标识'){
                                            LableId = schemelist[j].LableId
                                            schemelist[j].HexadecimalCodeList = arrListCounty.join(',')
                                        }
                                    }
                                        var length = $(".schemeItem").eq(0).width()*0.9;
                                        var domId = "#labelCodeList" + LableId;
                                        $(domId).combobox({
                                            valueField:'CountyHexadecimal',
                                            textField:'AreaName',
                                            formatter: function(row){
                                                if(row.AreaName){
                                                    return row.FatherAreaName+'-'+row.AreaName
                                                }else{
                                                    return ''
                                                } 
                                                 },
                                            data:labelCodeList,
                                            width:length,
                                            //panelHeight: 'auto',//高度自适应
                                            multiple: false,
                                            editable:true,//定义用户是否可以直接往文本域中输入文字
                                            //直接过滤，数据太多时不行，太卡了，放弃
                                            onLoadSuccess: function () {
                                                
                                            },
                                            filter: function(q, row){
                                                var opts = $(domId).combobox('options');
                                                return row[opts.textField].indexOf(q) != -1;
                                            },
                                            onSelect:function(row){
                                                if(row.AreaName == '' ||row.AreaName == undefined){
                                                    var LableCodeName =''
                                                }else{
                                                    var LableCodeName =row.FatherAreaName+'-'+row.AreaName;
                                                }
                                                var HexadecimalCode = row.CountyHexadecimal;
                                                var arrListCounty = []
                                            for(var k = 0;k < labelCodeList.length;k++){
                                                if(labelCodeList[k].CountyHexadecimal){
                                                    arrListCounty.push(labelCodeList[k].CountyHexadecimal)
                                                }
                                            }
                                            for(var j = 0;j < schemelist.length;j++){
                                                if(schemelist[j].LableId == row.LableId){
                                                    schemelist[j].LableCodeName = LableCodeName;
                                                    schemelist[j].HexadecimalCode = HexadecimalCode;
                                                    if(LableCodeName){
                                                        schemelist[j].HexadecimalCodeList = HexadecimalCode
                                                    } else{
                                                        schemelist[j].HexadecimalCodeList = arrListCounty.join(',')
                                                    }
                                                }
                                            }
                                                //刷新表格数据
                                                loadLabelCodeTable(schemelist);
                                            }
                                        });
                                    }
                                    //刷新表格数据
                                    loadLabelCodeTable(schemelist);
                                }
                            });
                            var arr = []
                            for(var k = 0;k < labelCodeList.length;k++){
                                if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == labelCodeList[k].AreaName)){
                                    arr.push(labelCodeList[k].CountyHexadecimal)
                                    schemelist[i].HexadecimalCode =  arr.join(',')
                                    schemelist[i].HexadecimalCodeList = arr.join(',')
                                }
                                if(schemelist[i].LableCodeName==undefined){
                                    schemelist[i].HexadecimalCode = ''
                                    schemelist[i].HexadecimalCodeList = arrList.join(',')
                                }
                                if(schemelist[i].LableCodeName==''){
                                    schemelist[i].HexadecimalCode = ''
                                    schemelist[i].HexadecimalCodeList = arrList.join(',')
                                }
                            }
                            loadLabelCodeTable(schemelist);
                            //默认显示标识名称
                            if(schemelist[i].LableCodeName){
                                $(domId).combobox('setValue',schemelist[i].LableCodeName);
                                // $(domId).combobox('disable');
                            }else{
                                $(domId).combobox('setValue',schemelist[i].LableName);
                            }
                        },
                        error:function(error){
                            $.messager.alert('提示','接口调用失败!','error');
                        },
                        complete:function(){
                        }
                    });
                }else{//区县
                    var params = {
                        AreaName:'',
                        pagesize:999,
                        pageno:1
                    }
                    $.ajax({
                        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetCountyCodeMngList'),
                        type:'POST',
                        data:JSON.stringify(params),
                        async: false,
                        dataType:'json',
                        contentType: 'application/json;chartset=UTF-8',
                        beforeSend: function () {
                    
                        },
                        success:function(obj){
                            //数据合并，根据AreaCode相同
                            var labelCodeList = mergeCodeByAreaCode(obj.data.rows);
                            countryAllList = mergeCodeByAreaCode(obj.data.rows);; //保存最初查到的区县列表，省改变时联动
                        var province='';
                        var arr= [];
                        var arrList = []
                        for(var k = 0;k < labelCodeList.length;k++){
                            if(labelCodeList[k].CountyHexadecimal){
                                arrList.push(labelCodeList[k].CountyHexadecimal)
                            }
                        }
                        for(let i  in labelCodeList){
                            arr.push(labelCodeList[i])
                        }
                        for(var k = 0;k<schemelist.length;k++){
                            if(schemelist[k].LableName == '省份标识'){
                                province = schemelist[k].LableCodeName
                            }
                        }
                        for(var j =0;j<Necessarylist.length;j++){
                            if(Necessarylist[j].LableId == labelCodeList[0].LableId){
                                if(Necessarylist[j].isNecessary == '1'){
                                    labelCodeList.unshift({
                                        CountyHexadecimal:'',
                                        LableCodeName: "",
                                        LableId: labelCodeList[0].LableId,
                                        FatherAreaName:'',
                                        AreaName:''
                                    })
                                }
                            }
                        }
                        if(province!=''){
                            for(let i=labelCodeList.length-1; i>=0; i--){
                                if(i != 0){
                                    if(labelCodeList[i].ProvinceName != province){
                                        labelCodeList.splice(i,1);
                                    }
                                }
                            }
                        }
                            
                            var length = $(".schemeItem").eq(0).width()*0.9;
                            var domId = "#labelCodeList" + schemelist[i].LableId;
                            $(domId).combobox({
                                valueField:'CountyHexadecimal',
                                textField:'AreaName',
                                formatter: function(row){
                                    if(row.AreaName){
                                        return row.FatherAreaName+'-'+row.AreaName
                                    }else{
                                        return ''
                                    } 
                                        },
                                data:labelCodeList,
                                width:length,
                                //panelHeight: 'auto',//高度自适应
                                multiple: false,
                                editable:true,//定义用户是否可以直接往文本域中输入文字
                                //直接过滤，数据太多时不行，太卡了，放弃
                                onLoadSuccess: function () {
                                    
                                },
                                filter: function(q, row){
                                    var opts = $(domId).combobox('options');
                                    return row[opts.textField].indexOf(q) != -1;
                                },
                                onSelect:function(row){
                                    if(row.AreaName == '' ||row.AreaName == undefined){
                                        var LableCodeName =''
                                    }else{
                                        var LableCodeName =row.FatherAreaName+'-'+row.AreaName;
                                    }
                                    var HexadecimalCode = row.CountyHexadecimal;
                                    for(var j = 0;j < schemelist.length;j++){
                                        if(schemelist[j].LableId == row.LableId){
                                            schemelist[j].LableCodeName = LableCodeName;
                                            schemelist[j].HexadecimalCode = HexadecimalCode;
                                            if(LableCodeName){
                                                schemelist[j].HexadecimalCodeList = HexadecimalCode
                                            } else{
                                                schemelist[j].HexadecimalCodeList = arrList.join(',')
                                            }
                                        }
                                    }
                                    //刷新表格数据
                                    loadLabelCodeTable(schemelist);
                                }
                            });
                            var arr = []
                            for(var k = 0;k < labelCodeList.length;k++){
                                if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == (labelCodeList[k].FatherAreaName+'-'+labelCodeList[k].AreaName))){
                                    arr.push(labelCodeList[k].CountyHexadecimal)
                                    schemelist[i].HexadecimalCode =  arr.join(',')
                                    schemelist[i].HexadecimalCodeList = arr.join(',')
                                }
                                if(schemelist[i].LableCodeName==undefined){
                                    schemelist[i].HexadecimalCode = ''
                                    schemelist[i].HexadecimalCodeList = arrList.join(',')
                                }
                                if(schemelist[i].LableCodeName==''){
                                    schemelist[i].HexadecimalCode = ''
                                    schemelist[i].HexadecimalCodeList = arrList.join(',')
                                }
                            }
                            loadLabelCodeTable(schemelist);
                            //默认显示标识名称
                            if(schemelist[i].LableCodeName){
                                $(domId).combobox('setValue',schemelist[i].LableCodeName);
                                // $(domId).combobox('disable');
                            }else{
                                $(domId).combobox('setValue',schemelist[i].LableName);
                            }
                        },
                        error:function(error){
                            $.messager.alert('提示','接口调用失败!','error');
                        },
                        complete:function(){
                        }
                    });
                }
            }
        // }
    }
}

//初始化下拉数据(本身)
function initComboboxData(){
    for(var i = 0;i < schemelist.length;i++){
        if(schemelist[i].CodeTableName == "IPv6LableCode"){//通用
            var params = {
                LableId:schemelist[i].LableId,
                LableCodeName:''
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6CodingMng/GetNormalCodeMngList'),
                type:'POST',
                data:JSON.stringify(params),
                async: false,
                dataType:'json',
                contentType: 'application/json;chartset=UTF-8',
                beforeSend: function () {
            
                },
                success:function(obj){
                    var labelCodeList = []
                    if(obj.data != undefined){
                        labelCodeList = obj.data;
                        for(var j =0;j<Necessarylist.length;j++){
                            if(Necessarylist[j].LableId == labelCodeList[0].LableId){
                                if(Necessarylist[j].isNecessary == '1'){
                                    labelCodeList.unshift({
                                        HexadecimalCode:'',
                                        LableCodeName: "",
                                        LableId: labelCodeList[0].LableId
                                    })
                                }
                            }
                        }
                    }else{
                        $.messager.alert('提示','先定义编码再进行划分!','error');
                    }
                    var length = $(".schemeItem").eq(0).width()*0.9;
                        var domId = "#labelCodeList" + schemelist[i].LableId;
                        $(domId).combobox({
                        valueField:'HexadecimalCode',
                        textField:'LableCodeName',
                        data:labelCodeList,
                        width:length,
                        //panelHeight: 'auto',//高度自适应
                        multiple: false,
                        editable:true,//定义用户是否可以直接往文本域中输入文字
                        //直接过滤，数据太多时不行，太卡了，放弃
                        onLoadSuccess: function () {
                            
                        },
                        filter: function(q, row){
                            var opts = $(domId).combobox('options');
                            return row[opts.textField].indexOf(q) != -1;
                        },
                        onSelect:function(row){
                            var LableCodeName = row.LableCodeName;
                            var HexadecimalCode = row.HexadecimalCode;
                            var arrList = []
                            for(var k = 0;k < labelCodeList.length;k++){
                                if(labelCodeList[k].HexadecimalCode){
                                    arrList.push(labelCodeList[k].HexadecimalCode)
                                }
                            }
                            for(var j = 0;j < schemelist.length;j++){
                                if(schemelist[j].LableId == row.LableId){
                                    schemelist[j].LableCodeName = LableCodeName;
                                    schemelist[j].HexadecimalCode = HexadecimalCode;
                                    if(LableCodeName){
                                        schemelist[j].HexadecimalCodeList = HexadecimalCode
                                    } else{
                                        schemelist[j].HexadecimalCodeList = arrList.join(',')
                                    }
                                }
                            }
                            //刷新表格数据
                            loadLabelCodeTable(schemelist);
                        }
                        });
                        var arr = []
                        var arrList = []
                        for(var k = 0;k < labelCodeList.length;k++){
                        if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == labelCodeList[k].LableCodeName)){
                            arr.push(labelCodeList[k].HexadecimalCode)
                            schemelist[i].HexadecimalCode =  arr.join(',')
                            schemelist[i].HexadecimalCodeList = arr.join(',')
                        }
                        if(labelCodeList[k].HexadecimalCode){
                            arrList.push(labelCodeList[k].HexadecimalCode)
                        }
                        if(schemelist[i].LableCodeName==undefined){
                            schemelist[i].HexadecimalCode = ''
                            schemelist[i].HexadecimalCodeList = arrList.join(',')
                        }
                        if(schemelist[i].LableCodeName==''){
                            schemelist[i].HexadecimalCode = ''
                            schemelist[i].HexadecimalCodeList = arrList.join(',')
                        }
                        }
                        loadLabelCodeTable(schemelist);
                        //默认显示标识名称
                        if(schemelist[i].LableCodeName){
                            $(domId).combobox('setValue',schemelist[i].LableCodeName);
                            // $(domId).combobox('disable');
                        }else{
                            $(domId).combobox('setValue',schemelist[i].LableName);
                        }
                },
                error:function(error){
                    $.messager.alert('提示','接口调用失败!','error');
                },
                complete:function(){
                }
            });
        }else{
            if(schemelist[i].LableName == "省份标识"){//省份
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetProvinceCodeMngList?AreaName='),
                    type:'POST',
                    data:{},
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                
                    },
                    success:function(obj){
                        //数据合并，根据AreaCode相同
                        var labelCodeList = mergeCodeByAreaCode(obj.data);
                        var arrList = []
                        for(var k = 0;k < labelCodeList.length;k++){
                            if(labelCodeList[k].CountyHexadecimal){
                                arrList.push(labelCodeList[k].CountyHexadecimal)
                            }
                        }
                        for(var j =0;j<Necessarylist.length;j++){
                            if(Necessarylist[j].LableId == labelCodeList[0].LableId){
                                if(Necessarylist[j].isNecessary == '1'){
                                    labelCodeList.unshift({
                                        HexadecimalCode:'',
                                        LableCodeName: "",
                                        LableId: labelCodeList[0].LableId
                                    })
                                }
                            }
                        }
                        var length = $(".schemeItem").eq(0).width()*0.9;
                        var domId = "#labelCodeList" + schemelist[i].LableId;
                        $(domId).combobox({
                            valueField:'CountyHexadecimal',
                            textField:'AreaName',
                            data:labelCodeList,
                            width:length,
                            //panelHeight: 'auto',//高度自适应
                            multiple: false,
                            editable:true,//定义用户是否可以直接往文本域中输入文字
                            //直接过滤，数据太多时不行，太卡了，放弃
                            onLoadSuccess: function () {
                                
                            },
                            filter: function(q, row){
                                var opts = $(domId).combobox('options');
                                return row[opts.textField].indexOf(q) != -1;
                            },
                            onSelect:function(row){
                                var LableCodeName = row.AreaName;
                                var HexadecimalCode = row.CountyHexadecimal;
                                for(var j = 0;j < schemelist.length;j++){
                                    if(schemelist[j].LableId == row.LableId){
                                        schemelist[j].LableCodeName = LableCodeName;
                                        schemelist[j].HexadecimalCode = HexadecimalCode;
                                        if(LableCodeName){
                                            schemelist[j].HexadecimalCodeList = HexadecimalCode
                                        } else{
                                            schemelist[j].HexadecimalCodeList = arrListCounty.join(',')
                                        }
                                    }
                                    if(schemelist[j].LableName == '区县标识'){
                                        schemelist[j].LableCodeName = '';
                                        schemelist[j].HexadecimalCode = '';
                                    }
                                }
                                var province=row.AreaName;
                                var labelCodeList = []
                                labelCodeList = JSON.parse(JSON.stringify(countryAllList))
                                if(labelCodeList.length != 0 ){
                                    for(var j =0;j<Necessarylist.length;j++){
                                        if(Necessarylist[j].LableId == labelCodeList[0].LableId){
                                            if(Necessarylist[j].isNecessary == '1'){
                                                labelCodeList.unshift({
                                                    HexadecimalCode:'',
                                                    LableCodeName: "",
                                                    LableId: labelCodeList[0].LableId,
                                                    FatherAreaName:'',
                                                    AreaName:''
                                                })
                                            }
                                        }
                                    }
                                    if(province!=''){
                                        for(let j=labelCodeList.length-1; j>=0; j--){
                                            if(j != 0){
                                            if(labelCodeList[j].ProvinceName != province){
                                                labelCodeList.splice(j,1);
                                            }
                                            } 
                                        }
                                    }
                                    var arrListCounty = []
                                    for(var k = 0;k < labelCodeList.length;k++){
                                        if(labelCodeList[k].CountyHexadecimal){
                                            arrListCounty.push(labelCodeList[k].CountyHexadecimal)
                                        }
                                    }
                                    var LableId ='';
                                    for(let j=schemelist.length-1; j>=0; j--){
                                        if(schemelist[j].LableName == '区县标识'){
                                            LableId = schemelist[j].LableId
                                            schemelist[j].HexadecimalCodeList = arrListCounty.join(',')
                                        }
                                    }
                                    var length = $(".schemeItem").eq(0).width()*0.9;
                                    var domId = "#labelCodeList" + LableId;
                                    $(domId).combobox({
                                        valueField:'CountyHexadecimal',
                                        textField:'AreaName',
                                        formatter: function(row){
                                            if(row.AreaName){
                                                return row.FatherAreaName+'-'+row.AreaName
                                            }else{
                                                return ''
                                            } 
                                             },
                                        data:labelCodeList,
                                        width:length,
                                        //panelHeight: 'auto',//高度自适应
                                        multiple: false,
                                        editable:true,//定义用户是否可以直接往文本域中输入文字
                                        //直接过滤，数据太多时不行，太卡了，放弃
                                        onLoadSuccess: function () {
                                            
                                        },
                                        filter: function(q, row){
                                            var opts = $(domId).combobox('options');
                                            return row[opts.textField].indexOf(q) != -1;
                                        },
                                        onSelect:function(row){
                                            if(row.AreaName == '' ||row.AreaName == undefined){
                                                var LableCodeName =''
                                            }else{
                                                var LableCodeName =row.FatherAreaName+'-'+row.AreaName;
                                            }
                                            var HexadecimalCode = row.CountyHexadecimal;
                                            for(var j = 0;j < schemelist.length;j++){
                                                if(schemelist[j].LableId == row.LableId){
                                                    schemelist[j].LableCodeName = LableCodeName;
                                                    schemelist[j].HexadecimalCode = HexadecimalCode;
                                                    if(LableCodeName){
                                                        schemelist[j].HexadecimalCodeList = HexadecimalCode
                                                    } else{
                                                        schemelist[j].HexadecimalCodeList = arrListCounty.join(',')
                                                    }
                                                }
                                            }
                                            //刷新表格数据
                                            loadLabelCodeTable(schemelist);
                                        }
                                    });
                                }
                                //刷新表格数据
                                loadLabelCodeTable(schemelist);
                            }
                        });
                        var arr = []
                        var arrList = []
                        for(var k = 0;k < labelCodeList.length;k++){
                            if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == labelCodeList[k].AreaName)){
                                arr.push(labelCodeList[k].CountyHexadecimal)
                                schemelist[i].HexadecimalCode =  arr.join(',')
                                schemelist[i].HexadecimalCodeList = arr.join(',')
                            }
                            if(labelCodeList[k].CountyHexadecimal){
                                arrList.push(labelCodeList[k].CountyHexadecimal)
                            }
                            if(schemelist[i].LableCodeName==undefined){
                                schemelist[i].HexadecimalCode = ''
                                schemelist[i].HexadecimalCodeList = arrList.join(',')
                            }
                            if(schemelist[i].LableCodeName==''){
                                schemelist[i].HexadecimalCode = ''
                                schemelist[i].HexadecimalCodeList = arrList.join(',')
                            }
                        }
                        loadLabelCodeTable(schemelist);
                        //默认显示标识名称
                        if(schemelist[i].LableCodeName){
                            $(domId).combobox('setValue',schemelist[i].LableCodeName);
                            // $(domId).combobox('disable');
                        }else{
                            $(domId).combobox('setValue',schemelist[i].LableName);
                        }
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }else{//区县
                var params = {
                    AreaName:'',
                    pagesize:999,
                    pageno:1
                }
                $.ajax({
                    url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetCountyCodeMngList'),
                    type:'POST',
                    data:JSON.stringify(params),
                    async: false,
                    dataType:'json',
                    contentType: 'application/json;chartset=UTF-8',
                    beforeSend: function () {
                
                    },
                    success:function(obj){
                        //数据合并，根据AreaCode相同
                        var labelCodeList = mergeCodeByAreaCode(obj.data.rows);
                        countryAllList = mergeCodeByAreaCode(obj.data.rows);; //保存最初查到的区县列表，省改变时联动
                        var province='';
                        var arr= [];
                        var arrList = []
                        for(var k = 0;k < labelCodeList.length;k++){
                            if(labelCodeList[k].CountyHexadecimal){
                                arrList.push(labelCodeList[k].CountyHexadecimal)
                            }
                        }
                        for(let i  in labelCodeList){
                            arr.push(labelCodeList[i])
                        }
                        for(var k = 0;k<schemelist.length;k++){
                            if(schemelist[k].LableName == '省份标识'){
                                province = schemelist[k].LableCodeName
                            }
                        }
                        for(var j =0;j<Necessarylist.length;j++){
                            if(Necessarylist[j].LableId == labelCodeList[0].LableId){
                                if(Necessarylist[j].isNecessary == '1'){
                                    labelCodeList.unshift({
                                        CountyHexadecimal:'',
                                        LableCodeName: "",
                                        LableId: labelCodeList[0].LableId,
                                        FatherAreaName:'',
                                        AreaName:''
                                    })
                                }
                            }
                        }
                        if(province!=''){
                            for(let i=labelCodeList.length-1; i>=0; i--){
                                if(i != 0){
                                    if(labelCodeList[i].ProvinceName != province){
                                        labelCodeList.splice(i,1);
                                    }
                                }
                            }
                        }
                        // console.log(labelCodeList)
                        var length = $(".schemeItem").eq(0).width()*0.9;
                        var domId = "#labelCodeList" + schemelist[i].LableId;
                        $(domId).combobox({
                            valueField:'CountyHexadecimal',
                            textField:'AreaName',
                            formatter: function(row){
                                if(row.AreaName){
                                    return row.FatherAreaName+'-'+row.AreaName
                                }else{
                                    return ''
                                } 
                                 },
                            data:labelCodeList,
                            width:length,
                            //panelHeight: 'auto',//高度自适应
                            multiple: false,
                            editable:true,//定义用户是否可以直接往文本域中输入文字
                            //直接过滤，数据太多时不行，太卡了，放弃
                            onLoadSuccess: function () {
                                
                            },
                            filter: function(q, row){
                                var opts = $(domId).combobox('options');
                                return row[opts.textField].indexOf(q) != -1;
                            },
                            onSelect:function(row){
                                if(row.AreaName == '' ||row.AreaName == undefined){
                                    var LableCodeName =''
                                }else{
                                    var LableCodeName =row.FatherAreaName+'-'+row.AreaName;
                                }
                                var HexadecimalCode = row.CountyHexadecimal;
                                for(var j = 0;j < schemelist.length;j++){
                                    if(schemelist[j].LableId == row.LableId){
                                        schemelist[j].LableCodeName = LableCodeName;
                                        schemelist[j].HexadecimalCode = HexadecimalCode;
                                        if(LableCodeName){
                                            schemelist[j].HexadecimalCodeList = HexadecimalCode
                                        } else{
                                            schemelist[j].HexadecimalCodeList = arrList.join(',')
                                        }
                                    }
                                }
                                //刷新表格数据
                                loadLabelCodeTable(schemelist);
                            }
                        });
                        var arr = []
                        for(var k = 0;k < labelCodeList.length;k++){
                            if((schemelist[i].LableCodeName!=undefined)&&(schemelist[i].LableCodeName == (labelCodeList[k].FatherAreaName+'-'+labelCodeList[k].AreaName))){
                                arr.push(labelCodeList[k].CountyHexadecimal)
                                schemelist[i].HexadecimalCode =  arr.join(',')
                                schemelist[i].HexadecimalCodeList = arr.join(',')
                            }
                            if(schemelist[i].LableCodeName==undefined){
                                schemelist[i].HexadecimalCode = ''
                                schemelist[i].HexadecimalCodeList = arrList.join(',')
                            }
                            if(schemelist[i].LableCodeName==''){
                                schemelist[i].HexadecimalCode = ''
                                schemelist[i].HexadecimalCodeList = arrList.join(',')
                            }
                        }
                        loadLabelCodeTable(schemelist);
                        //默认显示标识名称
                        if(schemelist[i].LableCodeName){
                            $(domId).combobox('setValue',schemelist[i].LableCodeName);
                            // $(domId).combobox('disable');
                        }else{
                            $(domId).combobox('setValue',schemelist[i].LableName);
                        }
                    },
                    error:function(error){
                        $.messager.alert('提示','接口调用失败!','error');
                    },
                    complete:function(){
                    }
                });
            }
        }
    }
}

//加载标识表格数据
function loadLabelCodeTable(tableData){
    //判断新划分的编码位置，与标准规范编码方案中对应位置标识的编码是否满足
    StandardToNew()
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData=[[
        // {field:'ck',checkbox:true},
        {field:'LableName', title: '标识名称',align:'center',width:100},
        {field:'LableCodeName',  title: '编码名称',align:'center',width:100},
        {field:'HexadecimalCode', title: '编码',align:'center',width:100,
         formatter:function(value,row,index){
            return '<input class="easyui-combobox labelCodeList" id="tablelabelCodeList'+row.LableId+'"/>'
        }},
        {field:'contrastFlag', title: '与标准规范编码对比',align:'center',width:100,
        formatter:function(value,row,index){
            if(row.contrastFlag == '1'){
                return '<span style="color:green">正确</span>'
            }else if(row.contrastFlag == '0'){
                return '<span style="color:red">错误</span>'
            }else{
                return '<span></span>'
            }
            
        }},
        {field:'BitLength', title: '长度(bit)',align:'center',width:100},
        {field:'Ipv6Position', title: '在128位地址中的地址',align:'center',width:100},
        {field:'operate',title: '操作',align:'center',width:50,
        formatter:function(value,row,index){
            return "<a style='color:#f40' class='operateBtn' onclick=delCodePlanItem(\'"+row.LableId+"\')>删除</a>"
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
    initComboboxlabelCode()////表格编码下拉框
}

//判断新划分的编码位置，与标准规范编码方案中对应位置标识的编码是否满足
function StandardToNew(){
    // IpTypeSchemeStandardList = {
    //     schemelist:[
    //         {
    //             BitLength: 20,
    //             CodeTableName: "IPv6LableCode",
    //             HexadecimalCode: "000AD,1AAAA,240E0",
    //             Ipv6Position: "1-20",
    //             LableCodeName: "240E:0",
    //             LableColor: "#C1FFC1",
    //             LableId: 1,
    //             LableName: "固定前缀",
    //             LableOrder: 1,
    //             SchemeId: 51,
    //             SeqId: 1643,
    //         },
    //         {
    //             BitLength: 8,
    //             CodeTableName: "IPv6LableCode",
    //             HexadecimalCode: "01-09,0B",
    //             Ipv6Position: "21-28",
    //             LableCodeName: "IDC用户地址",
    //             LableColor: "#FFE4B5",
    //             LableId: 2,
    //             LableName: "类型标识",
    //             LableOrder: 2,
    //             SchemeId: 51,
    //             SeqId: 1644,
    //         },
    //         {
    //             BitLength: 4,
    //             CodeTableName: "IPv6CountyCode",
    //             HexadecimalCode: "2,3,C-F,0-F",
    //             Ipv6Position: "29-32",
    //             LableCodeName: "广东",
    //             LableColor: "#FFF68F",
    //             LableId: 3,
    //             LableName: "省份标识",
    //             LableOrder: 3,
    //             SchemeId: 51,
    //             SeqId: 1645
    //         }
    //     ]
    // }
    // schemelist = [
    //     {
    //         BitLength: 20,
    //         CodeTableName: "IPv6LableCode",
    //         HexadecimalCode: "240E0",
    //         Ipv6Position: "1-20",
    //         LableCodeName: "240E:0",
    //         LableColor: "#C1FFC1",
    //         LableId: 1,
    //         LableName: "固定前缀",
    //         LableOrder: 1,
    //         SchemeId: 51,
    //         SeqId: 1643,
    //     },
    //     {
    //         BitLength: 4,
    //         CodeTableName: "IPv6LableCode",
    //         HexadecimalCode: "0",
    //         Ipv6Position: "21-24",
    //         LableCodeName: "IDC用户地址",
    //         LableColor: "#FFE4B5",
    //         LableId: 2,
    //         LableName: "类型标识",
    //         LableOrder: 2,
    //         SchemeId: 51,
    //         SeqId: 1644,
    //     },
    //     {
    //         BitLength: 8,
    //         CodeTableName: "IPv6CountyCode",
    //         HexadecimalCode: "02,03,7C-7F,B0-BF",
    //         Ipv6Position: "25-32",
    //         LableCodeName: "广东",
    //         LableColor: "#FFF68F",
    //         LableId: 3,
    //         LableName: "省份标识",
    //         LableOrder: 3,
    //         SchemeId: 51,
    //         SeqId: 1645
    //     },
    //     {
    //         BitLength: 8,
    //         CodeTableName: "IPv6CountyCode",
    //         HexadecimalCode: "02,03,7C-7F,B0-BF",
    //         Ipv6Position: "33-40",
    //         LableCodeName: "广东",
    //         LableColor: "#FFF68F",
    //         LableId: 3,
    //         LableName: "省份标识",
    //         LableOrder: 3,
    //         SchemeId: 51,
    //         SeqId: 1645
    //     }
    // ]
    let StandardSchemelist = IpTypeSchemeStandardList
    // console.log(StandardSchemelist)
    // console.log(schemelist)
// 编码比对举例说明：
    // 1.新划分标识“普通163拨号业务-ND地址池网段”，标识长度为12，位置为21-32。
// 在集团标准规范中，位置21-32为2个标识：接入类型，省份标识。接入类型标识长度为4，位置为21-24。省份标识长度为8，位置为25-32。则需要将新规划标识的编码，按21-24，25-32进行拆分，拆分后的编码分别与标准规范中的编码进行比对。若新规划标识的编码在标准规范中的编码范围内，则正确，否则错误。
    // 2.新划分标识“普通163拨号业务-ND地址池网段”，标识长度为8，位置为21-28。
// 在集团标准规范中，位置21-28为2个标识：接入类型，省份标识。接入类型标识长度为4，位置为21-24。省份标识长度为8，位置为25-32。其中省份标识，只占用25-28，则需要将省份标识的编码进行拆分，只比较25-28位置的编码。将新规划标识的编码，按21-24，25-28进行拆分，拆分后的编码分别与标准规范中的编码进行比对。若新规划标识的编码在标准规范中的编码范围内，则正确，否则错误。
for(var i =0;i<schemelist.length;i++){
    delete schemelist[i].contrastFlag 
    for(var j=0;j<StandardSchemelist.length;j++){
        let positionArr = schemelist[i].Ipv6Position.split('-') //当前index位置
        let positionArrS = StandardSchemelist[j].Ipv6Position.split('-')
        if(positionArr[0]>StandardSchemelist[StandardSchemelist.length-1].Ipv6Position.split('-')[1]){//对应到集团标准规范为子网空间
            schemelist[i].contrastFlag = ''       
         }else {//已设置的编码为空，则用下拉列表所有的值比较
            let HexadecimalCodeList = '' // 已设置编码
            
            if(schemelist[i].HexadecimalCode == ''){
                let domId = "#tablelabelCodeList" + schemelist[i].LableId;
                // console.log($(domId).combobox('getValues').join(","))
                // schemelist[i].contrastFlag = '' 
                HexadecimalCodeList = schemelist[i].HexadecimalCodeList
                // console.log(HexadecimalCodeList)
            }else{
                HexadecimalCodeList = schemelist[i].HexadecimalCode.replace(/:/g, "")
            }
            if(schemelist[i].Ipv6Position == StandardSchemelist[j].Ipv6Position){//当两个地址位置刚好相等
                if(includes(splitCode(StandardSchemelist[j].HexadecimalCode?(StandardSchemelist[j].HexadecimalCode.replace(/:/g, "")):''),splitCode(HexadecimalCodeList))){
                    schemelist[i].contrastFlag='1'
                }else{
                    schemelist[i].contrastFlag = '0'
                }
                break; 
            }else if(positionArrS[0]<= positionArr[0]&&positionArr[0]<positionArrS[1]){
                let positionS = '' 
                let positionE = ''
                if(positionArrS[1]<= positionArr[1]){
                    positionS = positionArr[0]
                    positionE = positionArrS[1]
                }else{
                    positionS = positionArr[0]
                    positionE = positionArr[1]
                }
                // console.log(i+'-'+j)
                // console.log(positionS+'-'+positionE)
                var arr =[]
                var arrS=[]
                splitCode(HexadecimalCodeList).filter((item,index) => {
                    arr.push(item.substr(0, (positionE-positionS+1)/4))
                }) // 新划分标识当前位置上存在的所有编码
                // console.log(unique(arr))
                splitCode(StandardSchemelist[j].HexadecimalCode.replace(/:/g, "")).filter((item,index) => {
                    arrS.push(item.substr((positionArr[0]-positionArrS[0])/4, (positionE-positionS+1)/4))
                })// 集团标准规范当前位置上存在的所有编码
                // console.log(unique(arrS))
                // console.log(schemelist[i].contrastFlag)
                if(includes(arrS,arr)){
                    if(schemelist[i].contrastFlag == undefined){
                        schemelist[i].contrastFlag='1'
                    }
                }else{
                    schemelist[i].contrastFlag='0'
                }
                // console.log( schemelist[i].contrastFlag)
            }
            else if(positionArrS[0]<= positionArr[1]&&positionArr[1]<positionArrS[1]){
                let positionS = positionArrS[0]
                let positionE = positionArr[1]
                // console.log(i+'-'+j)
                // console.log(positionS+'-'+positionE)
                var arr =[]
                var arrS=[]
                splitCode(HexadecimalCodeList).filter((item,index) => {
                    arr.push(item.substr((positionArrS[0]-positionArr[0])/4, (positionE-positionS+1)/4))
                }) // 新划分标识当前位置上存在的所有编码
                // console.log(unique(arr))
                splitCode(StandardSchemelist[j].HexadecimalCode.replace(/:/g, "")).filter((item,index) => {
                    arrS.push(item.substr(0, (positionE-positionS+1)/4))
                })// 集团标准规范当前位置上存在的所有编码
                // console.log(unique(arrS))
                if(includes(arrS,arr)){
                    if(schemelist[i].contrastFlag != '0'){
                        schemelist[i].contrastFlag='1'
                    } 
                }else{
                    schemelist[i].contrastFlag='0'
                }
                // console.log( schemelist[i].contrastFlag)
            }    
         }
    }
 }
//  console.log(schemelist)
}
//表格编码下拉框
function initComboboxlabelCode(){
        //编码下拉框
        for(var i = 0;i < schemelist.length;i++){
            //拆分获取所有下拉框的编码
            var HexadecimalCodeList = []
            if(schemelist[i].HexadecimalCodeList){
                var codeListArr= splitCode(schemelist[i].HexadecimalCodeList)
                codeListArr.forEach(function(item1,index1){
                    HexadecimalCodeList.push({
                        "HexadecimalCode":item1
                    })
                }) 
            }
            var domId1 = "#tablelabelCodeList" + schemelist[i].LableId;
            $(domId1).combobox({
                valueField:'HexadecimalCode',
                textField:'HexadecimalCode',
                data:HexadecimalCodeList,
                // width:201,
                //panelHeight: 'auto',//高度自适应
                multiple: true,
                editable:false,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                onLoadSuccess: function () {
                    
                },
                filter: function(q, row){
                    var opts = $(domId).combobox('options');
                    return row[opts.textField].indexOf(q) != -1;
                },
                onSelect:function(row){
                    // //联动编码方案数据
                    // for(var k = 0 ;k < schemelist.length; k++){
                    //     if(schemelist[k].LableId == LableId){
                    //         schemelist[k].HexadecimalCode = $(domId).co('getText')
                    //     }
                    // }
                    },
                });
            //拆分获取编码数组
            var HexadecimalCode = []
            if(schemelist[i].HexadecimalCode){
                var codeListArr= splitCode(schemelist[i].HexadecimalCode)
                codeListArr.forEach(function(item1,index1){
                    HexadecimalCode.push(item1)
                }) 
            }
            //下拉框赋值
            $(domId1).combobox('setValues',HexadecimalCode);
        }
}

//删除新划分的编码方案
function delCodePlanItem(LableId){
    schemelist = schemelist.filter(function(ele,idx,arr){
        return ele.LableId != LableId;
    });
    for(var i = 0; i<schemelist.length;i++){
        if(i == 0){
            schemelist[i].Ipv6Position=1 +'-'+Number(schemelist[i].BitLength)
        }else{
            schemelist[i].Ipv6Position=Number(schemelist[i-1].Ipv6Position.split('-')[1]) + 1 +'-'+(Number(schemelist[i-1].Ipv6Position.split('-')[1])+Number(schemelist[i].BitLength))
        }
    }
    //删除表格信息
    loadLabelCodeTable(schemelist);
    //重新加载编码方案展示信息
    $(".schemeItem").remove();//情况已有编码方案
    if(FatherTypeCode){//继承父节点编码方案
        var content = loadCodePlanContentByFather(schemelist);//刷新编码方案信息
        $(".planItemBox").append(content);
        initComboboxDataByFather();//加载下拉框数据
    }else{
        var content = loadCodePlanContent(schemelist);//刷新编码方案信息
        $(".planItemBox").append(content);
        initComboboxData();//加载下拉框数据
    }
    initDiviceBtnClickEvent();//初始化划分事件
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

//根据AreaCode去重，十六进制编码合并
function mergeCodeByAreaCode(beforeData){
    var afterData = []
    var tempArr = []
    for (var i = 0; i < beforeData.length; i++) {
      if (tempArr.indexOf(beforeData[i].AreaCode) === -1) {
        afterData.push(beforeData[i])
        tempArr.push(beforeData[i].AreaCode)
      } else {
        for (var j = 0; j < afterData.length; j++) {
          if (afterData[j].AreaCode == beforeData[i].AreaCode) {
            afterData[j].CountyHexadecimal = afterData[j].CountyHexadecimal + ',' + beforeData[i].CountyHexadecimal;
            break
          }
        }
      }
    }
    return afterData
}

//编码集合转化成数组
function splitCode(code){
    var codeList = []
    if(code!=undefined){
        if(code.indexOf(',') != -1){
            code.split(',').forEach(function(item,index){
                if(item.indexOf('-') != -1){
                    var codeArr=item.split("-") 
                    var len =codeArr[0].length
                    for(var i = parseInt(codeArr[0], 16); i <= parseInt(codeArr[1], 16);i++){
                        codeList.push(prefixZero(i.toString(16).toUpperCase(),len))
                    }
                }else{
                    codeList.push(item)
                }
            })
        }else{
            if(code.indexOf('-') != -1){
                var codeArr=code.split("-") 
                var len =codeArr[0].length
                for(var i = parseInt(codeArr[0], 16); i <= parseInt(codeArr[1], 16);i++){
                    codeList.push(prefixZero(i.toString(16).toUpperCase(),len))
                }
            }else{
                codeList.push(code)
            }
        }
    }
    return codeList
}
//位数不够左侧补零
function prefixZero(n,m){
	var _a = (Array(m).join(0) + n).slice(-m);
	return _a;
}
//去重
function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        if (array .indexOf(arr[i]) === -1) {
            array .push(arr[i])
        }
    }
    return array;
}
function includes(arr1, arr2) {
    return arr2.every(val => arr1.includes(val));
  }

