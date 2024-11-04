import { Router } from 'express'

import { getUsersByOwnerId } from '../controllers/owner'
import validateRequestWithSchema from '../middleware/validator'
import { addCollection, editCollection } from '../services/collection'
import { getAPIKeysOfOwner } from '../services/devapi'
import { addItem, editItem } from '../services/item'
import { addLoyalty, deleteLoyalty, editLoyalty } from '../services/loyalty'
import { getLeaderboardData } from '../services/owner/getleaderboard'
import {
  prepareOwnerAddCollection,
  prepareOwnerEditCollection
} from '../services/owner/manage_collections'
import {
  prepareOwnerAddItem,
  prepareOwnerEditItem
} from '../services/owner/manange_items'
import {
  CollectionSchema,
  EditCollectionSchema,
  ItemSchema,
  EditItemSchema,
  LoyaltySchema,
  RequireLoyaltyCode,
  EditLoyaltySchema
} from '../types/schemas'
import { getOwnerUsers } from '../services/owner/manage_users'

const router = Router()

router.post(
  '/collection/create',
  validateRequestWithSchema(CollectionSchema),
  prepareOwnerAddCollection,
  addCollection
)

router.post(
  '/collection/edit',
  validateRequestWithSchema(EditCollectionSchema),
  prepareOwnerEditCollection,
  editCollection
)

router.post(
  '/item/create',
  validateRequestWithSchema(ItemSchema),
  prepareOwnerAddItem,
  addItem
)

router.post(
  '/item/edit',
  validateRequestWithSchema(EditItemSchema),
  prepareOwnerEditItem,
  editItem
)

router.post(
  '/loyalty/create',
  validateRequestWithSchema(LoyaltySchema),
  addLoyalty
)

router.post(
  '/loyalty/edit',
  validateRequestWithSchema(RequireLoyaltyCode),
  validateRequestWithSchema(EditLoyaltySchema),
  editLoyalty
)

router.delete(
  '/loyalty/delete',
  validateRequestWithSchema(RequireLoyaltyCode),
  deleteLoyalty
)
router.get('/leaderboard', getLeaderboardData)

router.get('/apikeys', getAPIKeysOfOwner)
router.get('/users', getOwnerUsers)
export default router
