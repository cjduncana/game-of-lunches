'use strict';

const errorFactory = require('error-factory');

const Errors = {
  ExistingRestaurantError: errorFactory('ExistingRestaurantError', {
    message: 'Restaurant Already Exists',
    code: 'ExistingRestaurantError'
  }),
  ExistingUserError: errorFactory('ExistingUserError', {
    message: 'User Already Exists',
    code: 'ExistingUserError'
  }),
  ExistingVoteError: errorFactory('ExistingVoteError', {
    message: 'Vote Already Exists',
    code: 'ExistingVoteError'
  })
};

module.exports = Errors;
