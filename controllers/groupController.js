const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");
const Message = require("../models/Message");
const User = require("../models/User");

const createGroup = async (req, res) => {
	try {
		const group = await Group.create({
			name: req.body.groupName,
			description: req.body.groupDescription,
		});

		return res.status(201).json({ group });
	} catch (error) {
		console.log("Error in createGroup controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const createGroupUSers = async (req, res) => {
	const userIds = req.body.usersIds;
	userIds.push({ id: req.id, isAdmin: true });
	const groupId = req.params.groupId;

	if (!userIds) {
		return res.status(400).send("userIds not provided");
	}

	try {
		for (let i = 0; i < userIds.length; i++) {
			await UserGroup.create({
				userId: userIds[i].id,
				groupId,
				isAdmin: userIds[i].isAdmin,
			});
		}

		return res
			.status(201)
			.json({ success: true, message: "users added to the group" });
	} catch (error) {
		console.log("Error in createGroupUsers controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getUserGroups = async (req, res) => {
	try {
		const usergroups = await UserGroup.findAll({ where: { userId: req.id } });
		return res.status(200).json({ usergroups });
	} catch (error) {
		console.log("Error in getUserGroups controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getGroups = async (req, res) => {
	try {
		const groups = await Group.findAll({ where: { id: req.params.groupId } });
		return res.status(200).json({ groups });
	} catch (error) {
		console.log("Error in getGroups controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const isAdmin = async (req, res) => {
	try {
		const userId = parseInt(req.params.userId);
		const groupId = parseInt(req.params.groupId);

		const isAdmin = await UserGroup.findAll({
			where: { groupId: groupId, isAdmin: 1, userId: userId },
		});

		return res.status(200).json({ isAdmin });
	} catch (error) {
		console.log("Error in checking isAdmin controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getGroupMessages = async (req, res) => {
	try {
		const reciepientGroup = await Group.findByPk(req.params.groupId);
		const messages = await Message.findAll({
			where: { groupId: req.params.groupId },
		});
		return res.status(200).json({ chats: messages, reciepientGroup });
	} catch (error) {
		console.log("Error in getGroupMessages controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const sendMessage = async (req, res) => {
	const { userName, message, messageTime, groupId } = req.body;
	try {
		const chat = await Message.create({
			sentFrom: userName,
			message: message,
			messageTime: messageTime,
			groupId: groupId,
			senderId: req.id,
			reciepientId: req.params.reciepientId,
		});
		return res.status(200).json({ chat });
	} catch (error) {
		console.log("Error in sending group message controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getGroupUsers = async (req, res) => {
	try {
		const groupUsers = await UserGroup.findAll({
			where: { groupId: req.params.groupId },
		});

		return res.status(200).json({ groupUsers });
	} catch (error) {
		console.log("Error in getting group users controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getSingleUser = async (req, res) => {
	try {
		const user = await User.findByPk(req.params.userId);
		return res.status(200).json({ user });
	} catch (error) {
		console.log("Error in getSingleUsers from group controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const makeUserAdmin = async (req, res) => {

    try {
        const userId = parseInt(req.params.userId);
		const groupId = parseInt(req.params.groupId);

        const adminUser = await UserGroup.update({isAdmin: true}, {where: {groupId: groupId, userId: userId}});
        
        return res.status(200).json({adminUser});
    } catch (error) {
        console.log("Error in getUsersToUpdate controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
	createGroup,
	createGroupUSers,
	getUserGroups,
	isAdmin,
	getGroups,
	getGroupMessages,
	sendMessage,
	getGroupUsers,
	getSingleUser,
	makeUserAdmin,
};
