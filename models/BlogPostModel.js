import { Schema, model } from "mongoose";

const blogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["study-abroad", "stay-motivated", "lifestyle-and-health"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const BlogPost = model("BlogPost", blogPostSchema);

export default BlogPost;
