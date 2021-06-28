/**
 * easyui表格--修改参考 https://coding.net/u/zhangyu911013/p/easyuiClientSideFilter/git
 * desc：
 * //easyui必须是1.4以上,引入jquery.easyui.min.js,
 * //该方法前台操作返回的数据；
 * //如果要实现前台分页，必须引入datagrid-filter.js，加上筛选，把筛选行手动隐藏。
 */
function relatedTable(tableId,opt){

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
            "margin-top": 100,
        });
    }

    $(window).resize(function () {
        $("#" + tableId).datagrid("resize", {width: $("#" + tableId).width()});
    });

}

/**
 * easyui datagrid中列内容过长时自动增加...，鼠标浮动展示全部信息
 */
function formatLongString($obj) {
    var $target = $obj || $('.datagrid-btable div');
    $target.css({
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        '-o-text-overflow': 'ellipsis',
        'overflow': 'hidden'
    });
    $target.hover(function () {
        var $clone = $(this).clone().css({display: 'inline', width: 'auto', visibility: 'hidden'}).appendTo('body');
        if ($clone.width() >= $(this).width()) {
            var content;
            if ($(this).children('a').length) {
                content = $(this).children('a').html();
                // $(this).attr('title', $(this).children('a').html());
            } else {
                content = $(this).html();
                // $(this).attr('title', $(this).html());
            }
            $(this).tooltip({
                showDelay: 500,
                position: 'right',
                trackMouse: true,
                deltaY: -15,
                deltaX: -5,
                content: content
            }).tooltip('show').tooltip('arrow').hide();

            $(this).tooltip('tip').css({
                'background-color': '#fff',
                'border-radius': '0',
                'box-shadow': ' 2px 2px 3px grey',
                'padding': '2px',
                'max-width': '400px',
                'text-align': 'center'
            });
        } else {
            $(this).tooltip('destroy');
            //$(this).removeAttr('title');
        }
        $clone.remove();
    });
    //超链接加上颜色
    $('.datagrid-btable div a').parent('div').css('color', '#049DF6');
};

/**
* EasyUI DataGrid根据字段动态合并单元格
* 参数 tableID 要合并table的id
* 参数 colList 要合并的列,用逗号分隔(例如："name,department,office");
*/
function mergeCellsByField(tableID, colList){
    var ColArray = colList.split(",");
    var tTable = $("#" + tableID);
    var TableRowCnts = tTable.datagrid("getRows").length;
    var tmpA;
    var tmpB;
    var PerTxt = "";
    var CurTxt = "";
    var alertStr = "";
    for (j = ColArray.length - 1; j >= 0; j--) {
        PerTxt = "";
        tmpA = 1;
        tmpB = 0;

        for (i = 0; i <= TableRowCnts; i++) {
            if (i == TableRowCnts) {
                CurTxt = "";
            }
            else {
                CurTxt = tTable.datagrid("getRows")[i][ColArray[j]];
            }
            if (PerTxt == CurTxt) {
                tmpA += 1;
            }
            else {
                tmpB += tmpA;
                
                tTable.datagrid("mergeCells", {
                    index: i - tmpA,
                    field: ColArray[j],　　//合并字段
                    rowspan: tmpA,
                    colspan: null
                });
                tTable.datagrid("mergeCells", { //根据ColArray[j]进行合并
                    index: i - tmpA,
                    field: "Ideparture",
                    rowspan: tmpA,
                    colspan: null
                });
               
                tmpA = 1;
            }
            PerTxt = CurTxt;
        }
    }
};