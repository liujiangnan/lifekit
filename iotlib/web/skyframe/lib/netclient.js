/**
 * 负责网络通信
 * 单向通信(例如：向服务器发送消息或数据,以及侦听服务器发来的消息或数据)使用WebSocket
 * 请求响应通信(例如：请求页面)使用jquery的ajax  
 */
 var NetClient = function(host,server,callback){
 	//私有
 	var url = 'http://'+host;
 	var socket = io.connect(url);
    var socketid = null;
	var listener={};  //前后台数据同步的监听
	var dataline = {};  //数据链

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
			socket.emit("dataline", dataline);
			return flag;
		},
		get : function(target, key, receiver){
			return Reflect.get(target, key, receiver);
		}
	};

	var proxy = new Proxy(dataline,handler);

 	socket.on('connect', function(){
		//初始化对应模块的socket服务
		socket.emit("initserver",server,function(sid){
			socket.on('dataline',function(data){
				dataline = data;
				proxy = new Proxy(dataline,handler);
				var copy = copyData(data);
				for(var key in listener){
					listener[key](copy);
				}
			});
            socketid = sid;
			callback();
		});

	});
    socket.on('disconnect', function(){
        socketid = null;
        //socket.socket.reconnect();
    });


	var _net =  {

		addListener : function(name,func){
			listener[name] = func;
		},

		removeListener : function(name){
			delete listener[name];
		},

 		/**
		 * 侦听服务器事件
		 * @param evname 侦听服务器的事件名称
		 * @param callback 回调函数  
		 * 如：function example(data){}
		 */
        on : function(evname,callback){

			//这几个事件都是内置的事件名称,不可重名使用
			if(evname=="call"||evname=="dataline"||evname=="initserver"||evname=="connect"||evname=="disconnect"){
				return;
			}
			socket.on(evname, callback);
        },

		/**
		 * 向服务器发送事件
		 * @param evname 事件名称
         * @param data 数据
         */
		emit : function(evname,data,callback){
			//这几个事件都是内置的事件名称,不可重名使用
			if(evname=="call"||evname=="dataline"||evname=="initserver"||evname=="connect"||evname=="disconnect"){
				return;
			}
			socket.emit(evname,data,callback);
		},


		/**
		 * 调用后台的方法
		 * @param funcname 方法名称
		 * @param data 数据
         * @param callback 回调函数
         */
		call : function(funcname,data,callback){
			socket.emit('call', funcname, socketid, data, callback);
		},

		/**
		 * 获取Ajax的路径给第三方的插件用
		 * @returns {string}
         */
		getAjaxURL : function(){
			return "/getView/";
		},

		/**
		 * 由于后台过滤,发起Ajax必须要带一些参数,配合getAjaxURL才能正常的发起一个Ajax
		 * @param method
		 * @param parms
		 * @returns {{server: *, method: *, socketid: *, parms: *}}
         */
		getAjaxData : function(method,parms){
			return {
				'server':server,
				'method':method,
				'socketid':socketid,
				'parms':parms
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
		getView : function(method, parms, callback){
			$.ajax({
		        type: "POST",
		        contentType: "application/x-www-form-urlencoded; charset=utf-8",  
		        url: "/getView/",
		        data: {
					'server':server,
					'method':method,
                    'socketid':socketid,
					'parms':parms
				},
		        success: function (xhr) {
		        },
		        error: function (xhr, e) {

		        },
		        complete: function (xhr) {
		            if(callback){
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
		getData : function(method, parms, callback){
			this.getView(method, parms, callback);
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