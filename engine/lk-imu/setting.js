
module.exports = {
  '/':{ 
    header:'/lk-imu/web/header.ejs',
    title:'采集设备' 
  },
  "/runstatus":{
    header:'/lk-imu/web/header.ejs',
    title:'运行状态',
    service:"service",
    method: "runStatus"
  },
  "/devmodel":{
    header:'/lk-imu/web/header.ejs',
    title:'硬件型号',
    service:"service",
    method: "devModel"
  },
  "/software":{
    header:'/lk-imu/web/header.ejs',
    title:'软件版本',
    service:"service",
    method: "software"
  }
}