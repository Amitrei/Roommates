import mongoose from "mongoose";
import Joi from "Joi";

export const transactionSchema = mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  madeBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, default: 0, min: 0, required: true },
  category: { type: Number, required: true },
  date: { type: Date, default: new Date() },
});

export const Transaction = mongoose.model("transaction", transactionSchema);

// Joi validation
