const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { sendMessage , getMessages,delete_message} = require("../controllers/message.controller");

router.post("/send", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getMessages);
router.delete("/:messageId", authMiddleware, delete_message);

module.exports = router;
