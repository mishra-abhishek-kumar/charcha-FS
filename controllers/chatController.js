const User = require("../models/User");
const Message = require("../models/Message");
const { Op } = require("sequelize");

const sendMessage = async (req, res, next) => {
	const { userName, message } = req.body;
	try {
		const user = await User.findByPk(req.id);
		const chat = await Message.create({
			sentFrom: userName,
			message: message,
			senderId: req.id,
		});
		return res.status(200).json({ user });
	} catch (error) {
		return res.status(500).send(error);
	}
};

const getMessage = async (req, res, next) => {
	try {
		const chats = await Message.findAll({
            where: {
              id: {
                [Op.gt]: req.params.lastmsgId // Use 'Op.gt' for 'greater than'
              }
            }
          });
		return res.status(200).json(chats);
	} catch (error) {
		return res.status(500).send(error);
	}
};

module.exports = {
	sendMessage,
	getMessage,
};
