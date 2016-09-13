'use strict';

const Joi = require('joi');

const Restaurant = require('./restaurant');
const User = require('./user');

// TODO: When labels are fixed, reimplement them
module.exports = Joi.object().keys({
  id: Joi.string().allow('').optional()
    .description('Vote\'s ID')
    .example('c4928a13-8632-42f1-94e8-a6ed26342526'),
    // .label('ID'),
  rank: Joi.number().integer().min(0).default(0).allow('').optional()
    .description('Rank given to the voters choice')
    .example(3),
    // .label('Choice\'s Rank'),
  choice: Restaurant.required(),
    // .label('Voter\'s Choice'),
  voter: User.required()
    // .label('Voter')
}).label('Vote');
