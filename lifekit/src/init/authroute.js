/**
 * Web请求路由（带权限）
 */
let authroute = async function(app, secret, engine_dir) {
  let router = require('koa-router')();
  let jwt = require('jsonwebtoken');

  let url = require("url");
  let fs = require("fs");
  let ejs = require("ejs");


  //浏览器地址栏请求或刷新
  router.get('/', function(ctx, next) {
    var host = ctx.headers['host'];
    ejs.renderFile(root_path + '/engine/index.ejs', { 'host': host }, function(err, str) {
      if (err) {
        console.log(err);
      }
      return ctx.response.body = str;
    });
  });

  let fileNameArray = fs.readdirSync(engine_dir);
  fileNameArray.map(function(n) {
    var filepath = engine_dir + "/" + n;
    var stat = fs.lstatSync(filepath);
    if (stat && stat.isDirectory()) {
      console.log("正在装载'" + n + "'模块..");
      
      //模块入口路由
      router.get("/" + n, function(ctx, next) {
        var host = ctx.headers['host']; 
        var params = "";
        if (ctx.request.query) {
          params = JSON.stringify(ctx.request.query);
        }
        let token = jwt.sign({ engine: n }, secret, {
          'expiresIn': 30 // 设置过期时间，单位是秒
        });
        let renderOption = getDeployOption("/",filepath,token);

        //判断模块是否开启了socketio，如果没开启，就不能靠socket来声明实例了
        //所以要提前声明实例并存放在session中
        if(renderOption.token===null){ 
          let mdlService = require(filepath + '/src/'+renderOption.server);
          ctx.session._engine_svc = new mdlService();
        }

        renderOption.host = host; 
        renderOption.params = params;
        renderOption.engine = n;
        ejs.renderFile(root_path + '/lifekit/web/skyframe/skyframe.ejs', renderOption, function(err, str) {
          if (err) {
            console.log("模块" + n + "入口文件报错");
            console.log(err);
          }
          return ctx.response.body = str;
        });
      });
      //各个子模块路由
      router.get("/" + n + "/:service", function(ctx, next) {
        var host = ctx.headers['host']; 
        var params = "";
        if (ctx.request.query) {
          params = JSON.stringify(ctx.request.query);
        }
        var service = ctx.params.service;
        let token = jwt.sign({ engine: n }, secret, {
          'expiresIn': 30 // 设置过期时间，单位是秒
        });
        let renderOption = getDeployOption("/"+service,filepath,token);

        //判断模块是否开启了socketio，如果没开启，就不能靠socket来声明实例了
        //所以要提前声明实例并存放在session中
        if(renderOption.token===null){ 
          let mdlService = require(filepath + '/src/'+renderOption.server);
          ctx.session._engine_svc = new mdlService();
        }

        renderOption.host = host; 
        renderOption.params = params;
        renderOption.engine = n;
        ejs.renderFile(root_path + '/lifekit/web/skyframe/skyframe.ejs', renderOption, function(err, str) {
          if (err) {
            console.log("模块" + n + "/" + service + "入口文件报错");
            console.log(err);
          }
          return ctx.response.body = str;
        });
      });

      //模块交互路由
      router.post('/' + n + '/getView', async function(ctx, next) {
        let svc = null;
        let service = ctx.request.body.service;
        let option = getDeployOption("/"+service,filepath);  
        if(option.token){ //判断模块是否开启了socketio
          ctx.request.body.engine = n;
          svc = netclient.getService(ctx); 
        }else{ 
          svc = ctx.session._engine_svc;
        } 
        if (svc) {
          var method = ctx.request.body.method;
          var parms = ctx.request.body.parms;
          if (method === "getEjs") {
            return ctx.render(parms, {});
          } else {
            if (method === "init" && !svc["init"]) { 
              let index = option.index; 
              if(!index){
                index = n + "/web/index.ejs";
              }
              return ctx.render(index, {});
            } else {
              try {
                await svc[method](ctx, parms);
              } catch (error) {
                ejs.renderFile(root_path + '/lifekit/web/skyframe/error.ejs', {
                  message: "服务器错误："+error
                }, function(err, str) {
                  if (err) {
                    console.log(err);
                  }
                  return ctx.response.body = str;
                });
              }
            }
          }
        } else {
          ejs.renderFile(root_path + '/lifekit/web/skyframe/error.ejs', {
            message: "非法访问"
          }, function(err, str) {
            if (err) {
              console.log(err);
            }
            return ctx.response.body = str;
          });
        }
      });
      console.log("模块'" + n + "'装载完成..");
    }
  });
  app.use(router.routes(), router.allowedMethods());
  console.log("所有模块装载完成...");
}

function isOpenSocketIo(key,filepath){
  try {
    let deploy = require(filepath + "/deploy.js")[key];
    let res = deploy[key].socketio;
    return res===false?res:true;
  } catch (error) {
    return true;
  }
}

function getDefaultPage(key,filepath){
  try {
    let deploy = require(filepath + "/deploy.js")[key];
    return deploy[key].index;
  } catch (error) {
    return null;
  }
}

function getDeployOption(key,filepath,token){
  var packageJson = null;
  var deploy = null; 
  var renderOption = { 
    'server': 'service',
    'method': 'init', 
    'header': '',
    'token': token
  }; 
  try{
    //这个文件不一定存在
    deploy = require(filepath + "/deploy.js")[key]; 
    renderOption.title = deploy.title||"";
    if(deploy.socketio===false){
      renderOption.token = null;
    }
    //页面加载的时候，会自动嵌入页面的header中
    if(deploy.header){
      renderOption.header = root_path + '/engine/'+deploy.header;
    }
    //指定自定义的后台js文件
    if(deploy.service){
      renderOption.server = deploy.service.replace(".js","");
      renderOption.method = deploy.method?deploy.method:"init";
    }else{
      //如果没指定service，则走默认的service.js文件，路由指向service.js里的方法
      let method = key.replace('/',"");
      renderOption.method = method?method:"init";
    }
    if(deploy.index){
      renderOption.index = deploy.index;
    }
  }catch(e){  
    try{
      packageJson = require(filepath + "/package.json");
      renderOption.title = packageJson.description; 
      let method = key.replace('/',"");
      renderOption.method = method?method:"init";
    }catch(e){
      console.warn("模块"+n+"缺失package.json文件");
    }
  }
  return renderOption;
}
module.exports = authroute;