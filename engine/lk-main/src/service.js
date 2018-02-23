function service() {

  this.operation = async function (ctx, parms) {
    return ctx.render("lk-main/web/operation/main.ejs",{}); 
  }

  this.uploadLogo = async function(ctx,parms){
    console.log(ctx.request.body);
    ctx.send("success");
  }

}

module.exports = service;