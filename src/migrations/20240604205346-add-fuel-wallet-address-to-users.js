'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'fuel_wallet_address', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'fuel_wallet_address')
  }
}
