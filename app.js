/**
 * 应用程序入口 
 */

//设置常用目录,根目录及app.js所在目录
global.root_path = __dirname;
global.node_modules = __dirname + "/node_modules";

var userObj = {id:"123456",username:"testuser",password:"111111",nc:'hello'};

//启动程序
function start(){
	var sysconfig = require(__dirname+'/iotlib/src/config/sysconfig.json');
	//创建Web服务器
	var express = require('express');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
   // var bcrypt = require('bcrypt');

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        done(err, userObj);

        // User.findById(id, function(err, user) {
        //     done(err, user);
        // });
    });

    passport.use(new LocalStrategy({ usernameField: 'username' }, function(username, password, done) {

        return done(null, userObj);

        //实现用户名或邮箱登录
        //这里判断提交上的username是否含有@，来决定查询的字段是哪一个
        // var criteria = (username.indexOf('@') === -1) ? {username: username} : {email: username};
        // User.findOne(criteria, function(err, user) {
        //     if (!user) return done(null, false, { message: '用户名或邮箱 ' + username + ' 不存在'});
        //     bcompare(password, hash, function(err, isMatch) {
        //         if (isMatch) {
        //             return done(null, user);
        //         } else {
        //             return done(null, false, { message: '密码不匹配' });
        //         }
        //     });
        // });
    }));


    var errorHandler = require('errorhandler');
	var fs = require("fs");
	var app = express();
    var router = require(__dirname+"/iotlib/src/controller/route");

    var dbhelp = require("lifekit-mysqlhelper");

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

    app.use(passport.initialize());
    app.use(passport.session());

    //app.use(express.methodOverride());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // app.post('/login', passport.authenticate('local', function(err, user, info) {
    //         if (err) return next(err);
    //         if (!user) {
    //             req.flash('errors', { msg: info.message });
    //             return res.redirect('/login');
    //         }
    //         req.logIn(user, function(err) {
    //             if (err) return next(err);
    //             req.flash('success', { msg: '登录成功！' });
    //             res.redirect('/');
    //         });
    //     })(req, res, next)
    // );

    app.post('/login',passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }),
        function(req, res) {
            // 验证成功则调用此回调函数
            res.redirect('/users/' + req.user.username);
        });

    app.get('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/users/' + user.username);
            });
        })(req, res, next);
    });

    //这里getUser方法需要自定义
    app.get('/user', function(req,res){
        if (req.isAuthenticated()){
            res.send(userObj);
        }else{
            res.redirect('/login');
        }
    });
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

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

    //初始化全局的mysql连接池
    dbhelp.dbhelper("lifekit","localhost","3306","root","123456");

    console.log("系统初始化完成");
}
start();

