
function service(){

    this.init = function(req,res,parms){
        if(req.user){
            res.render(parms,{nc:req.user.NAME});
        }else{
            res.render(parms,{nc:undefined});
        }
    };

}
module.exports = service;