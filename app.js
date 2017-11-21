/**
 * 应用程序入口 
 */

//设置常用目录,根目录及app.js所在目录
global.root_path = __dirname;
global.node_modules = __dirname + "/node_modules";

//创建Web服务器
const http = require('http');
const Koa = require('koa');
const jwt = require('koa-jwt');
const convert = require('koa-convert');

const json = require('koa-json');
const onerror = require('koa-onerror');
const session = require('koa-generic-session');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const fs = require('fs');
 

const cors = require('koa-cors');

const lifekit = require(root_path+"/lifekit");

const app = new Koa();

app.keys = ['iot,lifekit'];
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
//app.use(logger());


app.use(async (ctx,next)=>{
  if(ctx.path==="/favicon.ico"){ 
      ctx.status = 200;
      return ctx.res.end();
  }
  return next();
});

//跨域访问
app.use(convert(cors()));


//Web端口号
var port = 1337;
//启动Web侦听

var server = http.createServer(app.callback());
server.listen(port, function(){
    console.log("已启动服务监听，端口：" + port);

    //加载lifekit组件
    lifekit(app,server);

});  