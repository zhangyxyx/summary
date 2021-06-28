(function() { 
    jQuery.ITE = {
            /**
             * [desc] 根据cookie的key得到对应的value值
             * @param {Object} cookieKey
             * 
             */
            getCookieValue: function(cookieKey) {
                var cookieStr = document.cookie;
                var cookieStrArr = cookieStr.split('; ');
                var cookieMap = {};
                if (cookieStrArr && cookieStrArr.length > 0) {
                    for (var i = 0; i < cookieStrArr.length; i++) {
                        var key = cookieStrArr[i].split('=')[0];
                        var value = cookieStrArr[i].split('=')[1];
                        cookieMap[key] = value;
                    }
                }
                //取消拦截本地测试
                //cookieMap['zy_token'] = 'web_123456';
                return cookieMap[cookieKey];
            },
            getLoginName: function(cookieKey) {
                var cookieStr = document.cookie;
                var cookieStrArr = cookieStr.split('; ');
                var cookieMap = {};
                if (cookieStrArr && cookieStrArr.length > 0) {
                    for (var i = 0; i < cookieStrArr.length; i++) {
                        var key = cookieStrArr[i].split('=')[0];
                        var value = cookieStrArr[i].split('=')[1];
                        cookieMap[key] = value;
                    }
                }
                //取消拦截本地测试
                //cookieMap['zy_token'] = 'web_123456';
                return cookieMap['loginName'];
            },
            // getLoginName: function () {
            //     var loginname =  $.ITE.getCookieValue('gwpageN');
            //     if(loginname && loginname.length>0){
            //         var nloginname = strDec(loginname,"1","2","2");
            //         return nloginname;    
            //     }else{
            //          window.location.href = '/views/jsp/sys/loginOut.jsp';
            //     }

            // },

            /**
             * 初始化Session信息，每次ajax请求需要增加请求头，便于服务端网关识别权限
             */
            initAjaxSessionToken: function() {
                var token = $.ITE.getCookieValue('zy_token');
                if (!token) {

                } else {
                    $.ajaxSetup({
                        "headers": {
                            zy_token: token,
                        }
                    })
                }
            },

            /**切换环境修改1
             * 获取URL前缀
             * @returns {string}
             */
            getUrlPrifix: function() {
                //return "http://192.168.6.70:16281/";
                return "";
            },

            /** 切换环境需改2
             * 微服务统一管理URL 路径
             * @returns {string}  
             */
            getajaxUrl: function() {
                //return "http://192.168.6.70:16281/api/api/dev/v1";
                return "/api/api/dev/v1";
            },

            //12476--3A重构任务url
            getajaxUrlAAA: function() {
                //return "http://192.168.6.70:16281/api/api/dev/v1";
                return "/tacacsapi/v1";
            },

            //切换环境需改3
            //改公用文件的时候把下面的IP 改为sub推送服务所在的ip 和端口地址  不加/ 
            getsubip: function() {
                return "http://192.168.6.120:16281";
            },

            //ipv4路径
            getajaxUrlIpv4: function() {
                //return "http://192.168.6.70:16281/api/api/dev/v1";
                return "/ipmanage";
            },

            /**
             * 解析url参数
             * @return 
             */
            getUrlRequest: function() {
                var urlRequest = {};
                var name, value;
                var str = location.href; //取得整个地址
                var num = str.indexOf("?");
                str = str.substr(num + 1); //取得所有参  stringvar.substr(start [, length ]

                var arr = str.split("&"); //各个参数放到数组
                for (var i = 0; i < arr.length; i++) {
                    num = arr[i].indexOf("=");
                    if (num > 0) {
                        name = arr[i].substring(0, num);
                        value = arr[i].substr(num + 1);
                        urlRequest[name] = decodeURI(value);
                    }
                }
                return urlRequest;
            },
            windowOpen:function(){
                if(!window.top.$vm){
                    window.top.$vm={'$openTab': function(obj){
                        window.open(obj.path)
                    }}    
                }
            }
        } //end 

    //初始化Session信息
    $.ITE.initAjaxSessionToken();
    $.ITE.windowOpen()
})(jQuery);

//网关拦截
function checkWebselr(msg) {
    var returnmsg = '';
    var token = $.ITE.getCookieValue('zy_token');
    if (!token) {
        var currentUrl = window.location.href;
        var loginUrl = "/views/jsp/sys/login.jsp";
        if (currentUrl.indexOf(loginUrl) < 0) {
            window.location.href = loginUrl;
        }
    } else {
        $.ajaxSetup({
            "headers": {
                zy_token: $.ITE.getCookieValue('zy_token'),
            }
        })
    }
    $.ajax({
        url: $.ITE.getUrlPrifix() + 'param/queryParams',
        async: false,
        type: 'post',
        data: {
            'url': msg
        },
        dataType: 'json',
        success: function(data) {
            console.log(data);
            if (data.code && data.code == 200) {
                var obj = data.data;
                returnmsg = true;
                for (var i = 0; i < obj.length; i++) {
                    var flag = param_valid_form(obj[i].jsonparam, obj[i].type, obj[i].rule, obj[i].length, obj[i].notnull);
                    if (flag == false) {
                        returnmsg = false;
                        break;
                    }
                }

            }
        }

    })
    return returnmsg;
}


String.prototype.gblen = function() {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len += 2;
        } else {
            len++;
        }
    }
    return len;
};
// id-- 输入框的ID    type -- 额外增加的自定义校验规则  rule -- 是规则的字符串
//length >5  那么大于5的就是非法     notnull 非空校验 需要写Y
function param_valid_form(id, type, rule, length, notnull) {
    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    function param_valid_xss(str) {
        str = str.replace(/\s+/g, '');
        if (/eval((.*?))/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/<script>|<\/script>/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/<("[^"]*"|'[^']*'|[^'">])*>|>("[^"]*"|'[^']*'|[^'">])*<|'|"/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/((?=[\x21-\x7e]+)[^A-Za-z0-9])/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/expression((.*?))/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/(javascript:|vbscript:|view-source:)/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/window.location|window.|.location|document.cookie|document.|alert(.*?)|window.open()/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/(oncontrolselect|oncopy|oncut|ondataavailable|ondatasetchanged|ondatasetcomplete|ondblclick|ondeactivate|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|onerror=|onerroupdate|onfilterchange|onfinish|onfocus|onfocusin|onfocusout|onhelp|onkeydown|onkeypress|onkeyup|onlayoutcomplete|onload|onlosecapture|onmousedown|onmouseenter|onmouseleave|onmousemove|onmousout|onmouseover|onmouseup|onmousewheel|onmove|onmoveend|onmovestart|onabort|onactivate|onafterprint|onafterupdate|onbefore|onbeforeactivate|onbeforecopy|onbeforecut|onbeforedeactivate|onbeforeeditocus|onbeforepaste|onbeforeprint|onbeforeunload|onbeforeupdate|onblur|onbounce|oncellchange|onchange|onclick|oncontextmenu|onpaste|onpropertychange|onreadystatechange|onreset|onresize|onresizend|onresizestart|onrowenter|onrowexit|onrowsdelete|onrowsinserted|onscroll|onselect|onselectionchange|onselectstart|onstart|onstop|onsubmit|onunload)/.test(str.toLocaleLowerCase())) {
            return false;
        }
        return true;
    }
    if ($('#' + id + '').val() == undefined) {
        return true;
    }
    if (type && type == 'notmatch' && rule && rule.length > 0) {
        //在有正则匹配的时候 不需要再进行XSS 和 SQL 注入的校验
    } else {
        if (!param_valid_xss(trim($('#' + id + '').val()))) {
            return false;
        }
        if (/'|and|exec|execute|insert|select|delete|update|count|drop|chr|mid|master|truncate|char|declare|sitename|net user|xp_cmdshell|;|or|,|like'|and|exec|execute|insert|create|drop|table|from|grant|use|group_concat|column_name|information_schema.columns|table_schema|union|where|select|delete|update|order|by|count|chr|mid|master|truncate|char|declare|or|;|,|like|#/.test(trim($('#' + id + '').val()).toLocaleLowerCase())) {
            return false;
        }
    }


    //notnull字段为Y有这段，其他情况不需要加
    if (notnull && notnull == 'Y') {
        if (trim($('#' + id + '').val()) == '') {
            return false;
        }
    }


    //length
    if (length && length.length > 0) {
        //  if (trim($('#'+id+'').val()).gblen() == 2) {
        //     return false;
        // }
        var vallen = trim($('#' + id + '').val());
        var fuhao = length.slice(0, 1);
        var valbeg = length.slice(1);
        if (fuhao == '>') {
            if (vallen.length > valbeg) {
                return false;
            }
        } else if (fuhao == '<') {
            if (vallen.length < valbeg) {
                return false;
            }
        }
    }

    if (type && type.length > 0) {
        if (type == 'include' && rule && rule.length > 0) {
            var rule = rule;
            var arr = rule.split('|');
            for (var i = 0; i < arr.length; i++) {
                if (trim($('#' + id + '').val()).indexOf(arr[i]) > -1) {
                    return false;
                }
            }
        } else if (type == 'match' && rule && rule.length > 0) {
            var rul = '/' + rule + '/';
            rul = eval(rul);
            if (rul.test(trim($('#' + id + '').val()))) {
                return false;
            }
        } else if (type == 'notmatch' && rule && rule.length > 0) {
            var rul = '/' + rule + '/';
            rul = eval(rul);
            if (trim($('#' + id + '').val()) != '' && !(rul.test(trim($('#' + id + '').val())))) {
                return false;
            }
        }
    }
    return true;
}



