import mongoose from "mongoose";
import Joi from "Joi";

export const userSchema = mongoose.Schema({
  name: String,
  roomId: mongoose.Schema.Types.ObjectId,
});

export const User = mongoose.model("user", userSchema);

export const validateUser = (user) => {
  const validateUserSchema = Joi.object({
    name: Joi.string().required().min(1).alphanum().max(20),
    roomId: Joi.number(),
  });

  return validateUserSchema(user);
};
