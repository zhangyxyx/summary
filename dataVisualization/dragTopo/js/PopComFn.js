/**
 * [PopDivHtml 弹出框DIV的效果与样式]
 * title：弹窗框的标题
 * classname：弹窗框的类名，默认是clickDetail
 * popheight：弹窗框的高度，默认是$(".clickDetail").height();
 * popwidth：弹窗框的高度，默认是$(".clickDetail").width();
 */
function PopDivHtml(opt){
    var opt = opt?opt:{};
    var title = opt.title?opt.title:"";
    var className = opt.className?opt.className:"clickDetail";
    var popHeight = opt.popHeight?opt.popHeight:350;
    var popWidth = opt.popWidth?opt.popWidth:800;

    $("<div class='mask'></div>").css({
        "position": "absolute",
        "top":0,
        "left":0,
        "z-index": 1000,
        "width": "100%",
        "height":"100%",
        "background": "rgba(0,0,0,.4)"
    }).appendTo('body');
    $("<div class='"+className+"'></div>").css({
        "position": "absolute",
        "z-index": 1001,
        "width": popWidth,
        "height": popHeight,
        "border-radius": "10px",
        "box-shadow":"0px 20px 50px 0 rgba(2, 17, 19, 0.77)",
        "background-color":"#074b66"
    }).appendTo('body');
    var detailHtml="<h3 class='poptitle'>"+title+" <div class='closeBtn'></div></h3>";
    detailHtml+="<div class='popcontent'></div>";
    $("."+className).html(detailHtml);
    $(".poptitle").css({
        "color":"#151616",
        "height":"40px",
        "line-height":"40px",
        "background":"#fff",
        "font-size":"14px",
        "padding-left":"14px",
        "border-top-left-radius":"10px",
        "border-top-right-radius":"10px",
        "cursor":"move",
        "font-weight":"normal"
    });
    $(".closeBtn").css({
        "float":"right",
        "width": "16px",
        "height": "16px",
        "margin-top":"12px",
        "margin-right":"14px",
        "border": 0,
        "background": "url(assets/img/closebtn.png) no-repeat",
        "background-size":"cover",
        "cursor": "pointer"
    });
    $(".popcontent").css({
        "background":"#074b66",
        "height":popHeight - $(".poptitle").outerHeight()-20+"px"
    });
    if(!popWidth){
        popWidth = $("."+className).width();
    }
    if(!popHeight){
        popHeight = $("."+className).height();
    }
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var scrollHeight = $(document).scrollTop();
    var DetailWidth=  popWidth;
    var DetailHeight=  popHeight;
    //居中
    $("."+className).css({
        'left': (windowWidth-DetailWidth)/2,
        'top':  (windowHeight-DetailHeight)/2+scrollHeight
    });
    //移动
    var move = false; //移动标记
    var _x, _y; //鼠标离控件左上角的相对位置


    $("."+className+" h3").mousedown(function(e) {
        move = true;
        _x = e.pageX - parseInt($("."+className).css("left"));
        _y = e.pageY - parseInt($("."+className).css("top"));
    });
    $(document).mousemove(function(e) {
        if (move) {
            var x = e.pageX - _x; //控件左上角到屏幕左上角的相对位置
            var y = e.pageY - _y;
            $("."+className).css({
                "top": y,
                "left": x
            });
        };
    }).mouseup(function() {
        move = false;
    });
    $("."+className+" .closeBtn").click(function(){
        $("."+className).remove();
        $(".mask").remove();
    });
};