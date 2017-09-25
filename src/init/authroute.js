/**
 * Web请求路由（带权限）
 */
function authroute(app,secret,engine_dir) {
    var router = require('koa-router')();
    var jwt = require('jsonwebtoken'); 

    var url = require("url");
    var fs = require("fs");
    var ejs = require("ejs");
 
    //浏览器地址栏请求或刷新
    router.get('/', function (ctx, next) {
        var host = ctx.headers['host'];
        ejs.renderFile(root_path+'/engine/index.ejs', { 'host': host },function(err, str){
            if(err){
                console.log(err);
            }
            return ctx.response.body = str;
        }); 
    });

    fs.readdir(engine_dir, function (err, fileNameArray) {
        fileNameArray.asynEach(function (i, n, flag) {
            var filepath = engine_dir + "/" + n;
            var stat = fs.lstatSync(filepath);
            if (stat && stat.isDirectory()) {
                console.log("正在装载'" + n + "'模块..");

                //模块入口路由
                router.get("/" + n, function (ctx, next) {
                    var host = ctx.headers['host'];
                    // 创建token
                    var token = jwt.sign({engine:n}, secret, {
                        'expiresIn': 30 // 设置过期时间，单位是秒
                    });
                    var params = "";
                    if(ctx.request.query){
                        params = JSON.stringify(ctx.request.query);                        
                    }
                    ejs.renderFile(root_path+'/node_modules/lifekit/web/skyframe/skyframe.ejs',
                    { 
                        'host': host, 
                        'server': n, 
                        'token': token,
                        'method':'init',
                        'params':params
                    },function(err, str){
                        if(err){
                            console.log("模块"+n+"入口文件报错");
                            console.log(err);
                        }
                        return ctx.response.body = str;
                    });  
                });
                //各个子模块路由
                router.get("/" + n + "/:method", function (ctx, next) { 
                    var host = ctx.headers['host'];
                    var token = jwt.sign({engine:n+'/'+ctx.params.method}, secret, {
                        'expiresIn': 30 // 设置过期时间，单位是秒
                    });
                    var params = "";
                    if(ctx.request.query){
                        params = JSON.stringify(ctx.request.query);                        
                    }
                    ejs.renderFile(root_path+'/node_modules/lifekit/web/skyframe/skyframe.ejs',
                    { 
                        'host': host, 
                        'server': n, 
                        'token': token,
                        'method': ctx.params.method,
                        'params': params
                    },function(err, str){
                        if(err){
                            console.log("模块"+n+"入口文件报错");
                            console.log(err);
                        }
                        return ctx.response.body = str;
                    }); 
                });

                //模块交互路由
                router.post('/' + n + '/getView', async function (ctx, next) {

                    ctx.request.body.server = n;
                    var svc = netclient.getService(ctx); 
                    if (svc) {
                        var method = ctx.request.body.method;
                        var parms = ctx.request.body.parms;
                        // var mdlService = require(filepath + '/src/service');
                        // var svc = new mdlService(socket); 
                        if (method === "getEjs") {
                            return ctx.render(parms, {});
                        } else{
                            if(method==="init"&&!svc["init"]){
                                return ctx.render(n + "/web/index.ejs", {});
                            }else{
                                await svc[method](ctx, parms);
                            } 
                        }
                    } else {
                        ejs.renderFile(root_path+'/node_modules/lifekit/web/skyframe/error.ejs',
                        { 
                            message: "非法访问"
                        },function(err, str){
                            if(err){ 
                                console.log(err);
                            }
                            return ctx.response.body = str;
                        });  
                    }
                });
                console.log("模块'" + n + "'装载完成..");
            }
            flag();
        }, function () {
            app.use(router.routes(), router.allowedMethods());
            console.log("所有模块装载完成...");
        });
    });
}
module.exports = authroute;