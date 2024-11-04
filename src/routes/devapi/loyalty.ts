import { Router } from 'express'

import validateRequestWithSchema from '../../middleware/validator'
import { addLoyalty, deleteLoyalty, editLoyalty } from '../../services/loyalty'
import {
  addLoyaltyPointsToUserOfOwner,
  removeLoyaltyPointOfUser,
  setLoyaltyDataOfUserOfOwner
} from '../../services/user/owner'
import {
  EditLoyaltySchema,
  LoyaltyDataSchema,
  LoyaltySchema,
  RequireLoyaltyCode
} from '../../types/schemas'

const router = Router()

router.post('/create', validateRequestWithSchema(LoyaltySchema), addLoyalty)

router.post(
  '/edit',
  validateRequestWithSchema(RequireLoyaltyCode),
  validateRequestWithSchema(EditLoyaltySchema),
  editLoyalty
)

router.delete(
  '/delete',
  validateRequestWithSchema(RequireLoyaltyCode),
  deleteLoyalty
)

router.post(
  '/setLoyaltyData',
  validateRequestWithSchema(LoyaltyDataSchema),
  setLoyaltyDataOfUserOfOwner
)

router.post(
  '/admin-add-code',
  validateRequestWithSchema(RequireLoyaltyCode),
  addLoyaltyPointsToUserOfOwner
)

router.post(
  '/admin-remove-code',
  validateRequestWithSchema(RequireLoyaltyCode),
  removeLoyaltyPointOfUser
)

export default router
