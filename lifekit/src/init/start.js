/**
 * Created by zhy on 17/1/28.
 */

const views = require('koa-views');
const fs = require('fs'); 
const send = require('koa-send');
const resolve = require('path').resolve; 
//证书标识
const secret = require("node-uuid").v1();
 
function start(app,server,engine_path) {

    let load_path = root_path; 
    let engine_dir = root_path+"/engine";

    if(engine_path){
        load_path = engine_path; 
        engine_dir = engine_path
    }
 
    global.ENGINE_PATH = engine_dir;
    
    //扩展自定义属性及方法
    require("./../common/common");

    app.use(require('koa-static')(root_path+'/lifekit/web'));

    //app.use(views(root_path, { extension: 'ejs' })); 

    app.use(views(engine_dir, { extension: 'ejs' }));   

    //设置静态文件路径
    var fileNameArray = fs.readdirSync(engine_dir); 
    for (var i = 0; i < fileNameArray.length; i++) {
        var filepath = engine_dir + "/" + fileNameArray[i]; 
        var stat = fs.lstatSync(filepath); 
        if (stat.isDirectory()) {
            (function(_block){
                app.use(function (ctx, next) {
                    
                    var counter = ctx.path.lastIndexOf(".");
                    if(counter>0&&ctx.path.substr(counter,3)==="ejs"){
                        return next();
                    } 
                    if ((ctx.path.indexOf("/"+_block+"/web")===0)&&(ctx.method == 'HEAD' || ctx.method == 'GET')) { 
                        return send(ctx, ctx.path, {root:resolve(engine_dir)}).then(done => {
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
    require('./authroute.js')(app,secret,engine_dir);

    //加载WebSocket控制器
    console.log("加载WebSocket控制器");
    var netclient = require('./netclient.js');
    global.netclient = new netclient(server,secret,engine_dir);
  
}
module.exports = start;