
function realtime(net){

  this.init = async function(ctx,parms){
    return ctx.render("lk-imu/web/realtime/index.ejs",{});
  }
}

module.exports = realtime;