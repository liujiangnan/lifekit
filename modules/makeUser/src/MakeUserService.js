/**
 * Created by zhy on 16/10/24.
 */

var sqlHelp = require("lifekit-mysqlhelper").Sqlparser();
var uuid = require("node-uuid");

function MakeUserService(){

    this.addUser = function(req,res,parms){
        var data = JSON.parse(parms);
        data["GUID"] = uuid.v1();
        var sql = sqlHelp.insertColumnForJson("LK_BASE_USER",data);
        global.dbhelper.execDataSet(sql,function(error,rows){
            if(error){
                console.log(error);
            }
            res.send(data["GUID"]);
        });

    };

    //检查用户名是否存在
    this.checkUser = function(req,res,parms){
        console.dir(parms);
        var sql = sqlHelp.queryWithWhere("LK_BASE_USER","username='"+parms+"'");
        global.dbhelper.execDataSet(sql,function(error,rows){
            if(error){
                console.log(error);
                var obj = {'valid':false};
                res.send(obj);
            }else if(rows.length>0){
                var obj = {'valid':false};
                res.send(obj);
            }else{
                var obj = {'valid':true};
                res.send(obj);
            }
        });
    };

    //检查昵称是否存在
    this.checkNc = function(req,res,parms){
        var sql = sqlHelp.queryWithWhere("LK_BASE_USER","name='"+parms+"'");
        global.dbhelper.execDataSet(sql,function(error,rows){
            if(error){
                console.log(error);
                var obj = {'valid':false};
                res.send(obj);
            }else if(rows.length>0){
                var obj = {'valid':false};
                res.send(obj);
            }else{
                var obj = {'valid':true};
                res.send(obj);
            }
        });
    };

};

module.exports = MakeUserService;