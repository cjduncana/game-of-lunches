'use strict';

const Boom = require('boom');

const Errors = require('../lib/errors');
const Formatters = require('../lib/formatters');

exports.listRestaurants = function(request, reply) {
  return this.models.Restaurant.findAll()
  .then((restaurants) => {
    return reply(Formatters.restaurants(restaurants)).code(200);
  })
  .catch(this.helpers.errorHandler.bind(this, reply));
};

exports.createRestaurant = function({ payload }, reply) {
  delete payload.id;

  return this.models.Restaurant.createRestaurant(payload)
  .then((restaurant) => {
    return reply(Formatters.restaurant(restaurant)).code(201);
  })
  .catch(Errors.ExistingRestaurantError, () => {
    return reply(Boom.conflict('Restaurant already exist'));
  })
  .catch(this.helpers.errorHandler.bind(this, reply));
};
