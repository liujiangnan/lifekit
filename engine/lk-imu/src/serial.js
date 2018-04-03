

function serial (net){ 
  //串口树
  net.data.treeData = [{ 
    id:1,
    label: '串口 1'
  }];
  //树属性
  net.data.treeProps = { 
    id: "id",
    label: "name",
    children: "children"
  };
  //串口属性
  net.data.serialProp = {
    id:"",
    name:"",
    discription:"",
    status:"",  //串口状态
    sendbit:"",  //发送字节
    receivebit:"",  //接收字节
    errorRate:"",  //误码率
    baudRate:"",  //波特率
    bitLength:"",  //数据字长
    validate:"",  //校验方式
    stopBit:"", //停止位

    drive:"",  //驱动
    pamam:"",  //参数 
    commandTimeInterval:"", //命令时间间隔
    bytesStreamMode:""  //字节流方式 
  }
  //设备列表
  net.data.devList = [{name:"dev1",status:'1',address:'1'}];
  this.init = async function(ctx,parms){ 
    return ctx.render("lk-imu/web/serial/index.ejs",{});
  }
  this.saveSerial = function(){

  }
}

module.exports = serial;