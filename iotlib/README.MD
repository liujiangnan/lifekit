# IOT

物联网应用模块的最小化平台支撑

# 1 概要说明

本组件意在实现为最小化的物联网应用模块提供容器,并提供简单易用的网络交互方式与高性能的实时数据更新<br>

# 2 方法及使用

## (1)  skyframe

说明:窗体,我们将符合物联网平台规范的应用模块包含于独立的窗体,这个窗体提供最大化/最小化/关闭/重叠/透明/拖拽等常用功能

使用:

```javascript
    var frame = new skyframe(); //获取对象
    frame.init({  //初始化
        id:"testframe",
        container:$("body"),
        server:"modules/example/src/QiangPro",
        views:"modules/example/web/example.ejs",
        parms:'a=123&b=234'
    });
    
```

其中:init方法接受一个option参数,配置如下:

```javascript
    var option = {
        id:"",  //为窗体设置一个ID
        container:$("body"),  //设置窗体的容器(jquery对象)
        server:"",  //指定模块的后台服务(规定:每个模块只能有一个后台服务)
        views:"",  //指定模块的入口页面(规定:每个模块只能有一个入口页面)
        parms:'',  //地址传值的方式为模块传递其他参数
        closeable:false,  //设置窗体是否可关闭,默认为false
        maximizeable:false,  //设置窗体是否可最大化,默认为false
        minimizeable:false,  //设置窗体是否可以最小化,默认为false
        moveable:false,  //设置窗体是否可以拖拽,默认为false
        resizeable:false  //设置窗体是否可以改变大小,默认为false(如果设置为true,则鼠标可以拖动边框来改变窗体大小并触发窗体的resize事件)
        
    }
```

公共方法:

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
frame.moveTo(top,left,callback);  //关闭窗体
```

```javascript
/**
     * 设置宽高
     * @param width 宽度
     * @param height 高度
     * @param callback 回调函数
     */
frame.chengeTo(width,height,callback);  //关闭窗体
```

```javascript
frame.setStyle(key,style);  //设置窗口的样式
```

```javascript
frame.setStyleObj(obj);  //设置窗口的样式
```


## (2)  netclient

说明:通讯模块,对于每一个符合物联网平台规范的应用模块,前端页面都会有此内置 net 对象,此对象提供非常灵活的前后台交互方法与实时的数据推送
功能等,同样的在server端有一个net的global对象与其配合使用

数据链:
netclient对象内置一个data属性,此属性具有前后台实时数据同步的能力,对此属性进行赋值或者修改等操作时,前后台都能够获取data的最新结果

例如,web端有如下操作:
```javascript
net.data.a={"name":"小明"};
```
则后台可以获取这个属性,代码如下:
```javascript

var client = net.getNetclientInstanceForReq(req);
console.dir(client.data.a); //{"name":"小明"}

```

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
var client = net.getNetclientInstanceForReq(req);
client.emit("myevent",data); //触发前台的myevent事件
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
var client = net.getNetclientInstanceForReq(req);
//由前台的emit方法触发
client.on("testEmit",function(obj,callback){
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

getView(method, parms, callback):经对应的服务器端method得到ejs,注意:如果method等于getEjs的话,则parms参数必须为有效的ejs路径字符串,此种情况直接返回parms指定的模版

web端写法
```javascript
net.getView("testRender",'',function(res){
    $("body").html(res);
});
```

对应的服务器端写法

```javascript
this.testRender = function(req,res,parms){
    console.dir(parms);
    res.render("modules/example/web/sonejs/student.ejs",{});
}
```

getData(method, parms, callback):向后台请求获取数据,方法使用同getView相同,只是对应的后台写法res.render应改为res.send


值得注意的时,后台获取client的方法都需要一个req(  var client = net.getNetclientInstanceForReq(req);  ),这样就决定了使用client就必须
在一个请求里,但是有些场景,我们可能是后台自启动的服务推送给前台数据,为了适应这样的场景,添加如下两个方法:

```javascript
/**
 * 根据服务名称获取所有已经开启的socketIO客户端信息
 * @param service
 * @returns [{"key":"socketid","value":"socket对象"},{}......]
 */
var clients = net.getSockets(service);

```
getSockets方法会获得对应service的模块的所有打开着的客户端,返回一个形如[{"key":"socketid","value":"socket对象"},{}......]的一个数组对象
通过遍历这个对象可以获取每一个client,然后就可以向指定的前台推送数据了

第二个方法如下:
```javascript
//获取所有的socket信息
var property = net.getAllSocket();
```
这个方法用一个特定的数据结构进行存储,结构如下:
```javascript
{
    service:[
        {"key":"socketid","value":"socket对象"},
        {"key":"socketid","value":"socket对象"},
        ...
    ],
    ...
}
```
它会获取所有的客户端,也就意味着它可以向其他任何一个模块推送数据,这将会增加模块的耦合,导致业务的混乱,增加代码的复杂度,增加维护难度.总之,不推荐使用

