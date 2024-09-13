import { Schema, model } from "mongoose";

// const commentSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       match: [/.+\@.+\..+/, "Please fill a valid email address"],
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     approved: {
//       type: Boolean,
//       default: false,
//     },
//     replies: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Comment", // Reference to another comment, enabling nested comments
//       },
//     ],
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

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
    featured: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const BlogPost = model("BlogPost", blogPostSchema);

export default BlogPost;
