/**
 * easyui表格--修改参考 https://coding.net/u/zhangyu911013/p/easyuiClientSideFilter/git
 * desc：
 * //easyui必须是1.4以上,引入jquery.easyui.min.js,
 * //该方法前台操作返回的数据；
 * //如果要实现前台分页，必须引入datagrid-filter.js，加上筛选，把筛选行手动隐藏。
 */
function relatedTable(tableId, opt) {
    var SelectRow
    var columnsData = opt.columnsData ? opt.columnsData : []; //必须存在
    var data = opt.data ? opt.data : [];
    var ipVersion = opt.ipVersion
    var tableH = opt.tableH ? opt.tableH : 300;
    var widthW = opt.widthW
    var tableOpt = opt.tableOpt ? opt.tableOpt : {}; //扩展的表格的属性

    var NofilterRow = opt.NofilterRow ? opt.NofilterRow : false; //是否有筛选行，true表示没有;

    var defautls = { //表格默认的属性
        height: tableH,
        width:widthW,
        nowrap: false, //不换行
        fitColumns: true, //列宽度自适应table宽度
        remoteFilter: false, //禁止远程筛选
        remoteSort: false, //禁止远程排序
        striped: true, //奇偶行
        pagination: true, //分页
        pageSize: 15,
        pageList: [15, 30, 50, 100], //可以设置每页记录条数的列表
        pageNumber: 1, //初始化，在翻页后重新加载数据时会显示第一页
        showRefresh: false, //是否显示刷新按钮
        singleSelect: true, //是否单选
        scrollbarSize: 1,
        columns: columnsData,
        sortable: false,
        sorter: function(a, b) {
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
        onLoadSuccess: function(data) {
            $('.noData').remove()
            if (true) {
                $(".datagrid-filter-row").hide();
            }
            if(ipVersion == 'IPV6'){
                $('td[field="aPnetname"]').hide();
                $('td[field="aPdescr"]').hide();
                $('td[field="aPadmin_c"]').hide();
                $('td[field="aPtech_c"]').hide();
                $('td[field="aPmnt_by"]').hide();
                $('td[field="aPmnt_lower"]').hide();
                $('td[field="aPmnt_routes"]').hide();

                $('td[field="aPchanged"]').hide();
                $('td[field="aPmnt_irt"]').hide();
                $('td[field="aPrev_srv"]').hide();
                $('td[field="aPnotify"]').hide();
                $('td[field="aPcountry"]').hide();
                $('td[field="aPstatus"]').hide();
                $('td[field="aPsource"]').hide();

            }
            $('#mm1').css('opacity', 1)
            if (data.rows.length > 0) {
                var ddlMenu = $('a[name=mm]').menubutton({
                    menu: '#mm1',
                    duration: 9999,
                    onClick: function() {
                        SelectRow = $(this).attr("data-rowindex");
                    }
                });

                //在这里获取当前行
                $(ddlMenu.menubutton('options').menu).menu({
                    onClick: function(item) {
                        //item.Text可以获取点击菜单的文本来进行判断
                        // alert(item.text);
                        var rows = $('#' + tableId).datagrid('getRows'); //获得所有行
                        var row = rows[SelectRow]; //根据index获得其中一行。
                        // console.log(row);
                        switch (item.text) {
                            case '修改':
                                modClick(row)
                                break;
                            case '删除':
                                $.messager.confirm('操作提示', '是否删除此条数据?', function(r) {
                                    if (r) {
                                        FilingDelBath([row.filingID])
                                    }
                                });

                                break;
                            case '详细信息':
                                toView(row)
                                break;

                            default:
                                break;
                        }
                    }
                })
            }

            formatLongString();

        }
    };

    var obj = $.extend({}, defautls, tableOpt);

    $("#" + tableId).datagrid(obj);

    $('#' + tableId).datagrid('enableFilter').datagrid('loadData', data); //必须先初始化过滤，再加载数据，插件自带排序筛选分页

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

    $(window).resize(function() {
        $("#" + tableId).datagrid("resize", { width: $("#" + tableId).width() });
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
    $target.hover(function() {
        var $clone = $(this).clone().css({ display: 'inline', width: 'auto', visibility: 'hidden' }).appendTo('body');
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