import axios from 'axios'
import { NextFunction, Response } from 'express'
import { BN } from 'fuels'

import { getCollectionById } from '../../controllers/collection'
import { createItem } from '../../controllers/item'
import { createNFT } from '../../controllers/nft'
import { getUserById } from '../../controllers/user'
import { ChainType } from '../../enums'
import { UserRequest } from '../../types/expressTypes'
import { CustomError } from '../../utils/errors_factory'
import logger from '../../utils/logger'
import { getFuelContract } from '../../utils/providers'

/**
 * Get all fuel nfts of a user for a given collection
 *
 *
 * @param {UserRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns all fuel nfts of user
 *
 */

const getFuelNFTsOfUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.query.user_id)
    const collection_id = Number(req.query.collection_id)

    const user_instance = await getUserById(user_id)

    const collection_instance = await getCollectionById(collection_id)

    if (collection_instance.chain_type !== ChainType.FUEL) {
      throw new CustomError('The given collection is not on Fuel', 500, {
        context: 'getFuelNFTsOfUser'
      })
    }

    const contract = await getFuelContract(collection_instance)
    const tokensOfOwner = await contract.functions
      .tokensOfOwner({
        Address: {
          value: user_instance.fuel_wallet_address
        }
      })
      .get()
    const token_ids: number[] = []
    for (const token of tokensOfOwner.value as BN[]) {
      const token_id = token.toNumber()
      if (token_id !== 0) {
        token_ids.push(token_id)
      }
    }
    const nfts = []
    for (const token_id of token_ids) {
      const uri = await contract.functions.uri(token_id).get()
      const { data } = await axios.get(uri.value)
      const [item_instance] = await createItem({
        collection_id: collection_instance.id,
        token_id,
        name: data.name,
        description: data.description,
        image_uri: data.image
      })
      await createNFT({
        user_id,
        item_id: item_instance.id,
        amount: 1
      })
      nfts.push(item_instance)
    }

    return res.status(200).json({ nfts })
  } catch (error: unknown) {
    const statusCode = 500
    const message = 'Failed to get user nfts'

    logger.debug(error)

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'getNFTsOfUser', error })
    )
  }
}

export { getFuelNFTsOfUser }
