//根据屏幕大小改变根元素字体大小
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 375) { //750这个值，根据设计师的psd宽度来修改，是多少就写多少，现在手机端一般是750px的设计稿，如果设计师给的1920的psd，自己用Photoshop等比例缩小
                docEl.style.fontSize = '100px';
            } else {
                docEl.style.fontSize = 100 * (clientWidth / 375) + 'px'; //750这个值，根据设计师的psd宽度来修改，是多少就写多少，现在手机端一般是750px的设计稿，如果设计师给的1920的psd，自己用Photoshop等比例缩小
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
$(function(){
	/*顶部轮播图*/
	 var swiper = new Swiper('.banner .swiper-container', {
        pagination: '.banner .swiper-pagination',
        paginationClickable: true,
        autoplay : 5000,
    });
    /*京东快报*/
    var swiper = new Swiper('.news .swiper-container', {
        pagination: '.news .swiper-pagination',
        paginationClickable: true,
        direction: 'vertical',
        autoplay : 5000,
    });
    /*京东秒杀*/
   	var swiper = new Swiper('.jdms_photo .swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 20,
        freeMode: true
    });
    /*第二个轮播图*/
    var swiper = new Swiper('.banner2 .swiper-container', {
        pagination: '.banner2 .swiper-pagination',
        paginationClickable: true,
        autoplay : 5000,
    });
    /*第三个轮播图*/
    var swiper = new Swiper('.banner3 .swiper-container', {
        pagination: '.banner3 .swiper-pagination',
        paginationClickable: true,
        autoplay : 5000,
    });
    /*第四个轮播图*/
    var swiper = new Swiper('.banner4 .swiper-container', {
        pagination: '.banner4 .swiper-pagination',
        paginationClickable: true,
        autoplay : 5000,
    });
    $(window).scroll(function(){
    	var top=$(window).scrollTop();
    	if(top<100){
    		$(".header").css({"background":"none"});
    	}else{
    		$(".header").css({"background":"red"});
    	}	
    })
})
