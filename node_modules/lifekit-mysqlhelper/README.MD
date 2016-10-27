#mysql数据库帮助类

在mysql基础上的一层封装类，对于简单的数据库操作（单表增删改查、sql文件）提供简便的方法

#方法及使用

## Sqlparser工具类

说明：主要用于sql的拼接，可以根据传入某些特定参数拼接出一条完整的sql,并且提供了加载sql.xml文件并取出对应配置的sql的功能

方法：

(1)、初始化工具类

```javascript
    
    var sqlparser = require("mysqlhelper").Sqlparser;
```

(2)、根据表名称查询数据库所有数据

```javascript

    var sql = sqlparser.queryAll("tablename");
    //=>select * from tablename
```

(3)、根据主键查询数据

```javascript

    var sql = sqlparser.queryWithKey("tablename","GUID_","g0001");
    //=>select * from tablename where GUID_='g0001'
```

(4)、根据表的某个字段查询值

```javascript

    var sql = sqlparser.queryWithColumn("tablename","NAME","小杰");
    //=>select * from tablename where NAME='小杰'
```

(5)、根据多个字段组成的json对象查询符合条件的数据

```javascript

    var columnobj = {'name':'小杰','age':18};
    var sql = sqlparser.queryWithColumns("tablename",columnobj);
    //=>select * from tablename where name='小杰' and age='18'
```

(6)、根据一个字符串组成的where条件查询符合条件的数据

```javascript

    var where = "name='小杰' and age='18'";
    var sql = sqlparser.queryWithWhere("tablename",where);
    //=>select * from tablename where name='小杰' and age='18'
```

(7)、根据表名称插入单行数据

```javascript

    var arr = ["G0001","小杰",18];
    var sql = sqlparser.insertRow("tablename",arr);
    //=>insert into tablename values('G0001','小杰','18');
```

(8)、根据表名称按字段插入一行数据

```javascript

    var columns = ["GUID","NAME","AGE"];
    var values = ["G0001","小杰",18];
    var sql = sqlparser.insertColumnForArray("tablename",columns,values);
    //=>insert into tablename (GUID,NAME,AGE) values ("G0001","小杰",18)
```

(9)、根据表名称按json对象插入数据

```javascript

    var json = {"GUID":"G0001","NAME":"小杰","AGE":18};
    var sql = sqlparser.insertColumnForJson(tablename,json);
    //=>insert into tablename (GUID,NAME,AGE) values ("G0001","小杰",18)
```

(10)、根据表名称和主键更新字段

```javascript

    var setobjs = {"NAME":"小杰","AGE":18};
    var sql = sqlparser.updateObjForKey("tablename",setobjs,"GUID","G0001");
    //=>update tablename set NAME='小杰',AGE=18 where GUID='G0001'
```

(11)、根据表名称和主键更新字段

```javascript

    var setcolumns=["AGE","SEX"];
    var setvalues=[18,"男"];
    var sql = sqlparser.updateArrayForKey("tablename",setcolumns,setvalues,"NAME","小杰");
    //=>update tablename set AGE='18',SEX='男' where NAME='小杰'
```

(12)、根据表名称与字段数组更新对应表的字段信息

```javascript

    var setcolumns = ["AGE","SEX"];
    var setvalues = [18,"男"];
    var wherecolumns = ["GUID","NAME"];
    var wherevalues = ["G00001","小杰"];
    var sql = sqlparser.updateForArray("tablename",setcolumns,setvalues,wherecolumns,wherevalues);
    //=>update tablename set AGE='18',SEX='男' where GUID='G00001' and NAME='小杰'
```

(13)、根据表名称与字段对象更新对应表的字段信息

```javascript

    var setobjs = {"AGE":18,"SEX":"男"};
    var whereobjs = {"GUID":"G00001","NAME":"小杰"};
    var sql = sqlparser.updateForJson("tablename",setobjs,whereobjs);
    //=>update tablename set AGE='18',SEX='男' where GUID='G00001' and NAME='小杰'
```

(14)、根据表名称和字段删除指定行

```javascript

    var sql = sqlparser.delete("tablename","NAME","小杰");
    //=>delete from tablename where NAME='小杰'
```

(15)、根据表名称和主键删除行

```javascript

    var sql = sqlparser.deleteForKey("tablename","GUID","G00001");
    //=>delete from tablename where GUID='G00001'
```

(16)、根据表名和字段数组删除指定数据

```javascript

    var keys=["GUID","NAME"];
    var key_values = ["G00001","小杰"];
    var sql = sqlparser.deleteForArray("tablename",keys,key_values);
    //=>delete from tablename where GUID='G00001' and NAME='小杰'
```

(17)、根据表名和字段对象删除指定数据

```javascript

    var columnObjs = {"GUID":"G00001","NAME":"小杰"};
    var sql = sqlparser.deleteForJson("tablename",columnObjs);
    //=>delete from tablename where GUID='G00001' and NAME='小杰'
```

(18)、删除表的所有数据

```javascript

    var sql = sqlparser.deleteAll("tablename");
    //=>delete from tablename
```

(19)、加载数据文件，根据sqlId取出对应的sql(这里需要注意，这个方法是异步方法，区别于原物联网平台)

```javascript

    sqlparser.loadSqlFile(__filename,function(sqlProperty){
        var sqlId='C60B9A90B8154AF3863C7E2CCED0FF68', 
        mapkeys = new map(), 
        parms = [];
        var sql = sqlparser.getSql(sqlProperty,sqlId,mapkeys,parms);
    });
     
```

对应的xml文件同原物联网平台相同,例子：

```xml

    <?xml version="1.0" encoding="UTF-8"?>
    <!-- 报表管理模块对应sql -->
    <!-- action(操作类别):SELECT\INSERT\UPDATE\DELETE -->
    <!-- database(数据库级别):SYSTEM(主数据库)\PROJECT(从数据库) -->
    
    
    <!-- dbtype(数据库类别):ORACLE\MYSQL\SQLSERVER -->
    <Sqls>
        <Sql id="0F3812D6-5A57-495D-9560-B60CC358AC83" action="SELECT" database="SYSTEM" dbtype="MYSQL" desc="获取区域下对应的站点">
            <![CDATA[SELECT GUID_, NAME_, CODE_, REF_CODE FROM #{database}.TB_BASE_STATION WHERE PORTAL_ID='?' AND AREA_CODE LIKE '?%' AND CODE_='?']]>
        </Sql>
    </Sqls>
```

##dbhelper工具类

说明：主要提供执行SQL的方法,自行管理数据库连接,此类提供一个全局变量dbhelper

方法：

(1)、初始化工具类

```javascript
    
    require("mysqlhelper").dbhelper("iot","192.168.1.212",3306,"iot","iot");
```

初始化之后就会有一个全局变量global.dbhelper产生

(2)、根据传入的sql查询结果集

```javascript
    
    var sql = "select * from table";
    global.dbhelper.execDataSet(sql,function(err,rows){
        
    });
```

(3)、根据传入的sql操作数据库（增删改）

```javascript

    var sql = "update table set name='小杰' where guid='ga001'";
    global.dbhelper.execNonQuery(sql,function(err,rows){
        
    });
```