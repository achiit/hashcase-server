import { NextFunction, Response } from 'express'

import { getBadgeByCharacterString } from '../../controllers/badges'
import { getItemById } from '../../controllers/item'
import { getLoyaltyByOwnerAndCode } from '../../controllers/loyalty'
import { getNFTsByUserId } from '../../controllers/nft'
import {
  getUserById,
  getUserByIdWithLoyalty,
  updateUserById
} from '../../controllers/user'
import { LoyaltyType } from '../../enums'
// import UserLoyaltyPoint from '../../models/loyaltytransaction'
import { OwnerRequest, UserRequest } from '../../types/expressTypes'
import { UserLoyaltyObject } from '../../types/modelTypes'
import { CustomError } from '../../utils/errors_factory'
import { _ownerOwnsItem } from '../owner/validators'
import { UserLoyaltyTotal } from '../../models/userloyaltytotal'
import LoyaltyTransaction from '../../models/loyaltytransaction'
import Streaks from '../../models/streaks'

/**
 * Get items of user owned by a given owner
 *
 * @param {OwnerRequest & UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to get items of user owned by a given owner
 *
 */
const getItemsOfUserOfOwner = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const owner_id = Number(req.query.owner_id)

    const nfts = await getNFTsByUserId(user_id)
    const items = (
      await Promise.all(
        nfts.map(async nft => {
          if (await _ownerOwnsItem(owner_id, nft.item_id)) {
            return await getItemById(nft.item_id)
          }
        })
      )
    ).filter(item => item !== undefined)

    return res.status(200).json({ items })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get items of user of owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getItemsOfUserOfOwner',
        error
      })
    )
  }
}

/**
 * Get nfts of user owned by a given owner
 *
 * @param {OwnerRequest & UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to get nfts of user owned by a given owner
 *
 */
const getNFTsOfUserOfOwner = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const owner_id = Number(req.query.owner_id)

    const nftsOfUser = await getNFTsByUserId(user_id)
    const nfts = (
      await Promise.all(
        nftsOfUser.map(async nft => {
          if (await _ownerOwnsItem(owner_id, nft.item_id)) {
            return nft
          }
        })
      )
    ).filter(nft => nft !== undefined)

    return res.status(200).json({ nfts: nfts })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get nfts of user of owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getNFTsOfUserOfOwner',
        error
      })
    )
  }
}

/**
 * Get loyalty data of user owned by a given owner
 *
 * @param {OwnerRequest & UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to get loyalty data of user owned by a given owner
 *
 */

const getLoyaltyDataOfUserOfOwner = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const owner_id = Number(req.query.owner_id)

    const user_instance = await getUserByIdWithLoyalty(user_id)

    if (user_instance.loyalty) {
      const loyalty = JSON.parse(user_instance.loyalty)
      const owner_loyalty = loyalty[owner_id] as string[]
      if (owner_loyalty) {
        return res.status(200).json({ loyalty: owner_loyalty })
      }
    }

    return res.status(200).json({ loyalty: [] })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get loyalty data of user of owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getLoyaltyDataOfUserOfOwner',
        error
      })
    )
  }
}

/**
 * Set loyalty data of user for a given owner
 *
 * @param {OwnerRequest & UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to set loyalty data of user for a given owner
 *
 */
const setLoyaltyDataOfUserOfOwner = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const owner_id = Number(req.query.owner_id)
    const loyalty = req.body.loyalty

    const user_instance = await getUserByIdWithLoyalty(user_id)

    // TODO: check if loyalty code  exists

    let user_loyalty = {} as Record<number, string[]>
    if (user_instance.loyalty) {
      user_loyalty = JSON.parse(user_instance.loyalty)
    }

    user_loyalty[owner_id] = loyalty

    const stringified_loyalty = JSON.stringify(user_loyalty)
    await updateUserById(user_id, { loyalty: stringified_loyalty })

    return res.status(200).json({ message: 'Loyalty data set' })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to set loyalty data of user of owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'setLoyaltyDataOfUserOfOwner',
        error
      })
    )
  }
}

