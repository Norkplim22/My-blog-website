import { Schema, model } from "mongoose";

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
});

const Admin = model("Admin", adminSchema);

export default Admin;
