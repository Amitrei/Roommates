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
  email: { type: String, required: true, unique: true },
  googleId: { type: Number, required: true, unique: true },
  profilePicture: { type: String },
  roomId: {type : mongoose.Schema.Types.ObjectId, default:null},
});

const User = mongoose.model("user", userSchema);

const validate = (user) => {
  const validateUserSchema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    profilePicture: Joi.string(),
    googleId: Joi.number().unsafe().required(),
    roomId: Joi.objectId().allow(null),
  });

  return validateUserSchema.validate(user);
};