/**
 * 初始化datatable
 */
var dataTableLanguage = {
    "sProcessing": "正在加载中......",
    "sLengthMenu": "每页显示 _MENU_ 条记录",
    "sZeroRecords": "对不起，查询不到相关数据！",
    "sEmptyTable": "表中无数据存在！",
    "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
    "sInfoFiltered": "数据表中共为 _TOTAL_ 条记录",
    "sSearch": "搜索",
    "oPaginate": {
        "sFirst": "首页",
        "sPrevious": "上一页",
        "sNext": "下一页",
        "sLast": "末页"
    }
};

/**
 * datatable异步加载数据后，根据配置信息和分页信息生成分页列表
 * @param settings 配置信息
 * @param pagination 分页数据
 * @returns {*}
 */
var generatePaginationHtml = function(settings, pagination) {
    if (!pagination) {
        return "";
    }
    console.log(settings)
        //每页显示条数
    var pageSizeArr = [15, 20, 30, 50, 100];
    var pageSizeOptionHtml = '';
    for (var i = 0; i < pageSizeArr.length; i++) {
        pageSizeOptionHtml += '<option value="' + pageSizeArr[i] + '"' + (pagination.pageSize == pageSizeArr[i] ? ' selected' : '') + '>' + pageSizeArr[i] + '</option>';
    }

    //分页按钮
    var paginateButtonHtml = '';
    var paginateButtonMaxNum = 5; //最多5个数字按钮

    //增加首页和下一页按钮
    var priviousPageNum = pagination.pageNum - 1;
    priviousPageNum = priviousPageNum == 0 ? 1 : priviousPageNum;
    var nextPageNum = pagination.pageNum + 1;
    nextPageNum = nextPageNum < pagination.pages ? nextPageNum : pagination.pages;

    paginateButtonHtml += '<li class="paginate_button first' + (pagination.pageNum <= 1 ? ' disabled' : '') + '" id="datatable-buttons_previous"><a href="javascript:void(0);" data-value="1" aria-controls="datatable-buttons" data-dt-idx="0" tabindex="0" title="首页"><i class="fa fa-step-backward"></i></a></li>' +
        '<li class="paginate_button previous' + (pagination.pageNum <= 1 ? ' disabled' : '') + '" id="datatable-buttons_previous"><a href="javascript:void(0);" data-value="' + priviousPageNum + '" aria-controls="datatable-buttons" data-dt-idx="1" tabindex="0" title="上一页"><i class="fa fa-backward"></i></a></li>';

    if (pagination.pageNum <= 3 || pagination.pages <= 5) {
        for (var i = 1, j = 1; i <= pagination.pages && j <= paginateButtonMaxNum; i++, j++) {
            paginateButtonHtml += '<li class="paginate_button' + (pagination.pageNum == i ? ' active' : '') + '"><a href="javascript:void(0)" data-value="' + i + '" aria-controls="datatable-buttons" data-dt-idx="' + (j + 1) + '" tabindex="0">' + i + '</a></li>'
        }
    } else if (pagination.pages - pagination.pageNum < 3) {
        for (var i = pagination.pages - 4, j = 1; i <= pagination.pages && j <= paginateButtonMaxNum; i++, j++) {
            paginateButtonHtml += '<li class="paginate_button' + (pagination.pageNum == i ? ' active' : '') + '"><a href="javascript:void(0)" data-value="' + i + '" aria-controls="datatable-buttons" data-dt-idx="' + (j + 1) + '" tabindex="0">' + i + '</a></li>'
        }
    } else {
        for (var i = pagination.pageNum - 2, j = 1; i <= pagination.pages && j <= paginateButtonMaxNum; i++, j++) {
            paginateButtonHtml += '<li class="paginate_button' + (pagination.pageNum == i ? ' active' : '') + '"><a href="javascript:void(0)" data-value="' + i + '" aria-controls="datatable-buttons" data-dt-idx="' + (j + 1) + '" tabindex="0">' + i + '</a></li>'
        }
    }

    //增加下一页和尾页按钮
    paginateButtonHtml += '<li class="paginate_button next' + (pagination.pageNum == pagination.pages ? ' disabled' : '') + '" id="datatable-buttons_next"><a href="javascript:void(0);" data-value="' + nextPageNum + '" aria-controls="datatable-buttons" data-dt-idx="8" tabindex="0" title="下一页"><i class="fa fa-forward"></i></a></li>' +
        '<li class="paginate_button last' + (pagination.pageNum == pagination.pages ? ' disabled' : '') + '" id="datatable-buttons_next"><a href="javascript:void(0);" data-value="' + pagination.pages + '" aria-controls="datatable-buttons" data-dt-idx="9" tabindex="0" title="尾页"><i class="fa fa-step-forward"></i></a></li>';

    //分页信息
    //分页页脚信息
    var pageInfoHtml = '<div class="dataTables_info pagination-info" id="tableList_info" >' +
        '共 ' + pagination.total + ' 条 | ' + pagination.pageNum + '/' + pagination.pages + ' 页 | 每页显示' +
        '<select name="pageSize">' + pageSizeOptionHtml + '</select>' +
        '条 | 跳转至第' +
        '<input type="number" name="pageNum" min="1" max="' + pagination.pages + '" value="' + pagination.pageNum + '">' +
        '页' + '</div>';
    $('#' + settings.sTableId).closest('div.row').next('div.row').children('div:first').html(pageInfoHtml);
    var paginationHtml = '<div class="dataTables_paginate">' +
        '<ul class="pagination">' + paginateButtonHtml + '</ul>' +
        '</div>';
    $('#' + settings.sTableId).closest('div.row').next('div.row').children('div:last').html(paginationHtml);

    //分页页码点击事件
    $('ul.pagination li.paginate_button:not(".active, .disabled")').click(function() {
        $(this).addClass('active').siblings('.active').removeClass('active');
        addPageNumHiddenHtml(settings.sTableId, $(this).children('a').data('value'));
        loadTableData();
    })

    //分页显示数量变化事件
    $('.pagination-info select[name="pageSize"]').change(function() {
        addPageSizeHiddenHtml(settings.sTableId, $(this).children('option:selected').val());
        loadTableData();
    })

    //分页指定页码跳转事件
    $('.pagination-info input[name="pageNum"]').keydown(function(e) {
        //按回车键查询
        if (e.keyCode == 13) {
            addPageNumHiddenHtml(settings.sTableId, $(this).val());
            loadTableData();
        }
    })
}

var addPageNumHiddenHtml = function(formId, val) {
    $('#' + formId).children('#pageNum').remove();
    $('#' + formId).prepend('<input type="hidden" id="pageNum" value="' + val + '"/>');
};

var addPageSizeHiddenHtml = function(formId, val) {
    $('#' + formId).children('#pageSize').remove();
    $('#' + formId).prepend('<input type="hidden" id="pageSize" value="' + val + '"/>');
};

