!function (global) {
    if(global.RTopo){
        global.RTopo.prototype.lines = function(options){
            var _rTopo = this,
                _paper = _rTopo.paper;
                 
            var _sNode = options.snode,
                _eNode = options.enode,
                _lines = options.lines,
                _span = options.ySpan?options.span:30,
                _click = options.click,
                _dbclick = options.dbclick,
                _lineAttr = options.lineattr?options.lineattr:{
                    "stroke":"#33cc33",
                    "stroke-width":3,
                    "stroke-opacity":1,
                    "cursor":"pointer"
                };

            if(typeof _sNode == "string"){
                _sNode = _paper.getById(_sNode);
            }
            if(typeof _eNode == "string"){
                _eNode = _paper.getById(_eNode);
            }
            var _sNodeBBox = _sNode.getBBox(),
                _eNodeBBox = _eNode.getBBox(),
                _sNodeCx = (_sNodeBBox.x+_sNodeBBox.x2)/2,
                _sNodeCy = (_sNodeBBox.y+_sNodeBBox.y2)/2,
                _eNodeCx = (_eNodeBBox.x+_eNodeBBox.x2)/2,
                _eNodeCy = (_eNodeBBox.y+_eNodeBBox.y2)/2;
             
            for(var i=0,len=_lines.length;i<len;i++){
                var _line = _lines[i];
                var p = 0;
                if(len%2==0){
                    if(i%2==0){
                        p = -_span*(i/2+1);
                    }else{
                        p = _span*(Math.floor(i/2)+1);
                    }
                }else{
                    if(i==0){
                        p = 0;
                    }else if(i%2==0){
                        p = _span*(i/2);;
                    }else {
                        p = -_span*(Math.ceil(i/2));
                    }
                }

                var cx = (_sNodeCx + _eNodeCx)/2,
                    cy = (_sNodeCy + _eNodeCy)/2;

                var sin = (_eNodeCy-_sNodeCy)/Math.sqrt((_eNodeCx-_sNodeCx)*(_eNodeCx-_sNodeCx)+(_eNodeCy-_sNodeCy)*(_eNodeCy-_sNodeCy)),
                    cos = (_eNodeCx-_sNodeCx)/Math.sqrt((_eNodeCx-_sNodeCx)*(_eNodeCx-_sNodeCx)+(_eNodeCy-_sNodeCy)*(_eNodeCy-_sNodeCy));

                var tempPos = {
                    x:cx + p*sin,
                    y:cy - p*cos
                };

                var line = _paper.path(["M",_sNodeCx.toFixed(3), _sNodeCy.toFixed(3), "C",tempPos.x.toFixed(3),tempPos.y.toFixed(3),tempPos.x.toFixed(3),tempPos.y.toFixed(3),_eNodeCx.toFixed(3),_eNodeCy.toFixed(3)].join(","));
                line.attr(_lineAttr).toBack();
                if(_line.color&&""!=_line.color){
                    line.attr("stroke",_line.color);
                }
                line.param = _line;
                console.log(line.param)
                if(_click){
                    line.click(function(){
                        _click(this.param)
                    });
                }
                if(_dbclick){
                    line.dblclick(function(){
                        _dbclick(this.param);
                    });
                }
                if(_line.hovertext){
                    _rTopo.tooltip({
                        elem:line,
                        info:_line.hovertext
                    });
                }
                line.hover(function(){
                    var _line = this;
                    var lineWidth = _line.attrs["stroke-width"];
                    _line.attr("stroke-width",lineWidth*2);
                },function(){
                    var _line = this;
                    var lineWidth = _line.attrs["stroke-width"];
                    _line.attr("stroke-width",lineWidth/2);
                });
            };
        };
    }
}(window);