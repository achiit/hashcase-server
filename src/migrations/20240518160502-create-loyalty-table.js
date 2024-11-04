/* eslint-disable @typescript-eslint/no-unused-vars */

'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loyalties', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'owners',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'point'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })

    await queryInterface.addIndex('loyalties', ['owner_id', 'code'], {
      name: 'unique_code',
      unique: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('loyalties')
  }
}
