

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

        $.ajax({
            type: "POST",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            url: "/login/",
            data: data,
            success: function (xhr) {
            },
            error: function (xhr, e) {
            },
            complete: function (xhr) {
                var res = xhr.responseText;
                if(res==='success'){
                    rootPage.closeLoginFrame();
                }else{
                    $("#cueinfo").html("用户名或密码错误").show();
                }
            }
        });

    });

    $("#registerUser").bind('click',function(){
        net.getView("getEjs","modules/makeUser/web/register/index.ejs",function(res){
            $("#divAll").html(res);
        });
    });


}

$(function(){

    adjustmentPage(); //调整页面
    //checkInfo(); //添加校验 登陆的时候 加校验效果不好
    bindEvent(); //绑定事件


});