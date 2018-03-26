module.exports = function(sequelize, DataTypes) {
  var roleEngine = sequelize.define('role_engine', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    engine_id: {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    engine_auth_id: {
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
  return roleEngine;
};