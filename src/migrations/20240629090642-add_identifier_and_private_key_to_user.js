'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'identifier', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('users', 'private_key', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true
    })
    await queryInterface.addColumn('users', 'owner_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'owners',
        key: 'id'
      }
    })
    await queryInterface.addIndex('users', ['owner_id', 'identifier'], {
      unique: true,
      name: 'unique_owner_identifier'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'identifier')
    await queryInterface.removeColumn('users', 'private_key')
    await queryInterface.removeColumn('users', 'owner_id')
    await queryInterface.removeIndex('users', 'unique_owner_identifier')
  }
}
