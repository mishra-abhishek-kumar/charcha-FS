const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signUpController);

module.exports = router;