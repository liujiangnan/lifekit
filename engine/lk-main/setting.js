/**
 * 更改模块的默认行为配置
 * 对象形式 {'模块路由':{配置项:值}}
 */
module.exports = { 
  '/':{
    // 是否开启长连接，默认是开启的
    socketio:false,  
    header:'/lk-main/web/header.ejs',
    title:'首页' 
  },
  '/operation': {
    // 是否开启长连接，默认是开启的
    socketio:false,
    //本模块个性化前端框架，需要在header中引用，可以在此指定一个模板，
    //页面加载的时候，会自动嵌入页面的header中
    header:'/lk-main/web/header.ejs',
    title:'首页配置',
    service:'service',
    method:'operation'
  }

}