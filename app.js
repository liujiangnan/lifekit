/**
 * 应用程序入口 
 */

//设置常用目录,根目录及app.js所在目录
global.root_path = __dirname;
global.node_modules = __dirname + "/node_modules";

//启动程序
function start(){
	var sysconfig = require(__dirname+'/iotlib/src/config/sysconfig.json');
	//创建Web服务器
	var express = require('express');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var errorHandler = require('errorhandler');
	var fs = require("fs");
	var app = express();
    var router = require(__dirname+"/iotlib/src/controller/route");

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
    app.set('views', __dirname);
    app.set('view engine', 'ejs');
    app.use(cookieParser());
    app.use(session({
                secret: 'iot',
                name: 'iot',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
                cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
                resave: false,
                saveUninitialized: true
            }));

    //app.use(express.methodOverride());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    router(app);
    //app.use(router);

    app.use(express.static(__dirname+'/iotlib/web'));

    fs.readdir(__dirname+"/modules",function(err,fileNameArray){
        for(var i=0;i<fileNameArray.length;i++){
            var filepath = __dirname+"/modules/"+fileNameArray[i];
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
	server.listen(port);
    console.log("已启动服务监听，端口："+port);

	//加载WebSocket控制器
    console.log("加载WebSocket控制器");
	var netclient = require(__dirname + '/iotlib/src/controller/netclient.js');
	global.net = new netclient(server);



	//初始化系统需要加载的项--统一都放到这里面
    console.log("加载系统初始化启动项");
	var InitServer = require(__dirname + '/iotlib/src/common/InitServer.js');
	new InitServer();

    console.log("系统初始化完成");
}
start();

