/**
 * Web请求路由（带权限）
 */
function authroute(app,secret) {
    var router = require('koa-router')();
    var jwt = require('jsonwebtoken'); 

    var url = require("url");
    var fs = require("fs");
 
    //浏览器地址栏请求或刷新
    router.get('/', function (ctx, next) {
        var host = ctx.headers['host'];
        return ctx.render('engine/index.ejs', { 'host': host });
    });

    fs.readdir(root_path + "/engine", function (err, fileNameArray) {
        fileNameArray.asynEach(function (i, n, flag) {
            var filepath = root_path + "/engine/" + n;
            var stat = fs.lstatSync(filepath);
            if (stat && stat.isDirectory()) {
                console.log("正在装载'" + n + "'模块..");

                //模块入口路由
                router.get("/" + n, function (ctx, next) {
                    var host = ctx.headers['host'];
                    // 创建token
                    var token = jwt.sign(person, secret, {
                        'expiresIn': 30 // 设置过期时间，单位是秒
                    });
                    var params = "";
                    if(ctx.request.query){
                        params = JSON.stringify(ctx.request.query);                        
                    }
                    return ctx.render('node_modules/lifekit/web/skyframe/skyframe.ejs',
                        { 
                            'host': host, 
                            'server': n, 
                            'token': token,
                            'method':'init',
                            'params':params
                        });
                });
                //各个子模块路由
                router.get("/" + n + "/:method", function (ctx, next) { 
                    var host = ctx.headers['host'];
                    var token = jwt.sign(person, secret, {
                        'expiresIn': 30 // 设置过期时间，单位是秒
                    });
                    var params = "";
                    if(ctx.request.query){
                        params = JSON.stringify(ctx.request.query);                        
                    }
                    return ctx.render('node_modules/lifekit/web/skyframe/skyframe.ejs',
                        { 
                            'host': host, 
                            'server': n, 
                            'token': token,
                            'method': ctx.params.method,
                            'params': params
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
                                return ctx.render("engine/" + n + "/web/index.ejs", {});
                            }else{
                                await svc[method](ctx, parms);
                            } 
                        }
                    } else {
                        return ctx.render('node_modules/lifekit/web/skyframe/error.ejs', { message: "非法访问" });
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