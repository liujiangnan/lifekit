/**
 * Created by zhy on 17/1/28.
 */

const views = require('koa-views');
const fs = require('fs'); 
const send = require('koa-send');
const resolve = require('path').resolve; 
//证书标识
const secret = require("node-uuid").v1();
 
function start(app,server) {

    //扩展自定义属性及方法
    require("./../common/common");

    app.use(require('koa-static')(node_modules+'/lifekit/web'));

    app.use(views(root_path, { extension: 'ejs' }));

    //设置静态文件路径
    var fileNameArray = fs.readdirSync(root_path + "/engine"); 
    for (var i = 0; i < fileNameArray.length; i++) {
        var filepath = root_path + "/engine/" + fileNameArray[i];
        var stat = fs.lstatSync(filepath); 
        if (stat.isDirectory()) {
            (function(_block){
                app.use(function (ctx, next) {
                    if ((ctx.path.indexOf("/"+_block+"/web")===0)&&(ctx.method == 'HEAD' || ctx.method == 'GET')) {
                        return send(ctx, ctx.path, {root:resolve(root_path + "/engine")}).then(done => {
                            if (!done) {
                                return next();
                            }
                        });
                    }
                    return next();
                });
            })(fileNameArray[i]);
            
        }
    }
    
    // routes
    require('./authroute.js')(app,secret);

    //加载WebSocket控制器
    console.log("加载WebSocket控制器");
    var netclient = require('./netclient.js');
    global.netclient = new netclient(server,secret);
  
}
module.exports = start;