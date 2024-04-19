const User = require("../models/User");
const Message = require("../models/Message");
const { Op, Sequelize } = require("sequelize");
const AWS = require("aws-sdk");
const fs = require("fs");

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

const uploadFileToS3 = async (req, res) => {
	try {
		// Check if file exists in request
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const file = req.files[0]; // Since i am using multer with 'upload.any()' method, the req.files is an array of files

		// Configure AWS S3 with credentials
		AWS.config.update({
			accessKeyId: process.env.IAM_USER_KEY,
			secretAccessKey: process.env.IAM_USER_SECRET,
		});

		const s3 = new AWS.S3();

		const params = {
			Bucket: process.env.BUCKET_NAME,
			Key: file.originalname,
			Body: file.buffer, // Use buffer instead of data
			ContentType: file.mimetype,
		};

		// Upload file to S3
		const s3Response = await s3.upload(params).promise();

		// Return the uploaded file URL in the response
		return res.status(201).json({ url: s3Response.Location });
	} catch (error) {
		console.error("Error in uploadFileToS3 controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	getUsers,
	sendMessage,
	getMessages,
	uploadFileToS3,
};
