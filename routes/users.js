'use strict';

const Joi = require('joi');

const config = require('../config/server');
const Users = require('../handlers/users');
const SCHEMAS = require('../lib/schemas');

const API_BASE_PATH = `${config.apiPrefix}/users`;

const routes = [];

// GET /users
routes.push({
  method: 'GET',
  path: API_BASE_PATH,
  config: {
    handler: Users.listUsers,
    description: 'List all users',
    notes: 'List all users within the system',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Success',
            schema: Joi.array().items(SCHEMAS.User).label('Users')
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

// POST /users
routes.push({
  method: 'POST',
  path: API_BASE_PATH,
  config: {
    handler: Users.createUser,
    description: 'Create a user',
    notes: 'Creates a new user',
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Success',
            schema: SCHEMAS.User
          },
          '400': {
            description: 'Bad Request',
            schema: SCHEMAS.Errors.BadRequestUserError
          },
          '409': {
            description: 'Duplicate User',
            schema: SCHEMAS.Errors.ExistingUserError
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
      payload: SCHEMAS.User
    }
  }
});

module.exports = routes;
