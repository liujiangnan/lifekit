//实时获取服务器推送的信息
net.on("getMessage",function(data){
    var dom = $("#messageShow").clone();
    dom.find(".talkName").html(data.nc);
    dom.find(".popover-content").html(data.message);
    $('#talkView').append(dom);
    dom.show();
    $('#talkView').scrollTop( $('#talkView')[0].scrollHeight );
});

//显示自己输入的信息
function showSelfMessage(message){
    var dom = $("#selfMessageShow").clone();
    dom.find(".talkName-right").html($('#userNc').val());
    dom.find(".popover-content").html(message);
    $('#talkView').append(dom);
    dom.show();
    $('#talkView').scrollTop( $('#talkView')[0].scrollHeight );
}

//登录
function login(){
    rootPage.showLoginFrame();
}
//注册
function register(){
    rootPage.showRegistFrame();
}

$(function () {
    $('#sendMessage').bind('click',function(){
        var message = $("#message").val();
        message = message==""?$("#message").text():message;
        if(message){
            showSelfMessage(message);
            net.getData("pushMessage",message,function(msg){
                if(msg==='success'){
                    $("#message").val('');
                }
            });
        }
    });

});