/**
 * 应用程序入口 
 */

//设置常用目录,根目录及app.js所在目录
global.root_path = __dirname;
global.node_modules = __dirname + "/node_modules";

//扩展自定义属性及方法
require(__dirname + "/iotlib/src/common/common1");

//启动程序
var start = require(root_path+"/iotlib/src/init/start");
new start();
