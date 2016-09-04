'use strict';

const Sequelize = require('sequelize');

const Errors = require('../lib/errors');

module.exports = function(db) {
  const User = db.define('User', {
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
      createUser: function(userData) {
        return this.create(userData)
        .then((user) => user)
        .catch((err) => {
          if (err.name === 'SequelizeUniqueConstraintError') {
            throw new Errors.ExistingUserError(err.message, 'EXISTING_USER_ERROR');
          }
          throw err;
        });
      }
    },
    instanceMethods: {},
    tableName: 'users'
  });

  return User;
};
