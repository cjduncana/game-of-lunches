'use strict';

const Sequelize = require('sequelize');

const Errors = require('../lib/errors');

module.exports = function(db) {
  const Vote = db.define('Vote', {
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
      createVote: function(voteData) {
        return this.create(voteData)
        .then((vote) => vote)
        .catch((err) => {
          if (err.name === 'SequelizeUniqueConstraintError') {
            throw new Errors.ExistingVoteError(err.message, 'EXISTING_VOTE_ERROR');
          }
          throw err;
        });
      }
    },
    instanceMethods: {},
    tableName: 'votes'
  });

  return Vote;
};
