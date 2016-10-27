/**
 * Created by zhy on 16/3/27.
 */
/**
 * sql语句初始化方法.created by sxw.2015/5/26
 * 加载相关模块时，初始化模块用到的sql语句
 */
function SqlParser() {

    var Map = require('./map');
    var Property = require('./property');


    /***
     * 根据表名称查询数据库所有数据
     * @param tablename
     * @returns ""
     */
    this.queryAll = function(tablename){
        return "SELECT * FROM "+tablename;
    };

    /***
     * 根据主键查询数据
     * @param tablename 表名称
     * @param key  主键
     * @param key_value  主键的值
     * @returns {*}
     */
    this.queryWithKey = function(tablename,key,key_value){
        return this.queryWithColumn(tablename,key,key_value);
    };

    /***
     * 根据表的某个字段查询值
     * @param tablename 表名称
     * @param column 字段名称
     * @param column_value 字段的值
     * @returns {*}
     */
    this.queryWithColumn = function(tablename,column,column_value){
        var where = column+'="'+column_value+'"';
        return getQuerySqldata(tablename,where);
    };

    /***
     * 根据多个字段组成的json对象查询符合条件的数据
     * @param tablename 表名称
     * @param columnobj 形如 ｛'name':'小明','age':18｝这样的json，表示查询出这个表中 name='小明' and age=18  的所有数据
     * @returns {*}
     */
    this.queryWithColumns = function(tablename,columnobj){
        var where = "";
        var i = 0;
        for(var key in columnobj){
            if(i==0){
                where = where + key + '="' + columnobj[key]+'"';
            } else {
                where = where + ' AND ' + key + '="' + columnobj[key]+'"';
            }
            i++;
        }
        return getQuerySqldata(tablename,where);
    };

    this.queryWithWhere = function(tablename,where){
        return getQuerySqldata(tablename,where);
    };

    /**
     * 根据表名称插入单行数据
     * @param tablename 表名称
     * @param values 行数据，是一个数组，每一个元素对应表的同位置字段的值
     * @returns {string} insert into tablename values(value1,value2...)
     */
    this.insertRow = function(tablename,values){
        var sql = 'INSERT INTO ' + tablename + ' VALUES (';
        for(var i=0;i<values.length;i++){
            if(i==0){
                sql = sql + '"'+values[i]+'"';
            }else{
                sql = sql + ',"' + values[i]+'"';
            }
        }
        sql = sql + ')';
        return sql;
    };

    /***
     * 根据表名称按字段插入一行数据
     * @param tablename 表名称
     * @param columns 字段名称，是一个数组，里面的元素是字符串，对应表里有的字段
     * @param values 字段值，是一个数组，对应columns里面的字段，一一对应
     * @returns {string} insert into tablename (column1,column2,...) values (value1,value2,...)
     */
    this.insertColumnForArray = function(tablename,columns,values){
        var sql = 'INSERT INTO ' + tablename + ' (';
        for(var i=0;i<columns.length;i++){
            if(i==0){
                sql = sql + '"'+columns[i]+'"';
            }else{
                sql = sql + ',"' + columns[i]+'"';
            }
        }
        sql = sql + ') VALUES (';
        for(var i=0;i<values.length;i++){
            if(i==0){
                sql = sql + '"'+values[i]+'"';
            }else{
                sql = sql + ',"' + values[i]+'"';
            }
        }
        sql = sql + ')';
        return sql;
    };

    /***
     * 根据表名称插入数据
     * @param tablename 表名称
     * @param columnsobj 要插入数据的字段-值的对象 ｛name:'小明' ,'age':18,....｝
     * @returns {string} insert into tablename (column1,column2,...) values (value1,value2,...)
     */
    this.insertColumnForJson = function(tablename,columnsobj){
        var column = '';
        var value = '';
        for(var obj in columnsobj){
            if(column==''){
                column = obj;
                value = '"'+columnsobj[obj]+'"';
            }else{
                column = column + ',' + obj;
                value = value + ',"' + columnsobj[obj]+'"';
            }
        }
        var sql = 'INSERT INTO ' + tablename + ' (' + column + ') VALUES (' + value + ')';
        return sql;
    };

    /***
     * 根据表名称和主键更新字段
     * @param tablename
     * @param setcolumns
     * @param setvalues
     * @param key
     * @param key_value
     */
    this.updateObjForKey = function(tablename,setobjs,key,key_value){
        var obj = new Object();
        obj[key] = key_value;
        return this.updateForJson(tablename,setobjs,obj);
    };

    /**
     * 根据表名称和主键更新字段
     * @param tablename
     * @param setcolumns
     * @param setvalues
     * @param key
     * @param key_value
     * @returns {string}
     */
    this.updateArrayForKey = function(tablename,setcolumns,setvalues,key,key_value){
        var keys = [key];
        var values = [key_value];
        return this.updateForArray(tablename,setcolumns,setvalues,keys,values);
    };

    /**
     * 根据表名称更新对应表的字段信息
     * @param tablename 表名称
     * @param setcolumns 要更新的字段名称数组
     * @param setvalues 要更新的字段的值的数组
     * @param wherecolumns 过滤条件的字段名称数组
     * @param wherevalues 过滤条件的字段的值的数组
     * @returns {string} update tablename set a=1,b=2 where c=1 AND d=2
     */
    this.updateForArray = function(tablename,setcolumns,setvalues,wherecolumns,wherevalues){
        var setStr = '';
        var whereStr = '';
        for(var i=0;i<setcolumns.length;i++){
            if(setStr==''){
                setStr = setcolumns[i] + '="' + setvalues[i]+'"';
            }else{
                setStr = setStr + ',' + setcolumns[i] + '="' + setvalues[i]+'"';
            }
        }
        for(var i=0;i<wherecolumns.length;i++){
            if(whereStr==''){
                whereStr = wherecolumns[i] + '="' + wherevalues[i]+'"';
            }else{
                whereStr = whereStr + ' AND ' + wherecolumns[i] + '="' + wherevalues[i]+'"';
            }
        }
        var sql = 'UPDATE ' + tablename + ' SET ' + setStr + ' WHERE ' + whereStr;
        return sql;
    };

    /**
     * 根据表名称更新对应表的字段信息
     * @param tablename 表名称
     * @param setobjs 要更新的字段-值的json {a:1,b:2,...}
     * @param whereobjs 过滤条件的字段-值的json {c:1,d:2,...}
     * @returns {string} update tablename set a=1,b=2 where c=1 and d=2
     */
    this.updateForJson = function(tablename,setobjs,whereobjs){
        var setStr = '';
        var whereStr = '';
        for(var str in setobjs){
            if(setStr==''){
                setStr = str + '="' + setobjs[str]+'"';
            }else{
                setStr = setStr + ',' + str + '="' + setobjs[str] + '"';
            }
        }
        for(var str in whereobjs){
            if(whereStr==''){
                whereStr = str + '="' + whereobjs[str]+'"';
            }else{
                whereStr = whereStr + ' AND ' + str + '="' + whereobjs[str]+'"';
            }
        }
        var sql = 'UPDATE ' + tablename + ' SET ' + setStr + ' WHERE ' + whereStr;
        return sql;
    };

    /**
     * 根据表名称和字段删除指定行
     * @param tablename
     * @param column
     * @param column_value
     * @returns {*}
     */
    this.delete = function(tablename,column,column_value){
        var where = column+'="'+column_value+'"';
        return getDeleteSqldata(tablename,where);
    };

    /**
     * 根据表名称和主键删除行
     * @param tablename
     * @param key
     * @param key_value
     * @returns {*} delete from tablename where key=key_value
     */
    this.deleteForKey = function(tablename,key,key_value){
        return this.delete(tablename,key,key_value);
    };

    /**
     * 根据表名和字段数组删除指定数据
     * @param tablename 表名称
     * @param keys 字段数组
     * @param key_values 数组值
     * @returns {*} delete from tablename where key1=key_values1 and key2=key_values2 and ...
     */
    this.deleteForArray = function(tablename,keys,key_values){
        var where = '';
        for(var i=0;i<keys.length;i++){
            if(where==''){
                where = keys[i] + '="' + key_values[i]+'"';
            }else{
                where = where + ' AND ' + keys[i] + '="' + key_values[i]+'"';
            }
        }
        return getDeleteSqldata(tablename,where);
    };

    /**
     * 根据表名和字段对象删除指定数据
     * @param tablename 表名称
     * @param columnObjs 字段对象 {a:1,b:2,c:3,...}
     * @returns {*} delete from tablename where a=1 and b=2 and c=3
     */
    this.deleteForJson = function(tablename,columnObjs){
        var where = '';
        for(var obj in columnObjs){
            if(where==''){
                where = obj + '="' + columnObjs[obj]+'"';
            }else{
                where = where + ' AND ' + obj + '="' + columnObjs[obj]+'"';
            }
        }
        return getDeleteSqldata(tablename,where);
    };

    /**
     * 删除表的所有数据
     * @param tablename
     * @returns {string} delete from tablename
     */
    this.deleteAll = function(tablename){
        return "DELETE FROM "+tablename;
    };

    //获取查询语句的公共部分
    function getQuerySqldata(tablename,where){
        return "SELECT * FROM "+tablename+" WHERE "+where;
    }

    //获取删除语句的公共部分
    function getDeleteSqldata(tablename,where){
        return "DELETE FROM "+tablename+" WHERE "+where;
    }

    /**
     * 将模块对应的sql文件初始化到内存中
     * @param path
     * @param filename
     */
    this.loadSqlFile = function (path,callback) {
        var fs = require('fs');
        var DOMParser = require(node_modules + "/xmldom").DOMParser;
        var xpath = require('xpath');
        fs.readFile(path, 'utf8',function(err,data){
            if (err){
                callback(err);
            }else{
                var pSqls = new Property();
                var xmlDoc = new DOMParser().parseFromString(data);
                var items = xpath.select("//Sql", xmlDoc);
                for (var i = 0; i < items.length; i++){
                    var id = items[i].getAttribute('id');
                    if(id){
                        var sqlId = id;
                        var action = items[i].getAttribute('action');
                        var database = items[i].getAttribute('database');
                        var dbtype = items[i].getAttribute('dbtype');
                        var desc = items[i].getAttribute('desc');

                        pSqls.put(sqlId,'action',action);
                        pSqls.put(sqlId,'database',database);
                        pSqls.put(sqlId,'dbtype',dbtype);
                        pSqls.put(sqlId,'desc',desc);
                        pSqls.put(sqlId,'sql',items[i].textContent);
                    }
                }
                callback(pSqls);
            }
        });
    };

    this.getSql = function(sqlProperty,sqlId, mapkeys, parms) {
        return getSqlStr(sqlProperty, sqlId, mapkeys, parms);
    };

    function getSqlStr(sqlProperty, sqlId, mapkeys, parms){
        var res;
        if(sqlProperty && sqlProperty.size() > 0) {
            var objSql = sqlProperty.get(sqlId);
            var sql = objSql.get('sql');
            var database = objSql.get('database');
            var dbtype = objSql.get('dbtype');
            var action = objSql.get('action');

            if(mapkeys == null) {
                mapkeys = new Map();
            }
            mapkeys.put('database', database);
            var tempKeys = mapkeys.keys();
            for(var i = 0; i < tempKeys.length; i++) {
                var key = tempKeys[i];
                var val = mapkeys.get(key);
                if(val == "@") {
                    var reg=new RegExp("\'\#\{" + key + "\}'","g");
                    var reg2=new RegExp("\#\{" + key + "\}","g");
                    sql = sql.replace(reg, val);
                    sql = sql.replace(reg2, val);
                }else {
                    var reg=new RegExp("\#\{" + key + "\}","g");
                    sql = sql.replace(reg, val);
                }
            }

            if(parms != null) {
                for(var j = 0; j < parms.length; j++) {
                    var sparm = parms[j]==null?"":parms[j];
                    sql = sqlReplaceParm(sql, sparm);
                }
            }

            sql = sql.replace(/\？/g, '?');
            res = sql;
        }else {
            console.log("sqlInit.getSql：" + sqlId + "对应的sql语句未找到");
            res = null;
        }
        return res;
    }

    function sqlReplaceParm(sql, parm) {
        var s = sql;
        if(parm == null || parm == "") {    //替换空条件为1=1
            var last = s.indexOf("?");
            if(last > -1) {
                var first = s.substring(0, last+1).lastIndexOf(" ");
                if(first > -1) {
                    var temp1 = s.substring(0, first + 1);
                    if(temp1.substring(temp1.lastIndexOf('like')).trim() == "like" || temp1.substring(temp1.lastIndexOf('LIKE')).trim() == "LIKE") {
                        temp1 = temp1.trim();
                        temp1 = temp1.substring(0, temp1.length-4).trim();
                        first = temp1.lastIndexOf(" ");
                        temp1 = temp1.substring(0, first+1);
                    }
                    var temp2 = s.substring(last + 2);

                    while(temp2.indexOf(" ") != 0 && temp2.indexOf(")") != 0) {
                        if(temp2 == "") {
                            break;
                        }
                        temp2 = temp2.substring(1,temp2.length);
                    }
                    s = temp1 + " 1=1 " + temp2;
                }

            }
        }else {
            s = s.replace(/\?/, parm);
        }
        return s;
    }
}
module.exports = SqlParser;