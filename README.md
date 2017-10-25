# LifeKit

物联网应用模块的最小化平台支撑(基于KOA实现)

# 1 概要说明

本组件意在实现为最小化的物联网应用模块提供容器,并提供简单易用的网络交互方式与高性能的实时数据更新<br>

# 2 方法及使用

## (1)  skyframe

说明:窗体,我们将符合物联网平台规范的应用模块包含于独立的窗体,这个窗体提供最大化/最小化/关闭/重叠/透明/拖拽等常用功能

使用:

```javascript

    var frame = new skyframe(); //获取对象
    frame.init({ //初始化
        id:"headFrame",
        container:$("#headDiv"),
        engine:"login"
    });

```

其中:init方法接受一个option参数,配置如下:

```javascript
    var option = {
        id:"",  //为窗体设置一个ID
        container:$("body"),  //设置窗体的容器(jquery对象)
        engine:"",  //指定模块(规定:每个模块名称在项目中唯一) 
        closeable:false,  //设置窗体是否可关闭,默认为false
        maximizeable:false,  //设置窗体是否可最大化,默认为false
        minimizeable:false,  //设置窗体是否可以最小化,默认为false
        moveable:false,  //设置窗体是否可以拖拽,默认为false
        resizeable:false  //设置窗体是否可以改变大小,默认为false(如果设置为true,则鼠标可以拖动边框来改变窗体大小并触发窗体的resize事件)
        
    }
```

公共方法:

```javascript
frame.flush();//刷新模块
```

```javascript
frame.bind(evname,callback); //绑定事件,支持click,close,max,min,move,reset事件
```


```javascript
frame.close(callback);  //关闭窗体
```

```javascript
frame.maximize(callback);  //最大化窗体
```

```javascript
frame.minimize(callback);  //最小化窗体
```

```javascript
frame.resetFrame(callback); //恢复最初的大小和位置
```

```javascript
/**
     * 移动到
     * @param top 绝对定位
     * @param left 绝对定位
     * @param callback 回调函数
     */
frame.moveTo(top,left,callback);  
```

```javascript
/**
     * 设置宽高
     * @param width 宽度
     * @param height 高度
     * @param callback 回调函数
     */
frame.chengeTo(width,height,callback); 
```

```javascript
frame.setStyle(key,style);  //设置窗口的样式
```

```javascript
frame.setStyleObj(obj);  //设置窗口的样式
```


## (2)  netclient

说明:通讯模块,对于每一个符合物联网平台规范的应用模块,前端页面都会有此内置 net 对象,此对象提供非常灵活的前后台交互方法与实时的数据推送功能等,同样的在server端有一个net的global对象与其配合使用

数据链(dataline):
netclient对象内置一个data属性,此属性具有前后台实时数据同步的能力,对此属性进行赋值或者修改等操作时,前后台都能够获取data的最新结果

例如,web端有如下操作:
```javascript
net.data.a={"name":"小明"};
```
则后台可以获取这个属性,代码如下:
```javascript
console.dir(net.data.a); //{"name":"小明"}

```
同理，后台也可以如上赋值被web端直接读取

公共方法:
on(eventname,callback):绑定侦听事件,对应服务器端的emit方法,这里需要注意call dataline  initserver  connect  disconnect这几个事件为内置事件,禁止侦听

web端写法

```javascript
net.on("myevent",function(data){
    console.dir(data);
});
```

这样当对应的服务端有如下代码执行时,将打印data数据

```javascript
var data = {a:12};
net.emit("myevent",data); //触发前台的myevent事件
```

emit(eventname,data,callback):触发服务器端绑定的事件,对应于服务器端的on方法,同样注意 call dataline initserver connect disconnect这几个事件为内置事件,禁止侦听

web端写法

```javascript
net.emit("testEmit",{a:1},function(res){
    console.dir(res);
});
```

这样当对应的服务端有如下代码时,则触发执行并触发前台的callback

```javascript
var data = {a:12};
//由前台的emit方法触发
net.on("testEmit",function(obj,callback){
    console.dir(obj);  //前台传过来的数据对象
    callback&callback(data);  //前台的callback会打印出{a:12}
}); 
```

call(funcname,data,callback):调用服务端的方法

web端写法

```javascript
net.call("test",{a:1},function(data){
    console.dir(data);
});
```

当对应的服务端有如下方法,将会执行并触发前台的callback

```javascript
this.test = function(data,callback){
    console.dir(data);
    callback&callback(1);  //前台将打印1
}
```

getAjaxURL();获取Ajax的路径给第三方的插件用,需要配合getAjaxData方法使用,才能正常发起一个Ajax请求

```javascript
var url = net.getAjaxURL();

```


getAjaxData(method,parms);由于后台过滤,发起Ajax必须要带一些参数,配合getAjaxURL才能正常的发起一个Ajax;method对应后台的方法名称,parms为传入后台的参数

