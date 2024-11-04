'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create badges table
    await queryInterface.createTable('badges', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      character_string: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        )
      }
    })

    // Add index on character_string for faster lookups
    await queryInterface.addIndex('badges', ['character_string'])

    // Add badges column to users table
    await queryInterface.addColumn('users', 'badges', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: '[]'
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Remove badges column from users table
    await queryInterface.removeColumn('users', 'badges')

    // Drop badges table
    await queryInterface.dropTable('badges')
  }
}
