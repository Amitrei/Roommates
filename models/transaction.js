import mongoose from "mongoose";
import Joi from "Joi";
import joiObjectId from "joi-objectid";
import moment from "moment";
Joi.objectId = joiObjectId(Joi);

export default () =>
  Object.freeze({
    schema: transactionSchema,
    model: Transaction,
    validate,
  });

const currentDate = moment().format("DD/MM/YYYY HH:mm").toString();

const transactionSchema = mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  madeBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  madeByEmail: { type: String, required: true },
  amount: { type: Number, min: 1, required: true },
  category: { type: Number, required: true },
  date: { type: String, default: currentDate },
});

export const Transaction = mongoose.model("transaction", transactionSchema);

const validate = (transaction) => {
  const validateTransactionSchema = Joi.object({
    roomId: Joi.objectId().required(),
    madeBy: Joi.objectId().required(),
    madeByEmail: Joi.string().required().email(),
    amount: Joi.number().integer().min(1).required(),
    category: Joi.number().required(),
    date: Joi.string().allow(null),
  });

  return validateTransactionSchema.validate(transaction);
};
