import mongoose from "mongoose";
import Joi from "Joi";
import joiObjectId from "joi-objectid";
Joi.objectId = joiObjectId(Joi);

export default () =>
  Object.freeze({
    schema: userSchema,
    model: User,
    validate,
  });

const userSchema = mongoose.Schema({
  name: String,
  roomId: mongoose.Schema.Types.ObjectId,
});

const User = mongoose.model("user", userSchema);

const validate = (user) => {
  const validateUserSchema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    roomId: Joi.objectId(),
  });

  return validateUserSchema.validate(user);
};
