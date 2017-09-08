/**
 * Created by zhy on 17/2/4.
 */

(function($){

    //判断对象的类型
    function type(v){
        return Object.prototype.toString.call(v);
    };

    //绑定数据链变化
    $.fn.datachange = function() {
        var option = arguments[0];
        var callback = arguments[1];
        return this.each(function() {
            var $this = $(this);
            if(option&&callback&&type(option)==='[object String]'&&type(callback)==='[object Function]'){
                $("body").on("net_"+option,function(event,val){
                    callback&&callback(val,$this);
                });
                net.addEvent("domchange_datachange",option,function(val){
                    $("body").trigger("net_"+option,val);
                });
            }
        });
    };

    $.fn.datachangeInVal = function(){
        var option = arguments[0];
        var callback = arguments[1];
        return this.each(function() {
            var $this = $(this);
            if(option&&callback&&type(option)==='[object String]'&&type(callback)==='[object Function]'){
                $("body").on("net_"+option,function(event,val){
                    $this.val(val);
                    callback&&callback(val,$this);
                });
                net.addEvent("domchange_datachange",option,function(val){
                    $("body").trigger("net_"+option,val);
                });
            }
        });
    };

    $.fn.datachangeInText = function(){
        var option = arguments[0];
        var callback = arguments[1];
        return this.each(function() {
            var $this = $(this);
            if(option&&callback&&type(option)==='[object String]'&&type(callback)==='[object Function]'){
                $("body").on("net_"+option,function(event,val){
                    $this.text(val);
                    callback&&callback(val,$this);
                });
                net.addEvent("domchange_datachange",option,function(val){
                    $("body").trigger("net_"+option,val);
                });
            }
        });
    };

    $.fn.datachangeInHtml = function(){
        var option = arguments[0];
        var callback = arguments[1];
        return this.each(function() {
            var $this = $(this);
            if(option&&callback&&type(option)==='[object String]'&&type(callback)==='[object Function]'){
                $("body").on("net_"+option,function(event,val){
                    $this.html(val);
                    callback&&callback(val,$this);
                });
                net.addEvent("domchange_datachange",option,function(val){
                    $("body").trigger("net_"+option,val);
                });
            }
        });
    };

})(jQuery);