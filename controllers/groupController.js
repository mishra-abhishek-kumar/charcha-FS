const Group = require("../models/Group");
const userGroup = require("../models/UserGroup");

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
	userIds.push(req.id);
	const groupId = req.params.groupId;

	if (!userIds) {
		return res.status(400).send("userIds not provided");
	}

	try {
		// Iterate over the userIds array and create a UserGroup entry for each
		const creationPromises = userIds.map((userId) =>
			userGroup.create({ userId, groupId, isAdmin: userId === req.id })
		);

		// Wait for all the UserGroup entries to be created
		await Promise.all(creationPromises);

		// Send a response back
		return res
			.status(201)
			.json({ success: true, message: "users added to the group" });
	} catch (error) {
		console.log("Error in createGroupUsers controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	createGroup,
	createGroupUSers,
};
