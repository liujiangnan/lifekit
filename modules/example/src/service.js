/**
 * Created by zhy on 17/1/31.
 */

function service(){


    this.testMethod = function(req,res,param){
        console.log(param);

        var socket = net.getNetclientInstanceForReq(req);
        socket.emit("myOn",1111111);

        socket.on("serverOn",function(res){
            console.log(res);
        });

        setInterval(function(){
            var str = new Date().pattern("yyyy-MM-dd HH:mm:ss S");
            socket.data.a = str;
            console.dir(str);
        },1000);

        res.send("*******");
    };

}
module.exports = service;

