import axios from 'axios'

import { getCollectionById } from '../../controllers/collection'
import {
  createItem,
  getItemByCollectionAndTokenId
} from '../../controllers/item'
import {
  createNFT,
  getNFTByUserIdAndItemId,
  updateNFTByUserIdAndItemId
} from '../../controllers/nft'
import { createUser } from '../../controllers/user'
import { CollectionAttributes } from '../../types/modelTypes'
import { CustomError } from '../../utils/errors_factory'
import logger from '../../utils/logger'
import { getBalanceOf } from '../contract/1155'
import { getTokenURI721 } from '../contract/721'
import { removeListener } from '../contract/listener'

/**
 * Handle 1155 transfer
 *
 * @param {string} operator The operator
 * @param {string} from The from address
 * @param {string} to The to address
 * @param {number} token_id The token id
 * @param {number} amount The amount
 * @param {CollectionAttributes & { id: number }} collection_instance The collection instance
 * @returns {Promise<void>}
 *
 */
const handle1155Transfer = async (
  operator: string,
  from: string,
  to: string,
  token_id: number,
  amount: number,
  collection_instance: CollectionAttributes & { id: number }
): Promise<void> => {
  try {
    const { id: collection_id } = collection_instance
    logger.debug(
      'TransferSingle1155_event',
      from,
      to,
      token_id,
      amount,
      collection_id
    )

    const found_collection_instance = await getCollectionById(
      collection_id,
      false
    )
    if (!found_collection_instance) {
      removeListener(collection_id)
      return
    }

    collection_instance = found_collection_instance

    const item_instance = await getItemByCollectionAndTokenId(
      collection_id,
      token_id
    )

    const [from_user_instance] = await createUser({
      eth_wallet_address: from
    })
    const [to_user_instance] = await createUser({
      eth_wallet_address: to
    })
    logger.debug('Creating NFTs')

    const from_nft_instance = await getNFTByUserIdAndItemId(
      from_user_instance.id,
      item_instance.id,
      false
    )
    if (from_nft_instance) {
      await updateNFTByUserIdAndItemId(
        from_user_instance.id,
        item_instance.id,
        {
          amount: await getBalanceOf(from, collection_instance, token_id)
        }
      )
    } else {
      await createNFT({
        user_id: from_user_instance.id,
        item_id: item_instance.id,
        amount: await getBalanceOf(from, collection_instance, token_id)
      })
    }

    const to_nft_instance = await getNFTByUserIdAndItemId(
      to_user_instance.id,
      item_instance.id,
      false
    )

    if (to_nft_instance) {
      await updateNFTByUserIdAndItemId(to_user_instance.id, item_instance.id, {
        amount: await getBalanceOf(to, collection_instance, token_id)
      })
    } else {
      await createNFT({
        user_id: to_user_instance.id,
        item_id: item_instance.id,
        amount: await getBalanceOf(to, collection_instance, token_id)
      })
    }
  } catch (error) {
    if (error instanceof CustomError) {
      logger.error(error.message)
    } else {
      logger.error('Failed to handle 1155 transfer', error)
    }
  }
}

const handle721Transfer = async (
  operator: string,
  from: string,
  to: string,
  token_id: number,
  amount: number,
  collection_instance: CollectionAttributes & { id: number }
): Promise<void> => {
  try {
    logger.debug(
      'TransferSingle721_event',
      operator,
      from,
      to,
      token_id,
      amount
    )

    collection_instance = await getCollectionById(collection_instance.id)

    const uri = await getTokenURI721(collection_instance, token_id)
    const { data } = await axios.get(uri)
    const [item_instance] = await createItem({
      collection_id: collection_instance.id,
      token_id,
      name: data.name,
      description: data.description,
      image_uri: data.image
    })

    const [from_user_instance] = await createUser({
      eth_wallet_address: from
    })

    const [to_user_instance] = await createUser({
      eth_wallet_address: to
    })

    await createNFT({
      user_id: from_user_instance.id,
      item_id: item_instance.id,
      amount: 0
    })

    await createNFT({
      user_id: to_user_instance.id,
      item_id: item_instance.id,
      amount: 1
    })
  } catch (error) {
    if (error instanceof CustomError) {
      logger.error(error.message)
    } else {
      logger.error('Failed to handle 721 transfer', error)
    }
  }
}

export { handle1155Transfer, handle721Transfer }
