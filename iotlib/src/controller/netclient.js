/**
 * WebSocket侦听路由
 */
function netclient(server){
    var Property = require(root_path + '/iotlib/src/model/property');
    var Map = require(root_path + '/iotlib/src/model/map');
	var io = require('socket.io').listen(server);
    //io.set('log level', 1);
	var cookie = require('cookie');
	var path = require('path');
	var property = new Property();

	//io.set('log level', 0);
	io.sockets.on('connection', function (socket) {
		var service;
		console.log('connection: SocketID=' + socket.id);
		socket.on('disconnect', function() {
            property.remove(service,socket.id);
            if(property.get(service).isEmpty()){
                property.remove(service);
            }

			console.log('disconnect: SocketID=' + socket.id);
		});

		socket.on("initserver",function(serverstr,callback){
			service = serverstr;
            var obj = {
                "socket":socket,
                "dataline":{}
            };
            property.put(service,socket.id,obj);

			socket.on("dataline",function(data){
                var obj = {
                    "socket":socket,
                    "dataline":data
                };
                property.put(service,socket.id,obj);
			});

			socket.on("call",function(funcname,data,callback){
				var mdlService = require(root_path + '/' + serverstr);
				var svc = new mdlService();
				svc[funcname](data, callback);
			});
			callback(socket.id);

		});

	});


    /**
     * 根据服务名称获取所有已经开启的socketIO客户端信息
     * @param service
     * @returns [{"key":"socketid","value":"socket对象"},{}......]
     */
    this.getSockets = function(service){
        return property.get(service);
    };


    /**
     * 获取所有的socket信息
     * @returns {Property}
     */
    this.getAllSocket = function(){
        return property;
    };

    /**
     * 获取自己的socketId
     * @param req
     */
    this.getSelfSocketId = function(req){
        return  req.body.socketid;
    };

    function netclientInstance(serviceName,socketid){

        var obj = property.getValue(serviceName,socketid);
        var socket = obj["socket"];
        var dataline = obj["dataline"];

        var handler = {
            set : function(target, key, value, receiver){
                var realValue;
                if(type(value)==='[object Object]'||type(value)==='[object Array]'){
                    setProxyForObj(value);
                    realValue = new Proxy(value,handler);
                }else{
                    realValue = value;
                }
                var flag = Reflect.set(target, key, realValue, receiver);
                //console.dir("set方法进来了.......");
                socket.emit("dataline", dataline);
                return flag;
            },
            get : function(target, key, receiver){
                return Reflect.get(target, key, receiver);
            }
        };

        var proxy = new Proxy(dataline,handler);

        var _net = {

            /***
             * 判断是否加载了此模块（有些定时推送数据场景，前台都关闭了，后台推送没法判断，所以添加此方法）
             */
            isload : function(){
                return obj?true:false;
            },

            /**
             * 触发前端的方法
             * @param eventname 要触发的前台的事件名称
             * @param data 传递的参数
             */
            emit : function(eventname,data){
                if(socket){
                    socket.emit(eventname,data);
                }
            },

            /**
             * 后台绑定一个方法,当前端触发相应事件执行
             * @param eventname 事件名称
             * @param callback 触发后执行的操作
             */
            on : function(eventname,callback){
                if(socket){
                    socket.on(eventname,callback);
                }else{
                    callback("error");
                }
            }

        };

        //判断对象的类型
        function type(v){
            return Object.prototype.toString.call(v);
        };

        function setProxyForObj(obj){
            for(var key in obj){
                var value = obj[key];
                if(type(value)==='[object Object]'||type(value)==='[object Array]'){
                    setProxyForObj(value);
                    obj[key] = new Proxy(value,handler);
                }else{
                    obj[key] = value;
                }
            }
        }

        function copyData(obj){
            var res = {};
            for(var key in obj){
                var temp = obj[key];
                if(type(temp)==='[object Object]'||type(temp)==='[object Array]'){
                    res[key] = copyData(temp);
                }else{
                    res[key] = temp;
                }
            }
            return res;
        }

        _net.data = proxy;

        return _net;
    };

    /**
     * 获取socketio对应模块的实例对象
     * @param serviceName 模块服务名称
     * @param socketid
     * @returns {{emit: emit, on: on}}
     */
    this.getNetclientInstance = netclientInstance;

    /**
	 * 获取socketio对应模块的实例对象
	 * @param req 请求对象
	 * @returns {{emit: emit, on: on}}
     */
	this.getNetclientInstanceForReq = function(req){
		var service = req.body.server;
        var socketid = req.body.socketid;
        //console.dir(service+"***"+socketid);
        return netclientInstance(service,socketid);
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