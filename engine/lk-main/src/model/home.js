module.exports = function(sequelize, DataTypes) {
  var home = sequelize.define('lk_main_home', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: { //网站名称
      type: DataTypes.STRING,
      allowNull : false
    },
    logo: {  //公司图标
      type: DataTypes.STRING,
      allowNull : false
    }, 
    loginUrl: {  //用户登录地址
      field: 'login_url',
      type: DataTypes.STRING
    },
    logoutUrl: {  //用户登出地址
      field: 'logout_url',
      type: DataTypes.STRING
    },
    changePwdUrl: {  //修改密码地址
      field: 'change_pwd_url',
      type: DataTypes.STRING
    },
    editUrl: {  //修改个人信息地址
      field: 'edit_url',
      type: DataTypes.STRING
    },
    ncStr: {  //昵称对应字段
      field: 'nc_column',
      type: DataTypes.STRING
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
  return home;
};