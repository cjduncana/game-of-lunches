'use strict';

const Sequelize = require('sequelize');

const Errors = require('../lib/errors');

module.exports = function(db) {
  const Restaurant = db.define('Restaurant', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(128),
      unique: true,
      allowNull: false
    }
  }, {
    classMethods: {
      createRestaurant: function(restaurantData) {
        return this.create(restaurantData)
        .then((restaurant) => restaurant)
        .catch((err) => {
          if (err.name === 'SequelizeUniqueConstraintError') {
            throw new Errors.ExistingRestaurantError(err.message, 'EXISTING_RESTAURANT_ERROR');
          }
          throw err;
        });
      },

      getRestaurant: function(restaurantId) {
        return this.findById(restaurantId)
        .then((restaurant) => {
          if (!restaurant) {
            throw new Errors.RestaurantNotFoundError();
          }
          return restaurant;
        });
      }
    },
    instanceMethods: {},
    tableName: 'restaurants'
  });

  return Restaurant;
};
