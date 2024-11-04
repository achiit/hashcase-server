import { DevAPI } from '../models'
import { DevAPIAttributes } from '../types/modelTypes'
import { CustomError } from '../utils/errors_factory'

/**
 * Creates a new dev api key
 *
 * @param {DevAPIAttributes} details The details of the dev api key to create
 * @returns {Promise<[DevAPI, boolean]>} The dev api instance
 * @throws {CustomError} If the dev api key cannot be created
 *
 */
const createDevAPI = async (
  details: DevAPIAttributes
): Promise<[DevAPI, boolean]> => {
  try {
    const result = await DevAPI.findOrCreate({
      where: {
        api_key: details.api_key,
        owner_id: details.owner_id
      },
      defaults: details
    })
    return result
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create dev api key'

    throw new CustomError(message, statusCode, {
      context: 'createDevAPI',
      error
    })
  }
}

/**
 * Retrieve a dev api key by its unique id
 *
 * @param {number} id The unique id of the dev api key to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the dev api key is not found.
 * Use this to indicate that the dev api key is required and should exist.
 * @returns {Promise<DevAPI|null>} The dev api instance, or null if not found
 * @throws {CustomError} If the dev api key is required and not found
 *
 */
const getDevAPIById = async <T extends boolean = true>(
  id: number,
  fail: T = true as T
): Promise<T extends true ? DevAPI : DevAPI | null> => {
  const devapi_instance = await DevAPI.findByPk(id)
  if (fail && !devapi_instance) {
    throw new CustomError('DevAPI not found', 404, { context: 'getDevAPIById' })
  }
  return devapi_instance as T extends true ? DevAPI : DevAPI | null
}

const getDevAPIByKey = async <T extends boolean = true>(
  api_key: string,
  fail: T = true as T
): Promise<T extends true ? DevAPI : DevAPI | null> => {
  const devapi_instance = await DevAPI.findOne({
    where: { api_key }
  })
  if (fail && !devapi_instance) {
    throw new CustomError('DevAPI not found', 404, {
      context: 'getDevAPIByKey'
    })
  }
  return devapi_instance as T extends true ? DevAPI : DevAPI | null
}

/**
 * Retrieve all dev api keys owned by a user
 *
 * @param {number} owner_id The unique id of the user who owns the dev api keys
 * @returns {Promise<DevAPI[]>} The dev api instances
 *
 */
const getDevAPIKeysByOwnerId = async (owner_id: number): Promise<DevAPI[]> => {
  const devapi_instances = await DevAPI.findAll({
    where: { owner_id }
  })
  return devapi_instances
}

/**
 * Update a dev api key
 *
 * @param {DevAPI} devapi_instance The dev api instance to update
 * @param {DevAPIAttributes} details The details of the dev api key to update
 * @returns {Promise<DevAPI>} The updated dev api instance
 * @throws {CustomError} If the dev api key cannot be updated
 *
 */
const _updateDevAPIInstance = async (
  devapi_instance: DevAPI,
  details: Partial<DevAPIAttributes>
): Promise<DevAPI> => {
  try {
    const updated_devapi = await devapi_instance.update(details)
    return updated_devapi
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to update dev api key'

    throw new CustomError(message, statusCode, {
      context: '_updateDevAPIInstance',
      error
    })
  }
}

/**
 * Update a dev api key by its unique id
 *
 * @param {number} id The unique id of the dev api key to update
 * @param {Partial<DevAPIAttributes>} details The details to update
 * @returns {Promise<DevAPI>} The updated dev api instance
 *
 */
const updateDevAPIById = async (
  id: number,
  details: Partial<DevAPIAttributes>
): Promise<DevAPI> => {
  return _updateDevAPIInstance(await getDevAPIById(id), details)
}

/**
 * Update a dev api key by its api key
 *
 * @param {string} api_key The api key of the dev api key to update
 * @param {Partial<DevAPIAttributes>} details The details to update
 * @returns {Promise<DevAPI>} The updated dev api instance
 *
 */
const updateDevAPIByKey = async (
  api_key: string,
  details: Partial<DevAPIAttributes>
): Promise<DevAPI> => {
  return _updateDevAPIInstance(await getDevAPIByKey(api_key), details)
}

/**
 * Deletes a dev api key
 *
 * @param {DevAPI} devapi_instance The dev api instance to delete
 * @returns {Promise<void>}
 * @throws {CustomError} If the dev api key cannot be deleted
 *
 */
const _deleteDevAPIInstance = async (
  devapi_instance: DevAPI
): Promise<void> => {
  try {
    await devapi_instance.destroy()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete dev api key'

    throw new CustomError(message, statusCode, {
      context: '_deleteDevAPIInstance',
      error
    })
  }
}

/**
 * Delete a dev api key by its unique id
 *
 * @param {number} id The unique id of the dev api key to delete
 * @returns {Promise<void>}
 *
 */
const deleteDevAPIById = async (id: number): Promise<void> => {
  return _deleteDevAPIInstance(await getDevAPIById(id))
}

/**
 * Delete a dev api key by its api key
 *
 * @param {string} api_key The api key of the dev api key to delete
 * @returns {Promise<void>}
 *
 */
const deleteDevAPIByKey = async (api_key: string): Promise<void> => {
  return _deleteDevAPIInstance(await getDevAPIByKey(api_key))
}

export {
  createDevAPI,
  getDevAPIById,
  getDevAPIByKey,
  getDevAPIKeysByOwnerId,
  updateDevAPIById,
  updateDevAPIByKey,
  deleteDevAPIById,
  deleteDevAPIByKey
}
