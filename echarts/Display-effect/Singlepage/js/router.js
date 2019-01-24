define(['backbone'],function(Backbone){
    var router=Backbone.Router.extend({
        routes:{
            'index':'show',
            'p':'pShow'
        },
        show:function(params,callback){
            var url='././main/view.js';
            var _this=this;
            require([url],function(view){
                var v=new view();
                v.render();
                $("#main").html(view.$el);
                _this.$frame=v;
                callback&&callback(_this.$frame)
            })
        },
        
    })
    return router;
})