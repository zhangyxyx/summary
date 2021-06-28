$(function(){
    getIpTypeSchemeList();
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
var tableData;//保存表格数据
var IpTypeCode;//地址类型编码
var ipTypeList;//点击加号筛选的信息
//获取区县编码数据
function getIpTypeSchemeList(){
    $.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeMng/GetIpTypeSchemeList'),
        type:'POST',
        data:{},
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {
            
        },
        success:function(obj){
            tableData = obj.data[0].children;//TypeLevel=1不显示 
            tableData.forEach(function(item,index){
                if(item.schemelist.length == 0 && item.TypeLevel == '2'){
                    item.schemelist = getIpTypeSchemeStandardList(item.IpTypeCode)
                    // console.log(getIpTypeSchemeStandardList(item.IpTypeCode))
                }
            })
            // console.log(tableData)
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
        {field:'IpTypeName', title: '地址类型',align:'center',width:50,
            formatter:function(value,row,index){
                if(row.children.length == 0){
                    return '<span style="margin-left:25px">'+value+'</span>';
                }else{
                    return '<span class="icon iconfont icon-jiahao first" style="margin-right:4px" IpTypeCode='+row.IpTypeCode+' onclick="initClickTableEvent(this)"></span><span>'+value+'</span>';
                }
            }
        },
        {field:'operate',title: '操作',align:'center',width:10,
        formatter:function(value,row,index){
            return "<a class='operateBtn' onclick=\"codePlanEditEvent(\'"+row.IpTypeCode+"\',\'"+row.IpTypeName+"\','',\'"+row.SchemId+"\',\'"+row.TypeLevel+"\')\">编辑</a>";
        }},
        {field:'Name', title: '编码方案',align:'center',width:150,
        formatter:function(value,row,index){
            return loadCodePlanContent(row.schemelist,row.TypeLevel);
        }},
    ]];
    var tableId="dataList";
    var tableH=$(".tablePanel").height();;
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
    //initClickTableEvent();
}

//编码方案编辑
function codePlanEditEvent(ipTypeCode,IpTypeName,topIpTypeName,SchemId,TypeLevel){
    //获得当前点击的地址编码
    IpTypeCode = ipTypeCode;
    getIpTypeInfo(tableData);
    if(ipTypeList.schemelist.length == 0 && TypeLevel > 2){
        //当前编码方案未定义,地址类型的typelevel>2
        //判断父节点是否定义了编码方案
        var FatherTypeCode = ipTypeList.FatherTypeCode;
        $.ajax({
            url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6SchemeMng/GetOneIpTypeScheme?IpTypeCode='+FatherTypeCode),
            type:'POST',
            data:{},
            dataType:'json',
            contentType: 'application/json;chartset=UTF-8',
            beforeSend: function () {
                
            },
            success:function(obj){
                var schemelist = obj.data[0].schemelist;
                if(schemelist.length == 0){
                    $.messager.alert('提示','先定义父地址类型的编码方案!','warning');
                }else{
                    // window.open('views/jsp/ipv6CodeMag/ipv6CodePlanEdit.jsp?IpTypeCode='+ipTypeCode+'&IpTypeName='+IpTypeName+'&topIpTypeName='+topIpTypeName+'&SchemId='+SchemId+'&FatherTypeCode='+FatherTypeCode);
                    window.top.$vm.$openTab({
                        name: 'IPv6编码方案编辑',
                        path:bathPath+'/ipaddrmodule/views/jsp/ipv6CodeMag/ipv6CodePlanEdit.jsp?IpTypeCode='+ipTypeCode+'&IpTypeName='+IpTypeName+'&topIpTypeName='+topIpTypeName+'&SchemId='+SchemId+'&FatherTypeCode='+FatherTypeCode
                    })
                }
            },
            error:function(error){
                $.messager.alert('提示','接口调用失败!','error');
            },
            complete:function(){
            }
        });
    }else{//自身纯在
        // window.open('views/jsp/ipv6CodeMag/ipv6CodePlanEdit.jsp?IpTypeCode='+ipTypeCode+'&IpTypeName='+IpTypeName+'&SchemId='+SchemId+'&topIpTypeName='+topIpTypeName);
        window.top.$vm.$openTab({
            name: 'IPv6编码方案编辑',
            path:bathPath+'/ipaddrmodule/views/jsp/ipv6CodeMag/ipv6CodePlanEdit.jsp?IpTypeCode='+ipTypeCode+'&IpTypeName='+IpTypeName+'&SchemId='+SchemId+'&topIpTypeName='+topIpTypeName
        })
    }
}

//编码方案内容
function loadCodePlanContent(schemelist,TypeLevel){
    var len = 0;
    var content = '';
    var itemWidth = "itemWidth"+schemelist.length;//宽度均分
    for(var i = 0;i < schemelist.length;i++){
        len += Number(schemelist[i].BitLength);
    }
    var spaceLen = 64 - len;
    if(spaceLen == 0){
        itemWidth = "itemWidthDeal"+schemelist.length;
    }
    for(var i = 0;i < schemelist.length;i++){
        if(schemelist[i].LableCodeName != "" && schemelist[i].LableCodeName != undefined){
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'" title='+schemelist[i].LableCodeName+'('+schemelist[i].BitLength+')'+'>'+schemelist[i].LableCodeName+'('+schemelist[i].BitLength+')'+'</div>'
        }else{
            content += '<div class="schemeItem '+itemWidth+'" style="background-color:'+schemelist[i].LableColor+'" title='+schemelist[i].LableName+'('+schemelist[i].BitLength+')'+'>'+schemelist[i].LableName+'('+schemelist[i].BitLength+')'+'</div>'
        }        
        
    } 
    if(schemelist.length != 0){
        if(spaceLen == 0){
            content += '<div class="schemeBox">';
            // content += '<div class="schemeItem subnetSpace">子网空间（'+spaceLen+'）</div>';
            content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
            content += '</div>';
        }else{
            content += '<div class="schemeBox">';
            content += '<div class="schemeItem subnetSpace">子网空间（'+spaceLen+'）</div>';
            content += '<div class="schemeItem interfaceAddr">接口地址（64）</div>';
            content += '</div>';
        }
    }else{
        if(TypeLevel == '2'){
            content += '<div class="schemeBox">';
            content += '<div class="schemeItem schemeItem1 subnetSpace">子网空间（64）</div>';
            content += '<div class="schemeItem schemeItem1 interfaceAddr">接口地址（64）</div>';
            content += '</div>';
        }else{
            content += '<div class="schemeBox">';
            content += '</div>';
        }
            
    }
    return content;
}

//初始化加减号按钮点击事件
function initClickTableEvent(e){
    //$(".icon").click(function(){
        if($(e).hasClass("icon-jiahao")){//打开
            //切换符号
            $(e).removeClass("icon-jiahao");
            $(e).addClass("icon-jianhao3");
            //获得当前点击的地址编码
            IpTypeCode = $(e).attr("IpTypeCode");
            getIpTypeInfo(tableData);
            
            //获取到当前点击图标所对应的tr
            let trP = '';
            let index = '';
            if($(e).hasClass("first")){//第一次节点
                trP = $(e).parent().parent().parent();
                index = trP.attr("datagrid-row-index");
            }else{
                trP = $(e).parent().parent();
                index = trP.attr("datagrid-row-index");
            }
            //遍历生成子节点
            var len = ipTypeList.children.length;
            ipTypeList.children.forEach(function(item,index){
                if(item.schemelist.length == 0 && item.TypeLevel == '2'){
                    item = getIpTypeSchemeStandardList(item.IpTypeCode)
                }
            })
            for(var i = 0;i < len ;i++){//倒序追加
                let content = '';
                var rowIndex = index +''+ (len-1-i).toString();//每行的唯一标识
                var marginLeft = $(e).css('marginLeft');//当前点击的margin-left
                var MarginLeftHasChild = 20 + Number(marginLeft.slice(0,marginLeft.length-2)) + 'px';
                var MarginLeftNoChild = 40 + Number(marginLeft.slice(0,marginLeft.length-2)) + 'px';
                content += '<tr class="trAdd trAdd'+index+'" datagrid-row-index='+rowIndex+'>';
                if(ipTypeList.children[len-1-i].children.length == 0){
                    content += '<td><span style="margin-left:'+MarginLeftNoChild+'">'+ipTypeList.children[len-1-i].IpTypeName+'</span></td>';
                }else{//如果有子节点
                    content += '<td><span class="icon iconfont icon-jiahao" style="margin-right:4px;margin-left:'+MarginLeftHasChild+'" IpTypeCode='+ipTypeList.children[len-1-i].IpTypeCode+' onclick="initClickTableEvent(this)"></span><span>'+ipTypeList.children[len-1-i].IpTypeName+'</span></td>';
                }
                content += '<td style="text-align:center"><a class="operateBtn" onclick=codePlanEditEvent(\''+ipTypeList.children[len-1-i].IpTypeCode+'\',\''+ipTypeList.children[len-1-i].IpTypeName+'\',\''+ipTypeList.IpTypeName+'\',\''+ipTypeList.children[len-1-i].SchemId+'\',\''+ipTypeList.children[len-1-i].TypeLevel+'\')>编辑</a></td>';
                content += '<td style="text-align:center">'+loadCodePlanContent(ipTypeList.children[len-1-i].schemelist,ipTypeList.children[len-1-i].TypeLevel)+'</td>';
                content += '</tr>'
                trP.after(content);
            }
            //initClickTableEvent();//初始化按钮点击事件
        }else{//关闭
            $(e).removeClass("icon-jianhao3");
            $(e).addClass("icon-jiahao");
            //获取到当前点击图标所对应的tr
            let trP = '';
            let index = '';
            if($(e).hasClass("first")){//第一次节点
                trP = $(e).parent().parent().parent();
                index = trP.attr("datagrid-row-index");
            }else{
                trP = $(e).parent().parent();
                index = trP.attr("datagrid-row-index");
            }
            //移除当前点击下的所有子节点
            $(".trAdd").each(function(i){
                if($(this).attr("datagrid-row-index").indexOf(index) == 0 && $(this).attr("datagrid-row-index") != index){//自己不能删除
                    $(this).remove();
                }
            })
        }
    //});
}

//获取当前点击地址类型的信息
function getIpTypeInfo(data){
    data.forEach((item) => { //利用foreach循环遍历
        if(item.IpTypeCode == IpTypeCode){//判断递归结束条件  
            ipTypeList = item;
            return;
        }else if(item.children && item.children.length > 0 ){//判断chlidren是否有数据
            getIpTypeInfo(item.children);  //递归调用                      
        }                   
    })
    return ipTypeList;
};

//若地址类型对应编码方案为空，则需要按地址类型（只有typelevel=2的地址类型需要查询），查询集团标准规范定义
function getIpTypeSchemeStandardList(IpTypeCode){
        let params = {
            ipTypeCode:IpTypeCode,
            scope:'equals'
        }
        let returnData;
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
                returnData =  data.data[0].schemelist
            },
            error:function(error){
                $.messager.alert('提示','接口调用失败!','error');
            },
            complete:function(){
            }
        });
        return returnData;
};