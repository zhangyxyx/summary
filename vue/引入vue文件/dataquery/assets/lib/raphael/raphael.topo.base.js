!function (global) {
    var addEventListener ;
    if(document.all){
        addEventListener = function(ele,eventname,fn){
            ele.attachEvent("on"+eventname,fn);
        }
    }else{
        addEventListener = function(ele,eventname,fn){
            ele.addEventListener(eventname,fn,false)
        };
    }
    var getEvent = function(e){
        var evt = window.event?window.event:e;
        if(!evt.stopPropagation){
            evt.stopPropagation = function(){
                evt.cancelBubble=false;
            }
        }
        if(!evt.preventDefault){
            evt.preventDefault = function(){
                evt.returnValue=false;
            }
        }
        if(!evt.target){
            evt.target = evt.srcElement;
        }
        if(!evt.which){
            e.which = e.button;
        }
        return evt;
    };
    var clearSelection = function(){
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }
    };
    var RTopo = global.RTopo = function(domId,options){
        var me = this;
        me.canvas = document.getElementById(domId);
        me.canvasx = $(me.canvas).offset().left;
        me.canvasy = $(me.canvas).offset().top;
        me.width = me.canvas.clientWidth;
        me.height = me.canvas.clientHeight;
        me.paper = Raphael(domId,me.width,me.height);
        me.options = {
            zoom:true,
            drag:true,
            maxzoom:2,
            zoomprop:0.9
        };
        if(options){
            for(var key in options){
                me.options[key] = options[key];
            }
        }
        me._bind();
        me.autoSet();
    };
    RTopo.prototype = {
        _bind:function(){
            var me  = this,
                c = me.canvas,
                wheel= function(e){
                    var evt = getEvent(e),
                        viewbox = me.getViewBox(),
                        delta = evt.wheelDelta?(evt.wheelDelta/120):(-evt.detail/3),
                        basePoint = {x:viewbox.x+evt.clientX-me.canvasx,y:viewbox.y+evt.clientY-me.canvasy};
                    me.setZoom(me.getZoom()*(1+delta*0.1),basePoint);
                    evt.stopPropagation();
                    evt.preventDefault();
                    return false;
                };
            try{
                if(me.options.zoom){
                    addEventListener(c,"mousewheel",wheel);//IE+webkit
                    addEventListener(c,"DOMMouseScroll",wheel);//firefox
                }
            }catch(e){
                // console.log(e);
            }
            if(me.options.drag){
                me.canvasdragging = false;
                addEventListener(c,"mousedown",function(e){
                    var evt = getEvent(e),
                        drag = false,
                        viewbox = me.getViewBox(),
                        node = me.paper.getElementByPoint(evt.clientX,evt.clientY);
                    if(e.which!=1){
                        return ;
                    }
                    if(evt.target.parentNode==me.canvas){
                        me.canvasdragging = {x:evt.clientX,y:evt.clientY,timestamp:(new Date()).getTime()};
                        me.canvas.style.cursor = "move";
                    }
                });
                addEventListener(c,"mousemove",function(e){
                    var evt = getEvent(e),
                        viewbox = me.getViewBox(),
                        now = (new Date()).getTime(),
                        hovernode = me.paper.getElementByPoint(evt.clientX,evt.clientY);
                    clearSelection();
                    if(me.canvasdragging && now-me.canvasdragging.timestamp >10 ){
                        var x = parseInt((me.canvasdragging.x-evt.clientX)/me.getZoom()),
                            y = parseInt((me.canvasdragging.y-evt.clientY)/me.getZoom()),
                            viewbox = me.getViewBox();
                        me.canvasdragging={x:evt.clientX,y:evt.clientY};
                        me.setViewBox(viewbox.x+x,viewbox.y+y,viewbox.w,viewbox.h);
                        me.canvasdragging.timestamp = now;
                    }
                });
                addEventListener(c,"mouseup",function(e){
                    var evt = getEvent(e);
                    clearSelection();
                    if(me.canvasdragging){
                        me.canvasdragging=false;
                        me.canvas.style.cursor = "auto";
                    }
                });
            }
        },
        setViewBox:function(x,y,w,h,fit){
            var me = this;
            me.x=x;
            me.y=y;
            me.w=w;
            me.h=h;
            return me.paper.setViewBox(x,y,w,h,fit);
        },
        getViewBox:function(){
            return {x:this.x,y:this.y,w:this.w,h:this.h};
        },
        getZoom:function(){
            return this.zoom;
        },
        reset:function(){
            this.zoom=1;
            this.setViewBox(0,0,this.width,this.height);
        },
        //当坐标为负数时，自动居中有问题
        autoSet:function(){
            var me = this;
            var paper = me.paper;

            var coord = {
                minx:Number.MAX_VALUE,
                miny:Number.MAX_VALUE,
                maxx:Number.MIN_VALUE,
                maxy:Number.MIN_VALUE
            };

            var nodeCount = 0;

            paper.forEach(function(ele){
                nodeCount ++;
                var box = ele.getBBox();
                coord.minx = coord.minx<box.x?coord.minx:box.x;
                coord.miny = coord.miny<box.y?coord.miny:box.y;
                coord.maxx = coord.maxx>box.x2?coord.maxx:box.x2;
                coord.maxy = coord.maxy>box.y2?coord.maxy:box.y2;
            });
            if(0==nodeCount){
                me.zoom = 1;
                me.setViewBox(0,0,me.width,me.height);
            }else{
                var centerPoint = {
                    x:(coord.minx+coord.maxx)/2,
                    y:(coord.miny+coord.maxy)/2
                };
                var zoom = me.width/(coord.maxx-coord.minx)<me.height/(coord.maxy-coord.miny)?me.width/(coord.maxx-coord.minx):me.height/(coord.maxy-coord.miny);
                zoom = zoom*me.options.zoomprop;//为了留出边距
                if(me.options.maxzoom){
                    if(zoom>me.options.maxzoom){
                        zoom = me.options.maxzoom;
                    }
                }
                me.zoom = zoom;
                me.setViewBox(centerPoint.x-me.width/me.zoom/2,centerPoint.y-me.height/me.zoom/2,me.width/me.zoom,me.height/me.zoom);
            }
        },
        setZoom:function(zoom,basePoint){
            var me=this,
                viewbox = me.getViewBox();
            if(!basePoint){
                basePoint  = {x:viewbox.x+viewbox.w/2,y:viewbox.y+viewbox.h/2};
            }
            viewbox.x += parseInt((basePoint.x-viewbox.x)*(1/me.zoom-1/zoom));
            viewbox.y += parseInt((basePoint.y-viewbox.y)*(1/me.zoom-1/zoom));
            me.zoom = zoom;
            viewbox.w = parseInt(me.paper.width/me.zoom);
            viewbox.h = parseInt(me.paper.height/me.zoom);
            me.setViewBox(viewbox.x,viewbox.y,viewbox.w,viewbox.h);
        },
        setSize:function(width,height){
            var me = this;
            me.width = width;
            me.height = height;
            me.paper.setSize(width,height);
            me.autoSet();
        },
        center:function(node){
            var me = this,
                vb = me.getViewBox();
            if(!node){
                return ;
            }
            var bbBox = node.getBBox();
            vb.x = (bbBox.x+bbBox.x2-me.width/me.zoom)/2;
            vb.y = (bbBox.y+bbBox.y2-me.height/me.zoom)/2;
            me.setViewBox(vb.x,vb.y,me.width/me.zoom,me.height/me.zoom);
        }
    };
}(window);