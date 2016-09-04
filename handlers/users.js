'use strict';

const Boom = require('boom');

const Errors = require('../lib/errors');
const Formatters = require('../lib/formatters');

exports.listUsers = function(request, reply) {
  return this.models.User.findAll()
  .then((users) => {
    return reply(Formatters.users(users)).code(200);
  })
  .catch(this.helpers.errorHandler.bind(this, reply));
};

exports.createUser = function({ payload }, reply) {
  delete payload.id;

  return this.models.User.createUser(payload)
  .then((user) => {
    return reply(Formatters.user(user)).code(201);
  })
  .catch(Errors.ExistingUserError, () => {
    return reply(Boom.conflict('User already exist'));
  })
  .catch(this.helpers.errorHandler.bind(this, reply));
};
