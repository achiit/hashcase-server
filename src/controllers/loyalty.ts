import { Loyalty } from '../models'
import { LoyaltyAttributes } from '../types/modelTypes'
import { CustomError } from '../utils/errors_factory'

/**
 * Creates a new loyalty
 *
 * @param {LoyaltyAttributes} details The details of the loyalty to create
 * @returns {Promise<[Loyalty, boolean]>} The loyalty instance
 * @throws {CustomError} If the loyalty cannot be created
 *
 */
const createLoyalty = async (
  details: LoyaltyAttributes
): Promise<[Loyalty, boolean]> => {
  try {
    const loyalty = await Loyalty.findOrCreate({
      where: {
        owner_id: details.owner_id,
        code: details.code
      },
      defaults: details
    })
    return loyalty
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create loyalty'

    throw new CustomError(message, statusCode, {
      context: 'createLoyalty',
      error
    })
  }
}

/**
 * Retrieves a loyalty by its unique id
 *
 * @param {number} id The unique id of the loyalty to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the loyalty is not found.
 * Use this to indicate that the loyalty is required and should exist.
 * @returns {Promise<Loyalty|null>} The loyalty instance, or null if not found
 * @throws {CustomError} If the loyalty is required and not found
 *
 */
const getLoyaltyById = async <T extends boolean = true>(
  id: number,
  fail: T = true as T
): Promise<T extends true ? Loyalty : Loyalty | null> => {
  const loyalty_instance = await Loyalty.findByPk(id)
  if (fail && !loyalty_instance) {
    throw new CustomError('Loyalty not found', 404, {
      context: 'getLoyaltyById'
    })
  }
  return loyalty_instance as T extends true ? Loyalty : Loyalty | null
}

/**
 * Retrieve loyalty by its owner and code
 *
 * @param {number} owner_id The unique id of the owner
 * @param {string} code The code of the loyalty
 * @param {boolean} [fail=false] If true, the function will throw an error if the loyalty is not found.
 * @returns {Promise<Loyalty|null>} The loyalty instance, or null if not found
 * @throws {CustomError} If the loyalty is required and not found
 *
 */
const getLoyaltyByOwnerAndCode = async <T extends boolean = true>(
  owner_id: number,
  code: string,
  fail: T = true as T
): Promise<T extends true ? Loyalty : Loyalty | null> => {
  const loyalty_instance = await Loyalty.findOne({
    where: {
      owner_id,
      code
    }
  })

  if (fail && !loyalty_instance) {
    throw new CustomError('Loyalty not found', 404, {
      context: 'getLoyaltyByOwnerAndCode'
    })
  }

  return loyalty_instance as T extends true ? Loyalty : Loyalty | null
}

/**
 * Retrieve all loyalties owned by an owner
 *
 * @param {number} owner_id The unique id of the owner
 * @returns {Promise<Loyalty[]>} The list of loyalties owned by the owner
 *
 */
const getLoyaltiesByOwner = async (owner_id: number): Promise<Loyalty[]> => {
  const loyalties = await Loyalty.findAll({
    where: {
      owner_id
    }
  })
  return loyalties
}

/**
 * Updates an existing loyalty
 *
 * @param {Loyalty} loyalty_instance The loyalty instance to update
 * @param {LoyaltyAttributes} details The details of the loyalty to update
 * @returns {Promise<Loyalty>} The updated loyalty instance
 * @throws {CustomError} If the loyalty cannot be updated
 *
 */
const _updateLoyaltyInstance = async (
  loyalty_instance: Loyalty,
  details: LoyaltyAttributes
): Promise<Loyalty> => {
  try {
    await loyalty_instance.update(details)
    return loyalty_instance
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to update loyalty'

    throw new CustomError(message, statusCode, {
      context: 'updateLoyaltyInstance',
      error
    })
  }
}

/**
 * Updates an existing loyalty
 *
 * @param {number} id The unique id of the loyalty to update
 * @param {LoyaltyAttributes} details The details of the loyalty to update
 * @returns {Promise<Loyalty>} The updated loyalty instance
 *
 */
const updateLoyaltyById = async (
  id: number,
  details: LoyaltyAttributes
): Promise<Loyalty> => {
  return _updateLoyaltyInstance(await getLoyaltyById(id, true), details)
}

/**
 * Deletes a loyalty instance
 *
 * @param {Loyalty} loyalty_instance The loyalty instance to delete
 * @returns {Promise<void>} A promise that resolves when the loyalty is deleted
 * @throws {CustomError} If the loyalty cannot be deleted
 *
 */
const _deleteLoyaltyInstance = async (
  loyalty_instance: Loyalty
): Promise<void> => {
  try {
    await loyalty_instance.destroy()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete loyalty'

    throw new CustomError(message, statusCode, {
      context: '_deleteLoyaltyInstance',
      error
    })
  }
}

/**
 * Deletes a loyalty by its unique id
 *
 * @param {number} id The unique id of the loyalty to delete
 * @returns {Promise<void>} A promise that resolves when the loyalty is deleted
 *
 */
const deleteLoyaltyById = async (id: number): Promise<void> => {
  return _deleteLoyaltyInstance(await getLoyaltyById(id, true))
}

export {
  createLoyalty,
  getLoyaltyById,
  getLoyaltyByOwnerAndCode,
  getLoyaltiesByOwner,
  updateLoyaltyById,
  deleteLoyaltyById
}
