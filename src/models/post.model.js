import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
