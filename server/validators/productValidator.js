const Joi = require("joi");
const ApiError = require("../utils/ApiError");

const validateCreateProduct = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(200).required(),
    price: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    desc: Joi.string().trim().max(2000).required(),
    specifications: Joi.alternatives().try(
      Joi.array().items(
        Joi.object({
          key: Joi.string().trim().max(100).required(),
          value: Joi.string().trim().max(250).required(),
        })
      ),
      Joi.string().allow("").optional()
    ).optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string().valid("true", "false")).optional(),
    order: Joi.alternatives().try(Joi.number(), Joi.string().regex(/^\d+$/)).optional(),
  });

  const { error } = schema.validate(req.body, { allowUnknown: true });
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
    desc: Joi.string().trim().max(2000).optional(),
    specifications: Joi.alternatives().try(
      Joi.array().items(
        Joi.object({
          key: Joi.string().trim().max(100).required(),
          value: Joi.string().trim().max(250).required(),
        })
      ),
      Joi.string().allow("").optional()
    ).optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string().valid("true", "false")).optional(),
    order: Joi.alternatives().try(Joi.number(), Joi.string().regex(/^\d+$/)).optional(),
    removedImages: Joi.alternatives().try(Joi.array(), Joi.string()).optional(),
  });

  const { error } = schema.validate(req.body, { allowUnknown: true });
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

module.exports = { validateCreateProduct, validateUpdateProduct };
