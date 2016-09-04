'use strict';

const _ = require('lodash');

function restaurant(restaurant) {
  return {
    id: restaurant.id,
    name: restaurant.name
  };
}

function restaurants(restaurants) {
  return _.map(restaurants, restaurant);
}

module.exports = {
  restaurant,
  restaurants
};
