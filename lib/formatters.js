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

function user(user) {
  return {
    id: user.id,
    name: user.name
  };
}

function users(users) {
  return _.map(users, user);
}

function vote(vote) {
  return {
    id: vote.id,
    name: vote.name
  };
}

function votes(votes) {
  return _.map(votes, vote);
}

module.exports = {
  poll,
  polls,
  restaurant,
  restaurants,
  user,
  users,
  vote,
  votes
};
