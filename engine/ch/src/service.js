var ClickHouse = require('clickhouse'); 

var ch = new ClickHouse({
  url: 'http://172.16.3.33',
  port: 8112,
  debug: false
});

module.exports = function() {

  this.connect = function(param,callback){
    console.log("****************");
    var query = 'select * from funtest';
    ch.query(query,function(err,rows){
      console.log(err);
      callback(rows);
    }); 
  }

}