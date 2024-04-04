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
		type: Sequelize.STRING,
		allowNull: false,
	},
    messageTime: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Message;
