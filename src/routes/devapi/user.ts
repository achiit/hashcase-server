import { Router } from 'express'

import validateRequestWithSchema from '../../middleware/validator'
import { validateOwnerOwnsItem } from '../../services/owner/validators'
import {
  checkIfUserHasAmountOfItem,
  checkIfUserHasItem,
  claimNFT,
  getUserInfo
} from '../../services/user'
import getLoyaltyTransactions, {
  addBadgeToUser,
  addLoyaltyPointsToUserOfOwner,
  getItemsOfUserOfOwner,
  getLoyaltyDataOfUserOfOwner,
  getLoyaltyPointsOfUserOfOwner,
  getNFTsOfUserOfOwner,
  getStreakCount,
  handleDailyCheckIn,
  setLoyaltyDataOfUserOfOwner
} from '../../services/user/owner'
import {
  CheckInSchema,
  CheckItemAmountSchema,
  ClaimNFTSchema,
  LoyaltyDataSchema,
  RequireBadgeCharacterString,
  RequireItemId,
  RequireLoyaltyCode,
  TransferNFTSchema
} from '../../types/schemas'
import inferUserAndOwnerRequest from '../../utils/type_gymnastics'

const router = Router()

router.get('/', getUserInfo)
router.get('/items', getItemsOfUserOfOwner)
router.get('/nfts', getNFTsOfUserOfOwner)

router.post(
  '/nfts/mint',
  validateRequestWithSchema(ClaimNFTSchema),
  inferUserAndOwnerRequest,
  validateOwnerOwnsItem,
  claimNFT
)
router.post(
  '/nfts/transfer',
  validateRequestWithSchema(TransferNFTSchema),
  validateOwnerOwnsItem //todo: transfer nft
)

router.get(
  '/tokengate/hasitem',
  validateRequestWithSchema(RequireItemId),
  inferUserAndOwnerRequest,
  validateOwnerOwnsItem,
  checkIfUserHasItem
)
router.get(
  '/tokengate/amountofitem',
  validateRequestWithSchema(CheckItemAmountSchema),
  inferUserAndOwnerRequest,
  validateOwnerOwnsItem,
  checkIfUserHasAmountOfItem
)

// router.get('/loyaltyData', getLoyaltyDataOfUserOfOwner)
router.get('/getLoyaltyPoints', getLoyaltyPointsOfUserOfOwner)

// router.post(
//   '/setLoyaltyData',
//   validateRequestWithSchema(LoyaltyDataSchema),
//   setLoyaltyDataOfUserOfOwner
// )

router.post(
  '/addLoyaltyCode',
  validateRequestWithSchema(RequireLoyaltyCode),
  addLoyaltyPointsToUserOfOwner
)
router.get('/gettransactions', getLoyaltyTransactions)
router.post(
  '/addBadge',
  validateRequestWithSchema(RequireBadgeCharacterString),
  addBadgeToUser
)
router.post(
  '/daily-check-in',
  validateRequestWithSchema(CheckInSchema),
  handleDailyCheckIn
)
// Assuming you have a router object already created
router.get('/get-streak', getStreakCount)

export default router
