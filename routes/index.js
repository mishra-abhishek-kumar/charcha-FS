const router = require("express").Router();
const userRoute = require("./authRouter");
const userChat = require("./chatRouter");
const userGroup = require("./groupRouter");

router.use("/user", userRoute);
router.use("/chat", userChat);
router.use("/group", userGroup);

module.exports = router;
