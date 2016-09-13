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
  PollNotFoundError: errorFactory('PollNotFoundError', {
    message: 'Poll Not Found',
    code: 'PollNotFoundError'
  }),
  RestaurantNotFoundError: errorFactory('RestaurantNotFoundError', {
    message: 'Restaurant Not Found',
    code: 'RestaurantNotFoundError'
  }),
  UserNotFoundError: errorFactory('UserNotFoundError', {
    message: 'User Not Found',
    code: 'UserNotFoundError'
  })
};

module.exports = Errors;
