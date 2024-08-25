import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["User", "Group"],
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["send", "read", "delivered"],
      default: "send",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", chatSchema);
