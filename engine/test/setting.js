/**
 * 更改模块的默认行为配置
 * 对象形式 {'模块路由':{配置项:值}}
 */
module.exports = { 
  '/kgtest':{
    // 是否开启长连接，默认是开启的
    socketio:false,  
    header:'/test/web/header.ejs',
    title:'51talk资源组件测试' 
  }

}