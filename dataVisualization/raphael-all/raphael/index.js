
$(function(){
	//初始化流程图
	showcanvas();
	window.onresize=function(){
		$(".info").empty();//清空canvas的元素必须保留
		showcanvas();
	}
	
	//流程图
	function showcanvas(rData){
		loadProcedure(rData)
		function loadProcedure(rData){
			//获取基本的信息
			var rwidth=$("#canvas").width();
			var rheight=$("#canvas").height();
			var r=Raphael("canvas",rwidth,rheight);
			//每个状态的样式 需要填充的样式
			var ok = {"fill":"#0099FF","fill-opacity":.8,"stroke":"#0099FF","stroke-width":1,"stroke-opacity":.9};
			var undo = {"stroke":"#CCC","fill":"#000","fill-opacity":.3,"stroke-width":2,"stroke-opacity":.8};
			var ok_text = {"fill":"#FFF","font-size":12,"font-weight":"bold","font-family":"微软雅黑","word-wrap":"break-word"};
			var ok_stext = {"fill":"#0099CC","font-size":12,"font-family":"微软雅黑"};
			var ok_line = {"stroke":"#0099FF","stroke-width":2,"stroke-opacity":1};
			var ok_arrow = {"fill":"#0099FF","opacity":1};
			var undo_line = {"stroke":"#ccc","stroke-width":2,"stroke-opacity":1};
			var undo_stext = {"fill":"#333","font-size":12,"font-family":"微软雅黑"};
			var shadow = { "fill":"#666","fill-opacity":.05,"stroke-width":0};
			var glow = {"width":4,"color":"#CCC"};
			var nor_info = {"fill":"#000","font-size":12,"font-family":"微软雅黑"};
			var stress_info = {"fill":"red","font-size":12,"font-family":"微软雅黑"};
			var undo_rect = {"stroke":"#CCC",};
			var rect_text = {"fill":"#FFF","fill-opacity":.2,"font-size":12,"font-family":"微软雅黑",'color':"#000"};
			//定义一些变量
			var cx = rwidth/5;
			var sy=rwidth/40
			var ll =rwidth/20,
				rw = rwidth/10,//矩形宽度
				rh = rwidth/40,//矩形高度
				dw = (rwidth/10)/2,//菱形横半径
				dh = (rwidth/40)/2,//菱形纵半径
				rx =rw/4, //椭圆横半径
				ry =rh/4; //椭圆纵半径
			var aw = 3, //箭头宽半径
				ah = 5, //箭头高
				es = 5; //元素间隔		
			//开始测试
			sy = sy + ah + es;
			var start = r.rect(cx-rw/2,sy,rw,rh).attr(undo);
			start.glow(glow);
			var wsnew_text = r.text(cx,sy+(rh/2),"开始测试").attr(ok_text);
			var start_Sline=Sline(start,ll/2," ")//连线
	
			//早饭
			var cece=rhombC(start_Sline.p1,dw,dh,"吃了早饭？");
			var cece_Sline=Sline(cece,2*dh,"N")//竖线
			var cece_Hline=Hline(cece,2*dw,'Y');//横线
			var cece_ell=ell(cece_Hline.pp2,'今天一天\n心情都很好！')
			var cece_Hline_two=Hline(cece_ell,5*dw);
			var cece_ell_line = cece_ell.getBBox();
			var end_rect=recttangle(cece_Hline_two.pp2,'一天结束');
			
			//午饭
			var pepe=rhombC(cece_Sline.p1,dw,dh,"吃了午饭？")
			var pepe_Sline=Sline(pepe,2*dh,"Y")//竖线
			var pepe_Hline=Hline(pepe,2*dw,'N');//横线
			var pepe_rect=recttangle(pepe_Hline.pp2,'心情不好')
			var pepe_rect_Hline_H=Hline(pepe_rect,ll/2,"","no");
			var pepe_rect_Hline_S=SlineC(pepe_rect_Hline_H.p2,4*dh);

			//晚饭
			var peacea=rhombC(pepe_Sline.p1,dw,dh,"吃了晚饭？")//peacea 菱形
			var peacea_Sline=Sline(peacea,2*dh,"Y");//竖线
			var peacea_Hline=Hline(peacea,2*dw,'N');//横线
			var peacea_rect=recttangle(peacea_Hline.pp2,'心情不好');
			var peacea_moreline=moreLine(peacea_rect,peacea)
			var peacea_rect_Hline_H=Hline(peacea_rect,ll/2,"","no");
			var peacea_rect_Hline_S=SlineC(peacea_rect_Hline_H.p2,0);
			//连接结果合并的连线
			var StartSline = peacea_rect_Hline_H.p2.getBBox(); 
			var panPath_Hline_p2=r.path("M"+(StartSline.x2)+","+(StartSline.y2)+"L"+(StartSline.x2+ll)+","+(StartSline.y2)).attr(undo_line);
			var panPath_Hline_pp2=r.path("M"+(StartSline.x2+ll)+","+(StartSline.y2-3)+"L"+(StartSline.x2+ll)+","+(StartSline.y2+3)+"L"+(StartSline.x2+ll+3)+","+(StartSline.y2)+"Z").attr(undo_line).attr(undo);
			var ell_result=ell(panPath_Hline_p2,'结果合并');
			//
			var StartHline = ell_result.getBBox();
			var ell_result_p1=r.path("M"+(StartHline.x2)+","+(StartHline.y2-StartHline.height/2)+"L"+(StartHline.x2+2*ll)+","+(StartHline.y2-StartHline.height/2)+"L"+(StartHline.x2+2*ll)+","+(StartHline.y2-StartHline.height/2-7*dh+es)).attr(undo_line);
			var ell_result_pp1=r.path("M"+(StartHline.x2+2*ll-3)+","+(StartHline.y2-StartHline.height/2-7*dh+es)+"L"+(StartHline.x2+2*ll+3)+","+(StartHline.y2-StartHline.height/2-7*dh+es)+"L"+(StartHline.x2+2*ll)+","+(StartHline.y2-StartHline.height/2-7*dh+es)+"Z").attr(undo_line).attr(undo);
				
			
			//夜宵
			var pebceb=rhombC(peacea_Sline.p1,dw,dh,"吃了夜宵")
			var pebceb_Sline=Sline(pebceb,2*dh,"Y")//竖线
			var pebceb_Hline=Hline(pebceb,2*dw,'N')//横线
			var pebceb_rect=recttangle(pebceb_Hline.pp2,'还行')
			var pebceb_moreline=moreLine(pebceb_rect)
			var endRStart=rhombC(pebceb_Sline.p1,dw,dh,"就这样")
			var endR = endRStart.getBBox();
			var ell_result_p1=r.path("M"+(endR.x2)+","+(endR.y2-endR.height/2)+"L"+(endR.x2+9*ll)+","+(endR.y2-endR.height/2)+"L"+(endR.x2+9*ll)+","+(endR.y2-4*ll+dh/2-es)).attr(undo_line);
			var ell_result_pp1=r.path("M"+(endR.x2+9*ll-3)+","+(endR.y2-4*ll+dh/2-es)+"L"+(endR.x2+9*ll+3)+","+(endR.y2-4*ll+dh/2-es)+"L"+(endR.x2+9*ll)+","+(endR.y2-4*ll+dh/2-es-3)+"Z").attr(undo_line).attr(undo);
				
			
			//连接到合并结果
			var pebceb_rect_Hline_H=Hline(pebceb_rect,ll/2,"","no");//横
			var pebceb_rect_Hline_S=SlineC(pebceb_rect_Hline_H.p2,-4*dh);//竖线
	
			//封装好的函数//
			//矩形
			function recttangle(start,text){
				var rstart = start.getBBox();
				var rstartX = rstart.x2;
				var rstartY = (rstart.y+rstart.y2)/2;
				var wsnew = r.rect(rstartX,rstartY-rh/2,rw,rh).attr(undo);
				wsnew.glow(glow);
				var wsnew_text = r.text(rstartX+rw/2+es,rstartY,text).attr(ok_text);
				return wsnew;
			}
			//菱形
			function rhombC(start,w,h,text){
				var rstart = start.getBBox();
				var rstartX = rstart.x2;
				var rstartY = rstart.y2;
				var judgereview = r.path("M"+(rstartX)+","+(rstartY)+"L"+(rstartX-w)+","+(rstartY+h)+"L"+(rstartX)+","+(rstartY+h*2)+"L"+(rstartX+w)+","+(rstartY+h)+"Z").attr(undo);
				judgereview.glow(glow);
				var judgereview_text = r.text(rstartX,rstartY+dh,text).attr(ok_text);
				return judgereview;
			}
			//竖线
			function Sline(start,l,text,no){
				var startXY = start.getBBox();
				var p1 = r.path("M"+(startXY.x2-startXY.width/2)+","+(startXY.y2)+"L"+(startXY.x2-startXY.width/2)+","+(startXY.y2+l)).attr(undo_line);
				if(!no){
					var pp1 = r.path("M"+(startXY.x2-startXY.width/2-3)+","+(startXY.y2+l)+"L"+(startXY.x2-startXY.width/2+3)+","+(startXY.y2+l)+"L"+(startXY.x2-startXY.width/2)+","+(startXY.y2+l+3)+"Z").attr(undo_line).attr(undo);
				}
				if(text){
					var pt1 = r.text(startXY.x2-startXY.width/2,(startXY.y2+l/2),text).attr(undo_stext);
				}
				return{
					p1:p1,
					pp1:pp1,
					pt1:pt1
				}			
			} 
			//横线
			function Hline(start,w,text,no){
				var wsimpbb = start.getBBox();
				var wsimpaccx = wsimpbb.x2;
				var wsimpaccy = (wsimpbb.y+wsimpbb.y2)/2;
				var p2 = r.path("M"+(wsimpaccx+w)+","+wsimpaccy+"L"+(wsimpaccx+es/2)+","+wsimpaccy).attr(undo_line);
				if(!no){
					var pp2 = r.path("M"+(wsimpaccx+w)+","+(wsimpaccy+3)+"L"+(wsimpaccx+w)+","+(wsimpaccy-3)+"L"+(wsimpaccx+w+3)+","+(wsimpaccy)+"Z").attr(undo_line).attr(undo);
				}
				if(text){	
					var pt2 = r.text(wsimpaccx+w/2,wsimpaccy,text).attr(undo_stext);
				}
				return {
					p2:p2,
					pp2:pp2,
					pt2:pt2
				};
			} 
			//多条线段
			function moreLine(start,end,text){
				var wsimpbb = start.getBBox();
				var h1=-ll/10;//竖线的长度
				var w1=dw;//横线的长度
				var wsimpaccx = wsimpbb.x;
				var wsimpaccy = (wsimpbb.y+wsimpbb.y2)/2;
				var p3 = r.path("M"+(wsimpaccx+wsimpbb.width/2)+","+(wsimpbb.y+wsimpbb.height)+"L"+(wsimpaccx+wsimpbb.width/2)+","+(wsimpbb.y+wsimpbb.width/2+h1)+"L"+(wsimpaccx-wsimpbb.width-w1)+","+(wsimpbb.y+wsimpbb.width/2+h1)).attr(undo_line);
				var pp3 = r.path("M"+(wsimpaccx-wsimpbb.width-w1)+","+(wsimpbb.y+wsimpbb.width/2+h1-3)+"L"+(wsimpaccx-wsimpbb.width-w1)+","+(wsimpbb.y+wsimpbb.width/2+h1+3)+"L"+(wsimpaccx-wsimpbb.width-w1-3)+","+(wsimpbb.y+wsimpbb.width/2+h1)+"Z").attr(undo_line).attr(undo);
				if(text){	
					var pt3 = r.text(wsimpaccx+ll,wsimpaccy,text).attr(undo_stext);
				}
				return {
					p3:p3,
					pp3:pp3
				};
			}
			//椭圆
			function ell(start,text){
				var estart = start.getBBox();
				var estartX = estart.x2;
				var estartY = (estart.y+estart.y2)/2;
				var start = r.ellipse(estartX+rx+es,estartY,rx,rx).attr(undo);
				  start.glow(glow);
				var start_text = r.text(estartX+rx+es,estartY,text).attr(ok_text);
				return start;
			}
			//单纯的一条横线
			function HlineC(start){
				var Startline = start.getBBox();
				var p2 = r.path("M"+(Startline.x2)+","+(Startline.y2-Startline.height/2)+"L"+(Startline.x2+ll)+","+(Startline.y2-Startline.height/2)).attr(undo_line);
				return p2;
			}
			//单纯的一条竖线
			function SlineC(start,h){
				var Startline = start.getBBox();
				var p1 = r.path("M"+(Startline.x2)+","+(Startline.y2)+"L"+(Startline.x2)+","+(Startline.y2+h)).attr(undo_line);
				return p1;
			}			
		};
	}  
})