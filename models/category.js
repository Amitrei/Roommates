import mongoose from "mongoose";
import Joi from "joi";
import joiObjectId from "joi-objectid";
Joi.objectId = joiObjectId(Joi);

export default () =>
  Object.freeze({
    schema: categorySchema,
    model: Category,
    validate,
  });

const categorySchema = mongoose.Schema({
  name: { type: String, minLength: 3, maxLength: 20, required: true },
  img: { type: String, required: true },
  description: { type: String, minLength: 3, maxLength: 40 },
});

const Category = mongoose.model("category", categorySchema);

const validate = (category) => {
  const validateCategorySchema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z\s]+$/)
      .required(),
    img: Joi.string(),
    description: Joi.string().min(3).max(40),
  });
  return validateCategorySchema.validate(category);
};
