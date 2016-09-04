'use strict';

const Joi = require('joi');

const config = require('../config/server');
const Restaurants = require('../handlers/restaurants');
const SCHEMAS = require('../lib/schemas');

const API_BASE_PATH = `${config.apiPrefix}/restaurants`;

const routes = [];

// GET /restaurants
routes.push({
  method: 'GET',
  path: API_BASE_PATH,
  config: {
    handler: Restaurants.listRestaurants,
    description: 'List all restaurants',
    notes: 'List all restaurants within the system',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Success',
            schema: Joi.array().items(SCHEMAS.Restaurant).label('Restaurants')
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

// POST /restaurants
routes.push({
  method: 'POST',
  path: API_BASE_PATH,
  config: {
    handler: Restaurants.createRestaurant,
    description: 'Create a restaurant',
    notes: 'Creates a new restaurant',
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Success',
            schema: SCHEMAS.Restaurant
          },
          '400': {
            description: 'Bad Request',
            schema: SCHEMAS.Errors.BadRequestRestaurantError
          },
          '409': {
            description: 'Duplicate Restaurant',
            schema: SCHEMAS.Errors.ExistingRestaurantError
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
      payload: SCHEMAS.Restaurant
    }
  }
});

module.exports = routes;
