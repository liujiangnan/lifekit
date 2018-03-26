# lk-main
基于lifekit框架的首页模块

# 安装及使用

### 安装

项目根目录执行如下命令进行安装

```
lifekit install lk-main
```

打开项目，则项目的engine目录下出现此模块，修改如下配置文件

1)配置mysql相关信息

/lk-main/src/config/datasource.json
```
{
  "database":"mybase",
  "host":"localhost",
  "port":3306,
  "username":"root",
  "password":"root",
  "dialect" : "mysql"
}
```
 

### 使用

1）配置首页

入口：http://localhost:1337/lk-main/operation 

* 注：配置首页时，每一个菜单所配置的URL需确保存在

2）首页展示

入口：http://localhost:1337/lk-main

