import { Router } from 'express'

import validateRequestWithSchema from '../../middleware/validator'
import { getCollection, getCollectionsOfOwner } from '../../services/collection'
import { validateOwnerOwnsCollection } from '../../services/owner/validators'
import { RequireCollectionId } from '../../types/schemas'

const router = Router()

router.get('/', getCollectionsOfOwner)
router.get(
  '/byId',
  validateRequestWithSchema(RequireCollectionId),
  validateOwnerOwnsCollection,
  getCollection
)

export default router
