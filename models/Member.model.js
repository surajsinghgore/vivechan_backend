import mongoose, { Schema } from "mongoose";

const memberSchema = new Schema(
  {
    group_id: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permission: {
      type: String,
      enum: ["read", "readandwrite", "all"],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Member = mongoose.model("Member", memberSchema);
