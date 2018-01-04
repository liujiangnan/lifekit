var ClickHouse = require('@apla/clickhouse'); 

module.exports = function() {

  this.getConnect = async function(ctx,param){ 
    try {
      let ch = new ClickHouse({
        host: param.host,
        port: param.port,
        debug: false
      });
      ctx.session.clickhouse = ch;
      let rows = await ch.querying("show databases",{syncParser: true}); 
      let resdata = [];
      let data = rows.data;
      for(let i=0;i<data.length;i++){
        resdata.push(data[i][0]);
      }
      ctx.body = { st:"success", msg:resdata };
    } catch (error) {
      ctx.body = { st:"error", msg:error };
    }
    
  }



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