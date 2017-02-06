/**
 * Created by zhy on 17/1/28.
 */

function start(){
    var sysconfig = require(root_path+'/iotlib/src/config/sysconfig.json');
    //创建Web服务器
    var express = require('express');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var passport = require('passport');
    global.passport = passport;
    // var bcrypt = require('bcrypt');

    var errorHandler = require('errorhandler');
    var fs = require("fs");
    var app = express();
    var router = require(root_path+"/iotlib/src/init/route");

    var http = require('http');
    http.globalAgent.maxSockets = 150;
    var server = http.createServer(app);

    // 只用于开发环境
    if ('development' == app.get('env')) {

    }

    // 只用于生产环境
    if ('production' == app.get('env')) {

    }

    //app.use(express.logger('dev'));
    app.set('views', root_path);
    app.set('view engine', 'ejs');
    app.use(cookieParser());
    app.use(session({
        secret: 'iot',
        name: 'iot',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
        cookie: {maxAge: 800000 },  //设置maxAge是80000ms，即800s后session和相应的cookie失效过期
        resave: false,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    //app.use(express.methodOverride());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //初始化全局的mysql连接池
    var dbhelp = require("lifekit-mysqlhelper");
    dbhelp.dbhelper("lifekit","localhost","3306","root","123456");



    //加载路由
    router(app);
    //app.use(router);

    app.use(express.static(root_path+'/iotlib/web'));

    fs.readdir(root_path+"/modules",function(err,fileNameArray){
        for(var i=0;i<fileNameArray.length;i++){
            var filepath = root_path+"/modules/"+fileNameArray[i];
            var stat = fs.lstatSync(filepath);
            if(stat){
                app.use("/"+fileNameArray[i]+"/web",express.static(filepath+'/web'));
            }
        }
    });
    //app.use(express.static('/mnt/googlemaps'));
    app.use(errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    //Web端口号
    var port = sysconfig.port;
    //启动Web侦听
    server.listen(port, function () {
        console.log('Express server listening on port ' + port);
    });
    console.log("已启动服务监听，端口："+port);

    //加载WebSocket控制器
    console.log("加载WebSocket控制器");
    var netclient = require(root_path + '/iotlib/src/controller/netclient.js');
    global.net = new netclient(server);

    //初始化系统需要加载的项--统一都放到这里面
    console.log("加载系统初始化启动项");
    var InitServer = require(root_path + '/iotlib/src/common/InitServer.js');
    new InitServer();

    //加载用户登录验证模块
    console.log("加载用户登录验证模块");
    require(root_path+"/modules/makeUser/src/UserLogin")(app,passport);
    console.log("系统初始化完成");
}
module.exports = start;