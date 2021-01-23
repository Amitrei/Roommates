import mongoose from "mongoose";
import Joi from "Joi";

export const transactionSchema = mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  transactions: {
    type: [
      {
        type: String,
        madeBy: Number,
        amount: Number,
        category: Number,
        date: Date,
      },
    ],
    default: [],
  },
});

export const Transcation = mongoose.model("transaction", transactionSchema);

// Joi validation
