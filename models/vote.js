'use strict';

const Sequelize = require('sequelize');

module.exports = function(db) {
  const Vote = db.define('Vote', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    rank: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    choiceId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    pollId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    voterId: {
      type: Sequelize.UUID,
      allowNull: false
    }
  }, {
    classMethods: {
      listVotes: function() {
        return this.findAll({
          include: [{
            model: this.sequelize.models.Restaurant,
            as: 'choice'
          }, {
            model: this.sequelize.models.Poll,
            as: 'poll',
            where: { active: true }
          }, {
            model: this.sequelize.models.User,
            as: 'voter'
          }]
        });
      },

      createVote: function({ rank, choiceId, pollId, voterId }) {
        return this.findOrCreate({
          where: { choiceId, pollId, voterId }
        })
        .spread((vote) => vote.update({ rank }))
        .then((response) => {
          return this.findOne({
            where: { choiceId, pollId, voterId },
            include: [{
              model: this.sequelize.models.Restaurant,
              as: 'choice'
            }, {
              model: this.sequelize.models.Poll,
              as: 'poll'
            }, {
              model: this.sequelize.models.User,
              as: 'voter'
            }]
          });
        });
      }
    },
    instanceMethods: {},
    tableName: 'votes'
  });

  return Vote;
};

module.exports.register = function({ Poll, Restaurant, User, Vote }) {
  Vote.belongsTo(Poll, { as: 'poll', foreignKey: 'pollId' });
  Vote.belongsTo(Restaurant, { as: 'choice', foreignKey: 'choiceId' });
  Vote.belongsTo(User, { as: 'voter', foreignKey: 'voterId' });
};
