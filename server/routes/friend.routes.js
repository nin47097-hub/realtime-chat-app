const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { sendfriendrequest } = require("../controllers/friend.controller");
const router = express.Router();

router.post("/request/:userId",authMiddleware,sendfriendrequest);
module.exports = router;
