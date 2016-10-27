var mysql = require('mysql');
mysql.createConnection({multipleStatements: true});
function dbHelper(dbname,server,port,uid,pwd){
	this.DataBase = dbname;
	this.Server = server;
	this.Port = port;
	this.UID = uid;
	this.Password = pwd;
    //multipleStatements 开启执行多条sql功能
    var env = {connectionLimit : 3, host : this.Server,port:this.Port, user : this.UID, password : this.Password, database : this.DataBase,multipleStatements:true};
    var pool = mysql.createPool(env);
    pool.on('connection', function(connection) {

    });

    this.execNonQuery = function (sql, callback){
        pool.getConnection(function (err, connection){
            connection.query(sql, function (err, rows) {
                try{
                    connection.release();
                    callback(err,rows);
                }catch (ex) {
                    callback(ex,null);
                }

            });
        });
    };

    this.execDataSet = function (sql, callback){
        pool.getConnection(function (err, connection){
            connection.query(sql, function (err, rows){
                try {
                    connection.release();
                    callback(err, rows);
                }catch (ex) {
                    callback(ex,null);
                }
            });
        });
    };

    /**
     * 同步执行 (会产生阻塞，但是按顺序遍历)
     * @param items 要遍历的数组
     * @param func 有回调的业务逻辑函数，此函数会传入三个参数
     *         i:当前位置，item: items[i] , next:执行下一条
     * @param callback  遍历完数组之后执行的函数逻辑
     */
    this.syncEach = function(items,func, callback){
        var i, next;
        i = -1;
        next = function() {
            if (++i >= items.length) {
                callback(items);
            }else{
                var item = items[i];
                func(i,item,next);
            }
        };
        next();
    };

    /**
     * 异步执行 （不会产生阻塞，但是会产生不按顺序遍历执行回调产生的逻辑混乱）
     * @param items 要遍历的数组
     * @param func 有回调的业务逻辑函数，此函数会传入三个参数
     *         i:当前位置，item: items[i] , flag:回调判断函数，当所有item的回调都执行完则调用callback
     * @param callback 遍历完数组之后执行的函数逻辑
     */
    this.asynEach = function(items,func, callback){
        var x,flag;
        x = 0;
        flag = function(){
            x++;
            if(x==items.length){
                callback(items);
            }
        };
        for(var i = 0;i<items.length;i++){
            var item = items[i];
            func(i,item,flag);
        }
        if(items.length==0){
            callback(items);
        }
    };

}
module.exports = dbHelper;