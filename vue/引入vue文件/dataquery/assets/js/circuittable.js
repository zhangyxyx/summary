// 2016.07.11,maml,国家电网拓扑
(function(win) {
    'use strict';

    var CIRVIEWURL = 'views/jsp/circuit/circuit.jsp';

    $('#phy-cir-table').datagrid({
        border: false,
        height: 265,
        fitColumns: true,
        striped: true,
        singleSelect: true,
        remoteSort: false,
        columns: [
            [{
                field: 'circuitid',
                title: '电路ID',
                hidden: true
            }, {
                field: 'circuitname',
                title: '电路名称',
                width: 200,
                align: 'center',
                sortable: true
            }, {
                field: 'adevicename',
                title: 'A端名称',
                width: 140,
                align: 'center',
                sortable: true
            }, {
                field: 'aport',
                title: 'A端端口',
                width: 100,
                align: 'center',
                sortable: true
            }, {
                field: 'bdevicename',
                title: 'B端名称',
                width: 140,
                align: 'center',
                sortable: true
            }, {
                field: 'bport',
                title: 'B端端口',
                width: 100,
                align: 'center',
                sortable: true
            }]
        ],
        loadMsg: '数据加载中...',
        data: {
            rows: []
        },
        rowStyler: function(index, row) {
            var alarmLevel = 0;
            if (row.isinterrupt) {
                alarmLevel = 9;
            } else if (row.iscongestion) {
                alarmLevel = 8;
            } else if (row.alarmlevel) {
                alarmLevel = row.alarmlevel;
            }
            var bgColor = getAlarmColor('CIR', alarmLevel);
            if (!bgColor) {
                bgColor = 'rgba(0,152,71,0.4)';
            }
            return 'background-color:' + bgColor;
        }
    });
    $('#phy-cir-window').window({
        width: 800,
        height: 300,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        shadow: false,
        resizable: true,
        modal: true,
        closed: true,
        onResize: function(width, height) {
            $('#phy-cir-table').datagrid('resize', {
                width: width - 12,
                height: height - 35
            });
        },
        onClose: function() {
            $('#phy-cir-table').datagrid('loadData', []);
        }
    });

    win.viewCirList = function(datas, title) {

        $('#phy-cir-window').window('setTitle', title?title:'');
        $('#phy-cir-window').window('open');

        $('#phy-cir-table').datagrid('loading');
        if (typeof datas == 'string') {
            $.ajax({
                url: datas,
                cache: false,
                dataType: 'json',
                success: function(data) {
                    $('#phy-cir-table').datagrid('loaded');
                    var tableData = {
                        rows: new Array()
                    };
                    for (var i = 0, len = data.result.circuits.length; i < len; i++) {
                        var row = data.result.circuits[i];
                        row.circuitname = '<a title="' + row.circuitname + '">' + row.circuitname + '<a>';
                        row.option = '<a target="_blank" style="text-decoration:underline;" href="' + CIRVIEWURL + '?webset=GW&circuitid=' + row.circuitid + '">电路视图</a>';
                        tableData.rows.push(row);
                    }
                    $('#phy-cir-table').datagrid('loadData', tableData);
                }
            });
        } else {
            var tableData = {
                rows: new Array()
            };
            for (var i = 0, len = datas.rows.length; i < len; i++) {
                var row = datas.rows[i];
                row.circuitname = '<a title="' + row.circuitname + '">' + row.circuitname + '<a>';
                tableData.rows.push(row);
            }
            $('#phy-cir-table').datagrid('loaded');
            $('#phy-cir-table').datagrid('loadData', datas);
        }
    };
    win.viewCirList2 = function(datas, title) {

        $('#phy-cir-window').window('setTitle', title?title:'');
        $('#phy-cir-window').window('open');

        $('#phy-cir-table').datagrid('loading');
        if (typeof datas == 'string') {
            $.ajax({
                url: datas,
                cache: false,
                dataType: 'json',
                success: function(data) {
                    $('#phy-cir-table').datagrid('loaded');
                    var tableData = {
                        rows: new Array()
                    };
                    for (var i = 0, len = data.circuits.length; i < len; i++) {
                        var row = data.circuits[i];
                        row.circuitname = '<a title="' + row.circuitname + '" target="_blank"  href="' + CIRVIEWURL + '?webset=GW&circuitid=' + row.circuitid + '">' + row.circuitname + '<a>';
                        // row.option = '<a target="_blank" style="text-decoration:underline;" href="' + CIRVIEWURL + '?webset=GW&circuitid=' + row.circuitid + '">电路视图</a>';
                        tableData.rows.push(row);
                    }
                    $('#phy-cir-table').datagrid('loadData', tableData);
                }
            });
        } else {
            var tableData = {
                rows: new Array()
            };
            for (var i = 0, len = datas.rows.length; i < len; i++) {
                var row = datas.rows[i];
                row.circuitname = '<a title="' + row.circuitname + '">' + row.circuitname + '<a>';
                tableData.rows.push(row);
            }
            $('#phy-cir-table').datagrid('loaded');
            $('#phy-cir-table').datagrid('loadData', datas);
        }
    };
    win.viewCirList3 = function(datas, title) {

        $('#phy-cir-window').window('setTitle', title?title:'');
        $('#phy-cir-window').window('open');

        $('#phy-cir-table').datagrid('loading');
        if (typeof datas == 'string') {
            $.ajax({
                url: datas,
                cache: false,
                dataType: 'json',
                success: function(data) {
                    $('#phy-cir-table').datagrid('loaded');
                    var tableData = {
                        rows: new Array()
                    };
                    for (var i = 0, len = data.circuits.length; i < len; i++) {
                        var row = data.circuits[i];
                        // row.circuitname = '<a title="' + row.circuitname + '" target="_blank"  href="views/jsp/alarmPaneltrue/alarmPanel.html?resid=' + row.circuitid + '">' + row.circuitname + '<a>';
                        row.circuitname = '<a title="' + row.circuitname + '" target="_blank"  href="/views/jsp/circuit/circuit.jsp?circuitid=' + row.circuitid + '&webset=GW">' + row.circuitname + '<a>';
                        // row.option = '<a target="_blank" style="text-decoration:underline;" href="' + CIRVIEWURL + '?webset=GW&circuitid=' + row.circuitid + '">电路视图</a>';
                        tableData.rows.push(row);
                    }
                    $('#phy-cir-table').datagrid('loadData', tableData);
                }
            });
        } else {
            var tableData = {
                rows: new Array()
            };
            for (var i = 0, len = datas.rows.length; i < len; i++) {
                var row = datas.rows[i];
                row.circuitname = '<a title="' + row.circuitname + '">' + row.circuitname + '<a>';
                tableData.rows.push(row);
            }
            $('#phy-cir-table').datagrid('loaded');
            $('#phy-cir-table').datagrid('loadData', datas);
        }
    };

})(window);
