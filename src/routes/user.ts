import { Router } from 'express'
import multer from 'multer'

import validateRequestWithSchema from '../middleware/validator'
import { getFuelNFTsOfUser } from '../services/nft/indexer'
import { claimNFT, getNFTsOfUser, getUserInfo, mintNFT } from '../services/user'
import {
  getLoyaltyDataOfUserOfOwner,
  getLoyaltyPointsOfUserOfOwner
} from '../services/user/owner'
import { ClaimNFTSchema, MintNFTSchema, RequireOwnerID } from '../types/schemas'

const upload = multer({
  dest: 'uploads/'
})
const router = Router()

router.get('/', getUserInfo)
router.get('/nfts', getNFTsOfUser)
router.get('/fuel-nfts', getFuelNFTsOfUser)
router.post('/claim', validateRequestWithSchema(ClaimNFTSchema), claimNFT)
router.post(
  '/mint',
  validateRequestWithSchema(MintNFTSchema),
  upload.single('image'),
  mintNFT
)

router.get(
  '/loyaltyData',
  validateRequestWithSchema(RequireOwnerID),
  getLoyaltyDataOfUserOfOwner
)

router.get(
  '/loyaltyPoints',
  validateRequestWithSchema(RequireOwnerID),
  getLoyaltyPointsOfUserOfOwner
)

export default router
