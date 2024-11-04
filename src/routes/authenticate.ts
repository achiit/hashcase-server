import { Router } from 'express'

import validateRequestWithSchema from '../middleware/validator'
import {
  generateWalletSignPrompt,
  processMagicLogin,
  processOwnerLogin,
  processAdminLogin,
  processWalletLogin,
  processFuelWalletLogin,
  processParticeWalletLogin
} from '../services/authenticator'
import {
  MagicLoginSchema,
  OwnerLoginSchema,
  ParticleLoginSchema,
  WalletLoginSchema
} from '../types/schemas'

const router = Router()

router.get('/wallet/request-token', generateWalletSignPrompt)

router.post(
  '/wallet/login',
  validateRequestWithSchema(WalletLoginSchema),
  processWalletLogin
)

router.post(
  '/fuel-wallet/login',
  validateRequestWithSchema(WalletLoginSchema),
  processFuelWalletLogin
)

router.post(
  '/particle-wallet/login',
  validateRequestWithSchema(ParticleLoginSchema),
  processParticeWalletLogin
)

router.post(
  '/magic/login',
  validateRequestWithSchema(MagicLoginSchema),
  processMagicLogin
)

router.post(
  '/owner/login',
  validateRequestWithSchema(OwnerLoginSchema),
  processOwnerLogin
)

router.post(
  '/admin/login',
  validateRequestWithSchema(OwnerLoginSchema),
  processAdminLogin
)

export default router
