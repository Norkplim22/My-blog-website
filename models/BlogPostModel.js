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
      enum: ["study-abroad", "stay-motivated", "lifestyle-and-health"], // Replace with your actual categories
      // required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  { timestamps: true }
);

const BlogPost = model("BlogPost", blogPostSchema);

export default BlogPost;