function IsEmpty(obj) {
    if (typeof(obj) == "undefined" || obj == null || (typeof(obj) != "object" && (obj + "").replace(/ /g, "") == "")) { //||obj.length==0
        return true;
    }
    return false;
}
/* @描述：遍历div下所有元素，用标签name做key，标签值做value来生成对象
 * @返回:objec
 */
function serialize() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

/**
 * [PopDivHtml 弹出框DIV的效果与样式]
 * title：弹窗框的标题
 * classname：弹窗框的类名，默认是clickDetail
 * popheight：弹窗框的高度，默认是$(".clickDetail").height();
 * popwidth：弹窗框的高度，默认是$(".clickDetail").width();
 */
function PopDivHtml(opt) {
    var opt = opt ? opt : {};
    var title = opt.title ? opt.title : "";
    var className = opt.className ? opt.className : "clickDetail";
    var popHeight = opt.popHeight ? opt.popHeight : 350;
    var popWidth = opt.popWidth ? opt.popWidth : 800;

    $("<div class='mask'></div>").css({
        "position": "absolute",
        "top": 0,
        "left": 0,
        "z-index": 1000,
        "width": "100%",
        "height": "100%",
        "background": "rgba(0,0,0,.4)"
    }).appendTo('body');
    $("<div class='" + className + "'></div>").css({
        "position": "absolute",
        "z-index": 1001,
        "width": popWidth,
        "height": popHeight,
        "border-radius": "10px",
        "box-shadow": "2px 2px 5px",
        "background": "rgba(204, 204, 204,.8)",
        "padding": "10px"
    }).appendTo('body');
    var detailHtml = "<h3 class='poptitle'>" + title + " <div class='closeBtn'></div></h3>";
    detailHtml += "<div class='popcontent'></div>";
    $("." + className).html(detailHtml);
    $(".poptitle").css({
        "color": "#fff",
        "height": "30px",
        "cursor": "move"
    });
    $(".closeBtn").css({
        "float": "right",
        "width": "14px",
        "height": "14px",
        "margin-top": "2px",
        "margin-right": "5px",
        "border": 0,
        "background": "url(assets/img/close.png) no-repeat",
        "background-size": "cover",
        "cursor": "pointer"
    });
    $(".popcontent").css({
        "background": "#fff",
        "height": popHeight - $(".poptitle").outerHeight() - 20
    });
    if (!popWidth) {
        popWidth = $("." + className).width();
    }
    if (!popHeight) {
        popHeight = $("." + className).height();
    }
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var scrollHeight = $(document).scrollTop();
    var DetailWidth = popWidth;
    var DetailHeight = popHeight;
    //居中
    $("." + className).css({
        'left': (windowWidth - DetailWidth) / 2,
        'top': (windowHeight - DetailHeight) / 2 + scrollHeight
    });
    //移动
    var move = false; //移动标记
    var _x, _y; //鼠标离控件左上角的相对位置


    $("." + className + " h3").mousedown(function(e) {
        move = true;
        _x = e.pageX - parseInt($("." + className).css("left"));
        _y = e.pageY - parseInt($("." + className).css("top"));
    });
    $(document).mousemove(function(e) {
        if (move) {
            var x = e.pageX - _x; //控件左上角到屏幕左上角的相对位置
            var y = e.pageY - _y;
            $("." + className).css({
                "top": y,
                "left": x
            });
        };
    }).mouseup(function() {
        move = false;
    });
    $("." + className + " .closeBtn").click(function() {
        $("." + className).remove();
        $(".mask").remove();
    });
};

// 异步加载js文件
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) { // IE
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { // Others: Firefox, Safari, Chrome, and Opera
        script.onload = function() {
            callback();
        };
    }
    script.src = url;
    document.body.appendChild(script);
};
/**
 * [desc]: 得到当前时间的前n个点
 *  @param opt {}
 *  endDate -默认时间是当前时间，时间格式是：yyyy-mm-dd HH:Mi:ss
 *  splitTime--时间分割，默认是5分钟
 *  count-数量-默认是12
 *
 *  return []
 */
function getDateArray(opt) {
    // 获取某个时间格式的时间戳   Date.parse(new Date("2017-06-29 23:45:12"));
    //endTime 是时间戳
    var endTime = Date.parse(new Date(opt.endDate)) ? Date.parse(new Date(opt.endDate)) : new Date().getTime();
    var splitTime = opt.splitTime ? opt.splitTime : 5 * 60 * 1000; //5分钟
    var count = opt.count ? opt.count : 12;

    var mod = endTime % splitTime;
    if (mod > 0) {
        endTime -= mod;
    }
    var dateArray = [];
    while (count-- > 0) {
        var d = new Date();
        d.setTime(endTime - count * splitTime);
        dateArray.push(transtimestamp(d));
    }
    return dateArray;
}

/**
 *[desc] 时间戳转换为时间格式(yyyymmddHHmi 201706300917)
 * @parma timestamp 时间戳
 * return 时间 格式是(yyyymmddHHmi 201706300917)
 */
function transtimestamp(timestamp) {
    if (timestamp == null || timestamp == '') {
        return '';
    }
    var date = new Date(timestamp);
    Y = date.getFullYear() + "";
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "";
    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + "";
    h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + "";
    m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + "";
    return (Y + M + D + h + m);
}

/**
 *[desc] 获取当前时间
 * return 时间 格式是(yyyy-mm-dd HH:mi:ss 2017-06-30 09:17:01)
 */
function getNowtime() {
    var date = new Date(); //日期对象
    var now = "";
    now = date.getFullYear() + "-"; //读英文就行了
    now = now + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'; //取月的时候取的是当前月-1如果想取当前月+1就可以了
    now = now + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + " ";
    now = now + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":";
    now = now + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ":";
    now = now + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + "";
    return now;
}

/**
 *[desc] 转换毫秒到时间格式的显示
 * return 时间 格式是(yyyy-mm-dd HH:mi:ss 2017-06-30 09:17:01)
 */
function changeTime(time) {
    var date = new Date(time);
    var now = "";
    now = date.getFullYear() + "-"; //读英文就行了
    now = now + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'; //取月的时候取的是当前月-1如果想取当前月+1就可以了
    now = now + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + " ";
    now = now + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":";
    now = now + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ":";
    now = now + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + "";
    return now;
}

/**
 *[desc] 获取从现在到 beforeDate 的时间
 * @param beforeDate 只能是整数 正数表示beforeDate前 负数表示beforeDate后
 * @param timeType 时间精度 Mi-分 H-小时 D-天 M-月
 * return 时间 格式是(yyyy-mm-dd HH:mi:ss 2017-06-30 09:17:01)
 */
function beforeNowDate(beforeDate, timeType) {
    var date = new Date(); //日期对象
    switch (timeType) {
        case "Mi":
            date.setMinutes(date.getMinutes() - beforeDate);
            break;
        case "H":
            date.setHours(date.getHours() - beforeDate);
            break;
        case "D":
            date.setDate(date.getDate() - beforeDate);
            break;
        default:
            break;
    }

    var now = "";
    now = date.getFullYear() + "-"; //读英文就行了
    now = now + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'; //取月的时候取的是当前月-1如果想取当前月+1就可以了
    now = now + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + " ";
    now = now + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":";
    now = now + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ":";
    now = now + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + "";
    return now;
}
/**
 * [desc] 时间截取展示
 * @param timeStr yyyymmddHHMiss
 * @param timeType 时间精度 Mi-分钟 H-小时 D-天 M-月
 * @returns {*} 格式：H-HH:Mi  D:mm-dd  M:mm
 */
function formatterTime(timeStr, timeType) {
    switch (timeType) {
        case 'H':
            return timeStr.slice(8, 10) + ':' + timeStr.slice(10, 12);
        case 'D':
            return timeStr.slice(4, 6) + '-' + timeStr.slice(6, 8);
        case 'M':
            return timeStr.slice(4, 6);
        default:
            return timeStr;
    }
}

/**
 * [desc] 获取两个时间的差-秒、分、小时、天
 * @param opt
 * startTime:开始时间
 * endTime：结束时间
 * diffType：时间精度
 */
