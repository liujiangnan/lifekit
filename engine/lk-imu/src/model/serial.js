module.exports = function(sequelize, DataTypes) {
    var serial = sequelize.define('lk_imu_serial', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      name: { //名称
        type: DataTypes.STRING
      },
      discription:{ //描述
        type: DataTypes.STRING
      },
			status:{ //串口状态
        type: DataTypes.STRING
      },  
			sendbit:{//发送字节
				type: DataTypes.STRING
			},  
			receivebit:{//接收字节
				type: DataTypes.STRING
			},  
			errorRate:{//误码率
				field:"error_rate",
				type: DataTypes.STRING
			},  
			baudRate:{//波特率
				field:"baud_rate",
				type: DataTypes.STRING
			},  
			bitLength:{//数据字长
				field:"bit_length",
				type: DataTypes.STRING
			},  
			validate:{//校验方式
				type: DataTypes.STRING
			},  
			stopBit:{//停止位
				field:"stop_bit",
				type: DataTypes.STRING
			}, 
			drive:{//驱动
				type: DataTypes.STRING
			},  
			param:{//参数 
				type: DataTypes.STRING
			},  
			commandTimeInterval:{//命令时间间隔
				field:"command_time_interval",
				type: DataTypes.STRING
			}, 
			bytesStreamMode:{//字节流方式 
				field:"bytes_stream_mode",
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
    return serial;
  };