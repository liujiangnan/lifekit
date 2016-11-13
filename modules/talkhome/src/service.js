/**
 * Created by zhy on 16/11/8.
 */

function  service(){

    this.pushMessage = function(req,res,parms){

        var clients = net.getSockets("modules/talkhome/src/service");
        var arr = clients.values();
        for(var i=0;i<arr.length;i++){
            var obj = arr[i];
            var sc = obj.socket;
            sc.emit("getMessage",parms);
        }
        res.send('success');
    }
}

module.exports = service;