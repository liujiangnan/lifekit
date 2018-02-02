
/**
 * 更改模块的默认行为配置
 * 对象形式 {'模块路由':{配置项:值}}
 */
module.exports = { 
  '/':{
    // //是否开启长连接，默认是开启的
    // socketio:false,  
    // //本模块个性化前端框架资源（css、js等），需要在header中引用，可以在此指定一个模板文件（ejs），
    // //页面加载的时候，会自动嵌入页面的header中
    // header:'',  
    // //指定自定义的后台js文件
    // //默认是src/service.js文件
    // service:'src/service.js',
    // //指定后台js对应的处理方法
    // //默认是init
    // //如果没有指定service,则method配置不生效，系统默认走service.js里与路由同名的方法
    // method:'getList',
    // //指定自定义的入口页面
    // //默认是web/index.ejs
    // index:'web/index.ejs',
    // //标题，就是网页的title
    // //默认情况是取package.json文件里的description
    // title:'',
  },

}