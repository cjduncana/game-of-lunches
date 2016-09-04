'use strict';

const Joi = require('joi');

const config = require('../config/server');
const Polls = require('../handlers/polls');
const SCHEMAS = require('../lib/schemas');

const API_BASE_PATH = `${config.apiPrefix}/polls`;

const routes = [];

// GET /polls
routes.push({
  method: 'GET',
  path: API_BASE_PATH,
  config: {
    handler: Polls.listPolls,
    description: 'List all polls',
    notes: 'List all polls within the system',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Success',
            schema: Joi.array().items(SCHEMAS.Poll).label('Polls')
          },
          '500': {
            description: 'Internal Server Error',
            schema: SCHEMAS.Errors.InternalServerError
          }
        }
      }
    },
    tags: ['api']
  }
});

// POST /polls
routes.push({
  method: 'POST',
  path: API_BASE_PATH,
  config: {
    handler: Polls.createPoll,
    description: 'Create a poll',
    notes: 'Creates a new poll',
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Success',
            schema: SCHEMAS.Poll
          },
          '400': {
            description: 'Bad Request',
            schema: SCHEMAS.Errors.BadRequestPollError
          },
          '500': {
            description: 'Internal Server Error',
            schema: SCHEMAS.Errors.InternalServerError
          }
        }
      }
    },
    tags: ['api'],
    validate: {
      payload: SCHEMAS.Poll
    }
  }
});

module.exports = routes;
