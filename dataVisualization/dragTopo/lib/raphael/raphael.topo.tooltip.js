!function (global){
    if(global.RTopo){
        global.RTopo.prototype.tooltip = function(options){
            var elem = options.elem,
                info = options.info;
            var fx,fy;
            var _mouseover = function(_elem){
                $("<div class='rtopotip'>"+info+"</div>").css({
                    "display":"none",
                    "position":"absolute",
                    "padding":10,
                    "background":'rgba(2,2,2,0.8)',
                    "z-index":9999,
                    'border-radius':3,
                    "color":'#fff',
                    "font-size":13,
                    "line-height":"20px"
                }).appendTo("body");
            };
            var _mouseout = function(_elem){
                $(".rtopotip").remove();
            };
            var _mousemove = function(e){
                e = e||window.event;
                fx = e.x;
                fy = e.y;
                if(e.pageX && e.pageY){ 
                    fx = e.pageX; 
                    fy = e.pageY; 
                } else {
                    fx = e.clientX + document.body.scrollLeft - document.body.clientLeft;
                    fy = e.clientY + document.body.scrollTop - document.body.clientTop;
                }

                if((fx-$(".rtopotip").outerWidth()/2)<0){
                    $(".rtopotip").css({
                        left:fx+20,
                        top:fy-$(".rtopotip").outerHeight()/2
                    }).show();
                }else{
                    $(".rtopotip").css({
                        left:fx-$(".rtopotip").outerWidth()/2,
                        top:fy-$(".rtopotip").outerHeight()-10
                    }).show();
                }
            };
            elem.mouseover(function(){
                _mouseover(this)
            });
            elem.mouseout(function(){
                _mouseout(this)
            });
            if(elem.text){
                elem.text.mouseover(function(){
                    _mouseover(elem)
                });
                elem.text.mouseout(function(){
                    _mouseout(elem)
                });
            }
            elem.mousemove(function(e){
                _mousemove(e)
            });
            if(elem.text){
                elem.text.mousemove(function(e){
                    _mousemove(e)
                });
            }
        }
    }
}(window);