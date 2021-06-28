var loadModal ={
    dom:'<div id="loading">'+
    '<div id="loading-center-absolute">'+
    '<div class="object" id="object_one"></div>'+
    '<div class="object" id="object_two"></div>'+
    '<div class="object" id="object_three"></div>'+
    '<div class="object" id="object_four"></div>'+
    '<div class="object" id="object_five"></div>'+
    '<div class="object" id="object_six"></div>'+
    '<div class="object" id="object_seven"></div>'+
    '<div class="object" id="object_eight"></div>'+
    '</div>'+
    '</div>',
    clear:function () {
        $('#loading').remove();
    },
    add:function (parent) {
        if(!document.getElementById('loading')){
            $(loadModal.dom).appendTo(parent);
        }
    }
}
