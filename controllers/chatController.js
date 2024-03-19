const User = require("../models/User");
const Message = require("../models/Message");

const sendMessage = async (req, res, next) => {
	const { userName, message } = req.body;
    console.log(req.body);
	try {
		const user = await User.findByPk(req.id);
		const chat = await Message.create({
            sentFrom: userName,
            message: message,
            senderId: req.id
        });
		return res.status(200).json({ chat });
	} catch (error) {
		return res.status(500).send(error);
	}
};

const getMessage = (req, res, next) => {
	// fs.readFile("chat.txt", "utf8", (err, data) => {
	// 	if (err) {
	// 		res.send(`Loading...`);
	// 	} else {
	// 		res.send(`${data}`);
	// 	}
	// });
};

module.exports = {
	sendMessage,
	getMessage,
};
