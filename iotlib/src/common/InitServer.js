/**
 * Created by liujn on 2014/10/30.
 */
function InitServer() {

    var initJson = require(root_path+"/iotlib/src/config/initserver.json");
    for(var i=0;i<initJson.length;i++){
        var item = initJson[i];
        var desc = item["desc"];
        //需要加载的类
        var objserver = item["server"];
        //需要执行的方法
        var objmethod = item["method"];
        try {
            var myService = require(root_path+"/modules/"+objserver);
            var svc = new myService();
            svc[objmethod]();
        } catch (e) {
            console.log(desc + "初始化执行异常，message：" + e);
        }
    }

}
module.exports = InitServer;