const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUpController = async (req, res) => {
	try {
		//spreading user information from request body
		const { name, email, phone, password } = req.body;

		//checking if any field is empty
		if (!name || !email || !phone || !password) {
			return res.status(400).send("All fields are required");
		}

		//checking if the user already registered
		const oldUser = await User.findAll({ where: { email: email } }); //this returns an array
		if (oldUser.length > 0) {
			return res.status(409).send("User is already registered");
		}

		//hashing the password using bcrypt
		const hashedPassword = await bcrypt.hash(password, 10);

		// creating new user
		const user = await User.create({
			name,
			email,
			phone,
			password: hashedPassword,
		});

		//generating accessToken
		const accessToken = generateAccessToken({ id: user.id });

		return res.status(201).json({ user, accessToken });
	} catch (error) {
		console.log("Error in signUp controller", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
};

const signInController = async (req, res) => {
	try {
		//spreading user information from request body
		const { email, password } = req.body;

		//checking if any field is empty
		if (!email || !password) {
			return res.status(400).send("Enter all the fields");
		}

		//cheking if user exists
		const user = await User.findAll({ where: { email: email } });
		if (user.length == 0) {
			return res.status(409).send("User is not registered");
		}

		//checking entered password is correct or not
		const matchedPassword = await bcrypt.compare(password, user[0].password);
		if (!matchedPassword) {
			return res.status(403).send("Incorrect password");
		}

		//generating accessToken
		const accessToken = generateAccessToken({ id: user[0].id });

		//sending user on successful login
		return res.status(200).json({ user, accessToken });
	} catch (error) {
		console.log("Error in signIn controller", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
};

const generateAccessToken = (id) => {
	try {
		const accessToken = jwt.sign(id, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
			expiresIn: "1d",
		});
		return accessToken;
	} catch (error) {
		console.log("Error in generateAccessToken controller", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	signUpController,
	signInController,
};
