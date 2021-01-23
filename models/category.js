import mongoose from "mongoose";

export const categorySchema = mongoose.Schema({
  name: String,
  img: String,
  description: String,
});

export const categoryModel = mongoose.model("category", categorySchema);
