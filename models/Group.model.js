import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    profile: {
      type: String, // URL or path to the group profile image
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Group = mongoose.model("Group", groupSchema);
