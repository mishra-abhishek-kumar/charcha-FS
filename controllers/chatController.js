const User = require("../models/User");
const Message = require("../models/Message");
const { Op, Sequelize } = require("sequelize");
const AWS = require("aws-sdk");
const crypto = require('crypto');
const sharp = require('sharp');

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

        console.log("222222===>");
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

const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

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
            signatureVersion: 'v4',
		});

		const s3 = new AWS.S3();

        const buffer = await sharp(file.buffer).resize({height: 1920, width: 1080, fit: "contain"}).toBuffer();

		const params = {
			Bucket: process.env.BUCKET_NAME,
			Key: randomFileName(),
			Body: buffer,
			ContentType: file.mimetype,
		};

		// Upload file to S3
		const s3Response = await s3.upload(params).promise();

		// Generate signed URL for the uploaded file
        const signedUrlParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: params.Key,
            Expires: 604000, // URL expiration time in seconds (7 days in this case)
        };
        const signedUrl = await s3.getSignedUrlPromise('getObject', signedUrlParams);

        // Return the uploaded file URL and signed URL in the response
        return res.status(201).json({ url: s3Response.Location, signedUrl });
	} catch (error) {
		console.error("Error in uploadFileToS3 controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const sendImageAsMessage = async (req, res) => {
    const { userName, imageUrl, messageTime } = req.body;

	try {
		const chat = await Message.create({
			sentFrom: userName,
			imageUrl: imageUrl,
			messageTime: messageTime,
			senderId: req.id,
			reciepientId: req.params.reciepientId,
		});

		return res.status(200).json({ chat });
	} catch (error) {
		return res.status(500).send(error);
	}
}

module.exports = {
	getUsers,
	sendMessage,    
	getMessages,
	uploadFileToS3,
    sendImageAsMessage,
};
