import { Schema, model } from "mongoose";
import validator from "validator";

const adminSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Email is not valid. Please fill a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
  },
  blogPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
    },
  ],
  featuredPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
    },
  ],
  subscribers: [
    {
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function (value) {
            return validator.isEmail(value);
          },
          message: "Email is not valid. Please fill a valid email address",
        },
      },
      subscribedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Admin = model("Admin", adminSchema);

export default Admin;
