'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE collections 
      MODIFY COLUMN chain_type ENUM('ethereum', 'filecoin', 'fuel') 
      NOT NULL DEFAULT 'ethereum';
    `)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE collections 
      MODIFY COLUMN chain_type ENUM('ethereum', 'filecoin') 
      NOT NULL DEFAULT 'ethereum';
    `)
  }
}
