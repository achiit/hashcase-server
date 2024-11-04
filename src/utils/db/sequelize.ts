import { Sequelize, Dialect, Options } from 'sequelize'

import config from '../../config/config.json'
import logger from '../logger'

const env = process.env.NODE_ENV!
const { database, username, password, ...rest } =
  config[env as keyof typeof config]
logger.info(
  `Database: ${database}, Username: ${username}, Password: ${password}`
)
const hostEnvName = `${env.toUpperCase()}_DB_HOST`

const sequelizeOptions: Options = {
  ...(rest as { dialect: Dialect }),
  host: process.env[hostEnvName] || rest.host
}

const sequelize = new Sequelize(database, username, password, sequelizeOptions)

export default sequelize
