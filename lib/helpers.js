'use strict';

const _ = require('lodash');
const Boom = require('boom');

const Helpers = {};

Helpers.errorHandler = function(reply, err) {
  this.logger.error(err.stack);

  return reply(Boom.badImplementation('An unknown error has occured. Please try again later.'));
};

exports.register = function(server, options, next) {
  // Bind the server to the helper functions
  _.each(Helpers, (helper, idx) => {
    Helpers[idx] = helper.bind(server);
  });

  server.decorate('server', 'helpers', Helpers);
  next();
};

exports.register.attributes = {
  name: 'Helpers',
  version: '1.0.0'
};
