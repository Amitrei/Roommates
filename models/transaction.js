import mongoose from "mongoose";
import Joi from "Joi";
import joiObjectId from "joi-objectid";
Joi.objectId = joiObjectId(Joi);

export default () =>
  Object.freeze({
    schema: transactionSchema,
    model: Transaction,
    validate,
  });

const transactionSchema = mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  madeBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, default: 0, min: 0, required: true },
  category: { type: Number, required: true },
  date: { type: Date, default: new Date() },
});

const Transaction = mongoose.model("transaction", transactionSchema);


const validate = (transaction) => {
  const validateTransactionSchema = Joi.object({
    roomId: Joi.objectId().required(),
    madeBy: Joi.objectId().required(),
    amount: Joi.number().min(0).required(),
    category: Joi.number().required(),
    date: Joi.date().allow(null),
  });

  return validateTransactionSchema.validate(transaction);
};
