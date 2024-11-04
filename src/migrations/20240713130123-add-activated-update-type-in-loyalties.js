'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('loyalties', 'type', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('loyalties', 'type', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'point'
    })
  }
}
