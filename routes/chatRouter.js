const router = require("express").Router();
const chatController = require("../controllers/chatController");
const requiredUser = require("../middlewares/requiredUser");

router.get("/get-users", requiredUser, chatController.getUsers);
router.post("/send-message/:reciepientId", requiredUser, chatController.sendMessage);
// router.post("/send-message", requiredUser, chatController.sendMessage);
// router.get("/get-message/:lastmsgId", requiredUser, chatController.getMessage);
router.get("/get-message/:reciepientId", requiredUser, chatController.getMessages);

module.exports = router;
