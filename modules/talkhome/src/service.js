/**
 * Created by zhy on 16/11/8.
 */

function  service(){

    this.init = function(req,res,parms){

        if(req.isAuthenticated()){
            res.render(parms,{login:true,nc:req.user.NAME});
        }else{
            res.render(parms,{login:false});
        }
    };

    this.pushMessage = function(req,res,parms){

        if(req.isAuthenticated()){
            var messageobj = {
                nc:req.user.NAME,
                message:parms
            };
            var clients = net.getSockets("modules/talkhome/src/service");
            var arr = clients.values();
            var selfSocketid = net.getSelfSocketId(req);
            for(var i=0;i<arr.length;i++){
                var obj = arr[i];
                var sc = obj.socket;
                //给其他聊天窗口推送消息,由于是自己发的消息所以不用推送
                if(sc.id!=selfSocketid){
                    sc.emit("getMessage",messageobj);
                }
            }
            res.send('success');
        }else{
            res.render('iotlib/web/skyframe/error.ejs',{message:"用户未登录或已退出,请重新登录"});
        }


    }
}

module.exports = service;