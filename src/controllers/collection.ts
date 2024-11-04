import { Collection } from '../models'
import { removeListener, resetListener } from '../services/contract/listener'
import { CollectionAttributes } from '../types/modelTypes'
import { CustomError } from '../utils/errors_factory'

/**
 * Creates a new collection
 *
 * @param {CollectionAttributes} details The details of the collection to create
 * @returns {Promise<[Collection, boolean]>} The collection instance and a boolean indicating if it was created
 *
 */
const createCollection = async (
  details: CollectionAttributes
): Promise<[Collection, boolean]> => {
  try {
    const [collection_instance, created] = await Collection.findOrCreate({
      where: {
        chain_type: details.chain_type,
        chain_id: details.chain_id,
        contract_address: details.contract_address
      },
      defaults: details
    })
    resetListener(collection_instance.id)
    return [collection_instance, created]
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create collection'

    throw new CustomError(message, statusCode, {
      context: 'createCollection',
      error
    })
  }
}

/**
 * Retrieve a collection by its unique id
 *
 * @param {number} id The unique id of the collection to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the collection is not found.
 * Use this to indicate that the collection is required and should exist.
 * @returns {Promise<Collection|null>} The collection instance, or null if not found
 * @throws {CustomError} If the collection is required and not found
 *
 */
const getCollectionById = async <T extends boolean = true>(
  id: number,
  fail: T = true as T
): Promise<T extends true ? Collection : Collection | null> => {
  const collection_instance = await Collection.findByPk(id)
  if (fail && !collection_instance) {
    throw new CustomError('Collection not found', 404, {
      context: 'getCollectionById'
    })
  }
  return collection_instance as T extends true ? Collection : Collection | null
}

/**
 * Retrieve collection by name
 *
 * @param {string} name The name of the collection to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the collection is not found.
 * Use this to indicate that the collection is required and should exist.
 * @returns {Promise<Collection|null>} The collection instance, or null if not found
 * @throws {CustomError} If the collection is required and not found
 *
 */
const getCollectionByName = async <T extends boolean = true>(
  name: string,
  fail: T = true as T
): Promise<T extends true ? Collection : Collection | null> => {
  const collection_instance = await Collection.findOne({ where: { name } })
  if (fail && !collection_instance) {
    throw new CustomError('Collection not found', 404, {
      context: 'getCollectionById'
    })
  }
  return collection_instance as T extends true ? Collection : Collection | null
}

/**
 * Retrieve all collections owned by a user
 *
 * @param {number} owner_id The unique id of the owner of the collections to retrieve
 * @returns {Promise<Collection[]>} The collection instances
 *
 */
const getCollectionsByOwnerId = async (
  owner_id: number
): Promise<Collection[]> => {
  const collections = await Collection.findAll({ where: { owner_id } })
  return collections
}

/**
 * Retrieve all collections managed by a paymaster
 *
 * @param {number} paymaster_id The unique id of the paymaster of the collections to retrieve
 * @returns {Promise<Collection[]>} The collection instances
 *
 */
const getCollectionsByPaymasterId = async (
  paymaster_id: number
): Promise<Collection[]> => {
  const collections = await Collection.findAll({ where: { paymaster_id } })
  return collections
}

/**
 * Retrieve all collections that match a given where clause
 *
 * @returns {Promise<Collection[]>} The collection instances
 *
 */
const getAllCollections = async (): Promise<Collection[]> => {
  const collections = await Collection.findAll()
  return collections
}

/**
 * Update a collection
 *
 * @param {Collection} collection_instance collection instance that needs to be updated
 * @param {Partial<CollectionAttributes>} details The details to update
 * @returns {Promise<Collection>} The updated collection instance
 * @throws {CustomError} If the update fails
 *
 */
const _updateCollectionInstance = async (
  collection_instance: Collection,
  details: Partial<CollectionAttributes>
): Promise<Collection> => {
  try {
    const res = await collection_instance.update(details)
    resetListener(collection_instance.id)
    return res
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to update collection'

    throw new CustomError(message, statusCode, {
      context: '_updateCollectionInstance',
      error
    })
  }
}

/**
 * Update a collection by its unique id
 *
 * @param {number} id The unique id of the collection to update
 * @param {Partial<CollectionAttributes>} details The details to update
 * @returns {Promise<Collection>}
 *
 */
const updateCollectionById = async (
  id: number,
  details: Partial<CollectionAttributes>
): Promise<Collection> => {
  return _updateCollectionInstance(await getCollectionById(id, true), details)
}

/**
 * Delete a collection instance
 *
 * @param collection_instance collection instance that needs to be deleted
 * @returns {Promise<void>}
 * @throws {CustomError} If the collection cannot be deleted
 *
 */
const _deleteCollectionInstance = async (
  collection_instance: Collection
): Promise<void> => {
  try {
    const res = await collection_instance.destroy()
    removeListener(collection_instance.id)
    return res
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete collection'

    throw new CustomError(message, statusCode, {
      context: '_deleteCollectionInstance',
      error
    })
  }
}

/**
 * Delete a collection by its unique id
 *
 * @param {number} id The unique id of the collection to delete
 * @returns {Promise<void>}
 *
 */
const deleteCollectionById = async (id: number): Promise<void> => {
  return _deleteCollectionInstance(await getCollectionById(id, true))
}

export {
  createCollection,
  getCollectionById,
  getCollectionByName,
  getCollectionsByOwnerId,
  getCollectionsByPaymasterId,
  getAllCollections,
  updateCollectionById,
  deleteCollectionById
}