function getDateDiff(opt) {

}
/*
 * encrypt the string to string made up of hex
 * return the encrypted string
 */
function strEnc(data, firstKey, secondKey, thirdKey) {
    var leng = data.length;
    var encData = "";
    var firstKeyBt, secondKeyBt, thirdKeyBt, firstLength, secondLength, thirdLength;
    if (firstKey != null && firstKey != "") {
        firstKeyBt = getKeyBytes(firstKey);
        firstLength = firstKeyBt.length;
    }
    if (secondKey != null && secondKey != "") {
        secondKeyBt = getKeyBytes(secondKey);
        secondLength = secondKeyBt.length;
    }
    if (thirdKey != null && thirdKey != "") {
        thirdKeyBt = getKeyBytes(thirdKey);
        thirdLength = thirdKeyBt.length;
    }

    if (leng > 0) {
        if (leng < 4) {
            var bt = strToBt(data);
            var encByte;
            if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                var tempBt;
                var x, y, z;
                tempBt = bt;
                for (x = 0; x < firstLength; x++) {
                    tempBt = enc(tempBt, firstKeyBt[x]);
                }
                for (y = 0; y < secondLength; y++) {
                    tempBt = enc(tempBt, secondKeyBt[y]);
                }
                for (z = 0; z < thirdLength; z++) {
                    tempBt = enc(tempBt, thirdKeyBt[z]);
                }
                encByte = tempBt;
            } else {
                if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                    var tempBt;
                    var x, y;
                    tempBt = bt;
                    for (x = 0; x < firstLength; x++) {
                        tempBt = enc(tempBt, firstKeyBt[x]);
                    }
                    for (y = 0; y < secondLength; y++) {
                        tempBt = enc(tempBt, secondKeyBt[y]);
                    }
                    encByte = tempBt;
                } else {
                    if (firstKey != null && firstKey != "") {
                        var tempBt;
                        var x = 0;
                        tempBt = bt;
                        for (x = 0; x < firstLength; x++) {
                            tempBt = enc(tempBt, firstKeyBt[x]);
                        }
                        encByte = tempBt;
                    }
                }
            }
            encData = bt64ToHex(encByte);
        } else {
            var iterator = parseInt(leng / 4);
            var remainder = leng % 4;
            var i = 0;
            for (i = 0; i < iterator; i++) {
                var tempData = data.substring(i * 4 + 0, i * 4 + 4);
                var tempByte = strToBt(tempData);
                var encByte;
                if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                    var tempBt;
                    var x, y, z;
                    tempBt = tempByte;
                    for (x = 0; x < firstLength; x++) {
                        tempBt = enc(tempBt, firstKeyBt[x]);
                    }
                    for (y = 0; y < secondLength; y++) {
                        tempBt = enc(tempBt, secondKeyBt[y]);
                    }
                    for (z = 0; z < thirdLength; z++) {
                        tempBt = enc(tempBt, thirdKeyBt[z]);
                    }
                    encByte = tempBt;
                } else {
                    if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                        var tempBt;
                        var x, y;
                        tempBt = tempByte;
                        for (x = 0; x < firstLength; x++) {
                            tempBt = enc(tempBt, firstKeyBt[x]);
                        }
                        for (y = 0; y < secondLength; y++) {
                            tempBt = enc(tempBt, secondKeyBt[y]);
                        }
                        encByte = tempBt;
                    } else {
                        if (firstKey != null && firstKey != "") {
                            var tempBt;
                            var x;
                            tempBt = tempByte;
                            for (x = 0; x < firstLength; x++) {
                                tempBt = enc(tempBt, firstKeyBt[x]);
                            }
                            encByte = tempBt;
                        }
                    }
                }
                encData += bt64ToHex(encByte);
            }
            if (remainder > 0) {
                var remainderData = data.substring(iterator * 4 + 0, leng);
                var tempByte = strToBt(remainderData);
                var encByte;
                if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                    var tempBt;
                    var x, y, z;
                    tempBt = tempByte;
                    for (x = 0; x < firstLength; x++) {
                        tempBt = enc(tempBt, firstKeyBt[x]);
                    }
                    for (y = 0; y < secondLength; y++) {
                        tempBt = enc(tempBt, secondKeyBt[y]);
                    }
                    for (z = 0; z < thirdLength; z++) {
                        tempBt = enc(tempBt, thirdKeyBt[z]);
                    }
                    encByte = tempBt;
                } else {
                    if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                        var tempBt;
                        var x, y;
                        tempBt = tempByte;
                        for (x = 0; x < firstLength; x++) {
                            tempBt = enc(tempBt, firstKeyBt[x]);
                        }
                        for (y = 0; y < secondLength; y++) {
                            tempBt = enc(tempBt, secondKeyBt[y]);
                        }
                        encByte = tempBt;
                    } else {
                        if (firstKey != null && firstKey != "") {
                            var tempBt;
                            var x;
                            tempBt = tempByte;
                            for (x = 0; x < firstLength; x++) {
                                tempBt = enc(tempBt, firstKeyBt[x]);
                            }
                            encByte = tempBt;
                        }
                    }
                }
                encData += bt64ToHex(encByte);
            }
        }
    }
    return encData;
}

/*
 * decrypt the encrypted string to the original string 
 *
 * return  the original string  
 */
function strDec(data, firstKey, secondKey, thirdKey) {
    var leng = data.length;
    var decStr = "";
    var firstKeyBt, secondKeyBt, thirdKeyBt, firstLength, secondLength, thirdLength;
    if (firstKey != null && firstKey != "") {
        firstKeyBt = getKeyBytes(firstKey);
        firstLength = firstKeyBt.length;
    }
    if (secondKey != null && secondKey != "") {
        secondKeyBt = getKeyBytes(secondKey);
        secondLength = secondKeyBt.length;
    }
    if (thirdKey != null && thirdKey != "") {
        thirdKeyBt = getKeyBytes(thirdKey);
        thirdLength = thirdKeyBt.length;
    }

    var iterator = parseInt(leng / 16);
    var i = 0;
    for (i = 0; i < iterator; i++) {
        var tempData = data.substring(i * 16 + 0, i * 16 + 16);
        var strByte = hexToBt64(tempData);
        var intByte = new Array(64);
        var j = 0;
        for (j = 0; j < 64; j++) {
            intByte[j] = parseInt(strByte.substring(j, j + 1));
        }
        var decByte;
        if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
            var tempBt;
            var x, y, z;
            tempBt = intByte;
            for (x = thirdLength - 1; x >= 0; x--) {
                tempBt = dec(tempBt, thirdKeyBt[x]);
            }
            for (y = secondLength - 1; y >= 0; y--) {
                tempBt = dec(tempBt, secondKeyBt[y]);
            }
            for (z = firstLength - 1; z >= 0; z--) {
                tempBt = dec(tempBt, firstKeyBt[z]);
            }
            decByte = tempBt;
        } else {
            if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                var tempBt;
                var x, y, z;
                tempBt = intByte;
                for (x = secondLength - 1; x >= 0; x--) {
                    tempBt = dec(tempBt, secondKeyBt[x]);
                }
                for (y = firstLength - 1; y >= 0; y--) {
                    tempBt = dec(tempBt, firstKeyBt[y]);
                }
                decByte = tempBt;
            } else {
                if (firstKey != null && firstKey != "") {
                    var tempBt;
                    var x, y, z;
                    tempBt = intByte;
                    for (x = firstLength - 1; x >= 0; x--) {
                        tempBt = dec(tempBt, firstKeyBt[x]);
                    }
                    decByte = tempBt;
                }
            }
        }
        decStr += byteToString(decByte);
    }
    return decStr;
}
/*
 * chang the string into the bit array
 * 
 * return bit array(it's length % 64 = 0)
 */
function getKeyBytes(key) {
    var keyBytes = new Array();
    var leng = key.length;
    var iterator = parseInt(leng / 4);
    var remainder = leng % 4;
    var i = 0;
    for (i = 0; i < iterator; i++) {
        keyBytes[i] = strToBt(key.substring(i * 4 + 0, i * 4 + 4));
    }
    if (remainder > 0) {
        keyBytes[i] = strToBt(key.substring(i * 4 + 0, leng));
    }
    return keyBytes;
}

