Raphael是一个js的矢量库
可以处理SVG VML格式的矢量图，它使用SVG推荐标准和VML作为创建图形的基础，可以用js操作DOM很容易的创建出负责的柱形图、走势图、曲线图等各种图表
同时它是跨浏览器的，完全支持IE6.0
使用：
//引入Raphael文件
var r=Raphael("canvas",rwidth,rheight);//初始化
//开始画图 如果现在想画一个rect的话
var myrect = r.rect(x,y,w,h).attr(样式);//这样就画好了一个rect图形并且有一定的样式
注意：
    1.如果想要获取某个图形的位置尺寸 var rstart = start.getBBox();


