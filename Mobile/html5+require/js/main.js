
require.config({
	paths:{
		'jquery':"js/jquery-1.7.2",
		"swiper":"js/swiper.min",
		
	}
});
require(["jquery","swiper"],function(jq,swiper){
	var mySwiper = new Swiper ('.swiper-container', {
			autoplay: 5000,//可选选项，自动滑动
		    direction: 'vertical',
		    // 如果需要分页器
		    pagination: '.swiper-pagination',
	}) ; 
	var mySwiper2 = new Swiper('.swiper-container2', {
		autoplay: 5000,//可选选项，自动滑动
		direction: 'vertical',
		// 如果需要分页器
		pagination: '.swiper-pagination',
	});
	var mySwiper3 = new Swiper('.swiper-container3', {
		autoplay: 5000,//可选选项，自动滑动
		pagination: '.swiper-pagination',
	});
	(function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if(clientWidth>=640){
                    docEl.style.fontSize = '100px';
                }else{
                    docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
                }
            };

        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
	$(function() {
		$(document).scroll(function() {
			var top = $(document).scrollTop();
			
			if(top > 10) {
			$(".header div").css({"background":"rgba(201,21,35,1)","color":"#fff","top":top+"px"})	;
			$(".header-none").css({"display":"block"})
		}else{
			$(".header div").css({"background":"none","color":"#000","top":"0px"})	;
			$(".header-none").css({"display":"none"})
		}
				
		});
	});
});
