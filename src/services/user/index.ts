import { NextFunction, Response } from 'express'

import { getCollectionById } from '../../controllers/collection'
import { getItemById } from '../../controllers/item'
import { getNFTByUserIdAndItemId, getNFTsByUserId } from '../../controllers/nft'
import { getUserById } from '../../controllers/user'
import { ChainType } from '../../enums'
import { UserRequest } from '../../types/expressTypes'
import { BadgeAttributes } from '../../types/modelTypes'
import { CustomError } from '../../utils/errors_factory'
import logger from '../../utils/logger'
import { transferToUser1155 } from '../contract/1155'
import { MintToUser721 } from '../contract/721'
import { uploadImageFromFile, uploadMetadata } from '../contract/metadata'

/**
 * Get user info
 *
 * @param {UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The user instance
 * @throws {CustomError} If unable to get user info
 *
 */
const getUserInfo = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)

    const user_instance = await getUserById(user_id)

    // Parse the badges from the user_instance
    let badges: BadgeAttributes[] = []
    if (user_instance.badges) {
      try {
        badges = JSON.parse(user_instance.badges)
      } catch (parseError) {
        console.error('Error parsing user badges:', parseError)
        // If there's an error parsing, we'll just return an empty array
      }
    }

    // Create a new object with user info and badges
    const userInfoWithBadges = {
      ...user_instance.toJSON(),
      badges: badges
    }

    return res.status(200).json({ user: userInfoWithBadges })
  } catch (error: unknown) {
    const statusCode = 500
    const message = 'Failed to get user info'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'getUserInfo', error })
    )
  }
}

/**
 * Get nfts of user
 *
 * @param {UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The nfts of user
 * @throws {CustomError} If unable to get user nfts
 *
 */
const getNFTsOfUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const nfts = await Promise.all(
      (await getNFTsByUserId(user_id)).map(async nft_instance => {
        const item = await getItemById(nft_instance.item_id, false)
        if (item) {
          return {
            amount: nft_instance.amount,
            item
          }
        }
      })
    )

    res.status(200).json({ nfts })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get user nfts'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'getNftsOfUser', error })
    )
  }
}

/**
 * Claims an NFT for a user
 *
 * @param {UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The receipt of the transaction
 * @throws {CustomError} If unable to claim NFT
 *
 */
const claimNFT = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const { item_id, amount = 1 } = req.body
    const { collection_id, token_id } = await getItemById(item_id)
    const collection_instance = await getCollectionById(collection_id)
    const { eth_wallet_address } = await getUserById(user_id)
    logger.debug('Claiming NFT', item_id, amount)
    const receipt = await transferToUser1155(
      collection_instance,
      eth_wallet_address!,
      token_id,
      amount
    )
    logger.debug('Claimed NFT', item_id, amount)
    return res
      .status(200)
      .json({ message: 'NFT claimed successfully', receipt })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to claim NFT'

    // console.log('Failed to claim NFT', error)

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'claimNFT', error })
    )
  }
}

/**
 * Mints a 721 NFT for a user
 *
 * @param {UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The receipt of the transaction
 * @throws {CustomError} If unable to mint NFT
 *
 */
const mintNFT = async (
  req: UserRequest & {
    file?: {
      path: string
    }
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const collection_id = Number(req.query.collection_id)
    const amount = Number(req.query.amount) || 1
    const collection_instance = await getCollectionById(collection_id)
    const { eth_wallet_address, fvm_wallet_address, fuel_wallet_address } =
      await getUserById(user_id)
    let user_address
    switch (collection_instance.chain_type) {
      case ChainType.FUEL:
        user_address = fuel_wallet_address
        break
      case ChainType.FILECOIN:
        user_address = fvm_wallet_address
        break
      default:
        user_address = eth_wallet_address
    }

    const { file } = req

    if (file) {
      const result = await uploadImageFromFile(file.path)
      req.body.image = `https://chocolate-certain-cockroach-300.mypinata.cloud/ipfs/${result.IpfsHash}`
    }
    const result = await uploadMetadata(req.body)
    const metadata_uri = `https://chocolate-certain-cockroach-300.mypinata.cloud/ipfs/${result.IpfsHash}`
    logger.debug('721 Metadata', metadata_uri)
    logger.debug('Minting NFT', collection_id, amount)
    const receipt = await MintToUser721(
      collection_instance,
      user_address!,
      amount,
      metadata_uri
    )
    logger.debug('Minted NFT', collection_id, amount)
    return res.status(200).json({ message: 'NFT minted successfully', receipt })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to mint NFT'

    logger.debug('Failed to mint NFT', error)

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'mintNFT', error })
    )
  }
}

/**
 * Check if user has item
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to check if user has item
 *
 */
const checkIfUserHasItem = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const { item_id } = req.query

    const nft_instance = await getNFTByUserIdAndItemId(
      user_id,
      Number(item_id),
      false
    )

    return res.status(200).json(nft_instance !== null)
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to check if user owns item'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'checkIfUserHasItem',
        error
      })
    )
  }
}

/**
 * Check if user has an amount of a given item
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to check if user has amount of item
 *
 */
const checkIfUserHasAmountOfItem = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const { item_id, amount } = req.query

    const nft_instance = await getNFTByUserIdAndItemId(
      user_id,
      Number(item_id),
      false
    )

    if (nft_instance === null) {
      return res.status(200).json(false)
    }

    return res.status(200).json(nft_instance.amount > Number(amount))
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to check if user owns amount of item'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'checkIfUserHasAmountOfItem',
        error
      })
    )
  }
}

export {
  getUserInfo,
  getNFTsOfUser,
  claimNFT,
  mintNFT,
  checkIfUserHasItem,
  checkIfUserHasAmountOfItem
}
