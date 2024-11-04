import { Application } from 'express'

import {
  authorizeAdmin,
  authorizeDevAPI,
  authorizeOwner,
  authorizeUser
  // authorizeUser
} from '../middleware/authorize'

import adminRouter from './admin'
import authRouter from './authenticate'
import devAPIRouter from './devapi'
import ownerRouter from './owner'
import platformRouter from './platform'
import userRouter from './user'

const initializeRoutes = (app: Application) => {
  app.use('/admin', authorizeAdmin, adminRouter)
  app.use('/auth', authRouter)
  app.use('/user', authorizeUser, userRouter)

  app.use('/owner', authorizeOwner, ownerRouter)
  app.use('/dev', authorizeDevAPI, devAPIRouter)
  app.use('/platform', platformRouter)
}

export default initializeRoutes
