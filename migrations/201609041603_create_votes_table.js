'use strict';

module.exports = {
  up: function(action, Sequelize) {
    action.createTable('votes', {
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
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: function(action, Sequelize) {
    action.dropTable('votes');
  }
};
