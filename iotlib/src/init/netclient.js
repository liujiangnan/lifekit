/**
 * WebSocket侦听路由
 */
function netclient(server) {
    var Property = require(root_path + '/iotlib/src/model/property');
    var Map = require(root_path + '/iotlib/src/model/map');
    var io = require('socket.io').listen(server);
    var socketioJwt = require("socketio-jwt");

    //io.set('log level', 1);
    var cookie = require('cookie');
    var path = require('path');
    var property = new Property();

    if(sysconfig.jwt){
        io.of('/auth').on('connection', socketioJwt.authorize({
            secret: sysconfig.jwt.option.secret,
            timeout: 5000 // 15 seconds to send the authentication message 
        })).on('authenticated',initSocket);
    }
     
    io.of('/nonAuth').on('connection', initSocket);
 
    /**
     * 根据服务名称获取所有已经开启的socketIO客户端信息
     * @param service
     * @returns [{"key":"socketid","value":"socket对象"},{}......]
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
        var service;
        console.log('connection: SocketID=' + socket.id);
        socket.on('disconnect', function () {
            property.remove(service, socket.id);
            if (property.get(service).isEmpty()) {
                property.remove(service);
            }

            console.log('disconnect: SocketID=' + socket.id);
        });

        socket.on("initserver", function (serverstr, callback) {
            service = serverstr;

            var dataline = {};

            var net_push_flag = false;  //前台推送变量赋值标示

            var handler = {
                set: function (target, key, value, receiver) {
                    if (key === "net_key") {
                        console.error("net_key是dataline私有属性,无法被赋值;请更改属性!");
                        return false;
                    }
                    if (key.indexOf(".") >= 0) {
                        console.error("dataline的属性名称不能包含'.',请更改属性!");
                        return false;
                    }
                    var realValue;
                    var netKey = key;
                    if (target["net_key"]) {
                        var tempKey = target["net_key"];
                        if (tempKey.indexOf(".") >= 0) {
                            netKey = tempKey.substring(0, tempKey.lastIndexOf(".") + 1) + key;
                        }
                    }
                    if (type(value) === '[object Object]' || type(value) === '[object Array]') {
                        setProxyForObj(value, netKey);
                        realValue = new Proxy(value, handler);
                    } else {
                        realValue = value;
                    }
                    var flag = Reflect.set(target, key, realValue, receiver);
                    //console.dir("set方法进来了.......");

                    target["net_key"] = netKey;
                    if (!net_push_flag) {
                        socket.emit("dataline", dataline, netKey);
                    }
                    return flag;
                },
                get: function (target, key, receiver) {
                    return Reflect.get(target, key, receiver);
                }
            };

            function setProxyForObj(obj, parentNetKey) {
                var netKey = parentNetKey + ".";
                for (var key in obj) {
                    var tempNetKey = netKey + key;
                    var value = obj[key];
                    if (type(value) === '[object Object]' || type(value) === '[object Array]') {
                        setProxyForObj(value, tempNetKey);
                        obj[key] = new Proxy(value, handler);
                    } else {
                        obj[key] = value;
                    }
                }
                obj["net_key"] = netKey;
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
                    chengeVal[netKeyArr[netKeyArr.length - 1]] = dataVal[netKeyArr[netKeyArr.length - 1]];
                } else {
                    proxy[netKey] = data[netKey];
                    //copy = copyData(data);
                }
                net_push_flag = false;

                //property.put(service,socket.id,obj);
            });

            var net = creatNet(socket,proxy);

            var mdlService = require(root_path + '/engine/' + serverstr+'/src/service');
            var svc = new mdlService(net);  

            socket.on("call", function (funcname,socketid,data, callback) {  
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

    function creatNet(socket,proxy){
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
        var svc = obj?obj["service"]:null; 
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