/**
 * WebSocket侦听路由
 */
function netclient(server, secret, engine_dir) {
  var Property = require('./../model/property');
  var Map = require('./../model/map');
  var io = require('socket.io').listen(server);
  var socketioJwt = require("socketio-jwt");

  //io.set('log level', 1);
  var cookie = require('cookie');
  var path = require('path');
  var property = new Property();
  let net_key = Symbol("net_key");

  io.on('connection', socketioJwt.authorize({
    secret: secret,
    timeout: 5000 // 15 seconds to send the authentication message 
  })).on('authenticated', initSocket);


  /**
   * 根据服务名称获取所有已经开启的socketIO客户端信息
   * @param service
   * @returns [{"key":"socketid","value":{net:{},service:""}},{}......]
   */
  this.getSockets = function (service) {
    return property.get(service);
  };


  /**
   * 获取所有的socket信息
   * @returns {Property}
   */
  this.getAllSocket = function () {
    return property;
  };

  /**
   * 获取自己的socketId
   * @param req
   */
  this.getSelfSocketId = function (req) {
    return req.body.socketid;
  };

  function initSocket(socket) {
    var service = socket.decoded_token.engine;
    if (!service) {
      socket.disconnect(true);
      return;
    }
    if (service.indexOf("/") > 0) {
      service = service.substring(0, service.indexOf("/"));
    }
    console.log('connection: SocketID=' + socket.id);
    socket.on('disconnect', function () {
      property.remove(service, socket.id);
      if (property.get(service).isEmpty()) {
        property.remove(service);
      }

      console.log('disconnect: SocketID=' + socket.id);
    });

    socket.on("initserver", function (serverstr, callback) {


      //service = serverstr;

      var dataline = {};

      var net_push_flag = false; //前台推送变量赋值标示

      var handler = {
        set: function (target, key, value, receiver) {
          //过滤自定义的原型链属性（正常赋值，但不推送）
          if (key === "__proto__") {
            return Reflect.set(target, key, value, receiver);
          } 

          if (key!==net_key&&key.indexOf(".") >= 0) {
            console.error("dataline的属性名称不能包含'.',请更改属性!");
            return false;
          }
          var realValue;
          var netKey = key;
          if (target[net_key]&&key!==net_key) {
            var tempKey = target[net_key];
            if (tempKey.indexOf(".") >= 0) {
              netKey = tempKey.substring(0, tempKey.lastIndexOf(".") + 1) + key;
            } 
          } 
          //对象属性值变化推送标识，默认是推送的
          let obj_push_flag = true;  
          if ((type(value) === '[object Object]' || type(value) === '[object Array]')) {   
            if (!isProxy(value)) {
              setProxyForObj(value, netKey); 
              realValue = new Proxy(value, handler);
            } else {  
              //说明对象的这个值是一个proxy
              //说明是对象自己的内部变动，不推送
              //这种情况一般都出现在数组的操作上
              //后续特殊情况则持续重构
              obj_push_flag = false;
              setProxyForObj(value, netKey);  
              realValue = value;
            }
          } else {
            realValue = value;
          }  
          let flag = Reflect.set(target, key, realValue, receiver); 
          if(net_key!==netKey){ 
            target[net_key] = netKey;
          } else {
            obj_push_flag = false;
          }
          if (!net_push_flag && obj_push_flag) {
            // console.log(key);
            // console.log(value);
            socket.emit("dataline", dataline, netKey);
          }
          return flag;
        },
        get: function (target, key, receiver) {
          return Reflect.get(target, key, receiver);
        },
        deleteProperty: function(target, key){
          let flag = Reflect.deleteProperty(target, key);
          if (!net_push_flag) {
            var tempKey = target[net_key];
            if (tempKey.indexOf(".") >= 0) {
              netKey = tempKey.substring(0, tempKey.lastIndexOf(".") + 1) + key;
            } 
            socket.emit("dataline", dataline, netKey);
          }
          return flag;
        }
      };

      function setProxyForObj(obj, parentNetKey) { 
        var netKey = parentNetKey + "."; 
        for (var key in obj) {
          var tempNetKey = netKey + key;
          var value = obj[key];
          if (type(value) === '[object Object]' || type(value) === '[object Array]') {
            if (!isProxy(value)) { 
              setProxyForObj(value, tempNetKey); 
              obj[key] = new Proxy(value, handler);
            } else {
              setProxyForObj(value, tempNetKey);
              obj[key] = value;
            }
          } else {
            if (!isProxy(obj)) { 
              obj[key] = value;
            }
          }
        }  
        obj[net_key] = netKey;  
      }

      var proxy = new Proxy(dataline, handler);

      socket.on("dataline", function (data, netKey) {
        net_push_flag = true;
        var copy = data;
        if (netKey.indexOf(".") >= 0) {
          var netKeyArr = netKey.split(".");
          var chengeVal = proxy[netKeyArr[0]];
          var dataVal = data[netKeyArr[0]];
          for (var i = 1; i < netKeyArr.length - 1; i++) {
            chengeVal = chengeVal[netKeyArr[i]];
            dataVal = dataVal[netKeyArr[i]];
          }
          if (type(chengeVal) === '[object Array]') {
            let key = netKeyArr[netKeyArr.length - 1] - 0;
            let value = dataVal[netKeyArr[netKeyArr.length - 1]];
            setArrayData(chengeVal, key, value);
          } else {
            let lastKey = netKeyArr[netKeyArr.length - 1];
						if(dataVal.hasOwnProperty(lastKey)){
							chengeVal[lastKey] = dataVal[lastKey];
						}else{
							delete chengeVal[lastKey];
						} 
          }
        } else {
          proxy[netKey] = data[netKey];
          //copy = copyData(data);
        }
        net_push_flag = false;

        //property.put(service,socket.id,obj);
      });

      var net = creatNet(socket, proxy);

      var mdlService = require(engine_dir + '/' + service + '/src/service');
      var svc = new mdlService(net);

      socket.on("call", function (funcname, socketid, data, callback) {
        svc[funcname](data, callback);
      });
      var obj = {
        "net": net,
        "service": svc
      };
      property.put(service, socket.id, obj);

      callback(socket.id);

    });
  }

  function creatNet(socket, proxy) {
    var _net = {
      /**
       * 触发前端的方法
       * @param eventname 要触发的前台的事件名称
       * @param data 传递的参数
       */
      emit: function (eventname, data) {
        if (socket) {
          socket.emit(eventname, data);
        }
      },

      /**
       * 后台绑定一个方法,当前端触发相应事件执行
       * @param eventname 事件名称
       * @param callback 触发后执行的操作
       */
      on: function (eventname, callback) {
        if (socket) {
          socket.on(eventname, callback);
        } else {
          callback("error");
        }
      },
      data: proxy

    };

    return _net;
  }

  function netclientInstance(serviceName, socketid) {

    var obj = property.getValue(serviceName, socketid);
    var _net = obj["net"];
    return _net;
  };

  //判断对象的类型
  function type(v) {
    return Object.prototype.toString.call(v);
  };

  function isProxy(v) {
    return v[net_key] !== undefined;
  }

  function setArrayData(arr, index, dataVal) {
    if (arr.length < dataVal.length) {  //push操作引起的数据链变动
      let value = dataVal[dataVal.length - 1];
      arr.push(value);
    } else { //其他
      arr.splice(0, arr.length);
      for (let i = 0; i < dataVal.length; i++) {
        arr.push(dataVal[i]);
      }
    }
  }



  function copyData(obj) {
    var res = {};
    for (var key in obj) {
      var temp = obj[key];
      if (type(temp) === '[object Object]' || type(temp) === '[object Array]') {
        res[key] = copyData(temp);
      } else {
        res[key] = temp;
      }
    }
    return res;
  }

  /**
   * 获取socketio对应模块的实例对象
   * @param serviceName 模块服务名称
   * @param socketid
   * @returns {{emit: emit, on: on}}
   */
  this.getNetclientInstance = netclientInstance;

  /**
   * 获取socketio对应模块的后台服务实例
   * @param ctx 请求对象
   * @returns {{emit: emit, on: on}}
   */
  this.getService = function (ctx) {
    var service = ctx.request.body.server;
    var socketid = ctx.request.body.socketid;
    var obj = property.getValue(service, socketid);
    var svc = obj ? obj["service"] : null;
    return svc;
  };


  //	function getSessionIdBySocket(socket){
  //		var cookies = socket.handshake.headers.cookie;
  //        return getSessionIdByCookie(cookies);
  //	}

  //	this.getSessionIdBySocket = getSessionIdBySocket;

  /**
   * 通过cookies获取SessionID
   * @param cookies
   * @returns {*}
   */
  //	function getSessionIdByCookie(cookies){
  //		var secret = 'iot';
  //		var key  = 'iot';
  //		var sessionId = null;
  //		if (cookies) {
  //			cookies = cookie.parse(cookies);
  //			cookies = utils.parseSignedCookies(cookies, secret);
  //			cookies = utils.parseJSONCookies(cookies);
  //			if(cookies[key]) {
  //				sessionId = cookies[key];
  //			}
  //		}
  //		return sessionId;
  //	};

  //	this.getSessionIdByCookie = getSessionIdByCookie;
};
module.exports = netclient;