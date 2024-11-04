'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loyalty_transactions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      points: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['success', 'failed']]
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('loyalty_transactions')
  }
}
