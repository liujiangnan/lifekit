
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
  }
}