import { Router } from 'express'

// import { authorizeUser } from '../../middleware/authorize'
import { authorizeUser } from '../../middleware/authorize'
import { createOwnerUser } from '../../services/owner/manage_users'

import devCollectionsRouter from './collections'
import devItemsRouter from './items'
import devLoyaltyRouter from './loyalty'
import devUserRouter from './user'

const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Successfully called devapi' })
})

router.post('/register-user', createOwnerUser)

router.use('/collections', devCollectionsRouter)
router.use('/items', devItemsRouter)
router.use('/user', authorizeUser, devUserRouter)
router.use('/loyalty', devLoyaltyRouter)

export default router
