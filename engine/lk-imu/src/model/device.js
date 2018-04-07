module.exports = function (sequelize, DataTypes) {
	var device = sequelize.define('lk_imu_device', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			unique: true
		},
		name: { //名称
			type: DataTypes.STRING
		},
		pointer: { //空间坐标
			type: DataTypes.STRING
		},
		status: { //通讯状态
			type: DataTypes.STRING
		},
		discription: { //描述
			type: DataTypes.STRING
		},  
		timeout: {  //设备超时
			type: DataTypes.STRING
		},
		address: {  //设备地址
			type: DataTypes.STRING
		},
		bitLength: {//数据字长
			field:"bit_length",
			type: DataTypes.STRING
		},
		packetSize: { //包长
			field:"packet_size",
			type: DataTypes.STRING
		}, 
		registerDifference: {//寄存器差值
			field:"register_difference",
			type: DataTypes.STRING
		}, 
		hexDataformat: { //16位数据格式
			field:"hex_dataformat",
			type: DataTypes.STRING
		},
		thirtyTwoDataformat: { //32位数据格式
			field:"thirty_two_dataformat",
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
	return device;
};