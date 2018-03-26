const engineRoot = ENGINE_PATH+'/lifekit-login';

const crypto = require('crypto');
const Sequelize = require('sequelize');
const datasource = require(engineRoot+'/src/config/datasource.json');
const jumpUrl = require(engineRoot+'/src/config/jump.json');
const sequelize = new Sequelize(
  datasource.database,
  datasource.username,
  datasource.password,
  datasource);

let user = sequelize.import(engineRoot+'/src/model/user.js');

sequelize.sync({force: false}).then(function() {
    console.log("USER数据结构初始化成功");
}).catch(function(err){
    console.log("USER数据结构初始化失败: %s", err);
});

function service(net) {

  net.data.jumpUrl = jumpUrl;

  this.init = function(ctx) { 
    return ctx.render("lifekit-login/web/login/login.ejs", {});
  }

  this.register = function(ctx){
    return ctx.render("lifekit-login/web/register/index.ejs", {});
  }

  this.login = async function(ctx, parms) {
    let data = JSON.parse(parms);
    let username = data.username;
    let password = data.password;
    const hash = crypto.createHash('md5');
    hash.update(password);
    password = hash.digest('hex');

    try{
      let rows = await user.findAll({where:{username:username,password:password}});
      if (rows.length > 0) {
        ctx.session.user = rows[0]; 
        var res = { flag: "success" };
        return ctx.body = JSON.stringify(res);
      } else {
        return ctx.body = JSON.stringify({ flag: "fail" });
      }
    }catch(e){
      console.log(e);
      return ctx.body = JSON.stringify({ flag: "fail" });
    }
 
  }

  this.update = function(ctx, parms) {
    var loginUser = ctx.session.user;
    if (loginUser) {
      return ctx.render("lifekit-login/web/update/index.ejs", {user:loginUser});
    } else {
      return ctx.render('lifekit-login/web/update/back.ejs',{});
    }
  }

  this.updateUser = async function(ctx,parms) { 
    try {
      let data = JSON.parse(parms);
      let loginUser = ctx.session.user;
      loginUser.set("name",data.name);
      loginUser.set("email",data.email);
      loginUser.set("phone",data.phone); 
      ctx.session.user = await loginUser.save(); 
      var res = { flag: "success" };
      return ctx.body = JSON.stringify(res);
    } catch (e) {
      console.log(e);
      return ctx.body = JSON.stringify({ flag: "false" });
    }
  }

  this.addUser = async function(ctx, parms) {
    var data = JSON.parse(parms);
    const hash = crypto.createHash('md5');
    hash.update(data["password"]);
    data["password"] = hash.digest('hex');
    try {
      let row = await user.create(data);
      ctx.session.user = row; 
      var res = { flag: "success" };
      return ctx.body = JSON.stringify(res);
    } catch (e) {
      console.log(e);
      return ctx.body = JSON.stringify({ flag: "false" });
    } 
  };

  //检查用户名是否存在
  this.checkUser = async function(ctx, parms) { 
    try{
      let rows = await user.findAll({where:{username:parms}}); 
      if(rows.length>0){
        return ctx.body = JSON.stringify({ 'valid': false });
      }else{
        return ctx.body = JSON.stringify({ 'valid': true });
      }
    }catch (e) {
      console.error(e);
      return ctx.body = JSON.stringify({ 'valid': false });
    } 
  };

  //检查昵称是否存在
  this.checkNc = async function(ctx, parms) { 
    try {
      var rows = await user.findAll({where:{name:parms}});
      if (rows.length > 0) {
        return ctx.body = JSON.stringify({ 'valid': false });
      } else {
        return ctx.body = JSON.stringify({ 'valid': true });
      }
    } catch (e) {
      console.error(e);
      return ctx.body = JSON.stringify({ 'valid': false });
    }
  };

  //检查昵称是否被其他用户使用
  this.checkNcAgain = async function(ctx, parms) { 
    let id = ctx.session.user.get("id");
    try {
      var rows = await user.findAll({where:{name:parms,id:{$ne:id}}});
      if (rows.length > 0) {
        return ctx.body = JSON.stringify({ 'valid': false });
      } else {
        return ctx.body = JSON.stringify({ 'valid': true });
      }
    } catch (e) {
      console.error(e);
      return ctx.body = JSON.stringify({ 'valid': false });
    }
  };

}
module.exports = service;