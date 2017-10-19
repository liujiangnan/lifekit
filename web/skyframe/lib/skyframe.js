
var rootPage = window.top;

var skyframeSequence = {sequence:{},count:8000};


//此方法限制了一个页面不能超过1000个frame,如果后面有需求,则把9000增大
function addSkyframeSequence(frameId){
    if(skyframeSequence.count<=9000){
        skyframeSequence.count++;
        skyframeSequence.sequence[frameId] = skyframeSequence.count;
        return skyframeSequence.count;
    }else{
        var tempObj = skyframeSequence.sequence;
        var arr = [];
        for(var obj in tempObj){
            arr.push({key:obj,value:(tempObj[obj]-0)});
        }
        arr.sort(function(a,b){
            return a.value - b.value;
        });
        skyframeSequence.count = 8000;
        for(var i=0;i<arr.length;i++){
            var obj = arr[i];
            skyframeSequence.count++;
            skyframeSequence.sequence[obj.key] = skyframeSequence.count;
            $('#'+obj.key).css("z-index",skyframeSequence.count);
        }
        skyframeSequence.count++;
        skyframeSequence.sequence[frameId] = skyframeSequence.count;
        return skyframeSequence.count;

    }
}



function skyframe(){

    var _skyframe = this;
    var opt;  //配置参数
    var _dom;  //窗口对象
    var _parent;  //窗口的父容器
    var _skyToolbar; //窗口上边框的工具条
    var _skyIframe; //窗口内容页面iframe框
    var url; //页面地址
    var evtObj = {}; //绑定事件对象
    var _skyframe_status = 0;  //窗口的状态 0:正常,1:最小化,2:最大化

    /***
     * 实例化dom对象
     * @param option
     * {
     *  id:'',
     *  container:$dom,     //jquery对象
     *  engine:'',     //对应IOT模块 
     *  closeable:false  //是否可关闭
     *  详细配置请参考README
     * }
     */
    this.init = function(option){
        opt = option;
        _parent = opt.container;
        var _pWith = _parent.width();
        var _pHeight = _parent.height();
        url = '/'+option.engine;
        var style = "";
        var html = '<div id="'+option.id+'" style="height: inherit;">' +
            '<div id="sky_toolBar" style="position: absolute; top: 0px;height: 20px; width: 100%; display: none; background:#000000;filter:alpha(opacity=50);-moz-opacity:0.5;opacity:0.5;">' +
            '</div>'+
            '<iframe id="frame_' + option.id +
            '" src="'+url+'" allowTransparency="true" scrolling="auto"  frameborder="no" marginheight="0" marginwidth="0" style="height: 100%;width: 100%;"></iframe>' +
            '</div>';

        _parent.html(html);
        _dom = $("#"+option.id);
        _skyToolbar = _dom.find("#sky_toolBar").eq(0);
        _skyIframe = $("#frame_"+option.id);

        var zIndex = addSkyframeSequence(option.id);
        this.setStyle("z-index",zIndex);

        if(option.style){
            this.setStyleObj(option.style);
        }else{
            //this.setStyleObj({position: "absolute",top:"0px",left:"0px",width:_pWith+'px',height:_pHeight+'px',background: "#FFFFFF"});
        }


        //设置moveable为true的话,则按住工具条实现拖动
        if(option.moveable){
            var downflag = false;
            var pagex = 0;
            var pagey = 0;

            _skyToolbar.bind("mousedown",function(e){
                var zIndex = addSkyframeSequence(opt.id);
                _skyframe.setStyle("z-index",zIndex);
                if(e.which){// 1 = 鼠标左键; 2 = 鼠标中键; 3 = 鼠标右键
                    downflag = true;
                }
            }).bind("mouseup",function(){
                downflag = false;
            }).bind("mouseout",function(){
                downflag = false;
            });

            $("body").bind("mousedown",function(e){
                pagex = e.pageX;
                pagey = e.pageY;
            }).bind("mousemove",function(e){
                if(downflag){
                    var tempx = e.pageX;
                    var tempy = e.pageY;
                    var offset = _dom.offset();
                    _dom.offset({
                        top:offset.top+(tempy-pagey),
                        left:offset.left+(tempx-pagex)
                    });
                    pagex = tempx;
                    pagey = tempy;
                }
            });
        }

        //绑定窗口控制按钮的显示与隐藏
        _dom.bind("mouseover",function(){
            //closeable:关闭按钮,minimizeable:最小化按钮,maximizeable:最大化按钮,moveable:可移动
            if(option.closeable||option.minimizeable||option.maximizeable||option.moveable){
                _skyToolbar.show();
            }
        }).bind("mouseout",function(){
            _skyToolbar.hide();
        });

        //默认的窗口点击事件
        _skyToolbar.bind('click',function(){

            var zIndex = addSkyframeSequence(opt.id);
            _skyframe.setStyle("z-index",zIndex);

            //执行绑定的点击事件
            if(evtObj["click"]){
                evtObj["click"](_dom);
            }
        });

        IframeOnClick.track(document.getElementById("frame_"+option.id), function(){
            var zIndex = addSkyframeSequence(opt.id);
            _skyframe.setStyle("z-index",zIndex);

            //执行绑定的点击事件
            if(evtObj["click"]){
                evtObj["click"](_dom);
            }
        });


        //绑定关闭按钮的事件
        if(option.closeable){
            var closeDiv = createToolButton("sky_btn_close","X");
            _skyToolbar.append(closeDiv);
            _skyToolbar.find("#sky_btn_close").eq(0).bind('click',function(){
                _skyframe.close();
            });
        }

        //绑定最大化按钮的事件
        if(option.maximizeable){
            var maxDiv = createToolButton("sky_btn_maximize","口");
            _skyToolbar.append(maxDiv);
            _skyToolbar.find("#sky_btn_maximize").eq(0).bind('click',function(){
                _skyframe.maximize();
            });
        }

        //绑定最小化按钮的事件
        if(option.minimizeable){
            var minDiv = createToolButton("sky_btn_minimize","-");
            _skyToolbar.append(minDiv);
            _skyToolbar.find("#sky_btn_minimize").eq(0).bind('click',function(){
                _skyframe.minimize();
            });
        }
    };

    this.flush = function(){
        _skyIframe.attr('src','').attr('src',url);
    };

    //绑定事件,支持click,close,max,min,move,reset事件
    this.bind = function(evname,callback){
        evtObj[evname] = callback;
    };

    //关闭
    this.close = function(callback){

        _dom.remove();

        //执行绑定的关闭事件
        if(evtObj["close"]){
            evtObj["close"]();
        }
        callback&&callback();
    };

    //最大化(针对于父容器的最大化)
    this.maximize = function(callback){
        if(_skyframe_status!=2){
            _skyframe_status = 2;
            var width = _parent.width();
            var height = _parent.height();
            _skyframe.setStyleObj({width:width+'px',height:height+'px',top:"0px",left:"0px"});
            _skyToolbar.find("#sky_btn_maximize")
                .eq(0).unbind("click").bind("click",function(){
                    _skyframe.resetFrame(function(){
                        _skyToolbar.find("#sky_btn_maximize")
                            .eq(0).unbind("click").bind("click",function(){
                            _skyframe.maximize();
                        }).html("口");
                    });
                }).html("回");
        }

        //执行绑定的最大化事件
        if(evtObj["max"]){
            evtObj["max"](_dom,_skyframe_status);
        }
        callback&&callback(_dom,_skyframe_status);
    };

    //最小化
    this.minimize = function(callback){
        _skyframe_status = 1;
        _dom.hide();
        //执行绑定的最小化事件
        if(evtObj["min"]){
            evtObj["min"](_dom);
        }
        callback&&callback(_dom);
    };

    /**
     * 恢复最初的大小和位置
     */
    this.resetFrame = function(callback){
        _skyframe_status = 0;
        _skyframe.setStyleObj(opt.style);
        //执行绑定的重置事件
        if(evtObj["reset"]){
            evtObj["reset"](_dom);
        }
        callback&&callback(_dom);
    };

    /**
     * 移动到
     * @param top 绝对定位
     * @param left 绝对定位
     * @param callback 回调函数
     */
    this.moveTo = function(top,left,callback){
        _skyframe.setStyleObj({top:top+'px',left:left+'px'});
        //执行绑定的移动窗口事件
        if(evtObj["move"]){
            evtObj["move"](_dom);
        }
        callback&&callback();
    };

    /**
     * 设置高度和高度
     * @param width 宽度
     * @param height 高度
     * @param callback 回调函数
     */
    this.changeTo = function(width,height,callback){
        _skyframe.setStyleObj({width:width+'px',height:height+'px'});
        callback&&callback();
    };

    /**
     * 设置窗口的样式
     * @param key
     * @param style
     */
    this.setStyle = function(key,style){
        _dom.css(key,style);
    };

    /**
     * 设置窗口的样式
     * @param obj
     */
    this.setStyleObj = function(obj){
        _dom.css(obj);
    };

    function createToolButton(id,html){
        var str = '<div align="center" id="'+id+'" style="display: block; width: 20px;height:20px;line-height: 20px;float: right;margin-right: 5px;color: #FFFFFF;cursor:pointer;">'+html+'</div>';
        return str;
    }

    var IframeOnClick = {
        resolution: 200,
        iframes: [],
        interval: null,
        Iframe: function() {
            this.element = arguments[0];
            this.cb = arguments[1];
            this.hasTracked = false;
        },
        track: function(element, cb) {
            this.iframes.push(new this.Iframe(element, cb));
            if (!this.interval) {
                var _this = this;
                this.interval = setInterval(function() { _this.checkClick(); }, this.resolution);
            }
        },
        checkClick: function() {
            if (document.activeElement) {
                var activeElement = document.activeElement;
                for (var i in this.iframes) {
                    if (activeElement === this.iframes[i].element) { // user is in this Iframe
                        if (this.iframes[i].hasTracked == false) {
                            this.iframes[i].cb.apply(window, []);
                            this.iframes[i].hasTracked = true;
                        }
                    } else {
                        this.iframes[i].hasTracked = false;
                    }
                }
            }
        }
    };
}