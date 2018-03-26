module.exports = function(sequelize, DataTypes) {
  var userRole = sequelize.define('user_role', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull : false
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
  return userRole;
};