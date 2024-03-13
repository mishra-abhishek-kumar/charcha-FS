const express = require("express");
const app = express();

//import required to create environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const path = require("path");
app.use("/", (req, res) => {
	res.sendFile(path.join(__dirname, `public/${req.url}`));
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
	console.log("Listening on PORT: ", PORT);
});
