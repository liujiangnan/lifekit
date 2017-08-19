
/**
 * 对Date的扩展，将 Date 转化为指定格式的String       
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
 * eg:       
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
 */          
Date.prototype.pattern=function(fmt) {           
    var o = {           
    "M+" : this.getMonth()+1, //月份           
    "d+" : this.getDate(), //日           
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
    "H+" : this.getHours(), //小时           
    "m+" : this.getMinutes(), //分           
    "s+" : this.getSeconds(), //秒           
    "q+" : Math.floor((this.getMonth()+3)/3), //季度           
    "S" : this.getMilliseconds() //毫秒           
    };           
    var week = {           
    "0" : "/u65e5",           
    "1" : "/u4e00",           
    "2" : "/u4e8c",           
    "3" : "/u4e09",           
    "4" : "/u56db",           
    "5" : "/u4e94",           
    "6" : "/u516d"          
    };           
    if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }           
    if(/(E+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);           
    }           
    for(var k in o){           
        if(new RegExp("("+ k +")").test(fmt)){           
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
        }           
    }           
    return fmt;           
}  

Date.prototype.addMinutes = function(minutes)
{
    this.setMinutes(this.getMinutes() + minutes);
};


Date.prototype.addDays = function(d)
{
    this.setDate(this.getDate() + d);
};


Date.prototype.addWeeks = function(w)
{
    this.addDays(w * 7);
};


Date.prototype.addMonths= function(m)
{
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);

    if (this.getDate() < d)
        this.setDate(0);
};


Date.prototype.addYears = function(y)
{
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);

    if (m < this.getMonth())
     {
        this.setDate(0);
     }
};

/**
 *时间格式处理
 */
Date.prototype.formatString = function formatTime(timeStr)
{
    var result = '0000-00-00 00:00:00:000';
    if (timeStr && timeStr.length == 17) {
        var y = timeStr.substr(0, 4);
        var m = timeStr.substr(4, 2);
        var d = timeStr.substr(6, 2);
        var h = timeStr.substr(8, 2);
        var min = timeStr.substr(10, 2);
        var s = timeStr.substr(12, 2);
        var l = timeStr.substr(14, 3);
        result = y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
    }
    return result;
};


/**
 * 同步执行 (会产生阻塞，但是按顺序遍历)
 * @param items 要遍历的数组
 * @param func 有回调的业务逻辑函数，此函数会传入三个参数
 *         i:当前位置，item: items[i] , next:执行下一条
 * @param callback  遍历完数组之后执行的函数逻辑
 */
Array.prototype.syncEach = function(func, callback){
    var _this = this;
    var i, next;
    i = -1;
    next = function() {
        if (++i >= _this.length) {
            callback(_this);
        }else{
            var item = _this[i];
            func(i,item,next);
        }
    };
    next();
};



/**
 * 异步执行 （不会产生阻塞，但是会产生不按顺序遍历执行回调产生的逻辑混乱）
 * @param items 要遍历的数组
 * @param func 有回调的业务逻辑函数，此函数会传入三个参数
 *         i:当前位置，item: items[i] , flag:回调判断函数，当所有item的回调都执行完则调用callback
 * @param callback 遍历完数组之后执行的函数逻辑
 */
Array.prototype.asynEach = function(func, callback){
    var _this = this;
    var x,flag;
    x = 0;
    flag = function(){
        x++;
        if(x==_this.length){
            callback(_this);
        }
    };
    for(var i = 0;i<_this.length;i++){
        var item = _this[i];
        func(i,item,flag);
    }
    if(_this.length==0){
        callback(_this);
    }
};