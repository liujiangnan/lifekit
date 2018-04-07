

let _ = require('lodash');

const engineRoot = ENGINE_PATH + '/lk-imu';

const Sequelize = require('sequelize');
const datasource = require(engineRoot + '/src/config/datasource.json');
const sequelize = new Sequelize(
  datasource.database,
  datasource.username,
  datasource.password,
  datasource
);

let Serial = sequelize.import(engineRoot + '/src/model/serial.js');
let Device = sequelize.import(engineRoot + '/src/model/device.js');
let Signal = sequelize.import(engineRoot + '/src/model/signal.js');

// 定义 hasMany 关联
Serial.hasMany(Device, {as: 'Devices'});
Device.hasMany(Signal, {as: 'Signals',foreignKey:'devId'});



sequelize.sync({ force: false }).then(function() {
  console.log("框架模块数据结构初始化成功");
}).catch(function(err) {
  console.log("框架模块数据结构初始化失败: %s", err);
});

 

function serial (net){ 
    

  this.init = async function(ctx,parms){ 
    let treeData = [];
    let records = await Serial.findAll(); 
    //串口树
    for(let i=0;i<records.length;i++){
      let record = records[i];
      let dVal = record.dataValues;
      dVal.type = "serial"; //传感器类型（设置个类型，点击树的时候好区分表单）
      let devices = await record.getDevices();
      dVal.children = _.map(devices,function(item){
        let dev = item.dataValues;
        dev.type = "device"; //设备类型（设置个类型，点击树的时候好区分表单）
        return dev;
      });
      treeData.push(dVal);
    }
    net.data.treeData = treeData; 
    return ctx.render("lk-imu/web/serial/index.ejs",{});
  }
  this.saveSerial = async function(parms,callback){
    try {
      let item = {
        name:parms.name,
        discription:parms.discription,
        baudRate:parms.baudRate,  //波特率
        bitLength:parms.bitLength,  //数据字长
        validate:parms.validate,  //校验方式
        stopBit:parms.stopBit, //停止位 
        drive:parms.drive,  //驱动
        param:parms.param,  //参数 
        commandTimeInterval:parms.commandTimeInterval, //命令时间间隔
        bytesStreamMode:parms.bytesStreamMode  //字节流方式 
      }; 
      let res = await Serial.update(item,{where:{id:parms.id}}); 
      callback("success");
    } catch (error) {
      console.log(error);
      callback(error);
    }
  }
  this.saveDevice = async function(parms,callback){ 
    try {
      let item = {
        lkImuSerialId: parms.lkImuSerialId,
        name:parms.name,
        pointer: parms.pointer,
        discription:parms.discription,
        timeout:parms.timeout,  
        address:parms.address,  
        bitLength:parms.bitLength,  
        packetSize:parms.packetSize, 
        registerDifference:parms.registerDifference,  
        hexDataformat:parms.hexDataformat, 
        thirtyTwoDataformat:parms.thirtyTwoDataformat
      }; 
      if(parms.id){
        let res = await Device.update(item,{where:{id:parms.id}}); 
        callback({flag:"success"});
      }else{
        let res = await Device.create(item); 
        callback({flag:"success",data:res.dataValues});
      } 
    } catch (error) {
      console.log(error);
      callback(error);
    }
  }
  this.saveSignal = async function(parms,callback){
    try { 
      if(parms.id){
        let res = await Signal.update(parms,{where:{id:parms.id}}); 
        callback({flag:"success"});
      }else{
        let res = await Signal.create(parms); 
        callback({flag:"success",data:res.dataValues});
      } 
    } catch (error) {
      console.log(error);
      callback(error);
    }
  }
  this.deleteDevice = async function(id,callback){
    try {
      let res = await Device.destroy({where:{id:id}});
      callback("success");
    } catch (error) {
      callback(error);
    }
  }
  this.deleteSignal = async function(id,callback){
    try {
      let res = await Signal.destroy({where:{id:id}});
      callback("success");
    } catch (error) {
      callback(error);
    }
  }
  this.findSignals = async function(devId,callback){
    try {
      let res = null;
      let records = await Signal.findAll({where:{devId:devId}});
      if(records.length>0){
        res = {};
        for(let i=0;i<records.length;i++){
          let record = records[i];
          let functionCode = record.functionCode;
          if(res[functionCode]){
            res[functionCode].push(record.dataValues);
          }else{
            res[functionCode] = [record.dataValues];
          }
        }
      } 
      callback({flag:"success",data:res});
    } catch (error) {
      console.log(error);
      callback(error);
    }
  }
}

module.exports = serial;