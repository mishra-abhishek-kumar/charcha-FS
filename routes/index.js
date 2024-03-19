const router = require("express").Router();
const userRoute = require("./authRouter");
const userChat = require("./chatRouter");

router.use("/user", userRoute);
router.use("/chat", userChat);

module.exports = router;
