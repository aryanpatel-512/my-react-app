const Joi = require("joi");
const ApiError = require("../utils/ApiError");

const validateCreateProduct = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(200).required(),
    price: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    desc: Joi.string().trim().max(2000).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

const validateUpdateProduct = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(200).optional(),
    price: Joi.string().trim().optional(),
    category: Joi.string().trim().optional(),
    desc: Joi.string().trim().max(2000).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

module.exports = { validateCreateProduct, validateUpdateProduct };
