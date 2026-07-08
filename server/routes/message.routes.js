const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { sendMessage , getMessages} = require("../controllers/message.controller");

router.post("/send", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getMessages);

module.exports = router;