

function serial (net){

  this.init = async function(ctx,parms){
    return ctx.render("lk-imu/web/serial/index.ejs",{});
  }
}

module.exports = serial;