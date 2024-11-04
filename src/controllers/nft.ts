import { NFT } from '../models'
import { NFTAttributes } from '../types/modelTypes'
import { CustomError } from '../utils/errors_factory'

/**
 * Creates a new NFT
 *
 * @param {NFTAttributes} details The details of the NFT to create
 * @returns {Promise<[NFT, boolean]>} The NFT instance
 * @throws {CustomError} If the NFT cannot be created
 *
 */
const createNFT = async (details: NFTAttributes): Promise<[NFT, boolean]> => {
  try {
    const res = await NFT.findOrCreate({
      where: {
        user_id: details.user_id,
        item_id: details.item_id
      },
      defaults: details
    })
    return res
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create NFT'

    throw new CustomError(message, statusCode, {
      context: 'createNFT',
      error
    })
  }
}

/**
 * Retrieve an NFT by its unique id
 *
 * @param {number} id The unique id of the NFT to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the NFT is not found.
 * Use this to indicate that the NFT is required and should exist.
 * @returns {Promise<NFT|null>} The NFT instance, or null if not found
 * @throws {CustomError} If the NFT is required and not found
 *
 */
const getNFTById = async <T extends boolean = true>(
  id: number,
  fail: T = true as T
): Promise<T extends true ? NFT : NFT | null> => {
  const nft = await NFT.findByPk(id)
  if (fail && !nft) {
    throw new CustomError('NFT not found', 404, { context: 'getNFTById' })
  }
  return nft as T extends true ? NFT : NFT | null
}

/**
 * Retrieve an NFT by it user id and item id
 *
 * @param {number} user_id The unique id of the user
 * @param {number} item_id The unique id of the item
 * @param {boolean} [fail=false] If true, the function will throw an error if the NFT is not found.
 * Use this to indicate that the NFT is required and should exist.
 * @returns {Promise<NFT|null>} The NFT instance, or null if not found
 * @throws {CustomError} If the NFT is required and not found
 *
 */
const getNFTByUserIdAndItemId = async <T extends boolean = true>(
  user_id: number,
  item_id: number,
  fail: T = true as T
): Promise<T extends true ? NFT : NFT | null> => {
  const nft = await NFT.findOne({ where: { user_id, item_id } })
  if (fail && !nft) {
    throw new CustomError("User doesn't own NFT", 404, {
      context: 'getNFTByUserIdAndItemId'
    })
  }
  return nft as T extends true ? NFT : NFT | null
}

/**
 * Retrieve all NFTs by user id
 *
 * @param {number} user_id The unique id of the user
 * @returns {Promise<NFT[]>} The NFT instances
 *
 */
const getNFTsByUserId = async (user_id: number): Promise<NFT[]> => {
  return NFT.findAll({ where: { user_id } })
}

/**
 * Updates an NFT by its unique id
 *
 * @param {NFT} nft_instance The NFT instance to update
 * @param {Partial<NFTAttributes>} details The details to update
 * @returns {Promise<NFT>} The updated NFT instance
 * @throws {CustomError} If the NFT cannot be updated
 *
 */
const _updateNFTInstance = async (
  nft_instance: NFT,
  details: Partial<NFTAttributes>
): Promise<NFT> => {
  try {
    const updated_nft = await nft_instance.update(details)
    return updated_nft
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to update NFT'

    throw new CustomError(message, statusCode, {
      context: '_updateNFTInstance',
      error
    })
  }
}

/**
 * Updates an NFT by its unique id
 *
 * @param {number} id The unique id of the NFT to update
 * @param {Partial<NFTAttributes>} details The details to update
 * @returns {Promise<NFT>} The updated NFT instance
 *
 */
const updateNFTById = async (
  id: number,
  details: Partial<NFTAttributes>
): Promise<NFT> => {
  return _updateNFTInstance(await getNFTById(id, true), details)
}

/**
 * Updates an NFT by its user id and item id
 *
 * @param {number} user_id The unique id of the user
 * @param {number} item_id The unique id of the item
 * @param {Partial<NFTAttributes>} details The details to update
 * @returns {Promise<NFT>} The updated NFT instance
 *
 */
const updateNFTByUserIdAndItemId = async (
  user_id: number,
  item_id: number,
  details: Partial<NFTAttributes>
): Promise<NFT> => {
  return _updateNFTInstance(
    await getNFTByUserIdAndItemId(user_id, item_id, true),
    details
  )
}

/**
 * Deletes an NFT instance
 *
 * @param {NFT} nft_instance The NFT instance to delete
 * @returns {Promise<void>}
 * @throws {CustomError} If the NFT cannot be deleted
 *
 */
const _deleteNFTInstance = async (nft_instance: NFT): Promise<void> => {
  try {
    await nft_instance.destroy()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete NFT'

    throw new CustomError(message, statusCode, {
      context: '_deleteNFTInstance',
      error
    })
  }
}

/**
 * Deletes an NFT by its unique id
 *
 * @param {number} id The unique id of the NFT to delete
 * @returns {Promise<void>}
 *
 */
const deleteNFTById = async (id: number): Promise<void> => {
  return _deleteNFTInstance(await getNFTById(id, true))
}

/**
 * Deletes an NFT by its user id and item id
 *
 * @param {number} user_id The unique id of the user
 * @param {number} item_id The unique id of the item
 * @returns {Promise<void>}
 *
 */
const deleteNFTByUserIdAndItemId = async (
  user_id: number,
  item_id: number
): Promise<void> => {
  return _deleteNFTInstance(
    await getNFTByUserIdAndItemId(user_id, item_id, true)
  )
}

export {
  createNFT,
  getNFTById,
  getNFTByUserIdAndItemId,
  getNFTsByUserId,
  updateNFTById,
  updateNFTByUserIdAndItemId,
  deleteNFTById,
  deleteNFTByUserIdAndItemId
}