/*
 * chang the string(it's length <= 4) into the bit array
 * 
 * return bit array(it's length = 64)
 */
function strToBt(str) {
    var leng = str.length;
    var bt = new Array(64);
    if (leng < 4) {
        var i = 0,
            j = 0,
            p = 0,
            q = 0;
        for (i = 0; i < leng; i++) {
            var k = str.charCodeAt(i);
            for (j = 0; j < 16; j++) {
                var pow = 1,
                    m = 0;
                for (m = 15; m > j; m--) {
                    pow *= 2;
                }
                bt[16 * i + j] = parseInt(k / pow) % 2;
            }
        }
        for (p = leng; p < 4; p++) {
            var k = 0;
            for (q = 0; q < 16; q++) {
                var pow = 1,
                    m = 0;
                for (m = 15; m > q; m--) {
                    pow *= 2;
                }
                bt[16 * p + q] = parseInt(k / pow) % 2;
            }
        }
    } else {
        for (i = 0; i < 4; i++) {
            var k = str.charCodeAt(i);
            for (j = 0; j < 16; j++) {
                var pow = 1;
                for (m = 15; m > j; m--) {
                    pow *= 2;
                }
                bt[16 * i + j] = parseInt(k / pow) % 2;
            }
        }
    }
    return bt;
}

/*
 * chang the bit(it's length = 4) into the hex
 * 
 * return hex
 */
function bt4ToHex(binary) {
    var hex;
    switch (binary) {
        case "0000":
            hex = "0";
            break;
        case "0001":
            hex = "1";
            break;
        case "0010":
            hex = "2";
            break;
        case "0011":
            hex = "3";
            break;
        case "0100":
            hex = "4";
            break;
        case "0101":
            hex = "5";
            break;
        case "0110":
            hex = "6";
            break;
        case "0111":
            hex = "7";
            break;
        case "1000":
            hex = "8";
            break;
        case "1001":
            hex = "9";
            break;
        case "1010":
            hex = "A";
            break;
        case "1011":
            hex = "B";
            break;
        case "1100":
            hex = "C";
            break;
        case "1101":
            hex = "D";
            break;
        case "1110":
            hex = "E";
            break;
        case "1111":
            hex = "F";
            break;
    }
    return hex;
}

/*
 * chang the hex into the bit(it's length = 4)
 * 
 * return the bit(it's length = 4)
 */
function hexToBt4(hex) {
    var binary;
    switch (hex) {
        case "0":
            binary = "0000";
            break;
        case "1":
            binary = "0001";
            break;
        case "2":
            binary = "0010";
            break;
        case "3":
            binary = "0011";
            break;
        case "4":
            binary = "0100";
            break;
        case "5":
            binary = "0101";
            break;
        case "6":
            binary = "0110";
            break;
        case "7":
            binary = "0111";
            break;
        case "8":
            binary = "1000";
            break;
        case "9":
            binary = "1001";
            break;
        case "A":
            binary = "1010";
            break;
        case "B":
            binary = "1011";
            break;
        case "C":
            binary = "1100";
            break;
        case "D":
            binary = "1101";
            break;
        case "E":
            binary = "1110";
            break;
        case "F":
            binary = "1111";
            break;
    }
    return binary;
}

/*
 * chang the bit(it's length = 64) into the string
 * 
 * return string
 */
function byteToString(byteData) {
    var str = "";
    for (i = 0; i < 4; i++) {
        var count = 0;
        for (j = 0; j < 16; j++) {
            var pow = 1;
            for (m = 15; m > j; m--) {
                pow *= 2;
            }
            count += byteData[16 * i + j] * pow;
        }
        if (count != 0) {
            str += String.fromCharCode(count);
        }
    }
    return str;
}

function bt64ToHex(byteData) {
    var hex = "";
    for (i = 0; i < 16; i++) {
        var bt = "";
        for (j = 0; j < 4; j++) {
            bt += byteData[i * 4 + j];
        }
        hex += bt4ToHex(bt);
    }
    return hex;
}

function hexToBt64(hex) {
    var binary = "";
    for (i = 0; i < 16; i++) {
        binary += hexToBt4(hex.substring(i, i + 1));
    }
    return binary;
}

/*
 * the 64 bit des core arithmetic
 */

function enc(dataByte, keyByte) {
    var keys = generateKeys(keyByte);
    var ipByte = initPermute(dataByte);
    var ipLeft = new Array(32);
    var ipRight = new Array(32);
    var tempLeft = new Array(32);
    var i = 0,
        j = 0,
        k = 0,
        m = 0,
        n = 0;
    for (k = 0; k < 32; k++) {
        ipLeft[k] = ipByte[k];
        ipRight[k] = ipByte[32 + k];
    }
    for (i = 0; i < 16; i++) {
        for (j = 0; j < 32; j++) {
            tempLeft[j] = ipLeft[j];
            ipLeft[j] = ipRight[j];
        }
        var key = new Array(48);
        for (m = 0; m < 48; m++) {
            key[m] = keys[i][m];
        }
        var tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
        for (n = 0; n < 32; n++) {
            ipRight[n] = tempRight[n];
        }

    }


    var finalData = new Array(64);
    for (i = 0; i < 32; i++) {
        finalData[i] = ipRight[i];
        finalData[32 + i] = ipLeft[i];
    }
    return finallyPermute(finalData);
}

function dec(dataByte, keyByte) {
    var keys = generateKeys(keyByte);
    var ipByte = initPermute(dataByte);
    var ipLeft = new Array(32);
    var ipRight = new Array(32);
    var tempLeft = new Array(32);
    var i = 0,
        j = 0,
        k = 0,
        m = 0,
        n = 0;
    for (k = 0; k < 32; k++) {
        ipLeft[k] = ipByte[k];
        ipRight[k] = ipByte[32 + k];
    }
    for (i = 15; i >= 0; i--) {
        for (j = 0; j < 32; j++) {
            tempLeft[j] = ipLeft[j];
            ipLeft[j] = ipRight[j];
        }
        var key = new Array(48);
        for (m = 0; m < 48; m++) {
            key[m] = keys[i][m];
        }

        var tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
        for (n = 0; n < 32; n++) {
            ipRight[n] = tempRight[n];
        }
    }


    var finalData = new Array(64);
    for (i = 0; i < 32; i++) {
        finalData[i] = ipRight[i];
        finalData[32 + i] = ipLeft[i];
    }
    return finallyPermute(finalData);
}

function initPermute(originalData) {
    var ipByte = new Array(64);
    for (i = 0, m = 1, n = 0; i < 4; i++, m += 2, n += 2) {
        for (j = 7, k = 0; j >= 0; j--, k++) {
            ipByte[i * 8 + k] = originalData[j * 8 + m];
            ipByte[i * 8 + k + 32] = originalData[j * 8 + n];
        }
    }
    return ipByte;
}

function expandPermute(rightData) {
    var epByte = new Array(48);
    for (i = 0; i < 8; i++) {
        if (i == 0) {
            epByte[i * 6 + 0] = rightData[31];
        } else {
            epByte[i * 6 + 0] = rightData[i * 4 - 1];
        }
        epByte[i * 6 + 1] = rightData[i * 4 + 0];
        epByte[i * 6 + 2] = rightData[i * 4 + 1];
        epByte[i * 6 + 3] = rightData[i * 4 + 2];
        epByte[i * 6 + 4] = rightData[i * 4 + 3];
        if (i == 7) {
            epByte[i * 6 + 5] = rightData[0];
        } else {
            epByte[i * 6 + 5] = rightData[i * 4 + 4];
        }
    }
    return epByte;
}

function xor(byteOne, byteTwo) {
    var xorByte = new Array(byteOne.length);
    for (i = 0; i < byteOne.length; i++) {
        xorByte[i] = byteOne[i] ^ byteTwo[i];
    }
    return xorByte;
}

