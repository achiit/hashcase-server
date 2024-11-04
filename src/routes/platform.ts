import { Router } from 'express'

import validateRequestWithSchema from '../middleware/validator'
import {
  getCollections,
  getCollection,
  getCollectionsOfOwner,
  getOwnerByCollection
} from '../services/collection'
import {
  getItem,
  getItemOfCollectionNameAndTokenId,
  getItemsOfCollection,
  getItemsOfOwner
} from '../services/item'
import {
  CollectionNameAndTokenId,
  RequireCollectionId,
  RequireItemId,
  RequireOwnerID
} from '../types/schemas'

const router = Router()

router.get(
  '/collection',
  validateRequestWithSchema(RequireCollectionId),
  getCollection
)
router.get('/collections', getCollections)
router.get(
  '/collections/byowner',
  validateRequestWithSchema(RequireOwnerID),
  getCollectionsOfOwner
)

router.get('/item', validateRequestWithSchema(RequireItemId), getItem)
router.get(
  '/item/by-collection-name-and-token-id',
  validateRequestWithSchema(CollectionNameAndTokenId),
  getItemOfCollectionNameAndTokenId
)
router.get(
  '/items/bycollection',
  validateRequestWithSchema(RequireCollectionId),
  getItemsOfCollection
)
router.get(
  '/items/byowner',
  validateRequestWithSchema(RequireOwnerID),
  getItemsOfOwner
)

router.get(
  '/owner-by-collection',
  validateRequestWithSchema(RequireCollectionId),
  getOwnerByCollection
)

export default router
