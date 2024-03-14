const router = require("express").Router();
const userRoute = require("./authRouter");

router.use("/user", userRoute);

module.exports = router;