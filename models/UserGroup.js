const Sequelize = require("sequelize");
const sequelize = require("../util/dbConnect");

const UserGroup = sequelize.define("userGroup", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	userId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: "users", // 'users' refers to table name
			key: "id", // 'id' refers to column name in users table
		},
	},
	groupId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: "groups", // 'groups' refers to table name
			key: "id", // 'id' refers to column name in groups table
		},
	},
	isAdmin: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
	},
});

module.exports = UserGroup;
