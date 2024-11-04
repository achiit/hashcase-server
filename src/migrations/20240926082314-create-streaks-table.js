'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Streaks', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      streak_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      last_check_in: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Streaks')
  }
}
