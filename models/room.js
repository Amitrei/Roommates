import mongoose from "mongoose";
import { transactionSchema } from "./transaction.js";

export const roomSchema = mongoose.Schema({
  name: String,
  admin: Number,
  members: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] },
  transactions: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "transaction" }],
    default: [],
  },
});

export const Room = mongoose.model("room", roomSchema);