# lifekit-login
基于lifekit框架的用户模块

# 安装及使用

### 安装

项目根目录执行如下命令进行安装

```
lifekit install lifekit-login
```

打开项目，则项目的engine目录下出现此模块，修改如下配置文件

1)配置mysql相关信息

/lifekit-login/src/config/datasource.json
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


2）配置跳转页面

/lifekit-login/src/config/jump.json
```
{
  "login_success":"/lifekit-test"
}
```
* 注：用来指定登陆成功或注册成功后跳转到指定路径

### 使用

1）直接访问

登陆入口：http://localhost:1337/lifekit-login

注册入口：http://localhost:1337/lifekit-login/register

修改信息入口：http://localhost:1337/lifekit-login/update

2）页面跳转

在页面任何地方可使用如下方式跳转
```
window.location.href="/lifekit-login";
```
注册和修改信息同理