/**
 * Get loyalty points of user owned by a given owner
 *
 * @param {OwnerRequest & UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to get loyalty points of user owned by a given owner
 *
 */

const getLoyaltyPointsOfUserOfOwner = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const owner_id = Number(req.query.owner_id)
    console.log('user_id:', user_id, 'owner_id:', owner_id)

    // Fetch total points directly from UserLoyaltyTotal table
    const userLoyaltyTotal = await UserLoyaltyTotal.findOne({
      where: { user_id, owner_id }
    })
    console.log('userLoyaltyTotal:', userLoyaltyTotal)

    const points = userLoyaltyTotal
      ? userLoyaltyTotal.dataValues['total_points']
      : 0
    console.log('points:', points)

    return res.status(200).json({ points })
  } catch (error) {
    console.error('Error in getLoyaltyPointsOfUserOfOwner:', error)
    const statusCode = 500
    const message = 'Failed to get loyalty points of user of owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getLoyaltyPointsOfUserOfOwner',
        error
      })
    )
  }
}

/**
 * Add loyalty points to a user for given owner
 *
 * @param {OwnerRequest & UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to add loyalty to a user for given owner
 *
 */
const addLoyaltyPointsToUserOfOwner = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const owner_id = Number(req.query.owner_id)
    const code = req.body.code
    const receivedValue = req.body.value ?? 0

    // Fetch the loyalty details
    const receivedLoyalty = await getLoyaltyByOwnerAndCode(owner_id, code)
    // console.log('receivedLoyalty', receivedLoyalty)
    if (!receivedLoyalty) {
      return res.status(404).json({ message: 'Loyalty code not found' })
    }

    // Check if the loyalty code has already been used
    const existingTransaction = await LoyaltyTransaction.findOne({
      where: { user_id, owner_id, code }
    })

    let pointsToAdd = 0

    // If code was already found and claimed for `ONE_FIXED` or `ONE_VARIABLE`, return early
    if (
      existingTransaction &&
      (receivedLoyalty.type === 'ONE_FIXED' ||
        receivedLoyalty.type === 'ONE_VARIABLE')
    ) {
      return res.status(400).json({ message: 'Loyalty code already claimed' })
    }

    // Calculate points to add based on loyalty type
    switch (receivedLoyalty.type) {
      case 'ONE_FIXED':
      case 'FIXED':
        pointsToAdd = receivedLoyalty.value
        break
      case 'ONE_VARIABLE':
      case 'VARIABLE':
        pointsToAdd = receivedValue / receivedLoyalty.value
        break
      case 'ADMIN_ADD':
        pointsToAdd = receivedValue
        break
      case 'ADMIN_SUBTRACT':
        const currentTotal = await LoyaltyTransaction.sum('points', {
          where: { user_id, owner_id }
        })
        pointsToAdd = -Math.min(receivedValue, currentTotal || 0)
        break
      default:
        return res.status(400).json({ message: 'Invalid loyalty type' })
    }

    // Log new transaction in loyalty_transactions table
    const transactionStatus = pointsToAdd !== 0 ? 'success' : 'failed'
    await LoyaltyTransaction.create({
      user_id,
      owner_id,
      code,
      points: pointsToAdd,
      type: receivedLoyalty.type,
      status: transactionStatus
    })

    // Calculate new total points
    const newTotalPoints = await LoyaltyTransaction.sum('points', {
      where: { user_id, owner_id }
    })

    // Update UserLoyaltyTotal
    await UserLoyaltyTotal.upsert({
      user_id,
      owner_id,
      total_points: newTotalPoints
    })

    return res.status(200).json({
      message: 'Loyalty points updated',
      pointsAdded: pointsToAdd,
      totalPoints: newTotalPoints
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to update loyalty points for user of owner'
    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'addLoyaltyPointsToUserOfOwner',
        error
      })
    )
  }
}

