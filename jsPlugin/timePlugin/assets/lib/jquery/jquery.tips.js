(function($){
    $.extend({
        tips:function(options){
            var settings = {
                    width:120,
                    height:26,
                    msg:"加载中...",
                    flag:"show",
                    color:"#2b2b2b",
					x:0,
					y:0
            };
            $.extend(settings,options);
            if("hide"==settings.flag){
                if($('div.tip').length>0){
                    $('div.tip').fadeOut("normal",function(){
                        $('div.tip').remove();
                    });
                }
            }else{
                var fadeInFlag = true;
                if(0!=$('div.tip').length){
                    fadeInFlag = false;
                    $('div.tip').remove();
                }
                $("<div class='tip'>"+settings.msg+"</div>").appendTo($("body"))
                .css({
                    display: 'none',
                    position:'absolute',
                    zIndex:10000,
                    left: settings.x,
                    top: settings.y,
                    opacity: 0.9,
                    backgroundColor:'#FFFFCC',
                    border:'1px solid #FFCC99',
                    width: settings.width, 
                    height: settings.height,
                    "text-align": 'center',
                    "line-height": settings.height+"px",
                    "font-size": "12px",
                    color:settings.color||'#2B2B2B'
                });
   //             $('div.tip').css({
     //               "left" : ($('html').width()-$('div.tip').outerWidth())/2-20
       //         });
                if(fadeInFlag)
                    $('div.tip').fadeIn();
                else
                    $('div.tip').show();
                
            }
        }
    });
})(jQuery);