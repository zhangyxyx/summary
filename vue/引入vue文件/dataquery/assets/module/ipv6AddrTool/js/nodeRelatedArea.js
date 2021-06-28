$(function(){
	var urlObj = new UrlSearch();
	NodeCode = urlObj.nodecode;
	getProvince()	
	initSubmitClickEvent();
});

/** 
 * combobox和combotree模糊查询 
 */ 
(function(){  
    //combobox可编辑，自定义模糊查询  
    $.fn.combobox.defaults.editable = true;  
    $.fn.combobox.defaults.filter = function(q, row){  
        var opts = $(this).combobox('options');  
        return row[opts.textField].indexOf(q) >= 0;  
    };  
    //combotree可编辑，自定义模糊查询  
    $.fn.combotree.defaults.editable = true;  
    $.extend($.fn.combotree.defaults.keyHandler,{  
        up:function(){  
            console.log('up');  
        },  
        down:function(){  
            console.log('down');  
        },  
        enter:function(){  
            console.log('enter');  
        },  
        query:function(q){  
            var t = $(this).combotree('tree');  
            var nodes = t.tree('getChildren');  
            for(var i=0; i<nodes.length; i++){  
                var node = nodes[i];  
                if (node.text.indexOf(q) >= 0){  
                    $(node.target).show();  
                } else {  
                    $(node.target).hide();  
                }  
            }  
            var opts = $(this).combotree('options');  
            if (!opts.hasSetEvents){  
                opts.hasSetEvents = true;  
                var onShowPanel = opts.onShowPanel;  
                opts.onShowPanel = function(){  
                    var nodes = t.tree('getChildren');  
                    for(var i=0; i<nodes.length; i++){  
                        $(nodes[i].target).show();  
                    }  
                    onShowPanel.call(this);  
                };  
                $(this).combo('options').onShowPanel = opts.onShowPanel;  
            }  
        }  
    });  
})(jQuery);  
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
var userName = jQuery.ITE.getLoginName('loginName');//登录用户
var NodeCode = '';//节点
var AreaCode = '';//节点配置区县信息
function getAreaInfo(){
	$.ajax({
        url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetNodeAreaCode?NodeCode='+NodeCode),
        type:'post',
        cache:false,
        data:{},
        dataType:'json',
        contentType:"application/json",
        success:function(obj){  
			if(obj.data){
				AreaCode = obj.data.AreaCode;
				if(AreaCode != '' ){//如果已经配置好，默认展示
				 $('#areaList').combotree('setValue',AreaCode);
			 }
			}
        }
    });
}
function getProvince(){
	$.ajax({
		url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/GetAllAreaInfoList'),
		type:'post',
		data:{},
		dataType:'json',
		contentType:"application/json",
		success:function(obj){     
			let areaList = parseList(obj.data); 
			// var len = $(".length").width()                        
			$("#areaList").combotree({
				idField:'AreaCode',
				textField:'AreaName',
				data:areaList,
				width:160,
				//panelHeight: 'auto',//高度自适应
				multiple: false,
                // editable:false,//定义用户是否可以直接往文本域中输入文字
                //直接过滤，数据太多时不行，太卡了，放弃
                // onLoadSuccess: function () {
                //     $("#areaList").combotree('tree').tree("collapseAll");
                // },
                // filter: function(q, row){
                //     var opts = $(this).combobox('options');
		        //     return row[opts.textField].indexOf(q) == 0;
                // },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                // keyHandler: {
                //     query: function(q, e) {
                //         $('#areaList').combotree('tree').tree('doFilter', q)
                //     }
                // },
				onBeforeSelect:function(row){ //节点被选中前触发，返回 false 则取消选择动作(但是返回false，下拉选项依旧会关闭)
					
				},
				onSelect:function(row){
					
				}
			});
			getAreaInfo();
		}
	}); 
} 

//初始化确认按钮点击事件
function initSubmitClickEvent(){
	$("#submitBtn").click(function(){
		var selectAreaCode = $("#areaList").combobox('getValue');
		if(selectAreaCode == ''){
			$.messager.alert('提示','请先选择区域!','warning');
            return;
		}

		if(AreaCode != ''){//修改
            var params = {
				NodeCode:NodeCode,
				AreaCode:selectAreaCode			
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/ModNodeAreaCode'),
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
					$.messager.progress('close');
                    if(obj.code == "0000"){
                        $.messager.alert('提示','修改成功！','success');
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
				NodeCode:NodeCode,
				AreaCode:selectAreaCode			
            }
            $.ajax({
                url:encodeURI(bathPath+'/ipaddrmodule/Ipv6/Ipv6AreaCodeMng/AddNodeAreaCode'),
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
					$.messager.progress('close');
                    if(obj.code == "0000"){
                        $.messager.alert('提示','新增成功！','success');
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

function parseList(list){
	    //创建一个对象命名为map
		var map = {};
		var level = 0;
		var count = 0;//判断跟节点是否是省节点
		for(var i=0;i<list.length;i++){
			if(list[i].LevelFlag == 1){
				level = 1;
			}
			if(list[i].LevelFlag == 2){
				count++;
			}
		}
		//通过遍历把list中的元素放到map对象中
		list.forEach(function(item){
			if(!map[item.AreaCode]){
		    //核心步骤1：map中的'item.id'属性指向list数组中的对象元素
				map[item.AreaCode]=item;
			}
		});
		if(level == 1 && count >= 0){//全国节点
			level = 1;
		}else if(level == 0 && count == 1){//省节点
			level = 2;
		}else{//地市节点
			level = 3;
		}
	    //再次遍历为了对map属性所指的对象进行处理
		list.forEach(function(item){
	        //过滤父级id不是null的元素
			if(item.LevelFlag!=level){
	            //map[item.pid]为该元素的父级元素
				map[item.FatherAreaCode].children ? map[item.FatherAreaCode].children.push(item):map[item.FatherAreaCode].children=[item];
			}
		});
	    //过滤后仅剩下根节点
		return list.filter(function(item){
			if(item.LevelFlag==level){
				return item;
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