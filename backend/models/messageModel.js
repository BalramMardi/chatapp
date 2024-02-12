import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.ObjectId, ref: "Chats" },
    readBy: [{ type: mongoose.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
