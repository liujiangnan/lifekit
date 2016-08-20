const EventEmitter = require('events');
const util = require('util');
util.inherits(ThreePro, EventEmitter);
function ThreePro() {
    var _this = this;
    EventEmitter.call(this);

    var alarmObj = {
        "id":123,
        "level":"1",  //告警等级
        "position":"0,75,100", //告警发生所在位置（空间坐标）
        "name":"灯光告警",//告警名称
        "desc":"二楼研发中心区域，非法使用电灯" //描述
    };

    var alarmObj2 = {
        "id":999,
        "level":"2",  //告警等级
        "position":"0,25,100", //告警发生所在位置（空间坐标）
        "name":"门禁告警",//告警名称
        "desc":"一楼门口区域，门禁断电，无法正常开关门" //描述
    };

    this.start = function(){
        var index = 1;
        var flag = setInterval(function(){
            var tag1 = Math.floor(Math.random()*10000);
            var tag2 = Math.floor(Math.random()*10000);
                setTimeout(function(){
                    index++;
                    alarmObj.id = alarmObj.id+index;
                    _this.emit("alarmEvent",alarmObj);
                },tag1);
                setTimeout(function(){
                    index++;
                    alarmObj2.id = alarmObj2.id+index;
                    _this.emit("alarmEvent", alarmObj2);
                },tag2);
        },10000);
    };


}

module.exports = ThreePro;

