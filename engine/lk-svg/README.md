# lk-svg
基于lifekit框架的SVG图展示实时数据模块

# 安装及使用

### 安装

项目根目录执行如下命令进行安装

```
lifekit install lk-svg
``` 
 

### 使用

1）配置SVG图

入口：http://localhost:1337/lk-svg/operation 
 

2）页面展示

入口：http://localhost:1337/lk-svg

3）详细说明

  此模块只是为方便开发实时数据展示模块而搭的一个架子，使用时只需要画一张SVG图，按照VUE.js配置好属性，然后在service.js中
添加实时数据的读取或者监听，然后把值赋值到net.data中，这样SVG图配置的VUE数据绑定就会实时展示数据了