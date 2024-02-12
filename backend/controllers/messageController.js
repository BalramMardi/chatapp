import Chats from "../models/chatsModel.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";

export const allMessage = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ chat: req.params.chatid })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export const sendMessage = async (req, res) => {
  const { content, chatid } = req.body;

  if (!content || !chatid) {
    console.log("invalid content or chatid passed");
    return res.status(400).send({
      success: false,
      message: "Invalid Content or Chatid passed",
    });
  }

  var newMessage = {
    sender: req.body.userId,
    content: content,
    chat: chatid,
  };

  try {
    var message = await messageModel.create(newMessage);

    message = await message.populate([{ path: "sender", select: "name pic" }]);

    message = await message.populate("chat");

    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chats.findByIdAndUpdate(req.body.chatid, { latestMessage: message });

    res.status(201).send({
      success: true,
      message: "Chat successfully send",
      message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in sending message",
    });
  }
};
