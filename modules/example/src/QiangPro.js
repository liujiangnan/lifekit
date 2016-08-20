
var threePro = require('./ThreePro');
var event = new threePro();
event.start();

function QiangPro(){

    var path = require('path');
    var fs = require('fs');

    /*
    //此方法测试系统初始化就执行
    this.protest = function(){
        console.dir("初始化执行任务--测试成功");
    };
    */

/*
    //此方法测试批量推送数据
    this.pushData = function(req, res, parms){
        var obj = JSON.parse(parms);
        //console.dir(obj.a+'8**********');

        //调用socketio的方法
        var socket = netclient.getNetclientInstanceForReq(req);
        event.on('alarmEvent',function(data){
            socket.emit('test',data);//推送数据
            //console.dir(data);
        });
        //推送结束

        //返回结果，推送可能是多次的，所以返回结果不放在触发事件的回调函数里
        res.send("success");
    }
*/
    this.getInitVal = function(req,res,parms){
        var data = require("./exampleConfig.json");
        res.send(JSON.stringify(data));
    };


    this.testSocketCall = function(socketid,data,callback){
        callback&callback();
    };


};
module.exports = QiangPro;