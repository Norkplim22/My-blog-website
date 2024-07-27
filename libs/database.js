import mongoose from "mongoose";

export default async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database is connected!");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
}
