
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
/*应用服务原始数据*/
function v4export(){
  tempService("ipv4","/ipaddrmodule/tempService/getIPYyfwlx")
}
function v6export(){
  tempService("ipv6","/ipaddrmodule/tempService/getIPYyfwlx") 
}
/*更新应用服务类型*/
function v4updata(){
  tempService("ipv4","/ipaddrmodule/tempService/UpdateIPYyfwlx","ipv4应用服务类型更新成功")
}
function v6updata(){
  tempService("ipv6","/ipaddrmodule/tempService/UpdateIPYyfwlx","ipv6应用服务类型更新成功") 
}

function tempService(type,serurl,msg) {
  $.ajax({
    url: encodeURI(bathPath + serurl),
    type: 'POST',
    data: JSON.stringify({ 
      iptype: type,
    }),
    dataType: 'json',
    cache:false,
    contentType: 'application/json;chartset=UTF-8',
    success: function (res) {
      if (res.code == "0000") {
        if(msg){
          alert(msg)
        }else{
            alert(res.tip);
        }
        $(".showTip").css({
          display:"none"
        })
      }else {
        alert(res.tip);
        $(".showTip").css({
          display:"block"
        })
        let error = "失败提示："+res.tip
        $(".showTip").html(error)
      }
    },
    error: function (error) {
        $(".showTip").css({
          display:"none"
        })
        $.messager.alert('提示', '接口调用失败!', 'error');
    },
  })
}

