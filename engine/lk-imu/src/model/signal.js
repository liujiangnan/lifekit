module.exports = function (sequelize, DataTypes) {
	var signal = sequelize.define('lk_imu_signal', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			unique: true
    },
    devId: {  //所属设备ID
      field:"dev_id",
      type: DataTypes.INTEGER
    },
    serialId: {  //所属串口ID
      field:"serial_id",
      type: DataTypes.INTEGER
    },
		name: { //名称
			type: DataTypes.STRING
		},
    pointName: { //点号
      field:"point_name",
			type: DataTypes.STRING
    },  
		discription: { //描述
			type: DataTypes.STRING
    }, 
    pNumber: {  //编号
      field:"p_number",
			type: DataTypes.STRING
    },
    invented: {  //是否是虚拟量
      type: DataTypes.BOOLEAN
    },  
    functionCode: {  //功能码
      field:"function_code",
			type: DataTypes.STRING
		},
		address: {  //寄存器地址
			type: DataTypes.STRING
		},
		storageCount: {//寄存器个数
			field:"storage_count",
			type: DataTypes.STRING
		},
		dataType: { //数据类型
			field:"data_type",
			type: DataTypes.STRING
		}, 
		coefficient: {//系数
			type: DataTypes.STRING
		}, 
		cardinalNumber: { //基数
			field:"cardinal_number",
			type: DataTypes.STRING
		},
		scanningPeriod: { //扫描周期
			field:"scanning_period",
			type: DataTypes.STRING
    },
    offset:{  //偏移量
      type: DataTypes.STRING
    },
    bitLength:{  //位长度
      type: DataTypes.STRING
    },
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	}, {
			freezeTableName: true
		});
	return signal;
};