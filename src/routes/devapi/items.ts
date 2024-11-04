import { Router } from 'express'

import validateRequestWithSchema from '../../middleware/validator'
import {
  getItem,
  getItemsOfCollection,
  getItemsOfOwner
} from '../../services/item'
import {
  validateOwnerOwnsCollection,
  validateOwnerOwnsItem
} from '../../services/owner/validators'
import { RequireCollectionId, RequireItemId } from '../../types/schemas'

const router = Router()

router.get('/', getItemsOfOwner)
router.get(
  '/bycollection',
  validateRequestWithSchema(RequireCollectionId),
  validateOwnerOwnsCollection,
  getItemsOfCollection
)
router.get(
  '/byid',
  validateRequestWithSchema(RequireItemId),
  validateOwnerOwnsItem,
  getItem
)

export default router
