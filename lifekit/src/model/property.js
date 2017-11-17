/**
 * 键值(键值对)对Map<key,Map>
 */
function Property() {
	var Map = require('./map');
	this.properties = new Map();
    //获取Property元素个数
    this.size = function() {
        return this.properties.size();
    };

    //判断Property是否为空
    this.isEmpty = function() {
        return (this.properties.size() < 1);
    };

    //删除Property所有元素
    this.clear = function() {
    	this.properties.clear();
    };

    //向Property中增加元素(name, value) 
    this.put = function(_key, _name, _value) {
	  	var val = this.properties.get(_key);
	  	if(val==null){
	  		val = new Map();
	  	}
    	     val.put(_name, _value);
          this.properties.put(_key, val); 
    };

    //删除指定KEY的元素,成功返回True,失败返回False
    this.remove = function(_key) {
        return this.properties.remove(_key);
    };
    
	//删除指定KEY的元素,成功返回True,失败返回False
    this.remove = function(_key, _name) {
    	var val = this.get(_key);
    	val.remove(_name);
        this.properties.put(_key, val);
        return true;
    };
    
    //获取指定KEY的元素MAP,失败返回NULL
    this.get = function(_key) {
        var val = this.properties.get(_key);
        if(val==null)
        {
        	val = new Map();
        }
        return val;
    };
    
	//获取指定KEY和NAME的元素值VALUE,失败返回NULL
    this.getValue = function(_key, _name) {
        var val = this.properties.get(_key);
        if(val)
        {
        	return val.get(_name);
        }
        return null;
    };
    
    //获取指定索引的元素,失败返回NULL
    this.element = function(_index) {
        return this.properties.element(_index);
    };

    //判断MAP中是否含有指定KEY的元素
    this.containsKey = function(_key) {
        return this.properties.containsKey(_key);
    };


    //获取MAP中所有KEY的数组(ARRAY)
    this.keys = function() {
        return this.properties.keys();
    };

    this.getElementsByProperty = function(_name,_value){
        var items = new Property();
        var len = this.size();
        for(var i=0;i<len;i++){
            var item = this.element(i);
            var v = this.get(item.key);
            if(this.getValue(item.key,_name)==_value){
                items.properties.put(item.key,v);
            }
            
        }
        return items;
    };
};
module.exports = Property;  