const router = require("express").Router();
const chatController = require("../controllers/chatController");
const requiredUser = require("../middlewares/requiredUser");

router.post("/send-message", requiredUser, chatController.sendMessage);
router.get("/get-message/:lastmsgId", requiredUser, chatController.getMessage);

module.exports = router;
