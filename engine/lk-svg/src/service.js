

function service(net){
  net.data.msg = Date.now();
  // setInterval(function(){
  //   net.data.msg = Date.now();
  // },1000)
}

module.exports = service;