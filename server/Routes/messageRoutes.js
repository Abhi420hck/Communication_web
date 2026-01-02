const express = require("express");
const { allMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages); // Get all messages
router.route("/").post(protect, sendMessage);       // Send a message

module.exports = router;