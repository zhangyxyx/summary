(function(global) {

    'use strict';

    var self = {};
    var _idBase = new Date() - 0;
    var _instances = {}; // RTopo实例map索引
    var DOM_ATTRIBUTE_KEY = '_rtopo_instance_';
    var OPTIONS = {
        zoom: true,
        drag: true,
        maxzoom: 1,
        zoomprop: 0.8,
        cx: 0.5,
        cy: 0.5,
        saveposflag: ""
    };

    self.version = '0.0.1';
    self.dependencies = {
        raphael: '2.1.0'
    };

    self.init = function(dom,options) {

        dom = dom instanceof Array ? dom[0] : dom;
        // dom与rtopo实例映射索引
        var key = dom.getAttribute(DOM_ATTRIBUTE_KEY);
        if (!key) {
            key = _idBase++;
            dom.setAttribute(DOM_ATTRIBUTE_KEY, key);
        }

        if (_instances[key]) {
            // 同一个dom上多次init，自动释放已有实例
            _instances[key].dispose();
        }
        _instances[key] = new Graph(dom,options);
        _instances[key].id = key;

        return _instances[key];
    };

    self.getInstanceById = function(key) {
        return _instances[key];
    };
    self.getGraph = function(dom){
        var key = dom.getAttribute(DOM_ATTRIBUTE_KEY);
        return _instances[key];
    };
    // end self

    // begin private method
    function addEventListener(ele, eventname, fn) {
        if(ele.addEventListener){
            ele.addEventListener(eventname, fn, false);
        }else{
            ele.attachEvent("on" + eventname, fn);
        }
    }

    function deleteEventListener(ele,eventname){
        if(ele.removeEventListener){
            ele.removeEventListener(eventname);
        }else{
            ele.detachEvent("on" + eventname);
        }
    }

    function getEvent(e) {
        var evt = window.event ? window.event : e;
        if (!evt.stopPropagation) {
            evt.stopPropagation = function() {
                evt.cancelBubble = false;
            }
        }
        if (!evt.preventDefault) {
            evt.preventDefault = function() {
                evt.returnValue = false;
            }
        }
        if (!evt.target) {
            evt.target = evt.srcElement;
        }
        // if (!evt.which) {
        //     e.which = e.button;
        // }
        return evt;
    }

    function clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {
                // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {
            // IE?
            document.selection.empty();
        }
    }

    function getCanvasOffset(dom) {
        if (!dom) {
            return;
        }
        if (!dom.getClientRects().length) {
            return {
                top: 0,
                left: 0
            };
        }
        var rect = dom.getBoundingClientRect();
        if (rect.width || rect.height) {
            var doc = dom.ownerDocument;
            var docElem = doc.documentElement;

            return {
                top: rect.top + global.pageYOffset - docElem.clientTop,
                left: rect.left + global.pageXOffset - docElem.clientLeft
            };
        }
        return rect;
    }

    function _indexOf(array, value) {
        if (array) {
            if (array.indexOf) {
                return array.indexOf(value);
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] === value) {
                    return i;
                }
            }
        }
        return -1;
    }

    function _getCenterPos(raphNode) {
        var _bBox = raphNode.getBBox();
        return {
            x: (_bBox.x + _bBox.x2) / 2,
            y: (_bBox.y + _bBox.y2) / 2
        };
    }
    function _getLoading(dom){
        var loadingHtml = new Array();
        loadingHtml.push("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 232 64\" width=\"232\" height=\"64\" fill=\"#fff\">");
        // loadingHtml.push("<text transform=\"translate(20 0)\" x=\"0\" y=\"36\" font-size=\"18\" font-family=\"微软雅黑\" >Loading</text>");
        loadingHtml.push("<circle transform=\"translate(90 0)\" cx=\"0\" cy=\"32\" r=\"0\"> ");
        loadingHtml.push("<animate attributeName=\"r\" values=\"0; 8; 0; 0\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0\"");
        loadingHtml.push("keytimes=\"0;0.2;0.7;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8\" calcMode=\"spline\" />");
        loadingHtml.push("</circle>");
        loadingHtml.push("<circle transform=\"translate(116 0)\" cx=\"0\" cy=\"32\" r=\"0\"> ");
        loadingHtml.push("<animate attributeName=\"r\" values=\"0; 8; 0; 0\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.3\"");
        loadingHtml.push("keytimes=\"0;0.2;0.7;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8\" calcMode=\"spline\" />");
        loadingHtml.push("</circle>");
        loadingHtml.push("<circle transform=\"translate(142 0)\" cx=\"0\" cy=\"32\" r=\"0\"> ");
        loadingHtml.push("<animate attributeName=\"r\" values=\"0; 8; 0; 0\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.6\"");
        loadingHtml.push("keytimes=\"0;0.2;0.7;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8\" calcMode=\"spline\" />");
        loadingHtml.push("</circle>");
        loadingHtml.push("</svg>");

        var fragment = document.createDocumentFragment();

        var loadingElement = document.createElement("div");
        loadingElement.className = "graph-loading";

        loadingElement.innerHTML = loadingHtml.join("");

        var width = dom.clientWidth;
        var height = dom.clientHeight;

        var styles = ["position:absolute",
                "width:"+width+"px",
                "height:"+height+"px",
                "padding:0",
                "top:0",
                "left:0",
                "zIndex:9999",
                "background:rgba(0,0,0,0.6)",
                "text-align:center",
                "line-height:"+height+"px"];

        loadingElement.setAttribute("style",styles.join(";"));

        fragment.appendChild(loadingElement);
        return fragment;
    }
    // end private method


    // begin Graph
    function Graph(dom, options) {

        dom.innerHTML = '';

        this.dom = dom;
        this.canvas = this.dom;
        this.canvasx = getCanvasOffset(dom).left;
        this.canvasy = getCanvasOffset(dom).top;
        this.width = this.dom.clientWidth;
        this.height = this.dom.clientHeight;
        this.options = {};
        for(var key in OPTIONS){
            this.options[key] = OPTIONS[key]
        }
        if (options) {
            for (var key in options) {
                this.options[key] = options[key];
            }
        }
        this._init();

        this.nodes = [];
        this.lines = [];

        this._nodesMap = {};
        this._linesMap = {};

        this.animateNodes = [];

        this.Node = Node;
        this.Line = Line;
    }


    var graphProto = Graph.prototype;

    graphProto._init = function() {

        if (this.width === 0 || this.height === 0) {
            console.error('Dom’s width & height should be ready before init.');
        }

        this.paper = Raphael(this.dom, this.width, this.height);

        var me = this;

        function wheel(e) {
            var evt = getEvent(e),
                viewbox = me.getViewBox(),
                delta = evt.wheelDelta ? (evt.wheelDelta / 120) : (-evt.detail / 3),
                basePoint = {
                    x: viewbox.x + evt.clientX - me.canvasx,
                    y: viewbox.y + evt.clientY - me.canvasy
                };
            me.setZoom(me.getZoom() * (1 + delta * 0.1), basePoint);
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        }
        // 把事件加在了dom下的svg上，为了删除时删除相关监听事件（滚动、拖动）
        me.options.zoom && addEventListener(me.canvas.querySelector("svg"), "mousewheel", wheel);

        function mousedownfn(e) {
            var evt = getEvent(e),
                viewbox = me.getViewBox();

            if (e.which != 1) {
                return;
            }
            if (evt.target.parentNode == me.canvas) {
                me.canvasdragging = {
                    x: evt.clientX,
                    y: evt.clientY,
                    timestamp: (new Date()).getTime()
                };
                me.canvas.style.cursor = "move";
            }
        }

        function mousemovefn(e) {
            var evt = getEvent(e),
                viewbox = me.getViewBox(),
                now = (new Date()).getTime();
            clearSelection();
            if (me.canvasdragging && now - me.canvasdragging.timestamp > 30) {
                var x = (me.canvasdragging.x - evt.clientX) / me.getZoom(),
                    y = (me.canvasdragging.y - evt.clientY) / me.getZoom(),
                    viewbox = me.getViewBox();
                me.canvasdragging = {
                    x: evt.clientX,
                    y: evt.clientY
                };
                me.setViewBox(viewbox.x + x, viewbox.y + y, viewbox.w, viewbox.h);
                me.canvasdragging.timestamp = now;
            }
        }

        function mouseupfn(e) {
            var evt = getEvent(e);
            clearSelection();
            if (me.canvasdragging) {
                me.canvasdragging = false;
                me.canvas.style.cursor = "auto";
            }
        }
        if (me.options.drag) {
            me.canvasdragging = false;
            addEventListener(me.canvas.querySelector("svg"), "mousedown", mousedownfn);
            addEventListener(me.canvas.querySelector("svg"), "mousemove", mousemovefn);
            addEventListener(me.canvas.querySelector("svg"), "mouseup", mouseupfn);
        }

        this.zoom = 1;
        this.setViewBox(0, 0, this.width, this.height);
    };

    graphProto.setViewBox = function(x, y, w, h, fit) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        return this.paper.setViewBox(x, y, w, h, fit);
    };
    graphProto.getViewBox = function() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        };
    };
    graphProto.getZoom = function() {
        return this.zoom;
    };
    graphProto.reset = function() {
        this.zoom = 1;
        this.setViewBox(0, 0, this.width, this.height);
    };

    graphProto.setZoom = function(zoom, basePoint) {
        var me = this;
        var viewbox = me.getViewBox();
        if (!basePoint) {
            basePoint = {
                x: viewbox.x + viewbox.w / 2,
                y: viewbox.y + viewbox.h / 2
            };
        }
        viewbox.x += (basePoint.x - viewbox.x) * (1 / me.zoom - 1 / zoom);
        viewbox.y += (basePoint.y - viewbox.y) * (1 / me.zoom - 1 / zoom);
        viewbox.w = me.paper.width / zoom;
        viewbox.h = me.paper.height / zoom;

        this.zoom = zoom;

        this.setViewBox(viewbox.x, viewbox.y, viewbox.w, viewbox.h);
    };
    graphProto.setSize = function(width, height) {
        this.width = width;
        this.height = height;
        this.paper.setSize(width, height);
        this.autoSet();
    };
    graphProto.resize = function(){
        var width = this.dom.clientWidth;
        var height = this.dom.clientHeight;
        this.width = width;
        this.height = height;
        this.paper.setSize(width, height);
        this.autoSet();
    };
    graphProto.center = function(node) {
        var viewBox = this.getViewBox();
        if (!node) {
            return;
        }
        var bbBox = node.getBBox();
        viewBox.x = (bbBox.x + bbBox.x2 - this.width / this.zoom) / 2;
        viewBox.y = (bbBox.y + bbBox.y2 - this.height / this.zoom) / 2;
        this.setViewBox(viewBox.x, viewBox.y, this.width / this.zoom, this.height / this.zoom);
    };

    graphProto.getDom = function() {
        return this.dom;
    };
    graphProto.getPaper = function() {
        return this.paper;
    };
    graphProto.clear = function() {

        this.nodes.length = 0;
        this.lines.length = 0;
        this._nodesMap = {};
        this._linesMap = {};

        this.animateNodes.length = 0;

        this.paper.clear();
        this.dom.style.backgroundColor = null;
        return this;
    };
    graphProto.dispose = function() {
        var key = this.dom.getAttribute(DOM_ATTRIBUTE_KEY);
        key && delete _instances[key];

        this.clear();
        this.paper.remove();
        this.paper = null;
    };
    graphProto.autoSet = function() {

        var coord = {
            minx: Number.MAX_VALUE,
            miny: Number.MAX_VALUE,
            maxx: Number.MIN_VALUE,
            maxy: Number.MIN_VALUE
        };
        for (var i = 0, len = this.nodes.length; i < len; i++) {
            var bBox = this.nodes[i].raphNode.getBBox();
            coord.minx = coord.minx < bBox.x ? coord.minx : bBox.x;
            coord.miny = coord.miny < bBox.y ? coord.miny : bBox.y;
            coord.maxx = coord.maxx > bBox.x2 ? coord.maxx : bBox.x2;
            coord.maxy = coord.maxy > bBox.y2 ? coord.maxy : bBox.y2;
        }

        if (0 == this.nodes.length) {
            this.zoom = 1;
            this.setViewBox(0, 0, this.width, this.height);
        } else {
            var centerPos = {
                x: (coord.minx + coord.maxx) * this.options.cx,
                y: (coord.miny + coord.maxy) * this.options.cy
            };
            var xZoom = this.width / (coord.maxx - coord.minx);
            var yZoom = this.height / (coord.maxy - coord.miny);
            var zoom = xZoom < yZoom ? xZoom : yZoom;
            //为了留出边距
            zoom = zoom * this.options.zoomprop;
            if (this.options.maxzoom) {
                if (zoom > this.options.maxzoom) {
                    zoom = this.options.maxzoom;
                }
            }
            this.zoom = zoom;
            this.setViewBox(
                centerPos.x - this.width / this.zoom / 2,
                centerPos.y - this.height / this.zoom / 2,
                this.width / this.zoom,
                this.height / this.zoom);
        }
    }
    graphProto.addNode = function(id, data,nodeData) {
        if (this._nodesMap[id]) {
            return this._nodesMap[id];
        }

        var node = new this.Node(id, data);

        var _type = data.type ? data.type : "circle";
        var _x = data.x ? data.x : 0;
        var _y = data.y ? data.y : 0;
        var _attr = data.attr ? data.attr : {};
        var _text = data.text ;
        var _textAttr = data.textAttr ? data.textAttr : {};
        var _alarmColor = data.alarmColor;

        var alarmAttr = {
            // 渐变效果没法透明渐变不好看
            // fill: "r#fff-"+_alarmColor,
            stroke: _alarmColor,
            "stroke-width": 5,
            "stroke-dasharray": ["."]
        };

        switch (_type) {
            case 'circle':
                var _r = data.r ? data.r : 10;
                node.raphNode = this.paper.circle(_x, _y, _r).attr(_attr);
                if(_text){
                    if("bottom"==_textAttr["v-align"]){
                        node.raphText = this.paper.text(_x,_y+_r+10,_text).attr(_textAttr);
                    }else if("center"==_textAttr["v-align"]){
                        node.raphText = this.paper.text(_x,_y,_text).attr(_textAttr);
                    }else if('right'==_textAttr["h-align"]){
                        node.raphText = this.paper.text(parseFloat(_x)+parseFloat(_r)+40,_y,_text).attr(_textAttr);
                    }
                }
                // if(_alarmColor){
                //     node.raphAlarm = this.paper.circle(_x+r,_y-r,5).attr(alarmAttr);
                // }
                break;
            case 'image':
                var _imageSrc = data.imageSrc;
                var _width = data.width;
                var _height = data.height;
                node.raphNode = this.paper.image(_imageSrc, _x, _y, _width, _height).attr(_attr);
                if(_text){
                    if("bottom"==_textAttr["v-align"]){
                        node.raphText = this.paper.text(_x+_width/2,_y+_height,_text).attr(_textAttr);
                    }else if("center"==_textAttr["v-align"]){
                        node.raphText = this.paper.text(_x+_width/2,_y+_height/2,_text).attr(_textAttr);
                    }else if("right"==_textAttr.align){
                        node.raphText = this.paper.text(_x+_width+_textAttr.span,_y+_height/2,_text).attr(_textAttr);
                    }else if("rotation"==_textAttr.align){
                        var tAngle = 0;
                        if(90<180*_textAttr.angle/Math.PI&&180>=180*_textAttr.angle/Math.PI){
                            tAngle = 180*_textAttr.angle/Math.PI+180;
                        }else if(270>=180*_textAttr.angle/Math.PI&&180<180*_textAttr.angle/Math.PI){
                            tAngle = 180*_textAttr.angle/Math.PI-180;
                        }else {
                            tAngle = 180*_textAttr.angle/Math.PI
                        }
                        node.raphText = this.paper.text(_x+_width/2+Math.cos(_textAttr.angle)*_textAttr.span,_y+_height/2+Math.sin(_textAttr.angle) * _textAttr.span,_text).attr(_textAttr).rotate(tAngle);
                    }
                }
                if(_alarmColor){
                    var r = Math.max(_width,_height)/2;
                    node.raphAlarm = this.paper.circle(_x+_width/2,_y+_height/2,r).attr(alarmAttr).toBack();
                }
                break;
            case 'rect':
                var _r = data.r ? data.r : 0;
                var _width = data.width;
                var _height = data.height;
                node.raphNode = this.paper.rect(_x, _y, _width, _height, _r).attr(_attr);
                if(_text){
                    if("bottom"==_textAttr["v-align"]){
                        node.raphText = this.paper.text(_x+_width/2,_y+_height+10,_text).attr(_textAttr);
                    }else if("center"==_textAttr["v-align"]){
                        node.raphText = this.paper.text(_x+_width/2,_y+_height/2,_text).attr(_textAttr);
                    }
                }
                break;
            case 'ellipse':
                var _rx = data.rx ? data.rx : 60;
                var _ry = data.ry ? data.ry : 30;
                node.raphNode = this.paper.ellipse(_x, _y, _rx, _ry).attr(_attr);
                if(_text){
                    if("bottom"==_textAttr["v-align"]){
                        node.raphText = this.paper.text(_x,_y+_ry+10,_text).attr(_textAttr);
                    }else if("center"==_textAttr["v-align"]){
                        node.raphText = this.paper.text(_x,_y,_text).attr(_textAttr);
                    }
                }
                break;
        }
        if("function" == typeof data.dbclick){
            node.raphNode.attr("cursor","pointer");
            node.raphNode.dblclick(function(){
                data.dbclick(id,nodeData);
            });
            if(node.raphText){
                node.raphText.attr("cursor","pointer");
                node.raphText.dblclick(function(){
                    data.dbclick(id,nodeData);
                });
            }
        }
        if("function" == typeof data.context){
            node.raphNode.attr("cursor","pointer");
            node.raphNode.mousedown(function(e){
                if(e.which ===3){//右键
                    data.context(e,id,nodeData)
                }
            });
        }
        this.nodes.push(node);
        this._nodesMap[id] = node;

        this.tooltip(id);
        this.drag(id);
        return node;
    };
    graphProto.getNodeById = function(id) {
        return this._nodesMap[id];
    };
    graphProto.addLine = function(n1, n2, data) {
        if (typeof(n1) == 'string') {
            n1 = this._nodesMap[n1];
        }
        if (typeof(n2) == 'string') {
            n2 = this._nodesMap[n2];
        }
        if (!n1 || !n2) {
            return;
        }

        var key = n1.id + '-' + n2.id;
        if (this._linesMap[key]) {
            return this._linesMap[key];
        }

        var line = new this.Line(n1, n2, data);

        var _attr = data.attr ? data.attr : {
            stroke: "#99CC33",
            "stroke-width": 2
        };

        var _sPos = _getCenterPos(n1.raphNode),
            _ePos = _getCenterPos(n2.raphNode);
        var _path = ["M", _sPos.x, _sPos.y, _ePos.x, _ePos.y];
        function _runEffect(effect){
            var _time = 30 * Math.sqrt((effect.ep.y-effect.sp.y)*(effect.ep.y-effect.sp.y)+(effect.ep.x-effect.sp.x)*(effect.ep.x-effect.sp.x));
            effect.obj.attr({
                cx: effect.sp.x,
                cy: effect.sp.y
            });
            effect.obj.animate({
                cx: effect.ep.x,
                cy: effect.ep.y
            },_time,function(){
                _runEffect(effect);
            });
        }

        if(data.effect){

            var runObj = this.paper.circle(_sPos.x,_sPos.y,3).attr({
                fill: 'r(0.5, 0.5)#fff-#fff',
                'fill-opacity': 0.8,
                stroke: 'none'
            });
            this.animateNodes.push(runObj);
            var _effect = {
                show: data.effect.show,
                loop: data.effect.loop,
                period: data.effect.period,
                obj: runObj,
                sp: {
                    x: _sPos.x,
                    y: _sPos.y,
                },
                ep: {
                    x: _ePos.x,
                    y: _ePos.y
                }
            };
            _runEffect(_effect);
        }
        line.raphLine = this.paper.path(_path.join(",")).attr(_attr).toBack();

        n1.lines.push(line);
        if (n1 !== n2) {
            n2.lines.push(line);
        }

        if("function" == typeof data.dbclick){
            line.raphLine.attr("cursor","pointer");
            line.raphLine.dblclick(function(){
                data.dbclick(key);
            });
        }



        this.lines.push(line);
        this._linesMap[key] = line;

        this.tooltip(key);

        return line;
    };
    graphProto.removeLine = function(line) {

        if(line.raphLine){
            line.raphLine.remove();
        }

        var n1 = line.node1;
        var n2 = line.node2;
        var key = n1.id + '-' + n2.id;
        n1.lines.splice(_indexOf(n1.lines, line), 1);
        if (n1 !== n2) {
            n2.lines.splice(_indexOf(n2.lines, line), 1);
        }

        delete this._linesMap[key];
        this.lines.splice(_indexOf(this.lines, line), 1);
    };
    graphProto.getLine = function(n1, n2) {
        if (typeof(n1) !== 'string') {
            n1 = n1.id;
        }
        if (typeof(n2) !== 'string') {
            n2 = n2.id;
        }
        return this._linesMap[n1 + '-' + n2] || this._linesMap[n2 + '-' + n1];
    };
    graphProto.removeNode = function(node) {
        if (typeof(node) === 'string') {
            node = this._nodesMap[node];
            if (!node) {
                return;
            }
        }
        if (node.raphNode) {
            node.raphNode.remove();
        }
        if (node.raphText){
            node.raphText.remove();
        }

        delete this._nodesMap[node.id];
        this.nodes.splice(_indexOf(this.nodes, node), 1);

        for (var i = 0; i < this.lines.length;) {
            var line = this.lines[i];
            if (line.node1.id == node.id || line.node2.id == node.id) {
                this.removeLine(line);
            } else {
                i++;
            }
        }
    };
    graphProto.showLoading = function(){
        var loading = this.dom.querySelector(".graph-loading");
        if(loading){
            this.dom.removeChild(loading);
        }
        this.dom.appendChild(_getLoading(this.dom));
    };
    graphProto.hideLoading = function(){
        var loading = this.dom.querySelector(".graph-loading");
        if(loading){
            this.dom.removeChild(loading);
        }
    };

    graphProto.tooltip = function(id){

        var nodes = this.nodes;
        var lines = this.lines;
        var animateNodes = this.animateNodes;
        var elem = this._nodesMap[id];
        var elemType;
        var raphElem;
        var raphText;
        if(elem){
            raphElem = elem.raphNode;
            elemType = "node";
        }else{
            elem = this._linesMap[id];
            raphElem = elem.raphLine;
            elemType = "line";
        }
        raphText = elem.raphText;

        function _getToolTip(){

            if(elem.data.hoverText){
                var tip = document.createElement("div");
                tip.className = "graph-tooltip";

                var styles = ["position:absolute",
                    "display:none",
                    "padding:10px 6px",
                    "top:0",
                    "left:0",
                    "zIndex:9999",
                    "color:#fff",
                    "border-radius:3px",
                    "background:rgba(2,2,2,0.8)",
                    "font-size:13px",
                    "line-height:20px"];
                tip.setAttribute("style",styles.join(";"));
                tip.innerHTML = elem.data.hoverText;

                return tip;
            }
        }

        function _mouseover() {
            var tip = _getToolTip();
            if(tip){
                document.body.appendChild(tip);
            }
            for(var i=0,len=nodes.length;i<len;i++){
                nodes[i].raphNode.attr("opacity",0.1);
                if(nodes[i].raphText){
                    nodes[i].raphText.attr("opacity",0.1);
                }
                if(nodes[i].raphAlarm){
                    nodes[i].raphAlarm.attr("opacity",0.1);
                }
            }
            for(var i=0,len=lines.length;i<len;i++){
                lines[i].raphLine.attr("opacity",0.1);
            }
            if("line"==elemType){
                var storkeWidth = raphElem.attr("stroke-width");
                raphElem.attr("stroke-width",storkeWidth*4);
                raphElem.attr("opacity",1);
                elem.node1.raphNode.attr("opacity",1);
                if(elem.node1.raphText){
                    elem.node1.raphText.attr("opacity",1);
                }
                if(elem.node1.raphAlarm){
                    elem.node1.raphAlarm.attr("opacity",1);
                }
                elem.node2.raphNode.attr("opacity",1);
                if(elem.node2.raphText){
                    elem.node2.raphText.attr("opacity",1);
                }
                if(elem.node2.raphAlarm){
                    elem.node2.raphAlarm.attr("opacity",1);
                }
            }else if("node"==elemType){
                //本身、本身连线、及本身连线相关对象，其余透明度变低
                // raphElem.attr("opacity",0.1);
                raphElem.attr("opacity",1);
                if(elem.raphText){
                    elem.raphText.attr("opacity",1);
                }
                if(elem.raphAlarm){
                    elem.raphAlarm.attr("opacity",1);
                }
                for(var i=0,len=elem.lines.length;i<len;i++){
                    var line = elem.lines[i];
                    line.node1.raphNode.attr("opacity",1);
                    if(line.node1.raphText){
                        line.node1.raphText.attr("opacity",1);
                    }
                    if(line.node1.raphAlarm){
                        line.node1.raphAlarm.attr("opacity",1);
                    }
                    line.node2.raphNode.attr("opacity",1);
                    if(line.node2.raphText){
                        line.node2.raphText.attr("opacity",1);
                    }
                    if(line.node2.raphAlarm){
                        line.node2.raphAlarm.attr("opacity",1);
                    }
                    line.raphLine.attr("opacity",1);
                }
            }
            for(var i=0,len=animateNodes.length;i<len;i++){
                animateNodes[i].hide();
            }
        };
        function _mouseout(){
            var tip = document.querySelector(".graph-tooltip");
            if(tip){
                document.body.removeChild(tip);
            }
            for(var i=0,len=nodes.length;i<len;i++){
                nodes[i].raphNode.attr("opacity",1);
                if(nodes[i].raphText){
                    nodes[i].raphText.attr("opacity",1);
                }
                if(nodes[i].raphAlarm){
                    nodes[i].raphAlarm.attr("opacity",1);
                }
            }
            for(var i=0,len=lines.length;i<len;i++){
                lines[i].raphLine.attr("opacity",1);
            }
            if("line"==elemType){
                var storkeWidth = raphElem.attr("stroke-width");
                raphElem.attr("stroke-width",storkeWidth/4);
                raphElem.attr("opacity",1);
            }else if("node"==elemType){
                raphElem.attr("opacity",1);
            }
            for(var i=0,len=animateNodes.length;i<len;i++){
                animateNodes[i].show();
            }
        };
        function _mousemove(e){

            var tip = document.querySelector(".graph-tooltip");
            if(!tip){
                return;
            }
            e = e||window.event;
            var fx = e.x;
            var fy = e.y;
            if(e.pageX && e.pageY){
                fx = e.pageX;
                fy = e.pageY;
            } else {
                fx = e.clientX + document.body.scrollLeft - document.body.clientLeft;
                fy = e.clientY + document.body.scrollTop - document.body.clientTop;
            }

            tip.style.display = "block";
            if((fx-tip.clientWidth/2)<0){
                tip.style.left = (fx+20)+"px";
                tip.style.top = (fy-tip.clientHeight/2)+"px";
            }else{
                tip.style.left = (fx-tip.clientWidth/2)+"px";
                tip.style.top = (fy-tip.clientHeight-6)+"px";
            }
        };
        raphElem.mouseover(function(){
            _mouseover();
        });
        raphElem.mouseout(function(){
            _mouseout();
        });
        raphElem.mousemove(function(e){
            _mousemove(e);
        });
        if(raphText){
            raphText.mouseover(function(){
                _mouseover();
            });
            raphText.mouseout(function(){
                _mouseout();
            });
            raphText.mousemove(function(e){
                _mousemove(e);
            });
        }
    };
    graphProto.drag = function(id){
        var graph = this;
        var elem = this._nodesMap[id];
        var raphElem;
        var raphText;
        var raphAlarm;
        if(elem){
            raphElem = elem.raphNode;
            raphText = elem.raphText;
            raphAlarm = elem.raphAlarm;
        }
        if(!raphElem){
            return;
        }
        var zoom = this.zoom;
        var cursorName = raphElem.attr("cursor");

        function dragger() {
            raphElem.tx = raphElem._.dx;
            raphElem.ty = raphElem._.dy;
        }
        function move (dx, dy) {
            // raphElem.attr({
            //     cursor:"move"
            // });
            raphElem.transform(["t",raphElem.tx+dx/graph.zoom,raphElem.ty+dy/graph.zoom].join(","));
            if(raphText){
                raphText.transform(["t",raphElem.tx+dx/graph.zoom,raphElem.ty+dy/graph.zoom].join(","));
            }
            if(raphAlarm){
                raphAlarm.transform(["t",raphElem.tx+dx/graph.zoom,raphElem.ty+dy/graph.zoom].join(","));
            }

            if(elem.lines){
                for(var i=0,len=elem.lines.length;i<len;i++){
                    var line = elem.lines[i];
                    var node1 = line.node1;
                    var node2 = line.node2;

                    var pos1 = {
                        x: (node1.raphNode.getBBox().x + node1.raphNode.getBBox().x2)/2,
                        y: (node1.raphNode.getBBox().y + node1.raphNode.getBBox().y2)/2
                    };
                    var pos2 = {
                        x: (node2.raphNode.getBBox().x + node2.raphNode.getBBox().x2)/2,
                        y: (node2.raphNode.getBBox().y + node2.raphNode.getBBox().y2)/2
                    };
                    var paths = ["M",pos1.x,pos1.y,"L",pos2.x,pos2.y];
                    line.raphLine.attr("path",paths.join(","));
                }
            }
        }

        function up () {
            if(""!=graph.options.saveposflag&&localStorage){
                var nodes = graph.nodes;
                var poss = {};
                for(var i=0,len=graph.nodes.length;i<len;i++){
                    var node = graph.nodes[i];
                    var bBox = node.raphNode.getBBox();
                    poss[node.id] = {
                        x: ((bBox.x + bBox.x2)/2).toFixed(0),
                        y: ((bBox.y + bBox.y2)/2).toFixed(0)
                    };
                }
                localStorage.setItem(graph.options.saveposflag,JSON.stringify(poss));
            }
        };
        raphElem.drag(move,dragger,up);
    };
    // end Graph

    // begin Node
    function Node(id, data) {
        this.id = id;
        this.data = data || null;
        this.lines = [];
    }
    // end Node

    // begin Line
    function Line(node1, node2, data) {
        this.node1 = node1;
        this.node2 = node2;
        this.data = data || null;
    }
    // end Line

    global.Graph = self;
})(window);