
let path = require('path');
let fs = require('fs');

function service() {

  this.operation = async function (ctx, parms) {
    return ctx.render("lk-main/web/operation/main.ejs",{}); 
  }

  this.uploadLogo = async function(ctx,parms){ 
    try {
      let upfile = ctx.request.body.files.file;
      var newpath =path.join(ENGINE_PATH+'/lk-main/web/upload',upfile.name);  
      var stream = fs.createWriteStream(newpath);//创建一个可写流  
      fs.createReadStream(upfile.path).pipe(stream);//可读流通过管道写入可写流   
      ctx.body = {code:200,msg:"/lk-main/web/upload/"+upfile.name};
    } catch (error) {
      ctx.body = {code:500,msg:error};
    }
    
  }

}

module.exports = service;