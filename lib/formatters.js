'use strict';

const _ = require('lodash');

function poll(poll) {
  return {
    id: poll.id,
    numberOfRestaurants: poll.numberOfRestaurants,
    active: poll.active
  };
}

function polls(polls) {
  return _.map(polls, poll);
}

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
  poll,
  polls,
  restaurant,
  restaurants
};
