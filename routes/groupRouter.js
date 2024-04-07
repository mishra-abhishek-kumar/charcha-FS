const router = require("express").Router();
const requiredUser = require("../middlewares/requiredUser");
const groupController = require("../controllers/groupController");

router.post("/create-group", requiredUser, groupController.createGroup);
router.post("/create-group-users/:groupId", requiredUser, groupController.createGroupUSers)

module.exports = router;