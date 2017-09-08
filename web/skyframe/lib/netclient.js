/**
 * 负责网络通信
 * 单向通信(例如：向服务器发送消息或数据,以及侦听服务器发来的消息或数据)使用WebSocket
 * 请求响应通信(例如：请求页面)使用jquery的ajax  
 */
var NetClient = function (host, server, token, callback) {
	//私有
	var url = 'http://' + host;  
	var socket = io.connect(url);
	var socketid = null;
	var listener = {};  //前后台数据同步的监听
	var dataline = {};  //数据链
	var net_push_flag = false;  //前台推送变量赋值标示

	var handler = {
		set: function (target, key, value, receiver) {
			//console.dir(value);
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


			target["net_key"] = netKey;
			//属性改变的监听事件
			if (listener[netKey]) {
				var listenerObj = listener[netKey];
				for (var i in listenerObj) {
					listenerObj[i](value);
				}
			}
			if (!net_push_flag) {
				socket.emit("dataline", dataline, netKey);
			}
			return flag;
		},
		get: function (target, key, receiver) {
			return Reflect.get(target, key, receiver);
		}
	};

	var proxy = new Proxy(dataline, handler); 

	socket.on('connect', function () {
		socket.on('authenticated', function () {
			socket.on('dataline', function (data, netKey) { 
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
				//for(var key in listener){
				//	listener[key](copy);
				//}

				net_push_flag = false;
			});
			//初始化对应模块的socket服务
			socket.emit("initserver", server, function (sid) { 
				socketid = sid;
				callback();
			});

		}).emit('authenticate', { token: token }); //send the jwt 
		
	});
	socket.on('disconnect', function () {
		socketid = null;
		socket.disconnect();
		$("#divAll").bind('click',function(){
			document.location.reload();
		});
	});


	var _net = {

		addEvent: function (eventname, dataline_key, func) {
			if (listener[dataline_key]) {
				listener[dataline_key][eventname] = func;
			} else {
				listener[dataline_key] = {};
				listener[dataline_key][eventname] = func;
			}
		},

		removeEvent: function (eventname, dataline_key) {
			if (listener[dataline_key] && listener[dataline_key][eventname]) {
				delete listener[dataline_key][eventname];
			}
		},

		/**
	 * 侦听服务器事件
	 * @param evname 侦听服务器的事件名称
	 * @param callback 回调函数  
	 * 如：function example(data){}
	 */
		on: function (evname, callback) {

			//这几个事件都是内置的事件名称,不可重名使用
			if (evname == "call" || evname == "dataline" || evname == "initserver" || evname == "connect" || evname == "disconnect") {
				return;
			}
			socket.on(evname, callback);
		},

		/**
		 * 向服务器发送事件
		 * @param evname 事件名称
         * @param data 数据
         */
		emit: function (evname, data, callback) {
			//这几个事件都是内置的事件名称,不可重名使用
			if (evname == "call" || evname == "dataline" || evname == "initserver" || evname == "connect" || evname == "disconnect") {
				return;
			}
			socket.emit(evname, data, callback);
		},


		/**
		 * 调用后台的方法
		 * @param funcname 方法名称
		 * @param data 数据
         * @param callback 回调函数
         */
		call: function (funcname, data, callback) {
			socket.emit('call', funcname, socketid, data, callback);
		},

		/**
		 * 获取Ajax的路径给第三方的插件用
		 * @returns {string}
         */
		getAjaxURL: function () {
			return "/" + server + "/getView/";
		},

		/**
		 * 由于后台过滤,发起Ajax必须要带一些参数,配合getAjaxURL才能正常的发起一个Ajax
		 * @param method
		 * @param parms
		 * @returns {{server: *, method: *, socketid: *, parms: *}}
         */
		getAjaxData: function (method, parms) {
			return {
				'server': server,
				'method': method,
				'socketid': socketid,
				'parms': parms
			}
		},

		/**
		 * 获取页面并执行callback方法
		 * @param method 指定后台方法
		 * @param parms 向后台传递的参数,json字符串
		 * @param callback callback方法
		 * @return 
		 * @type 
		 */
		getView: function (method, parms, callback) {
			var _url = "/" + server + "/getView/"; 
			$.ajax({
				type: "POST",
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				url: _url,
				data: {
					'method': method,
					'socketid': socketid,
					'parms': parms
				},
				success: function (xhr) {
				},
				error: function (xhr, e) {

				},
				complete: function (xhr) {
					if (callback) {
						callback(xhr.responseText);
					}
				}
			});
		},
		/**
		 * 获取数据并执行callback方法
		 * @param method 指定后台方法
		 * @param parms 向后台传递的参数
		 * @param callback callback方法
		 * @return 
		 * @type 
		 */
		getData: function (method, parms, callback) {
			this.getView(method, parms, callback);
		},

		/**
		 * 基于Vue的数据绑定，实现dataline对dom对象的数据联动功能
		 * 返回Vue实例
		 * @param id dom元素的id属性
		 * @param option Vue除了el、data的其他可配置项
		 */
		datachange: function (id, option) {
			var opt = option ? option : {};
			opt.el = "#" + id;
			opt.data = proxy;
			return new Vue(opt);
		}

	};

	//判断对象的类型
	function type(v) {
		return Object.prototype.toString.call(v);
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

	_net.data = proxy;

	return _net;

};