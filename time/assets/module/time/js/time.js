/*
依赖于bootstrap-datetimepicker扩展的日期插件
实现选择年月日 时分秒 多项选择
*/
$(function(){
    

    $.fn['time']=function(option){
        //设置一开始的日期
        $("#datetimepicker1").empty();
        var html=' <input type="text" class="form-control" id="calendarBtn2" style="width: 100%; height: 30px;" />'+
        '<i style="background:url(assets/module/time/img/date.png);position:absolute;width:30px;height:30px;right:5%;top:1px;"></i>';
        $("#datetimepicker1").html(html);

        var objName=$(this).selector;
        var init=function(option){
            var type=formatTime(option.type)?formatTime(option.type):'D',
            value=option.value?option.value:'',
            language=option.language?option.language:"zh-CN";
        var op={
            language:language,
            format:"yyyy-mm-dd",// 选择时间 
        }
        //年月日小时分钟
        var getType=function(type){
            var json={};
            switch(type){
                case 'D':
                json={
                    startView: 2,
                    minView:2,
                    maxView:2,
                    format:"yyyy-mm-dd"// 选择时间
                }
                break;
                case 'M':
                json={
                    startView: 3,
                    minView:3,
                    maxView:4,
                    format:"yyyy-mm"// 选择时间
                }
                break;
                case 'H':
                json={
                    startView: 1,
                    minView:2,
                    maxView:2,
                    format:"yyyy-mm-dd hh:00"// 选择时间
                }
                break;
                case 'Mi':
                json={
                    startView: 0,
                    minView:0,
                    maxView:1,
                    format:"yyyy-mm-dd hh:ii"// 选择时间
                }
                break;
            }
            return json;
        }
        //年月日小时分钟
        function formatTime(type){
            var f;
            switch(type){
                case '月':
                f='M';
                break;
                case '日':
                f='D';
                break;
                case '小时':
                f='H';
                break;
                case '分钟':
                f='Mi';
                break;
            }
            return f;
        }
        var op=$.extend({
            weekStart:1,
            todayBtn:1,
            autoclose:1,
            todayHighlight:1,
            forceParse:0,
        },op,getType(type))
        $(objName).datetimepicker(op);
        $(objName).val(value)
        $(objName).datetimepicker('update');
        $(objName).datetimepicker({
            onSelect:function(){}
        })
        }
        init(option)
    }
    //获取当前时间
    function getNowtime(){
        var date = new Date(); //日期对象
        var now = "";
        now = date.getFullYear()+"-"; //读英文就行了
        now = now + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';//取月的时候取的是当前月-1如果想取当前月+1就可以了
        now = now + (date.getDate() < 10 ? '0'+date.getDate() : date.getDate())+" ";
        return now;
    }
   var now=getNowtime();
    $('#calendarBtn2').time({
        type:'D',
        format:"yyyy-mm",// 选择时间
        value:now
    }) 

    $(".clickSelect").change(function(){
        var vals=$(".clickSelect").val();
        $('#calendarBtn2').time({
            type:vals,
            format:"yyyy-mm",// 选择时间
        }) 
    })
    
})
