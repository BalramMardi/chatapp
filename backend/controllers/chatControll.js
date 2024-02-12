// import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";
// import Chats from "../models/chatModel.mjs";

import Chats from "../models/chatsModel.js";

export const accessChat = async (req, res) => {
  const { userid } = req.body;

  if (!userid) {
    return res.status(404).send({
      success: false,
      message: "no user found",
    });
  }

  var isChat = await Chats.find({
    isGroup: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.body.userId } },
      },
      {
        users: { $elemMatch: { $eq: userid } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroup: false,
      users: [req.body.userId, userid],
    };

    try {
      const createdChat = await Chats.create(chatData);
      const FullChat = await Chats.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  }
};

export const fetchChat = async (req, res) => {
  try {
    Chats.find({
      users: {
        $elemMatch: {
          $eq: req.body.userId,
        },
      },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "fetchChat failed",
    });
  }
};

export const createGroup = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group Chats");
  }

  users.push(req.body.userId);

  try {
    const groupChat = await Chats.create({
      chatName: req.body.name,
      users: users,
      isGroup: true,
      groupAdmin: req.body.userId,
    });

    const fullGroupChat = await Chats.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chats.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chats Not Found");
  } else {
    res.json(updatedChat);
  }
};

export const addUser = async (req, res) => {
  const { chatId, userid } = req.body;

  // check if the requester is admin

  const added = await Chats.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userid },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chats Not Found");
  } else {
    res.json(added);
  }
};

export const removeUser = async (req, res) => {
  const { chatId, userid } = req.body;

  // check if the requester is admin

  const removed = await Chats.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userid },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chats Not Found");
  } else {
    res.json(removed);
  }
};

/* import chatModel from "../models/chatModel.js";

export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(404).send({
        success: false,
        message: "No user found",
      });
    }

    const isChat = await chatModel
      .find({
        isGroup: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("latestMessage.sender", "name pic email");

    if (isChat.length > 0) {
      return res.status(201).json({
        success: true,
        message: "Chats exists",
        Chats: isChat[0],
      });
    }

    const chatData = {
      chatName: "sender", // You may want to change this
      isGroup: false,
      users: [req.user._id, userId],
    };

    const createdChat = await chatModel.create(chatData);
    const fullChat = await chatModel
      .findOne({ _id: createdChat._id })
      .populate("users", "-password");

    res.status(200).json(fullChat);
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};
 */