function sBoxPermute(expandByte) {

    var sBoxByte = new Array(32);
    var binary = "";
    var s1 = [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ];

    /* Table - s2 */
    var s2 = [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ];

    /* Table - s3 */
    var s3 = [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ];
    /* Table - s4 */
    var s4 = [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ];

    /* Table - s5 */
    var s5 = [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ];

    /* Table - s6 */
    var s6 = [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ];

    /* Table - s7 */
    var s7 = [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ];

    /* Table - s8 */
    var s8 = [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ];

    for (m = 0; m < 8; m++) {
        var i = 0,
            j = 0;
        i = expandByte[m * 6 + 0] * 2 + expandByte[m * 6 + 5];
        j = expandByte[m * 6 + 1] * 2 * 2 * 2 +
            expandByte[m * 6 + 2] * 2 * 2 +
            expandByte[m * 6 + 3] * 2 +
            expandByte[m * 6 + 4];
        switch (m) {
            case 0:
                binary = getBoxBinary(s1[i][j]);
                break;
            case 1:
                binary = getBoxBinary(s2[i][j]);
                break;
            case 2:
                binary = getBoxBinary(s3[i][j]);
                break;
            case 3:
                binary = getBoxBinary(s4[i][j]);
                break;
            case 4:
                binary = getBoxBinary(s5[i][j]);
                break;
            case 5:
                binary = getBoxBinary(s6[i][j]);
                break;
            case 6:
                binary = getBoxBinary(s7[i][j]);
                break;
            case 7:
                binary = getBoxBinary(s8[i][j]);
                break;
        }
        sBoxByte[m * 4 + 0] = parseInt(binary.substring(0, 1));
        sBoxByte[m * 4 + 1] = parseInt(binary.substring(1, 2));
        sBoxByte[m * 4 + 2] = parseInt(binary.substring(2, 3));
        sBoxByte[m * 4 + 3] = parseInt(binary.substring(3, 4));
    }
    return sBoxByte;
}

function pPermute(sBoxByte) {
    var pBoxPermute = new Array(32);
    pBoxPermute[0] = sBoxByte[15];
    pBoxPermute[1] = sBoxByte[6];
    pBoxPermute[2] = sBoxByte[19];
    pBoxPermute[3] = sBoxByte[20];
    pBoxPermute[4] = sBoxByte[28];
    pBoxPermute[5] = sBoxByte[11];
    pBoxPermute[6] = sBoxByte[27];
    pBoxPermute[7] = sBoxByte[16];
    pBoxPermute[8] = sBoxByte[0];
    pBoxPermute[9] = sBoxByte[14];
    pBoxPermute[10] = sBoxByte[22];
    pBoxPermute[11] = sBoxByte[25];
    pBoxPermute[12] = sBoxByte[4];
    pBoxPermute[13] = sBoxByte[17];
    pBoxPermute[14] = sBoxByte[30];
    pBoxPermute[15] = sBoxByte[9];
    pBoxPermute[16] = sBoxByte[1];
    pBoxPermute[17] = sBoxByte[7];
    pBoxPermute[18] = sBoxByte[23];
    pBoxPermute[19] = sBoxByte[13];
    pBoxPermute[20] = sBoxByte[31];
    pBoxPermute[21] = sBoxByte[26];
    pBoxPermute[22] = sBoxByte[2];
    pBoxPermute[23] = sBoxByte[8];
    pBoxPermute[24] = sBoxByte[18];
    pBoxPermute[25] = sBoxByte[12];
    pBoxPermute[26] = sBoxByte[29];
    pBoxPermute[27] = sBoxByte[5];
    pBoxPermute[28] = sBoxByte[21];
    pBoxPermute[29] = sBoxByte[10];
    pBoxPermute[30] = sBoxByte[3];
    pBoxPermute[31] = sBoxByte[24];
    return pBoxPermute;
}

function finallyPermute(endByte) {
    var fpByte = new Array(64);
    fpByte[0] = endByte[39];
    fpByte[1] = endByte[7];
    fpByte[2] = endByte[47];
    fpByte[3] = endByte[15];
    fpByte[4] = endByte[55];
    fpByte[5] = endByte[23];
    fpByte[6] = endByte[63];
    fpByte[7] = endByte[31];
    fpByte[8] = endByte[38];
    fpByte[9] = endByte[6];
    fpByte[10] = endByte[46];
    fpByte[11] = endByte[14];
    fpByte[12] = endByte[54];
    fpByte[13] = endByte[22];
    fpByte[14] = endByte[62];
    fpByte[15] = endByte[30];
    fpByte[16] = endByte[37];
    fpByte[17] = endByte[5];
    fpByte[18] = endByte[45];
    fpByte[19] = endByte[13];
    fpByte[20] = endByte[53];
    fpByte[21] = endByte[21];
    fpByte[22] = endByte[61];
    fpByte[23] = endByte[29];
    fpByte[24] = endByte[36];
    fpByte[25] = endByte[4];
    fpByte[26] = endByte[44];
    fpByte[27] = endByte[12];
    fpByte[28] = endByte[52];
    fpByte[29] = endByte[20];
    fpByte[30] = endByte[60];
    fpByte[31] = endByte[28];
    fpByte[32] = endByte[35];
    fpByte[33] = endByte[3];
    fpByte[34] = endByte[43];
    fpByte[35] = endByte[11];
    fpByte[36] = endByte[51];
    fpByte[37] = endByte[19];
    fpByte[38] = endByte[59];
    fpByte[39] = endByte[27];
    fpByte[40] = endByte[34];
    fpByte[41] = endByte[2];
    fpByte[42] = endByte[42];
    fpByte[43] = endByte[10];
    fpByte[44] = endByte[50];
    fpByte[45] = endByte[18];
    fpByte[46] = endByte[58];
    fpByte[47] = endByte[26];
    fpByte[48] = endByte[33];
    fpByte[49] = endByte[1];
    fpByte[50] = endByte[41];
    fpByte[51] = endByte[9];
    fpByte[52] = endByte[49];
    fpByte[53] = endByte[17];
    fpByte[54] = endByte[57];
    fpByte[55] = endByte[25];
    fpByte[56] = endByte[32];
    fpByte[57] = endByte[0];
    fpByte[58] = endByte[40];
    fpByte[59] = endByte[8];
    fpByte[60] = endByte[48];
    fpByte[61] = endByte[16];
    fpByte[62] = endByte[56];
    fpByte[63] = endByte[24];
    return fpByte;
}

function getBoxBinary(i) {
    var binary = "";
    switch (i) {
        case 0:
            binary = "0000";
            break;
        case 1:
            binary = "0001";
            break;
        case 2:
            binary = "0010";
            break;
        case 3:
            binary = "0011";
            break;
        case 4:
            binary = "0100";
            break;
        case 5:
            binary = "0101";
            break;
        case 6:
            binary = "0110";
            break;
        case 7:
            binary = "0111";
            break;
        case 8:
            binary = "1000";
            break;
        case 9:
            binary = "1001";
            break;
        case 10:
            binary = "1010";
            break;
        case 11:
            binary = "1011";
            break;
        case 12:
            binary = "1100";
            break;
        case 13:
            binary = "1101";
            break;
        case 14:
            binary = "1110";
            break;
        case 15:
            binary = "1111";
            break;
    }
    return binary;
}
/*
 * generate 16 keys for xor
 *
 */
