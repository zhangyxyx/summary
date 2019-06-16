$(function(){
    //去掉默认右键事件
    document.oncontextmenu = function(){
        　　return false;
    }
    $("body").click(function(){
        $(".contextEvent").hide();
    })
    //初始化拓扑
    initTopo()
    //初始化事件
    //initEvent()
})
function initTopo(){
    var topo = Graph.init(document.getElementById('topo'), {
        cx: 0.65,
        drag: true,
        saveposflag:true,
    });
    topo.showLoading();
    topo.hideLoading();
}
function initEvent(){
    $(".delete").click(function(){
        var data=nowNode
        removeNode(data)
    })
}