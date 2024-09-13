import { Schema, model } from "mongoose";
import validator from "validator";

const commentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [2, "Name should be more than one character long"],
    },
    email: {
      type: String,
      required: true,
      // match: [/.+\@.+\..+/, "Please fill a valid email address"],
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Email is not valid. Please fill a valid email address",
      },
    },
    content: {
      type: String,
      required: [true, "Please enter your comment before submitting"],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      default: "User",
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

export default Comment;
