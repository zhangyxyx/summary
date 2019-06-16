window.mark=0;
window.topoArr=[]
window.nowNode;
//添加节点
window.addNode=function(data){
    var topoDom = document.getElementById('topo');
    var topo = Graph.getGraph(topoDom);
    var nodeData =data;
    var option = {
        type:'image',
        x: nodeData.posx ,
        y: nodeData.posy , 
        width: 35,
        height: 40,
        text: nodeData.nodename,
        id:nodeData.nodecode,
        imageSrc: imageSrc(nodeData.nodename),
        hoverText:'<p>双击服务</p>',
        data: nodeData,
        context:function(e,n1,data){
            var x=e.pageX
            var y=e.pageY
            $(".contextEvent").show();
            $(".contextEvent").css({"top":y,"left":x})
            nowNode=data;
            initEvent();
        },
        dbclick:function(id,data){
            mark++;
            topoArr.push(data)
            
            if(mark===2){
                addLines(topoArr)
                topoArr=[]
            }else if(mark>2){
                mark=1;
                mouseLine(data,topoArr)  
            }else{
                mouseLine(data,topoArr)  
            }
            
        }
    };
    var gNode = topo.addNode(nodeData.nodecode, option, nodeData,);
}
//添加连线
window.addLines=function(data){
    var topoDom = document.getElementById('topo');
    var topo = Graph.getGraph(topoDom);
    console.log(data)
    var line = {
        linestart:''+data[0].nodecode,
        lineend:''+data[1].nodecode,
    }
    var lineAttr = {
        "stroke-width": 2,
        "stroke":"green"
    };
    topo.addLine(line.linestart, line.lineend, {
        id: line.linestart + "_" + line.lineend,
        attr: lineAttr,
        hoverText:"双击线段设置出参和入参",
        dbclick: function(id,n1,n2,line){
            //console.log(id, n1, n2);
            //paramsWin(n1,n2,line)
            PopDivHtml({
                title:'输入输出参数',
                popHeight:300,
                popWidth:600
            })
            var inputStr='',outputStr='';
            for(var i=0;i<params['input'].length;i++){
                inputStr=inputStr+`<div data-mark=${params['input'][i].key}>${params['input'][i].text}:<input type="text"/></div>`
            }
            for(var i=0;i<params['output'].length;i++){
                outputStr=outputStr+`<div data-mark=${params['output'][i].key}>${params['output'][i].text}:<input type="text"/></div>`
            }
            var html=`<div style="color:#fff;">
                <div style="width:100%;height:200px;overflow-y:auto;">
                    <div class="left" style="width:50%;float:left;margin:10px 0px">${inputStr}</div>
                    <div class="right"  style="width:50%;float:left;margin:10px 0px"">${outputStr}</div>
                </div>
                <div style="width:100%;height:30px;text-align:center;"><button>确定</button></div>
            </div>`
            $(".popcontent").html(html)
        },
        data: line,
    });
}
//节点图标
window.imageSrc=function(name){
    var imgsrc=''
    if(name==='服务'){
        imgsrc='./img/dev.png'
    }else if(name==='判断'){
        imgsrc='./img/pan.png'
    }else if(name==='并行'){
        imgsrc='./img/bing1.png'
    }else if(name==='汇总'){
        imgsrc='./img/bing2.png'
    }
    return imgsrc
}
//鼠标连线
window.mouseLine=function(data,topoArr){
    var topoDom = document.getElementById('topo');
    var topo = Graph.getGraph(topoDom);
    var startX=data.posx
    var startY=data.posy
    
    $("body").mousemove(function(e){
        if(topoArr.length!=2){
            for(var i=0;i<$("svg").find('path').length;i++){
                if($("svg").find('path').eq(i).attr('stroke')==="#ff0000"){
                    $("svg").find('path').eq(i).remove()
                }
            }
            var _attr ={stroke: "red","stroke-width": 3,};
            topo.paper.path(`M${startX},${startY}L${e.offsetX},${e.offsetY}`).attr(_attr).toBack();
        }else{
            for(var i=0;i<$("svg").find('path').length;i++){
                if($("svg").find('path').eq(i).attr('stroke')==="#ff0000"){
                    $("svg").find('path').eq(i).remove()
                }
            }
            return;
        }
        
    })
}
//删除节点
window.removeNode=function(data){
    var topoDom = document.getElementById("topo");
    var topo = Graph.getGraph(topoDom);
    for(var i=0;i<topo.nodes.length;i++){
        if(topo.nodes[i].id===nowNode.nodecode){
            $(".contextEvent").hide();
            topo.removeNode(topo.nodes[i])
        }
    } 

}
