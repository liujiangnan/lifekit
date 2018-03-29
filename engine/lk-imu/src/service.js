
function service(net){

  this.runStatus = async function(ctx,parms){
    net.data.form = {
      name: 'abc',
      cpu: '111',
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: ''
    }
    return ctx.render("lk-imu/web/devinfo/run_status.ejs",{});
  }
}

module.exports = service;