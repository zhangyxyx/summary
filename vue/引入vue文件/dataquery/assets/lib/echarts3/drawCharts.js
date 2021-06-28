/**
 * desc:画折线图、堆积图、柱状图
 * @param id 图标的id
 * @param opt 对象 {}
 */
function drawLineOrBarChart(id,opt){
    var title = opt.title?opt.title:"";//标题
    
    var categories = opt.categories?opt.categories:[];//横轴数据
    var series = opt.series?opt.series:[];//纵轴属性加数据

    var xyChange = opt.xyChange?opt.xyChange:false;//x y是否交换-true是横向

    var colorArr = opt.colorArr?opt.colorArr:['#36C0FE','#F2914A','#B4D465','#FFE249'];

    var legendData = opt.legendData?opt.legendData:[];//图例
    var legendX= opt.legendX?opt.legendX:'center';//图例的x位置
    var legendY = opt.legendY?opt.legendY:'bottom';//图例的y位置
    var legendSelected = opt.legendSelected?opt.legendSelected:{};//每个图例是否展示

    var gridTop = opt.gridTop?opt.gridTop:'30px';
    var gridBottom = opt.gridBottom?opt.gridBottom:'10px';
    var gridLeft = opt.gridLeft?opt.gridLeft:'3%';
    var gridRight = opt.gridRight?opt.gridRight:'4%';

    var xycolor = opt.xycolor?opt.xycolor:"#787677";//xy轴的颜色
    var splitLineX = opt.splitLineX?opt.splitLineX:false;//X轴
    var inverseX = opt.inverseX?opt.inverseX:false;//X轴是否反向
    var boundaryGap = opt.boundaryGap?opt.boundaryGap:false;//坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
    var interVal = opt.intervalX?opt.intervalX:"auto";//x轴强制分割

    var splitLineY = opt.splitLineY?opt.splitLineY:false;
    var unit = opt.unit?opt.unit:'';
    var nameY = opt.nameY?opt.nameY:"";//y轴文本
    var splitNumberY = opt.splitNumberY?opt.splitNumberY:5;
    var maxY = opt.maxY?opt.maxY:null;
    var minY = opt.minY?opt.minY:null;

    var isyAxis2 = opt.isyAxis2?opt.isyAxis2:false;//是否有第二个y轴
    var unit2 = opt.unit2?opt.unit2:'';
	var nameY2 = opt.nameY2?opt.nameY2:"";//y轴文本
	var splitNumberY2 = opt.splitNumberY2?opt.splitNumberY2:5;
	var maxY2 = opt.maxY2?opt.maxY2:null;
    var minY2 = opt.minY2?opt.minY2:null;
    
    var chartType = opt.chartType?opt.chartType:"";//图形的类型：confidence-band表示基线带

    var dataZoomShow = opt.dataZoomShow?opt.dataZoomShow:false;
    var dataZoomType = opt.dataZoomType?opt.dataZoomType:"inside";
    var dataZoomStart = opt.dataZoomStart?opt.dataZoomStart:0;
    var dataZoomEnd = opt.dataZoomEnd?opt.dataZoomEnd:100;
	var tooltip = opt.tooltip?opt.tooltip:{
		trigger: 'axis',
		formatter:function(params){
            var toop = params[0].name;
            //提示信息
            if(chartType=="confidence-band"){
                var cur = "";
                var baseline = "";
                //提示信息
                var uValue = 0;
                $.each(params,function(i,param){
                    if(param.seriesName==="L"){
                        uValue += param.value;
                    }else if(param.seriesName==="U"){
                        uValue += param.value;
                    }

                    if(param.seriesName!=""&&param.value!="-"){
                        if(param.seriesName==="当前值"){
                            cur += '<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + param.color + '"></span>';
                            cur +=param.seriesName+'：'+Math.abs(param.value) + ' ' +unit;
                        }else if(param.seriesName==="L"){
                            baseline += '<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + param.color + '"></span>';
                            baseline +='基线带：'+ Math.abs(param.value) + ' ' +unit + ' ~ ';
                        }else if(param.seriesName==="U"){
                            baseline += Math.abs(uValue) + ' ' +unit;
                        }
                    }
                });
                toop += cur + baseline;
            }else{
                $.each(params,function(i,param){
                    if(param.seriesName!=""&&param.value!="-"&&param.seriesName!="占位"){
                        var color = param.color;
                        if(typeof color == "object"){
                            color = color.colorStops[0].color;
                        }
                        toop += '<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +color + '"></span>';
                        toop += param.seriesName +'：'+Math.abs(param.value) + ' ' +unit;
                    }
                });
            	return toop;
            }
        }
	};
	
	
    var chart = echarts.init(document.getElementById(id));
    var options = {
        title: {
            text: title,
            x:'center',
            textStyle:{
                color:xycolor,
                fontStyle:"normal",
                fontSize:12,
                fontWeight:"bold"
            }
        },
        tooltip:tooltip,
        color:colorArr,
        legend:{
            data:legendData,
            x:legendX,
            y:legendY,
            textStyle: {
                color: xycolor
            },
            selected:legendSelected
        },
        grid: {
            top:gridTop,
            left: gridLeft,
            right: gridRight,
            bottom: gridBottom,
            containLabel: true
        },
        dataZoom: [
            {
                type:dataZoomType,
                show: dataZoomShow,
                realtime: true,
                start: dataZoomStart,
                end: dataZoomEnd
            }
        ],
        xAxis : [
            {
                type : 'category',
                data : categories,
                boundaryGap : boundaryGap,
                inverse:inverseX,
                axisLabel : {
                    interval:interVal,
                    textStyle : {
                        color : xycolor
                    }
                },
                axisLine: {
                    lineStyle:{
                        color:xycolor
                    }
                },
                axisTick:{
                    inside:true,
                    length:3,
                    lineStyle:{
                        color:xycolor
                    }
                },
                splitLine:{
                    show:splitLineX,
                    lineStyle:{
                        type:'dashed'
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                min:minY,
                max:maxY,
                name:nameY,
                nameTextStyle:{
                    color:xycolor
                },
                splitNumber:splitNumberY,
                axisLabel : {
                    textStyle : {
                        color : xycolor
                    },
                    formatter: function(value) {
                        return Math.abs(value);
                    }
                },
                axisLine: {
                    interval:2,
                    lineStyle:{
                        color:xycolor
                    }
                },
                axisTick:{
                    inside:true,
                    length:3,
                    lineStyle:{
                        color:xycolor
                    }
                },
                splitLine:{
                    show:splitLineY,
                    lineStyle:{
                        type:'dashed'
                    }
                }
            }
        ],
        series:series
    };

    //
    if(isyAxis2){
        options.yAxis.push(
            {
                type : 'value',
                name:nameY2,
                min:minY2,
                max:maxY2,
                nameTextStyle:{
                    color:xycolor
                },
                splitNumber:splitNumberY2,
                axisLabel : {
                    textStyle : {
                        color : xycolor
                    },
                    formatter: function(value) {
                        return Math.abs(value);
                    }
                },
                axisLine: {
                    interval:2,
                        lineStyle:{
                        color:xycolor
                    }
                },
                axisTick:{
                    show:true
                },
                splitLine:{
                    show:splitLineY,
                        lineStyle:{
                        type:'dashed'
                    }
                }
            }
        );
    }

    if(xyChange && !isyAxis2){
        var xAxis = options.xAxis[0];
        var yAxis = options.yAxis[0];

        options.xAxis[0] = yAxis;
        options.yAxis[0] = xAxis;

    }

    chart.setOption(options,true);
    return chart;
};

/**
 * desc:画饼图
 * @param id 图标的id
 * @param opt 对象 {}
 */
function drawPieChart(id,opt){

    var title = opt.title?opt.title:"";

    var tooltipFn = opt.tooltipFn?opt.tooltipFn:"{b} :{d}%";

    var legendData = opt.legendData?opt.legendData:[];//图例
    var legendX= opt.legendX?opt.legendX:'center';//图例的x位置
    var legendY = opt.legendY?opt.legendY:'bottom';//图例的y位置

    var textcolor = opt.textcolor?opt.textcolor:"#787677";//xy轴的颜色

    var colorArr = opt.colorArr?opt.colorArr:['#36C0FE','#F2914A','#B4D465','#FFE249'];

    var series = opt.series?opt.series:[];

    var chart = echarts.init(document.getElementById(id));

    var options = {
        title: {
            text: title,
            x:'center',
            textStyle:{
                fontSize:12
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: tooltipFn
        },
        legend:{
            orient: 'vertical',
            data:legendData,
            x:legendX,
            y:legendY,
            textStyle: {
                color: textcolor
            }
        },
        color:colorArr,
        series:series
    };

    chart.setOption(options,true);
    return chart;
}

/**
 * desc:画地图--引入了地图的单文件js
 * @param id
 * @param opt
 */
function drawMapChart(id,opt){
    var series = opt.series?opt.series:[];
    var geoMap = opt.geoMap?opt.geoMap:'china';
	var itemStyle = opt.itemStyle?opt.itemStyle:{
        normal: {
            borderColor: '#fff',
            areaColor: {
                // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#4590C0' // 0% 处的颜色从下到上
                }, {
                    offset: 1, color: '#4B7397' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        },
        emphasis: {
            areaColor: '#6E8FBA'
        }
    };
    var chart = echarts.init(document.getElementById(id));
    var options = {
        tooltip : {
            trigger: 'item'
            // ,
            // formatter:function(param){
            //     var toop = param.name+" <br/>" + param.seriesName + "：" + param.value[2];
            //     return toop;
            // }
        },
        geo: {
            map: geoMap,
            label: {
                emphasis: {
                    show: true
                }
            },
            roam: true,
            itemStyle: itemStyle
        },
        series:series
    };
    chart.setOption(options,true);
    return chart;
}
