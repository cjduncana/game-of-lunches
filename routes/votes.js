'use strict';

const Joi = require('joi');

const config = require('../config/server');
const Votes = require('../handlers/votes');
const SCHEMAS = require('../lib/schemas');

const API_BASE_PATH = `${config.apiPrefix}/votes`;

const routes = [];

// GET /votes
routes.push({
  method: 'GET',
  path: API_BASE_PATH,
  config: {
    handler: Votes.listVotes,
    description: 'List all votes',
    notes: 'List all votes within the active poll',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Success',
            schema: Joi.array().items(SCHEMAS.Vote).label('Votes')
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

// POST /votes
routes.push({
  method: 'POST',
  path: API_BASE_PATH,
  config: {
    handler: Votes.createVotes,
    description: 'Create votes',
    notes: 'Creates several new votes',
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Success',
            schema: Joi.array().items(SCHEMAS.Vote).label('Votes')
          },
          '400': {
            description: 'Bad Request',
            schema: SCHEMAS.Errors.BadRequestVoteError
          },
          '500': {
            description: 'Internal Server Error',
            schema: SCHEMAS.Errors.InternalServerError
          }
        }
      }
    },
    tags: ['api'],
    // TODO: When any().forbidden() is fixed, change this portion.
    validate: {
      payload: Joi.array().items(SCHEMAS.Vote).label('Votes')
    }
  }
});

module.exports = routes;
