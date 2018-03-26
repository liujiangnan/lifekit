

//调整页面
function adjustmentPage(){
    var formHeight = $(".row").height();
    var pageHeight = $(".container-fluid").height();
    var topH = pageHeight/2-formHeight;
    $(".row").css("margin-top","200px");
}

//绑定事件
function bindEvent(){

    $("#loginMake").bind('click',function(){
        var data = {
            "username":$("#username").val(),
            "password":$("#password").val()
        };

        net.getData("login",JSON.stringify(data),function(res){
            var obj = JSON.parse(res);
            if(obj.flag!='success'){
                $("#cueinfo").html("用户名或密码错误").show();
            }else{
                window.location.href = net.data.jumpUrl.login_success;  //配置文件指定的路径（jump.json）
            }
        });  
    });

    $("#registerUser").bind('click',function(){ 
        window.location.href = "/lifekit-login/register";
    });


}

$(function(){

    adjustmentPage(); //调整页面
    //checkInfo(); //添加校验 登陆的时候 加校验效果不好
    bindEvent(); //绑定事件


});