'use strict';

const Sequelize = require('sequelize');

module.exports = function(db) {
  const Poll = db.define('Poll', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    numberOfRestaurants: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  }, {
    classMethods: {
      createPoll: function(pollData) {
        // Deactivate all polls that are active
        return this.update({ active: false }, {
          where: { active: true }
        })
        // Then create a new poll
        .then(() => this.create(pollData));
      }
    },
    instanceMethods: {},
    tableName: 'polls'
  });

  return Poll;
};
