module.exports = function(sequelize, DataTypes) {
  var menu = sequelize.define('lk_main_menu', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: { //菜单名称
      type: DataTypes.STRING,
      allowNull : false
    },
    url: {  //对应模块入口
      type: DataTypes.STRING,
      allowNull : false
    }, 
    type: {  //菜单类型  （1、首页；2、功能菜单）
      type: DataTypes.STRING
    },
    pid: {  //父菜单ID 
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue : DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue : DataTypes.NOW
    }
  }, {
    freezeTableName: true
  });
  return menu;
};