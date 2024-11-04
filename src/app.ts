import cors, { CorsOptions } from 'cors'
import dotenv from 'dotenv'
import express, { Express, NextFunction, Request, Response } from 'express'

import sequelize from './models'
import initializeRoutes from './routes'
import { refreshListeners } from './services/contract/listener'
import { CustomError } from './utils/errors_factory'
import logger from './utils/logger'

dotenv.config()
const app: Express = express()
const port = process.env.PORT

const corsOptions: CorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'x-api-key'
  ]
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

initializeRoutes(app)

app.use(
  (
    err: CustomError,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    logger.error(err.details?.context, err.message)
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      details: err.details
    })
    next()
  }
)

const server = app.listen(port, async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    await refreshListeners()
    logger.info('⚡️[server]: Server is running at http://localhost:', port)
  } catch (error) {
    logger.error('Unable to connect to the database:', error)
  }
})

export default app
export { server }
