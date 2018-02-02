function service() {

  this.operation = async function (ctx, parms) { 
    return ctx.render("lk-main/web/operation/main.ejs",{}); 
  }

}

module.exports = service;