function generateKeys(keyByte) {
    var key = new Array(56);
    var keys = new Array();

    keys[0] = new Array();
    keys[1] = new Array();
    keys[2] = new Array();
    keys[3] = new Array();
    keys[4] = new Array();
    keys[5] = new Array();
    keys[6] = new Array();
    keys[7] = new Array();
    keys[8] = new Array();
    keys[9] = new Array();
    keys[10] = new Array();
    keys[11] = new Array();
    keys[12] = new Array();
    keys[13] = new Array();
    keys[14] = new Array();
    keys[15] = new Array();
    var loop = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

    for (i = 0; i < 7; i++) {
        for (j = 0, k = 7; j < 8; j++, k--) {
            key[i * 8 + j] = keyByte[8 * k + i];
        }
    }

    var i = 0;
    for (i = 0; i < 16; i++) {
        var tempLeft = 0;
        var tempRight = 0;
        for (j = 0; j < loop[i]; j++) {
            tempLeft = key[0];
            tempRight = key[28];
            for (k = 0; k < 27; k++) {
                key[k] = key[k + 1];
                key[28 + k] = key[29 + k];
            }
            key[27] = tempLeft;
            key[55] = tempRight;
        }
        var tempKey = new Array(48);
        tempKey[0] = key[13];
        tempKey[1] = key[16];
        tempKey[2] = key[10];
        tempKey[3] = key[23];
        tempKey[4] = key[0];
        tempKey[5] = key[4];
        tempKey[6] = key[2];
        tempKey[7] = key[27];
        tempKey[8] = key[14];
        tempKey[9] = key[5];
        tempKey[10] = key[20];
        tempKey[11] = key[9];
        tempKey[12] = key[22];
        tempKey[13] = key[18];
        tempKey[14] = key[11];
        tempKey[15] = key[3];
        tempKey[16] = key[25];
        tempKey[17] = key[7];
        tempKey[18] = key[15];
        tempKey[19] = key[6];
        tempKey[20] = key[26];
        tempKey[21] = key[19];
        tempKey[22] = key[12];
        tempKey[23] = key[1];
        tempKey[24] = key[40];
        tempKey[25] = key[51];
        tempKey[26] = key[30];
        tempKey[27] = key[36];
        tempKey[28] = key[46];
        tempKey[29] = key[54];
        tempKey[30] = key[29];
        tempKey[31] = key[39];
        tempKey[32] = key[50];
        tempKey[33] = key[44];
        tempKey[34] = key[32];
        tempKey[35] = key[47];
        tempKey[36] = key[43];
        tempKey[37] = key[48];
        tempKey[38] = key[38];
        tempKey[39] = key[55];
        tempKey[40] = key[33];
        tempKey[41] = key[52];
        tempKey[42] = key[45];
        tempKey[43] = key[41];
        tempKey[44] = key[49];
        tempKey[45] = key[35];
        tempKey[46] = key[28];
        tempKey[47] = key[31];
        switch (i) {
            case 0:
                for (m = 0; m < 48; m++) { keys[0][m] = tempKey[m]; }
                break;
            case 1:
                for (m = 0; m < 48; m++) { keys[1][m] = tempKey[m]; }
                break;
            case 2:
                for (m = 0; m < 48; m++) { keys[2][m] = tempKey[m]; }
                break;
            case 3:
                for (m = 0; m < 48; m++) { keys[3][m] = tempKey[m]; }
                break;
            case 4:
                for (m = 0; m < 48; m++) { keys[4][m] = tempKey[m]; }
                break;
            case 5:
                for (m = 0; m < 48; m++) { keys[5][m] = tempKey[m]; }
                break;
            case 6:
                for (m = 0; m < 48; m++) { keys[6][m] = tempKey[m]; }
                break;
            case 7:
                for (m = 0; m < 48; m++) { keys[7][m] = tempKey[m]; }
                break;
            case 8:
                for (m = 0; m < 48; m++) { keys[8][m] = tempKey[m]; }
                break;
            case 9:
                for (m = 0; m < 48; m++) { keys[9][m] = tempKey[m]; }
                break;
            case 10:
                for (m = 0; m < 48; m++) { keys[10][m] = tempKey[m]; }
                break;
            case 11:
                for (m = 0; m < 48; m++) { keys[11][m] = tempKey[m]; }
                break;
            case 12:
                for (m = 0; m < 48; m++) { keys[12][m] = tempKey[m]; }
                break;
            case 13:
                for (m = 0; m < 48; m++) { keys[13][m] = tempKey[m]; }
                break;
            case 14:
                for (m = 0; m < 48; m++) { keys[14][m] = tempKey[m]; }
                break;
            case 15:
                for (m = 0; m < 48; m++) { keys[15][m] = tempKey[m]; }
                break;
        }
    }
    return keys;
}

function param_valid_form_01(id, type, rule, length, notnull) {
    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    function param_valid_xss(str) {
        str = str.replace(/\s+/g, '');
        if (/eval((.*?))/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/<script>|<\/script>/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/<("[^"]*"|'[^']*'|[^'">])*>|>("[^"]*"|'[^']*'|[^'">])*<|'|"/.test(str.toLocaleLowerCase())) {
            return false;
        }
        // if (/((?=[\x21-\x7e]+)[^A-Za-z0-9])/.test(str.toLocaleLowerCase()) && !(/.|(|)*/.test(str.toLocaleLowerCase()))) {
        if (/((?=[\x21-\x27\x2a-\x2c\x2f-\x5e\x60-\x7e]+)[^A-Za-z0-9])/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/expression((.*?))/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/(javascript:|vbscript:|view-source:)/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/window.location|window.|.location|document.cookie|document.|alert(.*?)|window.open()/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/(oncontrolselect|oncopy|oncut|ondataavailable|ondatasetchanged|ondatasetcomplete|ondblclick|ondeactivate|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|onerror=|onerroupdate|onfilterchange|onfinish|onfocus|onfocusin|onfocusout|onhelp|onkeydown|onkeypress|onkeyup|onlayoutcomplete|onload|onlosecapture|onmousedown|onmouseenter|onmouseleave|onmousemove|onmousout|onmouseover|onmouseup|onmousewheel|onmove|onmoveend|onmovestart|onabort|onactivate|onafterprint|onafterupdate|onbefore|onbeforeactivate|onbeforecopy|onbeforecut|onbeforedeactivate|onbeforeeditocus|onbeforepaste|onbeforeprint|onbeforeunload|onbeforeupdate|onblur|onbounce|oncellchange|onchange|onclick|oncontextmenu|onpaste|onpropertychange|onreadystatechange|onreset|onresize|onresizend|onresizestart|onrowenter|onrowexit|onrowsdelete|onrowsinserted|onscroll|onselect|onselectionchange|onselectstart|onstart|onstop|onsubmit|onunload)/.test(str.toLocaleLowerCase())) {
            return false;
        }
        return true;
    }
    if ($('#' + id + '').val() == undefined) {
        return true;
    }
    if (type && type == 'notmatch' && rule && rule.length > 0) {
        //在有正则匹配的时候 不需要再进行XSS 和 SQL 注入的校验
    } else {
        if (!param_valid_xss(trim($('#' + id + '').val()))) {
            return false;
        }
        if (/'|and|exec|execute|insert|select|delete|update|count|drop|chr|mid|master|truncate|char|declare|sitename|net user|xp_cmdshell|;|or|,|like'|and|exec|execute|insert|create|drop|table|from|grant|use|group_concat|column_name|information_schema.columns|table_schema|union|where|select|delete|update|order|by|count|chr|mid|master|truncate|char|declare|or|;|,|like|#/.test(trim($('#' + id + '').val()).toLocaleLowerCase())) {
            return false;
        }
    }


    //notnull字段为Y有这段，其他情况不需要加
    if (notnull && notnull == 'Y') {
        if (trim($('#' + id + '').val()) == '') {
            return false;
        }
    }


    //length
    if (length && length.length > 0) {
        //  if (trim($('#'+id+'').val()).gblen() == 2) {
        //     return false;
        // }
        var vallen = trim($('#' + id + '').val());
        var fuhao = length.slice(0, 1);
        var valbeg = length.slice(1);
        if (fuhao == '>') {
            if (vallen.length > valbeg) {
                return false;
            }
        } else if (fuhao == '<') {
            if (vallen.length < valbeg) {
                return false;
            }
        }
    }

    if (type && type.length > 0) {
        if (type == 'include' && rule && rule.length > 0) {
            var rule = rule;
            var arr = rule.split('|');
            for (var i = 0; i < arr.length; i++) {
                if (trim($('#' + id + '').val()).indexOf(arr[i]) > -1) {
                    return false;
                }
            }
        } else if (type == 'match' && rule && rule.length > 0) {
            var rul = '/' + rule + '/';
            rul = eval(rul);
            if (rul.test(trim($('#' + id + '').val()))) {
                return false;
            }
        } else if (type == 'notmatch' && rule && rule.length > 0) {
            var rul = '/' + rule + '/';
            rul = eval(rul);
            if (trim($('#' + id + '').val()) != '' && !(rul.test(trim($('#' + id + '').val())))) {
                return false;
            }
        }
    }
    return true;
}

