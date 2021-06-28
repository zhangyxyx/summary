/**
 * 以后在这里写根据不同的用户权限来显示不同的页面模块
 */
$(function(){
    var jurisdiction = {
        init:function(){
            this.bindEvents();
        },
        bindEvents:function(){
             var gd={
                 '监控调度':'views/jsp/monitor/monitor.html',
                 '运维保障':'views/jsp/testmanagement/EndToEnd.html',
                 '网络分析':'views/jsp/configview/configView.html?viewid=V0000000&isleftmenu=true',
                 '综合维护':'views/jsp/comprehensive/comprehensive.html'
             };

            $(".ul-box li").on("click",function () {
                if($(this).hasClass('noJurisdiction')){
                    return;
                }
                 var _type=$(this).children('p').attr('data-val');
                if(_type=== $(".tabActive").attr('data-val')){
                    return;
                }
                sessionStorage.setItem("openActiveName", _type);
                sessionStorage.setItem("openHref", gd[_type]);
                window.open('views/jsp/viewindex/viewIndex.html');
            })
            $(".ul-box li").on("mouseover",function () {
                if(!$(this).hasClass('nomalActive')){
                    $(this).addClass('tabActive');
                }
            })
            $(".ul-box li").on("mouseout",function () {
                if(!$(this).hasClass('nomalActive')){
                    $(this).removeClass('tabActive');
                }
            })

        },
        echartsMap:function(){

        }
    }
    jurisdiction.init();
})