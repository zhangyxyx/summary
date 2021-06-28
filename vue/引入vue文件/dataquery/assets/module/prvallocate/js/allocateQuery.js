$(function(){
    getmanageform();
    initLayuiObj();
    initBtnClickEvent()
   
});
var tableDataList = []
var curlPath = window.document.location.href;
var pathName = window.document.location.pathname;
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var userName = jQuery.ITE.getLoginName('loginName');//登录用户
var tempName = "/ipaddrmodule";//当前文件的跟目录
var bathPath = "";
if (projectName == tempName) {
    projectName = "";
} else {
    bathPath = curlPath.substring(0, pathName.indexOf('/')) + projectName;
}
let queryAllPage = {//汇总查询
    pageSize: 20,
    pageNum: 1,
    total: 0,
}

//管理组织
function getmanageform(){
    let params = {
        userName:userName,
        nodeCode:''
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/NodeManage/GetNodeList'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        success: function (res) {
            let nodelist = res.data
            $("#manageform").combotree({
                idField: 'nodeCode',
                textField: 'nodeName',
                data: nodelist,
                panelHeight: 'auto',//高度自适应
                width: 220,
                multiple: false,
                editable: false,//定义用户是否可以直接往文本域中输入文字
                onLoadSuccess: function () {
                    $("#manageform").combotree('tree').tree("collapseAll");
                },
                //直接过滤，数据太多时不行，太卡了，放弃
                filter: function (q, row) {
                    return row.text.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function (q, e) {
                        $('#manageform').combotree('tree').tree('doFilter', q)
                    }
                },
                // onSelect: function (row) {//点击节点联动地址类型
                //     getaddresstype(row.nodeCode);
                // }
            });
            //初始化显示权限节点
            $('#manageform').combotree('setValue', nodelist[0].nodeCode);
            //页面初始化的时候默认触发汇总查询事件
            $("#searchBtn").click();

        }
    })
}
//获取地址类型
function getaddresstype(nodeCode) {
    $('.clearBtn').css('display', 'none')
    let params = {
        userName: userName,
        nodeCode: nodeCode,
        ipType: "",
        authType: "",
    }
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/PrvIP/IpAddrType/GetPrvaddresstype'),
        type: 'post',
        cache: false,
        data: JSON.stringify(params),
        dataType: 'json',
        contentType: "application/json",
        success: function (obj) {
            let ipTypeList = obj.data;
            $("#addresstype").combotree({
                idField: 'id',
                textField: 'text',
                data: ipTypeList,
                panelHeight: 'auto',//高度自适应
                width: 220,
                multiple: false,
                editable: false,//定义用户是否可以直接往文本域中输入文字
                onLoadSuccess: function () {
                    $("#addresstype").combotree('tree').tree("collapseAll");
                },
                //直接过滤，数据太多时不行，太卡了，放弃
                filter: function (q, row) {
                    return row.text.indexOf(q) >= 0;
                },
                //本地过滤，根据输入关键字的值调用tree的过滤方法
                keyHandler: {
                    query: function (q, e) {
                        $('#addresstype').combotree('tree').tree('doFilter', q)
                    }
                },
                onBeforeSelect: function (row) { //节点被选中前触发，返回 false 则取消选择动作(但是返回false，下拉选项依旧会关闭)
                    if (row.click == "N") {//标签不可选
                        return false;
                    } else {
                        $('.clearBtn').css('display', 'block');
                        return true;
                    }
                },
            });
        }
    });
}

$('#addBtn').click(function(){
    let nodename = $('#manageform').val()
    let net = $('#net').combotree('getValue')
    window.top.$vm.$openTab({
        name: '新增',
        path: bathPath + '/ipaddrmodule/views/jsp/privatenet/newadd.jsp?nodename='+nodename+'&net='+net
    })
})

//初始化layui对象
function initLayuiObj() {
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //日期范围
        laydate.render({
            elem: '#dateTime',
            range: true
        });
        //日期范围
        laydate.render({
            elem: '#reportTime',
            range: true
        });
    })
}
//删除
function del(id){
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/PrvIP/prvIpAllocateCondition/batchAllocateIPDel'),
        type:'POST',
        data:JSON.stringify(id),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        success: function (res) {
            if(res.code == '0000'){
                if(res.data){
                    $.each(res.data,function(idx,item){
                        if(item.errormsg.length > 1){
                            $.messager.alert('提示', item.errormsg, 'error');
                        }
                    })
                }else{
                    $.messager.alert('提示', res.tip, 'success');
                    queryAllocatedlist();
                }
            }else{
                $.messager.alert('提示', res.tip, 'error');

            }
        }
    })
}

function detail(row){
    window.top.$vm.$openTab({
        name: '新增',
        path: bathPath + '/ipaddrmodule/views/jsp/privatenet/details.jsp'
    })
}
//初始化按钮点击事件
function initBtnClickEvent(){
    queryAllocatedlist();
}
$('#searchBtn').click(function(){
    queryAllocatedlist();
})

//初始化表格分页
function initClickPageEvent() {
    $('#pagination').pagination({
        total: queryAllPage.total,
        pageSize: queryAllPage.pageSize,
        pageNumber: queryAllPage.pageNum,
        pageList: [20, 30, 40, 50],
        onSelectPage: function (pageNumber, pageSize) {
            queryAllPage.pageSize = pageSize;
            queryAllPage.pageNum = pageNumber;
            queryAllocatedlist();
        }
    });
}

