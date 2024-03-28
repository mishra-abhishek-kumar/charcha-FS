const express = require("express");
const app = express();

//import required to create environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

//import required to parse JSON data from a POST request
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//import required for main-routing
const mainRoute = require("./routes/index");

//imports required for DB connection and table creation
const sequelize = require("./util/dbConnect");
const User = require("./models/User");
const Message = require("./models/Message");

app.use("/", mainRoute);
const path = require("path");
app.use((req, res) => {
	res.sendFile(path.join(__dirname, `public/${req.url}`));
});

//Defining relations between models
User.hasMany(Message, { as: "sentMessages", foreignKey: "senderId" });
Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

User.hasMany(Message, { as: "ReceivedMessages", foreignKey: "RecipientId" });
//Message.belongsTo(User, { as: "Recipient", foreignKey: "RecipientId" });
//association between group and messages
Group.hasMany(Message, { as: "GroupMessages", foreignKey: "GroupId" });
//Message.belongsTo(Group, { as: "Group", foreignKey: "GroupId" });

const PORT = process.env.PORT || 4001;
// sequelize.sync({ force: true })
sequelize
	.sync()
	.then((user) => {
		app.listen(PORT, () => {
			console.log("Listening on PORT:", PORT);
		});
	})
	.catch((err) => console.log(err));
