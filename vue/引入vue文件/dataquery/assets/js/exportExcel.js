/**
 * Created by zzl on 2016/7/11.
 */



function ChangeToTable(printDatagrid) {
    $("#exportExcel").remove();
    var tableString = '<div id="exportExcelContent">';
        tableString += '<table cellspacing="0" class="exportExcel" id="exportExcel">';
    var frozenColumns = printDatagrid.datagrid("options").frozenColumns;  // �õ�frozenColumns����
    var columns = printDatagrid.datagrid("options").columns;    // �õ�columns����
    var nameList = new Array();

    // ����title
    if (typeof columns != 'undefined' && columns != '') {
        $(columns).each(function (index) {
            tableString += '\n<tr>';
            if (typeof frozenColumns != 'undefined' && typeof frozenColumns[index] != 'undefined') {
                for (var i = 0; i < frozenColumns[index].length; ++i) {
                    if (!frozenColumns[index][i].hidden) {
                        tableString += '\n<td width="' + frozenColumns[index][i].width + '"';
                        if (typeof frozenColumns[index][i].rowspan != 'undefined' && frozenColumns[index][i].rowspan > 1) {
                            tableString += ' rowspan="' + frozenColumns[index][i].rowspan + '"';
                        }
                        if (typeof frozenColumns[index][i].colspan != 'undefined' && frozenColumns[index][i].colspan > 1) {
                            tableString += ' colspan="' + frozenColumns[index][i].colspan + '"';
                        }
                        if (typeof frozenColumns[index][i].field != 'undefined' && frozenColumns[index][i].field != '') {
                            nameList.push(frozenColumns[index][i]);
                        }
                        tableString += '>' + frozenColumns[0][i].title + '</td>';
                    }
                }
            }
            for (var i = 0; i < columns[index].length; ++i) {
                if (!columns[index][i].hidden) {
                    tableString += '\n<td width="' + columns[index][i].width + '"';
                    if (typeof columns[index][i].rowspan != 'undefined' && columns[index][i].rowspan > 1) {
                        tableString += ' rowspan="' + columns[index][i].rowspan + '"';
                    }
                    if (typeof columns[index][i].colspan != 'undefined' && columns[index][i].colspan > 1) {
                        tableString += ' colspan="' + columns[index][i].colspan + '"';
                    }
                    if (typeof columns[index][i].field != 'undefined' && columns[index][i].field != '') {
                        nameList.push(columns[index][i]);
                    }
                    tableString += '>' + columns[index][i].title + '</td>';
                }
            }
            tableString += '\n</tr>';
        });
    }
    // ��������
    var rows = printDatagrid.datagrid("getRows"); // ��δ����ǻ�ȡ��ǰҳ��������
    for (var i = 0; i < rows.length; ++i) {
        tableString += '\n<tr>';
        for (var j = 0; j < nameList.length; ++j) {
            var e = nameList[j].field.lastIndexOf('_0');

            tableString += '\n<td';
            if (nameList[j].align != 'undefined' && nameList[j].align != '') {
                tableString += ' style="text-align:' + nameList[j].align + ';"';
            }
            tableString += '>';
            if (e + 2 == nameList[j].field.length) {
                tableString += rows[i][nameList[j].field.substring(0, e)];
            }
            else
                tableString += rows[i][nameList[j].field];
            tableString += '</td>';
        }
        tableString += '\n</tr>';
    }
    tableString += '\n</table>';
    tableString += '\n</div>';
    /*tableString = $.base64({data:tableString,type:1});*/
    $("body").append(tableString);
    $("#exportExcel").find("td").each(function(){
        if($(this).text()=="undefined" || $(this).text()=="null"){
            $(this).text(" ");
        }
    });
    $.fn.tableExport.charset = "charset=gb1312";
    $("#exportExcel").tableExport({
        headings: true,                    // (Boolean), display table headings (th/td elements) in the <tdead>
        footers: true,                     // (Boolean), display table footers (th/td elements) in the <tfoot>
        type: 'excel',
        escape: 'false',
        ignoreRows: null,                  // (Number, Number[]), row indices to exclude from the exported file
        ignoreCols: null,                   // (Number, Number[]), column indices to exclude from the exported file
        ignoreCSS: ".tableexport-ignore"   // (selector, selector[]), selector(s) to exclude from the exported file
    });

    setTimeout(function(){
        console.log(2)
        $(".xlsx").click();

    },500);

    /*return tableString;*/
}
