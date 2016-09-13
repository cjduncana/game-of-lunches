'use strict';

const Joi = require('joi');

const Errors = {};

function boomError(statusCode, name, message, label) {
  return Joi.object().keys({
    statusCode: Joi.number().required()
      .description('HTTP Status Code')
      .example(statusCode)
      .label('Status Code'),
    message: Joi.string().required()
      .description('Description of the error')
      .example(message)
      .label('Error Message'),
    error: Joi.string().required()
      .description('Error name')
      .example(name)
      .label('Error Name')
  }).label(label);
}

function validationError(statusCode, type, message, label) {
  return Joi.object().keys({
    statusCode: Joi.number().required()
      .description('HTTP status code')
      .example(statusCode)
      .label('Status Code'),
    error: Joi.string().required()
      .description('Error type')
      .example(type)
      .label('Error type'),
    message: Joi.string().required()
      .description('Description of the error')
      .example(message)
      .label('Description'),
    validation: Joi.object().required()
      .description('Object describing the validation failure')
      .label('Validation Object')
  }).label(label);
}

// Application Errors
Errors.InternalServerError = boomError(500, 'Internal Server Error', 'An uknown error has occured. Please try again later.', 'InternalServerError');

// Bad Request Errors
Errors.BadRequestPollError = validationError(400, 'Bad Request', '"invalidKey" is not allowed', 'BadRequestPollError');
Errors.BadRequestRestaurantError = validationError(400, 'Bad Request', '"invalidKey" is not allowed', 'BadRequestRestaurantError');
Errors.BadRequestUserError = validationError(400, 'Bad Request', '"invalidKey" is not allowed', 'BadRequestUserError');
Errors.BadRequestVoteError = validationError(400, 'Bad Request', '"invalidKey" is not allowed', 'BadRequestVoteError');

// Conflict Errors
Errors.ExistingRestaurantError = boomError(409, 'Conflict', 'Restaurant already exist', 'ExistingRestaurantError');
Errors.ExistingUserError = boomError(409, 'Conflict', 'User already exist', 'ExistingUserError');

module.exports = Errors;
