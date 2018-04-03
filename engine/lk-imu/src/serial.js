

function serial (net){ 
  //串口树
  net.data.treeData = [{ 
    id:1,
    label: '串口 1'
  }];
  //树属性
  net.data.treeProps = { 
    id: "id",
    label: "label",
    children: "children"
  };
  //串口属性
  net.data.serialProp = {
    cpu:""
  }
  //设备列表
  net.data.devList = [{name:"dev1",status:'1',address:'1'}];
  this.init = async function(ctx,parms){ 
    return ctx.render("lk-imu/web/serial/index.ejs",{});
  }
}

module.exports = serial;