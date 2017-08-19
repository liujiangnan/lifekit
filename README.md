# koa-lifekit

物联网应用模块的最小化平台支撑(基于KOA实现)

# 1 概要说明

本平台意在实现为最小化的物联网应用模块提供容器,并提供简单易用的网络交互方式与高性能的实时数据更新<br>

# 2 使用 
    * 依赖环境：>=nodejs 7.0.0
    * 下载源码到本地，CMD进入文件夹
    * npm install
    * node app.js
    
# 3 第一次

1、在 /engine 下新建一个模块(文件夹) example，然后在example里新建 src 和 web 两个文件夹

2、在新建的src文件夹下新建service.js文件，编写内容如下：

```javascript

function service(net){ 
    net.data.message = "hello world!!";
}
module.exports = service;

```

3、在新建的web文件夹下新建index.ejs,编写内容如下：

`<div id="realData">`
    `<h1>{{message}}</h1>`
`</div>`
 
`<script> `

    var vue = net.datachange("realData");
`</script>`

4、在根目录打开CMD，输入 node app.js 命令来启动微服务

5、打开浏览器，输入http://localhost:8800/example 查看效果

# 4 更多功能与方法请查看iotlib/README.MD