!function (global) {
    var request = global.request = {
        getParam:function(paramname){
            var paramValue = global.location.search.match(new RegExp("[\?\&]" + paramname + "=([^\&]*)(\&?)","i"));
            if(paramValue){
                return paramValue ? decodeURIComponent(paramValue[1]) : decodeURIComponent(paramValue);
            }
        }
    };
}(window);