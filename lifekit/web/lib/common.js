
/**
 * 设置div自适应屏幕的高度
 */
function setDivHeight()
{
	var height = document.documentElement.clientHeight;
	var divViewHeight = height - 135;
	var divDisplayHeight = divViewHeight - 37;
	$("#divAll").css("height", height);
	$("#divView").css("height", divViewHeight);
	$("#divDisplay").css("height", divDisplayHeight);
}

 


/**
 * 通过对象返回urlData字符串
 * @param {} postData 由属性构成的对象
 * @return {}
 */
function getUrlData(obj){
	var props = "" ; 
	for ( var p in obj ){ 
		if ( typeof ( obj [ p ]) == "function" ){ 
			obj [ p ]() ; 
		} else { 
			props += p + "=" + obj [ p ] + "&" ; 
		} 
	}
	//alert(props);
	return  encodeURIComponent(props) ; 
}

/**
 * 去左空格
 * @param s 输入字符串
 */
function ltrim(s) {
    return s.replace(/^\s*/, "");
}
/**
 * 去右空格
 * @param s 输入字符串
 */ 
function rtrim(s) {
    return s.replace(/\s*$/, "");
}
/**
 * 去左右空格
 * @param s 输入字符串
 */
function trim(s) {
    return rtrim(ltrim(s));
}
/** 
* 读取Cookie
* @param key Cookie的键
* @returns 返回Cookie的值
*/ 
function GetCookieValue(key) {
    var cookies = document.cookie.split("; ");
    var value = "";
    var count = 0;
    count = cookies.length;
    for (var iCookie = 0; iCookie < count; iCookie++) {
        var arr = cookies[iCookie].split("=");
        if (trim(arr[0]) == trim(key)) {
            value = unescape(arr[1]);
            return value;
        }
    }
    return value;
}
/** 
* 写Cookie
* @param key Cookie的键
* @param value Cookie的值
*/
function SetCookieValue(key, value) {
	value = escape(value);
	document.cookie = key + "=" + value;
}

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

Date.prototype.subtractMonths= function(m)
{
    var d = this.getDate();
    this.setMonth(this.getMonth() - m);

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


// 转换日期格式 
function parseISO8601(dateStringInRange) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
        date = new Date(NaN), month,
        parts = isoExp.exec(dateStringInRange);
    if(parts) {
      month = +parts[2];
      date.setFullYear(parts[1], month - 1, parts[3]);
      if(month != date.getMonth() + 1) {
        date.setTime(NaN);
      }
    }
    return date;
 }

/**
 * 显示或隐藏等待框
 * @param isShow true-显示 false-隐藏
 */
function ShowWaitting(isShow){
	if(isShow)
	{
        $("#fwaitting").css({'display': 'block'});
        $("#fwaittingTable").css({'display': 'block'});
	}
	else
	{
        $("#fwaitting").css({'display': 'none'});	
        $("#fwaittingTable").css({'display': 'none'});	
	}
}
 

/**
 * 生成UUID
 */
var CreateUUID = (function (uuidRegEx, uuidReplacer) {
    return function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
    };
})(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == "x" ? r : (r & 3 | 8);
    return v.toString(16);
});

/**
 * 检查邮箱格式是否输入正确
 * @param strEmail 邮箱地址
 * @returns {boolean}
 */
function IsEmail(strEmail)
{
    var result = false;
    if(strEmail.length != 0) {
        var reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if(reg.test(strEmail)) {
            result = true;
        }
    }
    return result;
}
 