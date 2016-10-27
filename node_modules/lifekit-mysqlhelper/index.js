var Sqlparser = require('./lib/SqlParser');

var dbhelper = require('./lib/dbHelper');

/**
 * 拼接sql的工具类
 * @returns {SqlParser}
 * @constructor
 */
exports.Sqlparser = function() {
    return new Sqlparser();
};

/**
 * 数据库连接
 * @param dbname 数据库名称
 * @param server ip
 * @param port 端口
 * @param uid 用户名
 * @param pwd 密码
 */
exports.dbhelper = function(dbname,server,port,uid,pwd) {
    if(!global.dbhelper){
        var db = new dbhelper(dbname,server,port,uid,pwd);
        global.dbhelper = db;
        return db;
    }else{
        return  global.dbhelper;
    }
};