// Fetch transactions for a specific user and owner
const getLoyaltyTransactions = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, owner_id } = req.query

    // Validate that both user_id and owner_id are provided
    if (!user_id || !owner_id) {
      return res
        .status(400)
        .json({ message: 'user_id and owner_id are required' })
    }

    // Fetch loyalty transactions from the database
    const transactions = await LoyaltyTransaction.findAll({
      where: {
        user_id: Number(user_id),
        owner_id: Number(owner_id)
      },
      order: [['created_at', 'DESC']] // Optional: Order by creation date descending
    })

    // If no transactions found, return an empty array
    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ message: 'No transactions found for this user and owner' })
    }

    // Return the fetched transactions
    return res.status(200).json({
      message: 'Loyalty transactions retrieved successfully',
      data: transactions
    })
  } catch (error) {
    return next(
      new CustomError('Failed to fetch loyalty transactions', 500, {
        context: 'getLoyaltyTransactions',
        error
      })
    )
  }
}

export default getLoyaltyTransactions

const addBadgeToUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const badge_character_string = req.body.badge_character_string

    // Get the user
    const user_instance = await getUserById(user_id)

    // Check if the badge exists
    const badge = await getBadgeByCharacterString(badge_character_string)
    if (!badge) {
      throw new CustomError('Badge not found', 404, {
        context: 'addBadgeToUser'
      })
    }

    // Initialize or parse existing badge character strings
    let badge_strings: string[] = []
    if (user_instance.badges) {
      badge_strings = JSON.parse(user_instance.badges)
    }

    // Check if the user already has this badge
    if (badge_strings.includes(badge_character_string)) {
      return res.status(200).json({ message: 'User already has this badge' })
    }

    // Add the new badge character string
    badge_strings.push(badge_character_string)

    // Update the user with the new badge character strings
    const stringified_badges = JSON.stringify(badge_strings)
    await updateUserById(user_id, { badges: stringified_badges })

    return res
      .status(200)
      .json({ message: 'Badge added to user', badge_character_string })
  } catch (error) {
    const statusCode = error instanceof CustomError ? error.statusCode : 500
    const message = 'Failed to add badge to user'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'addBadgeToUser',
        error
      })
    )
  }
}

const handleDailyCheckIn = async (req, res, next) => {
  try {
    const { user_id, owner_id } = req.query
    const now = new Date()

    const streakEntry = await Streaks.findOne({
      where: { user_id, owner_id }
    })

    if (!streakEntry) {
      // If no record exists, start a new streak
      const newStreak = await Streaks.create({
        user_id,
        owner_id,
        streak_count: 1,
        last_check_in: now
      })
      await awardPoints(user_id, owner_id)
      return res.status(200).json({
        message: 'Check-in successful',
        streak: newStreak.streak_count
      })
    } else {
      const lastCheckIn = new Date(streakEntry.last_check_in)
      const hoursSinceLastCheckIn =
        (now.getTime() - lastCheckIn.getTime()) / 1000 / 60 / 60 // Calculate hours since last check-in

      if (hoursSinceLastCheckIn < 24) {
        // If within 24 hours and trying to check-in again, deny the check-in
        return res
          .status(403)
          .json({ message: 'Check-in already made today. Try again later.' })
      } else if (hoursSinceLastCheckIn >= 24 && hoursSinceLastCheckIn < 48) {
        // If they check-in within 24 to 48 hours, increment the streak
        streakEntry.streak_count += 1
      } else {
        // If more than 48 hours pass, reset the streak
        streakEntry.streak_count = 1
      }

      streakEntry.last_check_in = now
      await streakEntry.save()
      await awardPoints(user_id, owner_id)
      return res.status(200).json({
        message: 'Check-in successful',
        streak: streakEntry.streak_count
      })
    }
  } catch (error) {
    console.error('Error handling daily check-in:', error)
    next(error)
  }
}
const getStreakCount = async (req, res, next) => {
  try {
    const { user_id, owner_id } = req.query

    if (!user_id || !owner_id) {
      return res
        .status(400)
        .json({ message: 'User ID and Owner ID are required.' })
    }

    const streakEntry = await Streaks.findOne({
      where: { user_id, owner_id }
    })

    if (!streakEntry) {
      return res
        .status(404)
        .json({ message: 'Streak not found for this user and owner.' })
    }

    return res.status(200).json({
      message: 'Streak retrieved successfully.',
      streakCount: streakEntry.streak_count
    })
  } catch (error) {
    console.error('Failed to retrieve streak count:', error)
    next(error)
  }
}

