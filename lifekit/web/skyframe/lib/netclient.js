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
	let net_key = Symbol("net_key");

	var handler = {
		set: function (target, key, value, receiver) {
			//过滤自定义的原型链属性
			if(key === "__proto__"){
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
			if (type(value) === '[object Object]' || type(value) === '[object Array]') {
				if (!isProxy(value)) { 
					setProxyForObj(value, netKey);
					realValue = new Proxy(value, handler);
				} else {
					setProxyForObj(value, netKey);
					//说明对象的这个值是一个proxy
					//说明是对象自己的内部变动，不推送
					//这种情况一般都出现在数组的操作上
					//后续特殊情况则持续重构
					obj_push_flag = false;
					realValue = value;
				}
			} else {
				realValue = value;
			}
			var flag = Reflect.set(target, key, realValue, receiver); 
			if(net_key!==netKey){ 
				target[net_key] = netKey;
			} else {
				obj_push_flag = false;
			}
			//属性改变的监听事件
			if (listener[netKey]) {
				var listenerObj = listener[netKey];
				for (var i in listenerObj) {
					listenerObj[i](value);
				}
			}
			if (!net_push_flag && obj_push_flag) {
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
	var proxy = {};
	try{
		proxy = new Proxy(dataline, handler);
	}catch(e){
		console.log("浏览器不支持ES6新特性，无法使用数据链！");
	}
	 


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
						let key = netKeyArr[i];
						chengeVal = chengeVal[key];
						dataVal = dataVal[key];
					}

					if(type(chengeVal) === '[object Array]'){  
						let key = netKeyArr[netKeyArr.length - 1];
						setArrayData(chengeVal,key,dataVal);
					}else{
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
		$("#shadeAll").bind('click',function(){
			document.location.reload();
		}).show();
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
			opt.data = _net.data;
			return new Vue(opt);
		}

	};

	//判断对象的类型
	function type(v) {
		return Object.prototype.toString.call(v);
	};

	function isProxy(v) {
		return v[net_key] !== undefined;
	}

	function setArrayData(arr,index,dataVal){  
		arr.splice(0,arr.length);
		for(let i=0;i<dataVal.length; i++){
			arr.push(dataVal[i]);
		}  
	}

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