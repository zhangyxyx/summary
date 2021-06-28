var timer = null;
$(function () {
  initImportBtnClickEvent();
  getPlanAddrDetail(queryAllPage.pageSize,queryAllPage.pageNum);
  loadDetailTable();
  timer = setInterval(() => {
    getPlanAddrDetail(queryAllPage.pageSize,queryAllPage.pageNum);
  }, 10000);
});

var curlPath = window.document.location.href;
var pathName = window.document.location.pathname;
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var tempName = "/ipaddrmodule";//当前文件的跟目录
var bathPath = "";
if (projectName == tempName) {
  projectName = "";
} else {
  bathPath = curlPath.substring(0, pathName.indexOf('/')) + projectName;
}
let userid = jQuery.ITE.getLoginName('loginName');//登录用户
let queryAllPage = {//汇总查询
  pageSize: 5,
  pageNum: 1,
  total: 0,
}

//初始化导入按钮点击事件
function initImportBtnClickEvent() {
  $(".importBtn").click(function () {
      if ($(this).val() == "导入") {
          //判断是否选择了需要导入的文件
          if ($("input[name='impfilename']").val() == "") {
              alert("请选择需要导入的文件！");
              return;
          }else{
            let file = $("input[name='impfilename']").val();
            var strFileName=file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1");  //正则表达式获取文件名，不带后缀
            var FileExt=file.replace(/.+\./,"");   //正则表达式获取后缀
            if(FileExt !== 'csv'){
              alert("导入的文件格式不正确！");
              return;
            }
          }
          $("#importForm").ajaxSubmit({
              url: encodeURI(bathPath + '/ipaddrmodule/IpBatchQuery/QueryIpv4Batch'),
              // url: encodeURI('/ipaddrmodule/IpBatchQuery/QueryIpv4Batch'),
              type: 'POST',
              data: { 
                userid: userid,
                filename:strFileName+"."+FileExt,
                filedir:$("input[name='impfilename']").val()
              },
              dataType: 'json',
              // contentType: 'application/json;chartset=UTF-8',
              contentType:"multipart/form-data;harset=utf-8",
              beforeSend: function () {
                  $.messager.progress({
                      title: '提示',
                      msg: '数据正在导入中，请稍候...',
                      text: ''
                  });
              },
              success: function (obj) {
                  if (obj.code == "0000") {
                      $.messager.progress('close');
                      setTimeout(function(){
                        alert("V4地址批量导入成功!");
                        getPlanAddrDetail(queryAllPage.pageSize,queryAllPage.pageNum);
                      },100)
                      
                  } else {
                      alert("V4地址批量导入失败")
                      $.messager.progress('close');
                  }
              },
              error: function (error) {
                  $.messager.alert('提示', '接口调用失败!', 'error');
                  $.messager.progress('close');

              },
              complete: function () {
                // $HOME/itep/var/config/ipaddr/ipv4BatchQuery.csv
              }
          });
      } else if ($(this).val() == "模板下载") {
          // window.open(bathPath + "/ipaddrmodule/itep/var/config/ipaddr/ipv4BathQueryTemp.csv");
          // window.open(bathPath + "/ipaddrmodule/itep/var/config/ipaddr/ipv4BatchQuery.csv");
          let elink = document.createElement("a");
          elink.target = '_blank';
          // 设置下载文件名
          elink.download = "";
          elink.style.display = "none";
          elink.href = bathPath+"/"+'ipaddrmodule/itep/var/config/ipaddr/ipv4BathQueryTemp.csv';
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
      }
  });
}


//初始化表格分页
function initClickPageEvent() {
  $('#pagination').pagination({
      total: queryAllPage.total,
      pageSize: queryAllPage.pageSize,
      pageNumber: queryAllPage.pageNum,
      pageList: [5,10,20, 30, 40, 50],
      onSelectPage: function (pageNumber, pageSize) {
          queryAllPage.pageSize = pageSize;
          queryAllPage.pageNum = pageNumber;
          getPlanAddrDetail(queryAllPage.pageSize,queryAllPage.pageNum);
      }
  });
}

//明细查询
function getPlanAddrDetail(pageSize,pageNum) {
  let params = {
        userid: userid,
        ipversion:"IPV4",
  };
  $.ajax({
    url: encodeURI(bathPath + '/ipaddrmodule/IpBatchQuery/GetIpBatchQueryList'),
    type: 'post',
    data: JSON.stringify(params),
    cache: false,
    dataType: 'json',
    contentType: 'application/json;chartset=UTF-8',
    beforeSend: function () {

    },
    success: function (obj) {
      if(obj.code=="0000"){
        let tableData = obj.data;
        queryAllPage.total = obj.data.length;
        let newData = tableData.slice((pageNum-1)*pageSize,pageNum*pageSize)
        loadDetailTable(newData);
        initClickPageEvent()
      }else{
        alert("Ipv4公网地址批量查询失败");
        clearInterval(timer);
        timer = null;
      }
      
    },
    error: function (error) {
        $.messager.alert('提示', '接口调用失败!', 'error');
        clearInterval(timer);
        timer = null;
    },
    complete: function () {

    }
  });
}

//加载明细表格数据
function loadDetailTable(tableData) {
  //清空无数据提示信息
  $(".noData").hide();
  /*定义表格的表头*/
  var columnsData = [[
      { field: 'filename', title: '文件名称', align: 'center',width: fixWidth(0.6)},
      { field: 'opertime', title: '生成时间', align: 'center',width: fixWidth(0.18)},
      {
          field: 'operate', title: '操作', align: 'center', width: fixWidth(0.18),
          formatter: function (value, row, index) {
              let objdata = {
                filedir:row.filedir,
                filename:row.filename
              };
              // return '<a style="cursor:pointer" onclick=openAddrPlanPage(\''+row.filedir+','+row.filename+'\')>'+'下载'+'</a>'
              var str = '<a style="cursor:pointer" onclick= "openAddrPlanPage(' +
              JSON.stringify(objdata).replace(/\"/g, "'") + ')" >下载</a>';
              return str
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
          pagination: false//分页
      }
  };
  relatedTable(tableId, opt);
  $(".datagrid-row td").css("background-color", "#fff");
}

function openAddrPlanPage(val) {
  window.open(bathPath+"/nms/Common/Inc/download.jsp?filename="+val.filedir+"&viewfilename="+val.filename,"","toolbar=no,directories=no,menubar=no,scrollbars=no,resizable=no,width=400,height=300,left=80,top=80");
}


 //easyui表格宽度

 function fixWidth(percent){  

  return (document.body.clientWidth - 5) * percent ;   

}
