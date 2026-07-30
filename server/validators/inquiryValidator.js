const Joi = require("joi");
const ApiError = require("../utils/ApiError");

const validateCreateInquiry = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    phone: Joi.string().trim().required(),
    email: Joi.string().trim().email().allow('').optional(),
    message: Joi.string().trim().min(1).max(2000).required(),
    productName: Joi.string().trim().allow('').optional(),
    productId: Joi.string().trim().allow('').optional(),
    type: Joi.string().valid("general", "product").default("general")
  });

  const { error } = schema.validate(req.body, { allowUnknown: true });
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

const validateUpdateStatus = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid("new", "contacted", "in_progress", "quotation", "negotiation", "closed", "rejected").required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

const validateUpdatePriority = (req, res, next) => {
  const schema = Joi.object({
    priority: Joi.string().valid("normal", "hot", "bulk", "dealer", "urgent", "hospital").required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

const validateAddNote = (req, res, next) => {
  const schema = Joi.object({
    note: Joi.string().trim().max(1000).required(),
    createdAt: Joi.date().optional().allow(null, '')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

module.exports = { 
  validateCreateInquiry, 
  validateUpdateStatus, 
  validateUpdatePriority, 
  validateAddNote 
};
