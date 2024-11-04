'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_loyalty_totals', {
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
      total_points: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.dropTable('user_loyalty_totals')
  }
}
