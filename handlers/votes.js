'use strict';

const Boom = require('boom');
const Promise = require('bluebird');

const Errors = require('../lib/errors');
const Formatters = require('../lib/formatters');

exports.listVotes = function(request, reply) {
  return this.models.Vote.findAll()
  .then((votes) => {
    return reply(Formatters.votes(votes)).code(200);
  })
  .catch(this.helpers.errorHandler.bind(this, reply));
};

exports.createVotes = function({ payload }, reply) {
  payload.forEach((vote) => {
    delete vote.id;
  });

  return Promise.map(payload, ({ rank, choice, voter }) => {
    return Promise.props({
      rank,
      choice: this.models.Restaurant.getRestaurant(choice.id),
      voter: this.models.User.getUser(voter.id)
    });
  })

  .then((votes) => Promise.props({
    poll: this.models.Poll.getActivePoll(),
    votes
  }))

  .then(({ poll, votes }) => Promise.map(votes, ({ rank, choice, voter }) => {
    return this.models.Vote.createVote({
      rank,
      choiceId: choice.id,
      pollId: poll.id,
      voterId: voter.id
    });
  }))

  .then((votes) => {
    // console.log(votes);
    return reply(Formatters.votes(votes)).code(201);
  })

  .catch(Errors.PollNotFoundError, () => {
    return reply(Boom.badRequest('An active poll was not found'));
  })
  .catch(Errors.RestaurantNotFoundError, () => {
    return reply(Boom.badRequest('A restaurant in the list was not found'));
  })
  .catch(Errors.UserNotFoundError, () => {
    return reply(Boom.badRequest('A user in the list was not found'));
  })
  // .catch((err) => {
  //   console.log(err);
  //   throw err;
  // })
  .catch(this.helpers.errorHandler.bind(this, reply));
};
