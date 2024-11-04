import { beforeAll, afterAll } from 'bun:test'

import sequelize from '../models'

/** This is a setup file for the tests. It will run before and after all the tests. */

if (process.env.NODE_ENV !== 'test') {
  throw new Error('NODE_ENV is not set to test')
}

/** Sets up the database before running all the tests */
beforeAll(async () => {
  await sequelize.authenticate()
  await sequelize.sync({ force: true })
})

/** Closes the database after running all the tests */
afterAll(async () => {
  await sequelize.close()
})
