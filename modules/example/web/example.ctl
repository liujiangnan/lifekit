/*
 *脚本,模块控制层,负责绑定事件
*/
$(function(){

    initPage();

    $("#loadTest").bind('click',function(){
        var initObj = {
            id:"exampleframe",
            container:$("#exampleContainer")
        };
        if($("#server").val()&&$("#views").val()){
            initObj["server"] = $("#server").val();
            initObj["views"] = $("#views").val();
        }else{
            alert("请填写server和views");
            return;
        }
        initObj["closeable"] = $("#closeable").is(':checked');
        initObj["maximizeable"] = $("#maximizeable").is(':checked');
        initObj["minimizeable"] = $("#minimizeable").is(':checked');
        initObj["moveable"] = $("#moveable").is(':checked');
        var style = $("#styletext").val();
        initObj["style"] = style?JSON.parse(style):{};
        initObj["parms"] = $("#paramtext").val();
        var frame = new skyframe();
        frame.init(initObj);
    });


//    netclient.on("test",function(data){
//        console.dir(data);
//    });
//
//    var obj = {'a':'好的'};
//    netclient.getView("pushData",JSON.stringify(obj),function(res){
//        //alert(res);
//    });

//    netclient.call('testSocketCall','aaa',function(){
//        //alert("成功");
//    });
});

