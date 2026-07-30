const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  if (!(err instanceof ApiError)) {
    // Log unexpected errors
    logger.error("Unexpected Error:", err);
    
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      error = ApiError.badRequest('Invalid Resource ID');
    }
    // Mongoose duplicate key
    else if (err.code === 11000) {
      error = ApiError.conflict('Duplicate field value entered');
    }
    // Mongoose validation error
    else if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = ApiError.badRequest(message);
    }
    else {
      error = new ApiError(500, process.env.NODE_ENV === 'production' ? 'Server Error' : err.message);
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'Server Error'
    }
  });
};

module.exports = errorHandler;
