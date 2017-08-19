

//调整页面
function adjustmentPage(){
    var formHeight = $(".row").height();
    var pageHeight = $(".container-fluid").height();
    var topH = (pageHeight-formHeight)/2;
    $(".row").css("margin-top",topH+"px");
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
                window.location.href = "/yxjk";
            }
        });  
    });

    $("#registerUser").bind('click',function(){ 
        net.getView("toRegister","engine/login/web/register/index.ejs",function(res){
            $("#divAll").html(res);
        });
    });


}

$(function(){

    adjustmentPage(); //调整页面
    //checkInfo(); //添加校验 登陆的时候 加校验效果不好
    bindEvent(); //绑定事件


});