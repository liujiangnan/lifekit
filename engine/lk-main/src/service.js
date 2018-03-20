
let path = require('path');
let fs = require('fs');
let _ = require('lodash');

const engineRoot = ENGINE_PATH + '/lk-main';

const Sequelize = require('sequelize');
const datasource = require(engineRoot + '/src/config/datasource.json');
const sequelize = new Sequelize(
  datasource.database,
  datasource.username,
  datasource.password,
  datasource
);

let Home = sequelize.import(engineRoot + '/src/model/home.js');
let Menu = sequelize.import(engineRoot + '/src/model/menu.js');


sequelize.sync({ force: false }).then(function() {
  console.log("框架模块数据结构初始化成功");
}).catch(function(err) {
  console.log("框架模块数据结构初始化失败: %s", err);
});

function service() {

  this.operation = async function (ctx, parms) { 
    return ctx.render("lk-main/web/operation/main.ejs"); 
  }

  this.getHomeInfo = async function (ctx,parms){
    try {
      let homeInfo = await Home.findOne();  
      if(homeInfo){
        homeInfo = homeInfo.dataValues;
      }
      let menu = await Menu.findAll(); 
      let menuData = _.map(menu,function(item){
        let obj = item.dataValues;
        obj.edit = false;
        return obj;
      });
      return ctx.body = {code:200,msg:"查询成功",data:{home:{name:"ceshi"},menu:menu}};
    } catch (error) {
      return ctx.body = {code:-1,msg:"查询失败 error:"+error};
    }
  } 

  this.saveMenu = async function(ctx,parms){ 
    try {
      let res = null;
      if(parms.id){
        res = await Menu.update(parms,{id:parms.id});
        console.log("======更新=========");
      }else{
        res = await Menu.create(parms);
        res = res.dataValues;
        console.log("======创建=========");
      } 
      return ctx.body = {code:200,msg:"创建成功",data:res};
    } catch (error) {
      return ctx.body = {code:-1,msg:"菜单保存失败 error:"+error};
    } 
  }

  this.uploadLogo = async function(ctx,parms){ 
    try {
      let upfile = ctx.request.body.files.file;
      var newpath =path.join(ENGINE_PATH+'/lk-main/web/upload',upfile.name);  
      var stream = fs.createWriteStream(newpath);//创建一个可写流  
      fs.createReadStream(upfile.path).pipe(stream);//可读流通过管道写入可写流   
      ctx.body = {code:200,msg:"/lk-main/web/upload/"+upfile.name};
    } catch (error) {
      ctx.body = {code:500,msg:error};
    }
    
  }

}

module.exports = service;