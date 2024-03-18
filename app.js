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

app.use("/", mainRoute);
const path = require("path");
app.use((req, res) => {
	res.sendFile(path.join(__dirname, `public/${req.url}`));
});

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