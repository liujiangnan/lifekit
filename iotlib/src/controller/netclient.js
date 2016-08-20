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
    }

    function netclientInstance(serviceName,socketid){

        return {

            /***
             * 判断是否加载了此模块（有些定时推送数据场景，前台都关闭了，后台推送没法判断，所以添加此方法）
             */
            isload : function(){
                return (property.getValue(serviceName,socketid))?true:false;
            },

            /**
             * 触发前端的方法
             * @param eventname 要触发的前台的事件名称
             * @param data 传递的参数
             */
            emit : function(eventname,data){
                var obj = property.getValue(serviceName,socketid);
                if(obj){
                    var sock = obj["socket"];
                    sock.emit(eventname,data);
                }
            },

            /**
             * 后台绑定一个方法,当前端触发相应事件执行
             * @param eventname 事件名称
             * @param callback 触发后执行的操作
             */
            on : function(eventname,callback){
                var obj = property.getValue(serviceName,socketid);
                if(obj){
                    var sock = obj["socket"];
                    sock.on(eventname,callback);
                }else{
                    callback("error");
                }
            },

            /**
             * 设置数据链
             * @param key 键
             * @param data 值
             */
            setDataLine : function(key,data){
                var obj = property.getValue(serviceName,socketid);
                if(obj){
                    var sock = obj["socket"];
                    obj["dataline"][key] = data;
                    property.put(serviceName,socketid,obj);
                    sock.emit("dataline",obj["dataline"]);
                }
            },

            /**
             * 获取数据链
             * @returns {{}|*}
             */
            getDataLine : function(key){
                var obj = property.getValue(serviceName,socketid);
                var res = null;
                if(obj){
                    var sock = obj["socket"];
                    res = obj["dataline"][key];
                }
                return res;
            }

        }
    };

    /**
     * 获取socketio对应模块的实例对象
     * @param serviceName 模块服务名称
     * @param socketid
     * @returns {{emit: emit, on: on, setDataLine: setDataLine, getDataLine: getDataLine}}
     */
    this.getNetclientInstance = netclientInstance;

    /**
	 * 获取socketio对应模块的实例对象
	 * @param req 请求对象
	 * @returns {{emit: emit, on: on, setDataLine: setDataLine, getDataLine: getDataLine}}
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