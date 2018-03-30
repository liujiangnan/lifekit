
function service(net){

  //运行状态
  this.runStatus = async function(ctx,parms){
    net.data.form = {
      firstDate: Date.now(),  //首次开机时间
      thisDate: '', //本次开机时间
      totleTime: '', //累计运行时长
      thisTime: '', //本次运行时长
      cpu: '95%', //CPU利用率
      ram: '', //内存利用率
      rom: '', //硬盘利用率

      devNow: Date.now(),  //系统当前时间
      updateNow: '',  //手动修改时间

      url: '/lk-imu',  //web域名
      effectiveDate: Date.now()+30*24*60*60*1000,  //有效日期
      isEdit: false  //是否可编辑
    }
    return ctx.render("lk-imu/web/devinfo/run_status.ejs",{});
  }

  //硬件型号
  this.devModel = async function(ctx,parms){
    net.data.form = {
      cpu: '',  
      ram: '', 
      nandflash: '', 
      com1: '', 
      com2: '', 
      com3: '',
      com4: '', 
      net1: '',
      net2: '',
      sn:'',
      isEdit: false  //是否可编辑
    }
    return ctx.render("lk-imu/web/devinfo/dev_model.ejs",{});
  }

  //软件版本
  this.software = async function (ctx,parms) {
    net.data.form = {
      linux:'',
      runing:'',
      webapp:''
    };
    return ctx.render("lk-imu/web/devinfo/software.ejs",{});
  }

  //当前工程
  this.projectInfo = async function(ctx,parms){
    net.data.form = {
      name:"",
      description:"",
      startDate:"",
      updateDate:"",
      author:"",
      version:""
    };
    return ctx.render("lk-imu/web/devinfo/project_info.ejs",{});
  }

  //产权信息
  this.propertyRight = async function(ctx,parms){
    net.data.form = {
      company:"",
      buytime:"",
      price:"",
      salesman:"",
      tel:""
    };
    return ctx.render("lk-imu/web/devinfo/property_right.ejs",{});
  }
}

module.exports = service;