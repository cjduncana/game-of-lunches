'use strict';

const Joi = require('joi');

// TODO: When labels are fixed, reimplement them
module.exports = Joi.object().keys({
  id: Joi.string().allow('').optional()
    .description('Poll\'s ID')
    .example('c4928a13-8632-42f1-94e8-a6ed26342526'),
    // .label('ID'),
  numberOfRestaurants: Joi.number().integer().required()
    .description('Number of restaurants this poll will generate as winners')
    .example(3),
    // .label('Number of Restaurants'),
  active: Joi.boolean().default(true).optional()
    .description('True if the poll is active in this moment')
    .example(true)
    // .label('Active')
}).label('Poll');
