/**
 * Created by zhy on 17/1/28.
 */

function start() {
    global.sysconfig = require(root_path + '/iotlib/src/config/sysconfig.json');
    //创建Web服务器
    const http = require('http');
    const Koa = require('koa');
    const jwt = require('koa-jwt');
    const convert = require('koa-convert');
    const views = require('koa-views');
    const json = require('koa-json');
    const onerror = require('koa-onerror');
    const session = require('koa-generic-session');
    const bodyparser = require('koa-bodyparser')();
    const logger = require('koa-logger');
    const fs = require('fs');
    const resolve = require('path').resolve; 
    const send = require('koa-send');

    var cors = require('koa-cors');


    const app = new Koa();
    app.keys = ['liujiangnan'];
    app.use(convert(session({
        secret: 'iot',
        name: 'iot',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
        cookie: { maxAge: 800000 },  //设置maxAge是80000ms，即800s后session和相应的cookie失效过期
        resave: false,
        saveUninitialized: true
    })));

    // error handler
    onerror(app);

    // middlewares
    app.use(bodyparser);
    app.use(json());
    app.use(logger());
    
    app.use(async (ctx,next)=>{
        if(ctx.path==="/favicon.ico"){ 
            ctx.status = 200;
            return ctx.res.end();
        }
        return next();
    });

    app.use(require('koa-static')(root_path + '/iotlib/web'));

    app.use(views(root_path, { extension: 'ejs' }));
    fs.readdir(root_path + "/engine", function (err, fileNameArray) {
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
    });


    //跨域访问
    app.use(convert(cors()));

    // routes
    require(root_path + '/iotlib/src/init/authroute.js')(app);

    //Web端口号
    var port = sysconfig.port||1337;
    //启动Web侦听

    var server = http.createServer(app.callback());
    server.listen(port, () => console.log('Server listening on', port));

    console.log("已启动服务监听，端口：" + port);

    //加载WebSocket控制器
    console.log("加载WebSocket控制器");
    var netclient = require(root_path + '/iotlib/src/init/netclient.js');
    global.netclient = new netclient(server);
  
}
module.exports = start;
