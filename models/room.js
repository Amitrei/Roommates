import mongoose from "mongoose";
import Joi from "joi";
import joiObjectId from "joi-objectid";
Joi.objectId = joiObjectId(Joi);

export default () =>
  Object.freeze({
    schema: roomSchema,
    model: Room,
    validate,
  });

const roomSchema = mongoose.Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 30 },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  transactions: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "transaction" }],
    default: [],
  },

  totalExpenses: { type: Number, default: 0, min: 0 },
});

const validate = (room) => {
  const validateRoomSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    admin: Joi.objectId().required(),
    members: Joi.array().items(Joi.objectId()),
    transactions: Joi.array().items(Joi.objectId()),
    totalExpenses: Joi.number().min(0),
  });

  return validateRoomSchema.validate(room);
};

export const Room = mongoose.model("room", roomSchema);
