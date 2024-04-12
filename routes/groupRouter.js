const router = require("express").Router();
const requiredUser = require("../middlewares/requiredUser");
const groupController = require("../controllers/groupController");

router.post("/create-group", requiredUser, groupController.createGroup);
router.post("/create-group-users/:groupId", requiredUser, groupController.createGroupUSers);
router.get("/get-usergroups", requiredUser, groupController.getUserGroups);
router.get("/get-groups/:groupId", requiredUser, groupController.getGroups);
router.get("/isAdmin/:userId/:groupId", requiredUser, groupController.isAdmin);
router.get("/get-messages/:groupId", requiredUser, groupController.getGroupMessages);
router.post("/send-message/:reciepientId", requiredUser, groupController.sendMessage);
router.get("/group-users/:groupId", requiredUser, groupController.getGroupUsers);
router.get("/get-single-user/:userId", requiredUser, groupController.getSingleUser);
router.put("/make-admin/:groupId/:userId", groupController.makeUserAdmin);
router.delete("/remove-user/:groupId/:userId", groupController.removeUserFromGroup);

module.exports = router;