```javascript
var data = net.getAjaxData("testmethod",parms);//这样 后台的testmethod方法就可以被ajax调用,并且穿过去parms参数供业务使用
```

getView(method, parms, callback):经对应的服务器端method得到ejs,注意:如果method等于getEjs的话,则parms参数必须为有效的ejs路径字符串,此种情况直接返回parms指定的模版

web端写法
```javascript
net.getView("testRender",'',function(res){
    $("body").html(res);
});
```

对应的服务器端写法

```javascript
this.testRender = async function(ctx,parms){
    console.dir(parms);
    return ctx.render("engine/example/web/sonejs/student.ejs",{});
}
```

getData(method, parms, callback):向后台请求获取数据,方法使用同getView相同,只是对应的后台写法res.render应改为res.body


我们可能是后台自启动的服务推送给前台数据,为了适应这样的场景,添加如下两个方法:

```javascript
/**
 * 根据服务名称获取所有已经开启的socketIO客户端信息
 * @param service
 * @returns [{"key":"socketid","value":{net:{},service:""}},{}......]
 */
var clients = net.getSockets(service);

```
getSockets方法会获得对应service的模块的所有打开着的客户端,返回一个形如[{"key":"socketid","value":{net:{},service:""}},{}......]的一个数组对象
通过遍历这个对象可以获取每一个net,然后就可以向指定的前台推送数据了

第二个方法如下:
```javascript
//获取所有的socket信息
var property = net.getAllSocket();
```
这个方法用一个特定的数据结构进行存储,结构如下:
```javascript
{
    service:[
        {"key":"socketid","value":{net:{},service:""}},
        {"key":"socketid","value":{net:{},service:""}},
        ...
    ],
    ...
}
```
它会获取所有的客户端,也就意味着它可以向其他任何一个模块推送数据,这将会增加模块的耦合,导致业务的混乱,增加代码的复杂度,增加维护难度.总之,不推荐使用


## (3)  数据联动

说明:借助于数据链(dataline),应用Vue.js使数据变动绑定到dom元素上，实现数据链对页面元素的实时控制，包括文本、样式、显示/隐藏、元素填充等

公共方法：
datachange(id,option);初始化数据绑定
示例：

例如存在如下HTML片段：

`<div id="realData">`

`<span>{{message}}</span>`
`<span v-bind:title="title">`

    绑定title属性
  `</span>`

`<p v-if="seen">显示与隐藏</p>`

`</div>` 

使用datachange方法初始化数据绑定，如下：

```javascript

var vue = net.datachange("realData"); //"realData"为需要数据绑定的元素ID，此方法返回一个Vue实例

```

当数据链(dataline)的message、title、seen属性值发生变动时，页面元素则同时发生变化(显示message的值、title属性被动态赋值、显示与隐藏)

比如:

    当net.data.message="hello world"时，页面`<span>{{message}}</span>`则相应的变为`<span>hello world</span>`
    当net.data.title = "测试标题"时，页面`<span v-bind:title="title">绑定title属性</span>`则相应的变为`<span v-bind:title="测试标题">绑定title属性</span>`
    当net.data.seen = true时，`<p v-if="seen">显示与隐藏</p>`会显示
    当net.data.seen = false时，`<p v-if="seen">显示与隐藏</p>`会隐藏掉

更多功能与效果请参见 Vue.js官网：https://cn.vuejs.org/

 

## (4)  规范

### (1) 所有独立业务模块必须放在 /engine 文件夹下；模块名称为文件夹名称，文件夹包含 src与web两个文件夹，src存放服务端代码，web存放页面、js、css、图片等前端静态文件，web下的文件都能够被浏览器直接访问到
    --src文件夹下必须包含service.js（必须叫这个名字）文件作为后台逻辑的统一入口,结构如下：
    --业务模块必须包含README.MD文件，说明模块的用途与注意事项等

service.js
```javascript

const jwt = require('jsonwebtoken');
function service(){ 
    //内置方法，实现此方法，则当模块调用时先执行此方法的逻辑
    this.init = function(ctx,parms){
        return ctx.render("engine/login/web/login/login.ejs",{});
    }

    //可被前台getView调用的方法
    //ctx为KOA2框架的上下文
    //parms为前台传送的参数
    this.login = async function(ctx,parms){
        var data = JSON.parse(parms); 
        const token = jwt.sign({user: data.username}, sysconfig.jwt.option.secret); 
        var res = {flag:"success",data:token};
        return ctx.body=JSON.stringify(res);
    }

}
module.exports = service;

```

### (2) 所有的后台模块必须发布成独立的nodejs模块，放在node_modules下，可使用npm install命令安装

### (3) 所有的前端模板必须放在其被引用的独立业务模块的web下,不允许多个独立业务模块公用一个前端模板，哪怕使用的模板一模一样

### (4) 以上规范对架构重构者或资深nodejs开发者无效