/**
 * Awards 10 loyalty points to the user for a successful check-in.
 */
const awardPoints = async (user_id: number, owner_id: number) => {
  try {
    const code = 'daily_check_in' // This code should exist in your loyalty database
    const value = 10 // The number of points to add

    const req = {
      query: { user_id, owner_id },
      body: { code, value },
      params: {}
    } as unknown as Request // Simulating a Request object

    const res = {
      status: (statusCode: number) => ({
        json: (data: any) => console.log(`Status: ${statusCode}`, data)
      })
    } as unknown as Response // Simulating a Response object

    // Call the function to add points
    await addLoyaltyPointsToUserOfOwner(req, res, () => {})
  } catch (error) {
    console.error('Error awarding points:', error)
  }
}
/**
 * Remove loyalty points to a user for given owner
 *
 * @param {OwnerRequest & UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to remove loyalty to a user for given owner
 *
 */
const removeLoyaltyPointOfUser = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const owner_id = Number(req.query.owner_id)
    const code = req.body.code
    const receivedValue = Number(req.body.value)

    const user_instance = await getUserByIdWithLoyalty(user_id)

    let user_loyalty = {} as Record<number, UserLoyaltyObject[]>
    if (user_instance.loyalty?.length) {
      user_loyalty = JSON.parse(user_instance.loyalty)
    }

    if (!user_loyalty[owner_id].keys()) {
      return res.status(404).json({ error: 'User has not loyalty points' })
    }
    const loyalty_instance = await getLoyaltyByOwnerAndCode(owner_id, code)
    for (const loyalty of user_loyalty[owner_id]) {
      if (
        loyalty.code == code &&
        loyalty_instance.type == LoyaltyType.REPEAT_VARIABLE &&
        receivedValue == loyalty.value
      ) {
        user_loyalty[owner_id] = user_loyalty[owner_id].filter(
          existing_loyalty => {
            return !(
              existing_loyalty.value === receivedValue &&
              existing_loyalty.code === code
            )
          }
        )
      } else if (
        loyalty.code == code &&
        loyalty_instance.type == LoyaltyType.REPEAT_FIXED
      ) {
        user_loyalty[owner_id] = user_loyalty[owner_id]
          .map(existing_loyalty => {
            if (existing_loyalty.code === code) {
              existing_loyalty.value -= loyalty_instance.value
              if (existing_loyalty.value === 0) {
                return null
              }
            }
            return existing_loyalty
          })
          .filter(loyaltyItem => loyaltyItem !== null)
      } else if (
        loyalty.code == code &&
        loyalty_instance.type != LoyaltyType.REPEAT_VARIABLE
      ) {
        user_loyalty[owner_id] = user_loyalty[owner_id].filter(
          existing_loyalty => existing_loyalty.code !== code
        )
      }
    }

    const stringified_loyalty = JSON.stringify(user_loyalty)
    await updateUserById(user_id, { loyalty: stringified_loyalty })

    return res.status(200).json({ message: 'Loyalty updated' })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to remove loyalty of user'
    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'removeLoyaltyPointOfUser',
        error
      })
    )
  }
}
export {
  addBadgeToUser,
  getItemsOfUserOfOwner,
  getNFTsOfUserOfOwner,
  getLoyaltyDataOfUserOfOwner,
  setLoyaltyDataOfUserOfOwner,
  getLoyaltyPointsOfUserOfOwner,
  addLoyaltyPointsToUserOfOwner,
  removeLoyaltyPointOfUser,
  handleDailyCheckIn,
  getStreakCount
}
