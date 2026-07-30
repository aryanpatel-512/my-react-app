const Joi = require("joi");
const ApiError = require("../utils/ApiError");

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

module.exports = { validateLogin };
