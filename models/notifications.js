import mongoose from "mongoose";
import Joi from "joi";
import joiObjectId from "joi-objectid";
Joi.objectId = joiObjectId(Joi);

export default () =>
  Object.freeze({
    schema: notificationSchema,
    model: Notification,
    validate,
  });

const notificationSchema = mongoose.Schema({
  type: { type: String, required: true },
  content: { type: String, required: true },
  seen: { type: Boolean, default: false },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  roomName: { type: String, required: true },
  sentTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const validate = (notification) => {
  const validateNotification = Joi.object({
    type: Joi.string().required(),
    content: Joi.string().required(),
    seen: Joi.boolean(),
    roomId: Joi.objectId().required(),
    roomName: Joi.string().required(),
    sentTo: Joi.objectId().required(),
  });

  return validateNotification.validate(notification);
};

export const Notification = mongoose.model("notification", notificationSchema);
