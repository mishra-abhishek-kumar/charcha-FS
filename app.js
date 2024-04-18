const express = require("express");
const app = express();

//import require for creating http server
const http = require("http");
const server = http.createServer(app);

//import require for socket.io connection
const { Server } = require("socket.io");
const io = new Server(server); //initializing a new instance of socket.io by passing the server (the HTTP server) object

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
const Group = require("./models/Group");
const UserGroup = require("./models/UserGroup");

app.use("/", mainRoute);
const path = require("path");
app.use((req, res) => {
	res.sendFile(path.join(__dirname, `public/${req.url}`));
});

//making socket.io connection
// io.on("connection", (socket) => {
// 	console.log("a user connected with ID:",socket.id);
// 	socket.on("disconnect", () => {
// 		console.log("user disconnected");
// 	});
// });

io.on('connection', (socket) => {
    console.log("a user connected with ID:",socket.id);

    socket.emit('user-socket-ID', socket.id);

    socket.on('user-chat-message', (msg, socketId) => {
        io.emit('chat-message', msg);
    });
  });

//Defining relations between models
// User and Group many-to-many relationship
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

// Messages can belong to a Group (group chat) or directly to a User (private chat)
Message.belongsTo(Group, { foreignKey: "groupId", as: "group" });
Group.hasMany(Message, { foreignKey: "groupId", as: "messages" });

User.hasMany(Message, { as: "sentMessages", foreignKey: "senderId" });
Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

User.hasMany(Message, { as: "receivedMessages", foreignKey: "reciepientId" });
Message.belongsTo(User, { as: "recipient", foreignKey: "reciepientId" });

const PORT = process.env.PORT || 4001;
// sequelize.sync({ force: true })
sequelize
	.sync()
	.then((user) => {
		server.listen(PORT, () => {
			console.log("Listening on PORT:", PORT);
		});
	})
	.catch((err) => console.log(err));
