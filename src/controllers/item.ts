import { Item } from '../models'
import { ItemAttributes } from '../types/modelTypes'
import { CustomError } from '../utils/errors_factory'

/**
 * Creates a new item
 *
 * @param {ItemAttributes} details The details of the item to create
 * @returns {Promise<[Item, boolean]>} The item instance and a boolean indicating if it was created
 * @throws {CustomError} If the item cannot be created
 *
 */
const createItem = async (
  details: ItemAttributes
): Promise<[Item, boolean]> => {
  try {
    const [item, created] = await Item.findOrCreate({
      where: {
        collection_id: details.collection_id,
        token_id: details.token_id
      },
      defaults: details
    })
    return [item, created]
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create item'

    throw new CustomError(message, statusCode, {
      context: 'createItem',
      error
    })
  }
}

/**
 * Retrieve all items
 *
 * @returns {Promise<Item[]>} The item instances
 *
 */
const getAllItems = async (): Promise<Item[]> => {
  return Item.findAll()
}

/**
 * Retrieve an item by its unique id
 *
 * @param {number} id The unique id of the item to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the item is not found.
 * Use this to indicate that the item is required and should exist.
 * @returns {Promise<Item|null>} The item instance, or null if not found
 * @throws {CustomError} If the item is required and not found
 *
 */
const getItemById = async <T extends boolean = true>(
  id: number,
  fail: T = true as T
): Promise<T extends true ? Item : Item | null> => {
  const item = await Item.findByPk(id)
  if (fail && !item) {
    throw new CustomError('Item not found', 404, {
      context: 'getItemById'
    })
  }
  return item as T extends true ? Item : Item | null
}

/**
 * Retrieve an item by its collection id and token id
 *
 * @param {number} collection_id The unique id of the collection to which the item belongs
 * @param {number} token_id The unique token id of the item
 * @param {boolean} [fail=false] If true, the function will throw an error if the item is not found.
 * Use this to indicate that the item is required and should exist.
 * @returns {Promise<Item|null>} The item instance, or null if not found
 * @throws {CustomError} If the item is required and not found
 *
 */
const getItemByCollectionAndTokenId = async <T extends boolean = true>(
  collection_id: number,
  token_id: number,
  fail: T = true as T
): Promise<T extends true ? Item : Item | null> => {
  const item = await Item.findOne({
    where: {
      collection_id,
      token_id
    }
  })
  if (fail && !item) {
    throw new CustomError('Item not found', 404, {
      context: 'getItemByCollectionAndTokenId'
    })
  }
  return item as T extends true ? Item : Item | null
}

/**
 * Retrieve all items by their collection id
 *
 * @param {number} collection_id The unique id of the collection to which the items belong
 * @returns {Promise<Item[]>} The item instances
 *
 */
const getItemsByCollectionId = async (
  collection_id: number
): Promise<Item[]> => {
  return Item.findAll({
    where: {
      collection_id
    }
  })
}

/**
 * Update an item
 *
 * @param {Item} item_instance The item instance to update
 * @param {Partial<ItemAttributes>} details The details to update
 * @returns {Promise<Item>} The updated item instance
 * @throws {CustomError} If the item cannot be updated
 *
 */
const _updateItemInstance = async (
  item_instance: Item,
  details: Partial<ItemAttributes>
): Promise<Item> => {
  try {
    return await item_instance.update(details)
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to update item'

    throw new CustomError(message, statusCode, {
      context: '_updateItemInstance',
      error
    })
  }
}

/**
 * Update an item by its unique id
 *
 * @param {number} id The unique id of the item to update
 * @param {Partial<ItemAttributes>} details The details to update
 * @returns {Promise<Item>} The updated item instance
 *
 */
const updateItemById = async (
  id: number,
  details: Partial<ItemAttributes>
): Promise<Item> => {
  return _updateItemInstance(await getItemById(id, true), details)
}

/**
 * Update an item by its collection id and token id
 * @param {number} collection_id The unique id of the collection to which the item belongs
 * @param {number} token_id The unique token id of the item
 * @param {Partial<ItemAttributes>} details The details to update
 * @returns {Promise<Item>} The updated item instance
 *
 */
const updateItemByCollectionAndTokenId = async (
  collection_id: number,
  token_id: number,
  details: Partial<ItemAttributes>
): Promise<Item> => {
  return _updateItemInstance(
    await getItemByCollectionAndTokenId(collection_id, token_id, true),
    details
  )
}

/**
 * Delete an item
 *
 * @param {Item} item_instance The item instance to delete
 * @returns {Promise<void>}
 * @throws {CustomError} If the item cannot be deleted
 *
 */
const _deleteItemInstance = async (item_instance: Item): Promise<void> => {
  try {
    await item_instance.destroy()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete item'

    throw new CustomError(message, statusCode, {
      context: '_deleteItemInstance',
      error
    })
  }
}

/**
 * Delete an item by its unique id
 *
 * @param {number} id The unique id of the item to delete
 * @returns {Promise<void>}
 *
 */
const deleteItemById = async (id: number): Promise<void> => {
  return _deleteItemInstance(await getItemById(id))
}

/**
 * Delete an item by its collection id and token id
 *
 * @param {number} collection_id The unique id of the collection to which the item belongs
 * @param {number} token_id The unique token id of the item
 * @returns {Promise<void>}
 *
 */
const deleteItemByCollectionAndTokenId = async (
  collection_id: number,
  token_id: number
): Promise<void> => {
  return _deleteItemInstance(
    await getItemByCollectionAndTokenId(collection_id, token_id, true)
  )
}

export {
  createItem,
  getAllItems,
  getItemById,
  getItemByCollectionAndTokenId,
  getItemsByCollectionId,
  updateItemById,
  updateItemByCollectionAndTokenId,
  deleteItemById,
  deleteItemByCollectionAndTokenId
}
