var ClickHouse = require('@apla/clickhouse'); 

module.exports = function() {

  this.getConnect = async function(ctx,param){ 
    try {
      if(!ctx.session.clickhouse){
        ctx.session.clickhouse = new ClickHouse({
          host: param.host,
          port: param.port,
          debug: false
        }); 
        ctx.session.connOption = {
          host: param.host,
          port: param.port,
          debug: false
        }
      }
      let ch = ctx.session.clickhouse;
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

  //选择数据库
  this.choseDB = async function(ctx,param){
    try {
      let ch;
      if(ctx.session.connOption.queryOptions
        &&ctx.session.connOption.queryOption.database
        &&ctx.session.connOption.queryOptions.database===param){
        ch = ctx.session.clickhouse;
      }else{
        ctx.session.connOption.queryOptions = {database: param};
        ch = new ClickHouse (ctx.session.connOption);
        ctx.session.clickhouse = ch;
      } 
      let rows = await ch.querying("show tables",{syncParser: true});  
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

  this.query = async function(ctx,sql){
    try {
      let ch = ctx.session.clickhouse;
      let rows = await ch.querying(sql,{syncParser: true});   
      let resdata = {
        columns:[],
        rows:[]
      };
      let meta = rows.meta;
      let data = rows.data; 

      for(let j=0;j<meta.length;j++){ 
        resdata.columns.push(meta[j].name); 
      } 
      for(let i=0;i<data.length;i++){
        let obj = {};
        for(let j=0;j<meta.length;j++){ 
          obj[meta[j].name] = data[i][j]; 
        }
        resdata.rows.push(obj);
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