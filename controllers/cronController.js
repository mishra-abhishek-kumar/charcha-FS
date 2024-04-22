const Message = require("../models/Message");
const ArchivedMessage = require("../models/ArchivedMessage");
const { Op } = require("sequelize");

const moveChats = async (req, res) => {
	try {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		const messages = await Message.findAll({
			where: {
				createdAt: {
					[Op.gte]: yesterday,
				},
			},
		});

		// Move/add fetched messages to another table
		await ArchivedMessage.bulkCreate(messages.map((msg) => msg.toJSON()));

		// Delete fetched messages from the original table
		await Message.destroy({
			where: {
				createdAt: {
					[Op.gte]: yesterday,
				},
			},
		});

		return res.json({
			message: "Messages moved to another table successfully",
		});
	} catch (error) {
		console.error("Error in cronController to move and delete messages", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = { moveChats };
