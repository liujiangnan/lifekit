var ClickHouse = require('@apla/clickhouse'); 

var ch = new ClickHouse({
  host: 'localhost',
  port: 8123,
  debug: false
});

module.exports = function() {

  this.query = async function(param,callback){ 
    var query = 'select * from funtest';
    let rows = await ch.querying(query,{syncParser: true}); 
    console.log(rows); 
  }

  this.update = async function(param,callback){ 
      var query = 'update funtest set name="小明" where id=3';
      let rows = await ch.querying(query,{syncParser: true}); 
      console.log(rows);  
  }

  this.createDB = async function(){
    var query = 'CREATE DATABASE mydb';
    let res = await ch.querying(query);  
    console.log(res);
  }

  this.createTable = async function(){
    var query = 'CREATE TABLE mydb.PERSON (a UInt8) ENGINE = Memory';  
    let res = await ch.querying(query); 
    console.log(res); 
  }

}