
net.on("getMessage",function(data){
    var dom = $("#messageShow").clone();
    dom.find(".popover-content").html(data);
    $('#talkView').append(dom);
    dom.show();
    $('#talkView').scrollTop( $('#talkView')[0].scrollHeight );
});


$(function () {

    $('#sendMessage').bind('click',function(){
        var message = $("#message").val();
        message = message==""?$("#message").text():message;
        if(message){
            net.getData("pushMessage",message,function(msg){
                if(msg==='success'){
                    $("#message").val('');
                }
            });
        }
    });

});