//分配址查询
function queryAllocatedlist() {
    let params = {
        pagesize: queryAllPage.pageSize.toString(),
        pageno: queryAllPage.pageNum.toString(),
        nodecode: $("#manageform").val(),
        nodescope:'like',
        beginallotdate: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[0]+' 00:00:00',
        endAllotDate: $("#dateTime").val() == "" ? "" : $("#dateTime").val().split(" - ")[1]+' 23:59:59',
        beginip: $("#addresspart").val() == "" ? "" : $("#addresspart").val().split(" - ")[0]+' 00:00:00',
        endip: $("#addresspart").val() == "" ? "" : $("#addresspart").val().split(" - ")[1]+' 23:59:59',
        scope: 'intersection',
        netcode:$('#net').combotree('getValue'),
        netscope:'like',
        iptypecode:$('#addresstype').combotree('getValue'),
        iptypescope:'like',
        netuserid:userName,
        nextnodename:$("#applyform").combotree('getValue'),
        nextnodenamescope:'like',
    }
    // console.log(params,'canshu')
    $.ajax({
        url: encodeURI(bathPath + '/ipaddrmodule/PrvIP/prvIpAllocateCondition/queryAllocatedlist'),
        type:'POST',
        data:JSON.stringify(params),
        dataType:'json',
        contentType: 'application/json;chartset=UTF-8',
        beforeSend: function () {},
        success: function (res) {
            if(res.code == "0000"){
                let tableData = res.data.result;
                queryAllPage.total = res.data.totalResult;
                tableDataList = tableData
                loadDetailTable(tableData);
                initClickPageEvent();
            }else{
                $.messager.alert('提示',res.tip,'error');
            }
        },
        error: function (error) {
            $.messager.alert('提示', '接口调用失败!', 'error');
        },
        complete: function () {}
    });
}
//加载明细表格数据
function loadDetailTable(tableData) {
    //清空无数据提示信息
    $(".noData").hide();
    /*定义表格的表头*/
    var columnsData = [[ 
        { field: 'ck', checkbox: true, width: '30' },  //复选框 
        { field: 'nodename', title: '管理组织', align: 'center', width: 140 },
        { field: 'nextnodename', title: '申请组织', align: 'center', width: 100 },
        { field: 'inetnum', title: '地址段', align: 'center', width: 100 },
        { field: 'netname', title: '所属网络', align: 'center', width: 100 },
        { field: 'iptypename', title: '原地址类型', align: 'center', width: 120 },
        { field: 'iptypenewname', title: '新地址类型', align: 'center', width: 120 },
        { field: 'allotdate', title: '分配日期', align: 'center', width: 120 },
        { field: 'operate', title: '操作', align: 'center', width: 100,
            formatter: function (value, row, index) {
                let delarr = []
                if(row.inetnumid){
                    delarr.push({inetnumid:row.inetnumid})
                }else{
                    delarr.push({inetnumid:row.inetnumid,startip:row.startip,endip:row.endip,netcode:row.netcode,nodecode:row.nodecode})
                }
                delarr = JSON.stringify(delarr)
                return `<span>
                            <a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=detail>详情</a>
                            <a class='operateBtn'style='cursor:hand;margin-left:10px' onclick=del(${delarr})>删除</a>
                        </span>`;
            }
        }
    ]];

    var tableId = "dataList";
    var tableH = $(".tablePanel").height();
    var opt = {
        columnsData: columnsData,
        data: tableData,
        tableH: tableH,
        NofilterRow: true,
        tableOpt: {
            pagination: false,//分页
            checkOnSelect:false,
            onLoadSuccess:function(row){//当表格成功加载时执行      
                $(".datagrid-filter-row").hide();    
                var rowData = row.rows;
                $.each(rowData,function(idx,val){//遍历JSON
                      
                });        
            }
        }
    };
    relatedTable(tableId, opt);
}

/*******************************************************************
 函数名：	formatIpMask(start,end)
 功能：		将起始地址终止地址转换成  地址—地址 或者 地址/掩码 或 单地址
 例如：  formatIpMask('127.0.0.0','127.0.0.0') => '127.0.0.0'
        formatIpMask('127.0.0.0','127.0.0.2') => '127.0.0.0-127.0.0.2'
        formatIpMask('127.0.0.0','127.0.0.255') => '127.0.0.0/24'
 入口参数：	start,end 地址段的起始地址和终止地址（全编码也可）
*******************************************************************/
function formatIpMask(start,end){
    try{
        var startint=ipStrToInt(start);
        var endint=ipStrToInt(end);
        if(startint==endint){
            return ipIntToStr(startint);
        }
        var mask=31;
        var out=false;
        for(;mask>=0;mask--)
        {    		
                if((startint&(1<<31-mask))!=0||(endint&(1<<31-mask))==0)
                {
                    out=true;
                    break;
                }
            }  
        if(mask<31)
          {
           if(mask!=0||out)
           {
              mask++;
           }
        if(mask==0||(startint&(-1<<(32-mask)))==(endint&(-1<<(32-mask))))
              return ipIntToStr(startint)+"/"+mask;    		
          }
        return ipIntToStr(startint)+"-"+ipIntToStr(endint);
    }catch(e){
        return "Error";
    }
}