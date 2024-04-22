const router = require("express").Router();
const chatController = require("../controllers/chatController");
const requiredUser = require("../middlewares/requiredUser");

router.get("/get-users", requiredUser, chatController.getUsers);
router.post(
	"/send-message/:reciepientId",
	requiredUser,
	chatController.sendMessage
);
router.get(
	"/get-message/:reciepientId",
	requiredUser,
	chatController.getMessages
);
router.post("/uploadToS3", requiredUser, chatController.uploadFileToS3);
router.post(
	"/send-image/:reciepientId",
	requiredUser,
	chatController.sendImageAsMessage
);

module.exports = router;
