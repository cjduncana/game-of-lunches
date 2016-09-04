'use strict';

const Boom = require('boom');

const Errors = require('../lib/errors');
const Formatters = require('../lib/formatters');

exports.listVotes = function(request, reply) {
  return this.models.Vote.findAll()
  .then((votes) => {
    return reply(Formatters.votes(votes)).code(200);
  })
  .catch(this.helpers.errorHandler.bind(this, reply));
};

exports.createVote = function({ payload }, reply) {
  delete payload.id;

  return this.models.Vote.createVote(payload)
  .then((vote) => {
    return reply(Formatters.vote(vote)).code(201);
  })
  .catch(Errors.ExistingVoteError, () => {
    return reply(Boom.conflict('Vote already exist'));
  })
  .catch(this.helpers.errorHandler.bind(this, reply));
};
