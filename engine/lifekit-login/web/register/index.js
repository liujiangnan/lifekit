/**
 * Created by zhy on 16/10/24.
 */


function checkInfo(){
    $('#userform').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: '用户名验证失败',
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        min: 8,
                        max: 18,
                        message: '用户名长度必须在8到18位之间'
                    },
                    threshold :  8 , //有8字符以上才发送ajax请求，（input中输入一个字符，插件会向服务器发送一次，设置限制，8字符以上才开始）
                    remote: {//ajax验证。server result:{"valid",true or false} 向服务发送当前input name值，获得一个json数据。例表示正确：{"valid",true}
                        url: net.getAjaxURL(),//验证地址
                        message: '用户已存在',//提示消息
                        delay :  2000,//每输入一个字符，就发ajax请求，服务器压力还是太大，设置2秒发送一次ajax（默认输入一个字符，提交一次，服务器压力太大）
                        type: 'POST',//请求方式
                        /**自定义提交数据，默认值提交当前input value*/
                        data: function(validator) {
                            return net.getAjaxData("checkUser",$("#username").val());
                        }
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: '用户名只能包含大写、小写、数字和下划线'
                    }
                }
            },
            password:{
                message:'密码输入错误',
                validators:{
                    notEmpty:{
                        message:'密码不能为空'
                    }
                }
            },
            passagain:{
                message:'密码输入错误',
                validators:{
                    notEmpty:{
                        message:'密码不能为空'
                    },
                    identical: {//相同
                        field: 'password', //需要进行比较的input name值
                        message: '两次密码不一致'
                    }
                }
            },
            nc: {
                message: '昵称验证失败',
                validators: {
                    notEmpty: {
                        message: '昵称不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 10,
                        message: '昵称的长度必须是2-10个字符'
                    },
                    threshold :  2 , //有8字符以上才发送ajax请求，（input中输入一个字符，插件会向服务器发送一次，设置限制，8字符以上才开始）
                    remote: {//ajax验证。server result:{"valid",true or false} 向服务发送当前input name值，获得一个json数据。例表示正确：{"valid",true}
                        url: net.getAjaxURL(),//验证地址
                        message: '昵称已被占用',//提示消息
                        delay :  2000,//每输入一个字符，就发ajax请求，服务器压力还是太大，设置2秒发送一次ajax（默认输入一个字符，提交一次，服务器压力太大）
                        type: 'POST',//请求方式
                        /**自定义提交数据，默认值提交当前input value*/
                        data: function(validator) {
                            return net.getAjaxData("checkNc",$("#nc").val());
                        }
                    },
                }
            },
            myEmial: {
                message: '邮箱验证失败',
                validators: {
                    notEmpty: {
                        message: '邮箱不能为空'
                    },
                    emailAddress: {
                        message: '邮箱地址格式有误'
                    }
                }
            },
            phoneNum:{
                message: '手机验证失败',
                validators: {
                    regexp: {
                        regexp: /^1[3|5|8]{1}[0-9]{9}$/,
                        message: '请输入正确的手机号码'
                    }
                }
            }
        }
    });
}

function saveInfo(){
    var userObj = {
        username:$("#username").val(),
        password:$("#password").val(),
        email:$("#myEmail").val(),
        name:$("#nc").val(),
        phone:$("#phoneNum").val()
    }; 
    net.getView("addUser",JSON.stringify(userObj),function(res){
        var obj = JSON.parse(res);
        if(obj.flag==="success"){
            window.location.href = net.data.jumpUrl.login_success;  //配置文件指定的路径（jump.json）
        }else{
            showModal("提示","注册失败!","确定");
        }
    });
}

 

$(function(){
    checkInfo();
    $("#saveUser").bind("click",function(){
        $("#userform").bootstrapValidator('validate');
        if($('#userform').data('bootstrapValidator').isValid()){
            saveInfo();
        }else{
            showModal("提示","请认真填写必要信息","确定");
        }
    });
    $("#cancle").bind('click',function(){
        document.location.href="/lifekit-login";
    });
});