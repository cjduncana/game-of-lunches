'use strict';

module.exports = {
  up: function(action, Sequelize) {
    action.createTable('restaurants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(128),
        unique: true,
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
    action.dropTable('restaurants');
  }
};
