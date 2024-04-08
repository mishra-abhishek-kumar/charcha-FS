const User = require("../models/User");
const Message = require("../models/Message");
const { Op, Sequelize } = require("sequelize");

const getUsers = async (req, res) => {
	try {
		const users = await User.findAll({
			where: { id: { [Sequelize.Op.ne]: req.id } },
		});
		return res.status(200).json({ users });
	} catch (error) {
		console.log("Error in getUsers controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const sendMessage = async (req, res, next) => {
	const { userName, message, messageTime } = req.body;
	try {
		const chat = await Message.create({
			sentFrom: userName,
			message: message,
			messageTime: messageTime,
			senderId: req.id,
			reciepientId: req.params.reciepientId,
		});
		return res.status(200).json({ chat });
	} catch (error) {
		return res.status(500).send(error);
	}
};

const getMessages = async (req, res, next) => {
	try {
		const messages = await Message.findAll({
			where: {
				senderId: {
					[Op.in]: [req.id, req.params.reciepientId],
				},
				reciepientId: {
					[Op.in]: [req.params.reciepientId, req.id],
				},
                groupId: { [Op.is]: null },
			},
		});

		const reciepientUser = await User.findByPk(req.params.reciepientId);

		return res.status(200).json({ chats: messages, reciepientUser });
	} catch (error) {
		return res.status(500).send(error);
	}
};

module.exports = {
	getUsers,
	sendMessage,
	getMessages,
};
