const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signUpController);
router.post("/signin", authController.signInController);

module.exports = router;