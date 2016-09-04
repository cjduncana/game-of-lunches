'use strict';

const errorFactory = require('error-factory');

const Errors = {
  ExistingRestaurantError: errorFactory('ExistingRestaurantError', {
    message: 'Restaurant Already Exists',
    code: 'ExistingRestaurantError'
  })
};

module.exports = Errors;
