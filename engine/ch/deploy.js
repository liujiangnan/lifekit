
/**
 * 更改模块的默认行为配置
 * 对象形式 {'模块路由':{配置项:值}}
 */
module.exports = { 
  '/':{
    //是否开启长连接，默认是开启的
    socketio:false,  
    //本模块个性化前端框架，需要在header中引用，可以在此指定一个模板，
    //页面加载的时候，会自动嵌入页面的header中
    header:'',  
    //指定自定义的后台js文件
    //默认是src/service.js文件
    service:'',
    //指定自定义的入口页面
    //默认是web/index.ejs
    index:'',
  },

}