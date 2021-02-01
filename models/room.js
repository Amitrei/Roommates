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
  admin: Number,
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
    name: Joi.string().required().min(3).alphanum().max(30),
    adming: Joi.number(),
    members: Joi.array().items(Joi.objectId()),
    transactions: Joi.array().items(Joi.objectId()),
    totalExpenses: Joi.number().min(0)
  });

  return validateRoomSchema.validate(room);
};

const Room = mongoose.model("room", roomSchema);
