/**
 * Created by zhy on 17/1/31.
 */

function service(net){  
 
    net.data.message = "hello world!!";

    this.table = function(ctx,parms){
        net.data.list = [{}];
        return ctx.render("engine/example/web/table.ejs",{});
    }

}
module.exports = service;

