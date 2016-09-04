'use strict';

const Formatters = require('../lib/formatters');

exports.listPolls = function(request, reply) {
  return this.models.Poll.findAll()
  .then((polls) => {
    return reply(Formatters.polls(polls)).code(200);
  })
  .catch(this.helpers.errorHandler.bind(this, reply));
};

exports.createPoll = function({ payload }, reply) {
  delete payload.id;
  delete payload.active;

  return this.models.Poll.createPoll(payload)
  .then((poll) => {
    return reply(Formatters.poll(poll)).code(201);
  })
  .catch(this.helpers.errorHandler.bind(this, reply));
};
