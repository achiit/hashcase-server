import { Router } from 'express'

import validateRequestWithSchema from '../middleware/validator'
import {
  addBadge,
  deleteBadge,
  editBadge,
  getBadge,
  getBadges
} from '../services/badges'
import {
  addCollection,
  deleteCollection,
  editCollection,
  getCollections
} from '../services/collection'
import { addDevApi } from '../services/devapi'
import { addItem, deleteItem, editItem, getItems } from '../services/item'
import { addOwner, deleteOwner, editOwner, getOwners } from '../services/owner'
import {
  AdminCollectionSchema,
  AdminEditOwnerSchema,
  BadgeSchema,
  EditCollectionSchema,
  EditItemSchema,
  ItemSchema,
  OwnerSchema,
  RequireBadgeId,
  RequireCollectionId,
  RequireItemId,
  RequireOwnerID
} from '../types/schemas'

const router = Router()

router.get('/owners', getOwners)

router.post(
  '/owner/create',
  validateRequestWithSchema(OwnerSchema),
  addOwner,
  addDevApi
)

router.post(
  '/owner/edit',
  validateRequestWithSchema(AdminEditOwnerSchema),
  editOwner
)

router.delete(
  '/owner/delete',
  validateRequestWithSchema(RequireOwnerID),
  deleteOwner
)

router.post(
  '/owner/createDevApi',
  validateRequestWithSchema(RequireOwnerID),
  addDevApi
)

router.get('/collections', getCollections)

router.post(
  '/collection/create',
  validateRequestWithSchema(AdminCollectionSchema),
  addCollection
)

router.post(
  '/collection/edit',
  validateRequestWithSchema(EditCollectionSchema),
  editCollection
)

router.delete(
  '/collection/delete',
  validateRequestWithSchema(RequireCollectionId),
  deleteCollection
)

router.get('/items', getItems)

router.post('/item/create', validateRequestWithSchema(ItemSchema), addItem)

router.post('/item/edit', validateRequestWithSchema(EditItemSchema), editItem)

router.delete(
  '/item/delete',
  validateRequestWithSchema(RequireItemId),
  deleteItem
)
router.get('/badges', getBadges)

router.post('/badge/create', validateRequestWithSchema(BadgeSchema), addBadge)

router.post('/badge/edit', validateRequestWithSchema(BadgeSchema), editBadge)

router.delete(
  '/badge/delete',
  validateRequestWithSchema(RequireBadgeId),
  deleteBadge
)

router.get('/badge', validateRequestWithSchema(RequireBadgeId), getBadge)
export default router
