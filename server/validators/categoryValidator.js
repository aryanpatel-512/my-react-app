const Joi = require("joi");
const ApiError = require("../utils/ApiError");

const validateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

module.exports = { validateCategory };
