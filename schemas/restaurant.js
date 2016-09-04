'use strict';

const Joi = require('joi');

// TODO: When labels are fixed, reimplement them
module.exports = Joi.object().keys({
  id: Joi.string().allow('').optional()
    .description('Restaurant\'s ID')
    .example('c4928a13-8632-42f1-94e8-a6ed26342526'),
    // .label('ID'),
  name: Joi.string().required()
    .description('Restaurant\'s name')
    .example('Subway')
    // .label('Name')
}).label('Restaurant');
