const Sequelize = require("sequelize");
const sequelize = require("../util/dbConnect");

const Message = sequelize.define("message", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	sentFrom: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	message: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
    imageUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
	messageTime: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	groupId: {
		type: Sequelize.INTEGER,
		allowNull: true,
		references: {
			model: "groups", // 'groups' refers to table name
			key: "id", // 'id' refers to column name in groups table
		},
	},
});

module.exports = Message;