function param_valid_form_02(id, type, rule, length, notnull) {
    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    function param_valid_xss(str) {
        str = str.replace(/\s+/g, '');
        if (/eval((.*?))/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/<script>|<\/script>/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/<("[^"]*"|'[^']*'|[^'">])*>|>("[^"]*"|'[^']*'|[^'">])*<|'|"/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/((?=[\x21-\x2c\x30-\x39\x3b-\x5e\x60-\x7e]+)[^A-Za-z0-9])/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/expression((.*?))/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/(javascript:|vbscript:|view-source:)/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/window.location|window.|.location|document.cookie|document.|alert(.*?)|window.open()/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/(oncontrolselect|oncopy|oncut|ondataavailable|ondatasetchanged|ondatasetcomplete|ondblclick|ondeactivate|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|onerror=|onerroupdate|onfilterchange|onfinish|onfocus|onfocusin|onfocusout|onhelp|onkeydown|onkeypress|onkeyup|onlayoutcomplete|onload|onlosecapture|onmousedown|onmouseenter|onmouseleave|onmousemove|onmousout|onmouseover|onmouseup|onmousewheel|onmove|onmoveend|onmovestart|onabort|onactivate|onafterprint|onafterupdate|onbefore|onbeforeactivate|onbeforecopy|onbeforecut|onbeforedeactivate|onbeforeeditocus|onbeforepaste|onbeforeprint|onbeforeunload|onbeforeupdate|onblur|onbounce|oncellchange|onchange|onclick|oncontextmenu|onpaste|onpropertychange|onreadystatechange|onreset|onresize|onresizend|onresizestart|onrowenter|onrowexit|onrowsdelete|onrowsinserted|onscroll|onselect|onselectionchange|onselectstart|onstart|onstop|onsubmit|onunload)/.test(str.toLocaleLowerCase())) {
            return false;
        }
        return true;
    }
    if ($('#' + id + '').val() == undefined) {
        return true;
    }
    if (type && type == 'notmatch' && rule && rule.length > 0) {
        //在有正则匹配的时候 不需要再进行XSS 和 SQL 注入的校验
    } else {
        if (!param_valid_xss(trim($('#' + id + '').val()))) {
            return false;
        }
        if (/'|and|exec|execute|insert|select|delete|update|count|drop|chr|mid|master|truncate|char|declare|sitename|net user|xp_cmdshell|;|or|,|like'|and|exec|execute|insert|create|drop|table|from|grant|use|group_concat|column_name|information_schema.columns|table_schema|union|where|select|delete|update|order|by|count|chr|mid|master|truncate|char|declare|or|;|,|like|#/.test(trim($('#' + id + '').val()).toLocaleLowerCase())) {
            return false;
        }
    }


    //notnull字段为Y有这段，其他情况不需要加
    if (notnull && notnull == 'Y') {
        if (trim($('#' + id + '').val()) == '') {
            return false;
        }
    }


    //length
    if (length && length.length > 0) {
        //  if (trim($('#'+id+'').val()).gblen() == 2) {
        //     return false;
        // }
        var vallen = trim($('#' + id + '').val());
        var fuhao = length.slice(0, 1);
        var valbeg = length.slice(1);
        if (fuhao == '>') {
            if (vallen.length > valbeg) {
                return false;
            }
        } else if (fuhao == '<') {
            if (vallen.length < valbeg) {
                return false;
            }
        }
    }

    if (type && type.length > 0) {
        if (type == 'include' && rule && rule.length > 0) {
            var rule = rule;
            var arr = rule.split('|');
            for (var i = 0; i < arr.length; i++) {
                if (trim($('#' + id + '').val()).indexOf(arr[i]) > -1) {
                    return false;
                }
            }
        } else if (type == 'match' && rule && rule.length > 0) {
            var rul = '/' + rule + '/';
            rul = eval(rul);
            if (rul.test(trim($('#' + id + '').val()))) {
                return false;
            }
        } else if (type == 'notmatch' && rule && rule.length > 0) {
            var rul = '/' + rule + '/';
            rul = eval(rul);
            if (trim($('#' + id + '').val()) != '' && !(rul.test(trim($('#' + id + '').val())))) {
                return false;
            }
        }
    }
    return true;
}

function param_valid_form_03(id, type, rule, length, notnull) {
    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    function param_valid_xss(str) {
        str = str.replace(/\s+/g, '');
        if (/eval((.*?))/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/<script>|<\/script>/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/<("[^"]*"|'[^']*'|[^'">])*>|>("[^"]*"|'[^']*'|[^'">])*<|'|"/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/((?=[\x21-\x2d\x2f-\x7e]+)[^0-9])/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/expression((.*?))/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/(javascript:|vbscript:|view-source:)/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/window.location|window.|.location|document.cookie|document.|alert(.*?)|window.open()/.test(str.toLocaleLowerCase())) {
            return false;
        }
        if (/(oncontrolselect|oncopy|oncut|ondataavailable|ondatasetchanged|ondatasetcomplete|ondblclick|ondeactivate|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|onerror=|onerroupdate|onfilterchange|onfinish|onfocus|onfocusin|onfocusout|onhelp|onkeydown|onkeypress|onkeyup|onlayoutcomplete|onload|onlosecapture|onmousedown|onmouseenter|onmouseleave|onmousemove|onmousout|onmouseover|onmouseup|onmousewheel|onmove|onmoveend|onmovestart|onabort|onactivate|onafterprint|onafterupdate|onbefore|onbeforeactivate|onbeforecopy|onbeforecut|onbeforedeactivate|onbeforeeditocus|onbeforepaste|onbeforeprint|onbeforeunload|onbeforeupdate|onblur|onbounce|oncellchange|onchange|onclick|oncontextmenu|onpaste|onpropertychange|onreadystatechange|onreset|onresize|onresizend|onresizestart|onrowenter|onrowexit|onrowsdelete|onrowsinserted|onscroll|onselect|onselectionchange|onselectstart|onstart|onstop|onsubmit|onunload)/.test(str.toLocaleLowerCase())) {
            return false;
        }
        return true;
    }
    if ($('#' + id + '').val() == undefined) {
        return true;
    }
    if (type && type == 'notmatch' && rule && rule.length > 0) {
        //在有正则匹配的时候 不需要再进行XSS 和 SQL 注入的校验
    } else {
        if (!param_valid_xss(trim($('#' + id + '').val()))) {
            return false;
        }
        if (/'|and|exec|execute|insert|select|delete|update|count|drop|chr|mid|master|truncate|char|declare|sitename|net user|xp_cmdshell|;|or|,|like'|and|exec|execute|insert|create|drop|table|from|grant|use|group_concat|column_name|information_schema.columns|table_schema|union|where|select|delete|update|order|by|count|chr|mid|master|truncate|char|declare|or|;|,|like|#/.test(trim($('#' + id + '').val()).toLocaleLowerCase())) {
            return false;
        }
    }


    //notnull字段为Y有这段，其他情况不需要加
    if (notnull && notnull == 'Y') {
        if (trim($('#' + id + '').val()) == '') {
            return false;
        }
    }


    //length
    if (length && length.length > 0) {
        //  if (trim($('#'+id+'').val()).gblen() == 2) {
        //     return false;
        // }
        var vallen = trim($('#' + id + '').val());
        var fuhao = length.slice(0, 1);
        var valbeg = length.slice(1);
        if (fuhao == '>') {
            if (vallen.length > valbeg) {
                return false;
            }
        } else if (fuhao == '<') {
            if (vallen.length < valbeg) {
                return false;
            }
        }
    }

    if (type && type.length > 0) {
        if (type == 'include' && rule && rule.length > 0) {
            var rule = rule;
            var arr = rule.split('|');
            for (var i = 0; i < arr.length; i++) {
                if (trim($('#' + id + '').val()).indexOf(arr[i]) > -1) {
                    return false;
                }
            }
        } else if (type == 'match' && rule && rule.length > 0) {
            var rul = '/' + rule + '/';
            rul = eval(rul);
            if (rul.test(trim($('#' + id + '').val()))) {
                return false;
            }
        } else if (type == 'notmatch' && rule && rule.length > 0) {
            var rul = '/' + rule + '/';
            rul = eval(rul);
            if (trim($('#' + id + '').val()) != '' && !(rul.test(trim($('#' + id + '').val())))) {
                return false;
            }
        }
    }
    return true;
}