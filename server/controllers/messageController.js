const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// @description: Send a new message
// @route: POST /api/message
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    // 1. Create the message
    var message = await Message.create(newMessage);

    // 2. Populate sender details (name, pic)
    message = await message.populate("sender", "name pic");
    
    // 3. Populate chat details
    message = await message.populate("chat");
    
    // 4. Populate users inside that chat
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // 5. Update the Chat's "latestMessage" field
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @description: Get all messages for a specific chat
// @route: GET /api/message/:chatId
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
      
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };