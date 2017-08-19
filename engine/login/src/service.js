let sqlparser = require("lifekit-mysqlhelper").Sqlparser(); 
let db = sysconfig.db;
let conn = require("lifekit-mysqlhelper").dbhelper(db.dbname,db.server,db.port,db.uid,db.pwd);
var uuid = require("node-uuid");
const crypto = require('crypto');
 
function service(net){

    this.init = function(ctx){
        return ctx.render("engine/login/web/login/login.ejs",{});
    }

    this.login = async function(ctx,parms){
        let data = JSON.parse(parms);
        let username = data.username;
        let password = data.password;
        const hash = crypto.createHash('md5');
        hash.update(password);
        password = hash.digest('hex');
        let sql = sqlparser.queryWithColumns("LK_BASE_USER",{username:username,password:password});
        let rows = await conn.asyncExec(sql);  
        if(rows.length>0){
            ctx.session.user = rows[0];
            // const jwt = require('jsonwebtoken'); 
            // const token = jwt.sign({user: data.username}, sysconfig.jwt.option.secret);
            // var res = {flag:"success",data:token};
            var res = {flag:"success"};
            return ctx.body=JSON.stringify(res);
        }else{
            return ctx.body=JSON.stringify({flag:"fail"});
        } 
    }

    this.updateUser = function(ctx,parms){
        var user = ctx.session.user;
        if(user){
            return ctx.render("engine/login/web/update/index.ejs",user);
        }else{
            return ctx.redirect('/login');
        } 
    }

    this.update = async function(ctx,parms){
        var data = JSON.parse(parms); 
        var sql = sqlparser.updateForJson("LK_BASE_USER",data,{"USERNAME":data.USERNAME}); 
        try{
            await conn.asyncExec(sql);
            ctx.session.user.NAME = data.NAME;
            ctx.session.user.EMAIL = data.EMAIL;
            ctx.session.user.PHONE = data.PHONE;
            // const jwt = require('jsonwebtoken'); 
            // const token = jwt.sign({user: data.username}, sysconfig.jwt.option.secret);
            // var res = {flag:"success",data:token};
            var res = {flag:"success"};
            return ctx.body=JSON.stringify(res); 
        }catch(e){
            return ctx.body=JSON.stringify({flag:"false"}); 
        }
    }

    this.addUser = async function(ctx,parms){ 
        var data = JSON.parse(parms);
        data["GUID"] = uuid.v1();
        const hash = crypto.createHash('md5');
        hash.update(data["PASSWORD"]);
        data["PASSWORD"] = hash.digest('hex');
        var sql = sqlparser.insertColumnForJson("LK_BASE_USER",data); 
        try{
            await conn.asyncExec(sql);
            ctx.session.user = data;
            // const jwt = require('jsonwebtoken'); 
            // const token = jwt.sign({user: data.username}, sysconfig.jwt.option.secret);
            // var res = {flag:"success",data:token};
            var res = {flag:"success"};
            return ctx.body=JSON.stringify(res); 
        }catch(e){
            return ctx.body=JSON.stringify({flag:"false"}); 
        }
       
    };

    //检查用户名是否存在
    this.checkUser = async function(ctx,parms){
        var sql = sqlparser.queryWithWhere("LK_BASE_USER","username='"+parms+"'");
        try{
            var rows = await conn.asyncExec(sql);
            if(rows.length>0){ 
                return ctx.body = JSON.stringify({'valid':false});
            }else{ 
                return ctx.body = JSON.stringify({'valid':true});
            }
        }catch(e){
            console.error(e);
            return ctx.body = JSON.stringify({'valid':false});
        } 
    };

    //检查昵称是否存在
    this.checkNc = async function(ctx,parms){
        var sql = sqlparser.queryWithWhere("LK_BASE_USER","name='"+parms+"'");
        try{
            var rows = await conn.asyncExec(sql);
            if(rows.length>0){ 
                return ctx.body = JSON.stringify({'valid':false});
            }else{ 
                return ctx.body = JSON.stringify({'valid':true});
            }
        }catch(e){
            console.error(e);
            return ctx.body = JSON.stringify({'valid':false});
        }  
    }; 

}
module.exports = service;