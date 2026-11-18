const Joi = require("joi");
const ApiError = require("../utils/ApiError");

const validateCreateInquiry = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().pattern(/^[a-zA-Z\s.'-]+$/).min(2).max(100).required().messages({
      "string.pattern.base": "Name should contain valid name characters."
    }),
    phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required().messages({
      "string.pattern.base": "Phone must be exactly 10 digits."
    }),
    email: Joi.string().trim().email().required(),
    message: Joi.string().trim().min(5).max(2000).required(),
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

const validateEmailUs = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      "string.empty": "Full Name is required.",
      "string.min": "Full Name must be at least 2 characters.",
      "any.required": "Full Name is required."
    }),
    email: Joi.string().trim().email().max(120).required().messages({
      "string.empty": "Email Address is required.",
      "string.email": "Please enter a valid email address.",
      "any.required": "Email Address is required."
    }),
    phone: Joi.string().trim().allow('', null).pattern(/^[0-9+\s()-]{7,20}$/).optional().messages({
      "string.pattern.base": "Please enter a valid phone number."
    }),
    subject: Joi.string().trim().min(2).max(150).required().messages({
      "string.empty": "Subject is required.",
      "string.min": "Subject must be at least 2 characters.",
      "any.required": "Subject is required."
    }),
    message: Joi.string().trim().min(5).max(3000).required().messages({
      "string.empty": "Message is required.",
      "string.min": "Message must be at least 5 characters.",
      "any.required": "Message is required."
    })
  });

  const { error } = schema.validate(req.body, { allowUnknown: false });
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

const validateAdminSendEmail = (req, res, next) => {
  const schema = Joi.object({
    to: Joi.string().trim().email().required().messages({
      "string.empty": "Recipient email is required.",
      "string.email": "Please enter a valid recipient email address.",
      "any.required": "Recipient email is required."
    }),
    subject: Joi.string().trim().min(2).max(200).required().messages({
      "string.empty": "Subject is required.",
      "string.min": "Subject must be at least 2 characters.",
      "any.required": "Subject is required."
    }),
    message: Joi.string().trim().min(5).max(5000).required().messages({
      "string.empty": "Message is required.",
      "string.min": "Message must be at least 5 characters.",
      "any.required": "Message is required."
    })
  });

  const { error } = schema.validate(req.body, { allowUnknown: false });
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }
  next();
};

module.exports = { 
  validateCreateInquiry, 
  validateUpdateStatus, 
  validateUpdatePriority, 
  validateAddNote,
  validateEmailUs,
  validateAdminSendEmail
};
