import { Owner, User } from '../models'
import { OwnerAttributes } from '../types/modelTypes'
import { CustomError } from '../utils/errors_factory'

/**
 * Creates a new owner
 *
 * @param {OwnerAttributes} details The details of the owner to create
 * @returns {Promise<[Owner, boolean]>} Array of the owner instance and a boolean indicating if it was created
 * @throws {CustomError} If the owner cannot be created
 *
 */
const createOwner = async (
  details: OwnerAttributes
): Promise<[Owner, boolean]> => {
  try {
    const result = await Owner.findOrCreate({
      where: {
        email: details.email
      },
      defaults: details
    })
    return result
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create owner'

    throw new CustomError(message, statusCode, {
      context: 'createOwner',
      error
    })
  }
}

/**
 * Retrieve all owners
 *
 * @returns {Promise<Owner[]>} The list of all owners
 *
 */

const getAllOwners = async (): Promise<Owner[]> => {
  return Owner.findAll()
}

/**
 * Retrieve an owner by its unique id
 *
 * @param {number} id The unique id of the owner to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the owner is not found.
 * Use this to indicate that the owner is required and should exist.
 * @returns {Promise<Owner|null>} The owner instance, or null if not found
 * @throws {CustomError} If the owner is required and not found
 *
 */
const getOwnerById = async <T extends boolean = true>(
  id: number,
  fail: T = true as T
): Promise<T extends true ? Owner : Owner | null> => {
  const owner_instance = await Owner.findByPk(id)
  if (fail && !owner_instance) {
    throw new CustomError('Owner not found', 404, {
      context: 'getOwnerById'
    })
  }
  return owner_instance as T extends true ? Owner : Owner | null
}

/**
 * Retrieve an owner by its email
 *
 * @param {string} email The email of the owner to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the owner is not found.
 * Use this to indicate that the owner is required and should exist.
 * @returns {Promise<Owner|null>} The owner instance, or null if not found
 * @throws {CustomError} If the owner is required and not found
 *
 */
const getOwnerByEmail = async <T extends boolean = true>(
  email: string,
  fail: T = true as T
): Promise<T extends true ? Owner : Owner | null> => {
  const owner_instance = await Owner.findOne({ where: { email } })
  if (fail && !owner_instance) {
    throw new CustomError('Owner not found', 404, {
      context: 'getOwnerByEmail'
    })
  }
  return owner_instance as T extends true ? Owner : Owner | null
}

/**
 * Updates an owner instance
 *
 * @param {Owner} owner_instance The owner instance to update
 * @param {Partial<OwnerAttributes>} details The details to update
 * @returns {Promise<Owner>} The updated owner instance
 * @throws {CustomError} If the owner cannot be updated
 *
 */
const _updateOwnerInstance = async (
  owner_instance: Owner,
  details: Partial<OwnerAttributes>
): Promise<Owner> => {
  try {
    await owner_instance.update(details)
    return owner_instance
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to update owner'

    throw new CustomError(message, statusCode, {
      context: '_updateOwnerInstance',
      error
    })
  }
}

/**
 * Update an owner by its unique id
 *
 * @param {number} id The unique id of the owner to update
 * @param {Partial<OwnerAttributes>} details The details to update
 * @returns {Promise<Owner>} The updated owner instance
 *
 */
const updateOwnerById = async (
  id: number,
  details: Partial<OwnerAttributes>
): Promise<Owner> => {
  return _updateOwnerInstance(await getOwnerById(id, true), details)
}

/**
 * Update an owner by its email
 *
 * @param {string} email The email of the owner to update
 * @param {Partial<OwnerAttributes>} details The details to update
 * @returns {Promise<Owner>} The updated owner instance
 *
 */
const updateOwnerByEmail = async (
  email: string,
  details: Partial<OwnerAttributes>
): Promise<Owner> => {
  return _updateOwnerInstance(await getOwnerByEmail(email, true), details)
}

/**
 * Deletes an owner instance
 *
 * @param {Owner} owner_instance The owner instance to delete
 * @returns {Promise<void>}
 * @throws {CustomError} If the owner cannot be deleted
 *
 */
const _deleteOwnerInstance = async (owner_instance: Owner): Promise<void> => {
  try {
    await owner_instance.destroy()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete owner'

    throw new CustomError(message, statusCode, {
      context: '_deleteOwnerInstance',
      error
    })
  }
}

/**
 * Delete an owner by its unique id
 *
 * @param {number} id The unique id of the owner to delete
 * @returns {Promise<void>}
 *
 */
const deleteOwnerById = async (id: number): Promise<void> => {
  return _deleteOwnerInstance(await getOwnerById(id, true))
}

/**
 * Delete an owner by its email
 *
 * @param {string} email The email of the owner to delete
 * @returns {Promise<void>}
 *
 */
const deleteOwnerByEmail = async (email: string): Promise<void> => {
  return _deleteOwnerInstance(await getOwnerByEmail(email, true))
}
export const getUsersByOwnerId = async (
  owner_id: number,
  page: number = 1,
  limit: number = 20
) => {
  const offset = (page - 1) * limit

  try {
    const { count, rows } = await User.findAndCountAll({
      where: { owner_id },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    return { count, rows }
  } catch (error) {
    console.error('Error in getUsersByOwnerId:', error)
    throw new CustomError('Failed to fetch users by owner ID', 500, {
      context: 'getUsersByOwnerId',
      error
    })
  }
}
export {
  createOwner,
  getAllOwners,
  getOwnerById,
  getOwnerByEmail,
  updateOwnerById,
  updateOwnerByEmail,
  deleteOwnerById,
  deleteOwnerByEmail
}
