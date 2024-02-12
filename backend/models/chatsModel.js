import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    chatName: {
      type: String,
      required: true,
      trim: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },

    users: [
      {
        type: mongoose.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chats", chatSchema);

/* const Chats = mongoose.model("Chats", chatSchema);

export default Chats; */
