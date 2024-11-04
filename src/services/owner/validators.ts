import { NextFunction, Response } from 'express'

import { getCollectionById } from '../../controllers/collection'
import { getItemById } from '../../controllers/item'
import { OwnerRequest } from '../../types/expressTypes'
import { CustomError } from '../../utils/errors_factory'

/**
 * Ensure owner owns collection
 *
 * @param {number} owner_id The owner id
 * @param {number} collection_id The collection id
 * @throws {CustomError} If owner does not own collection
 *
 */
const _ensureOwnerOwnsCollection = async (
  owner_id: number,
  collection_id: number
) => {
  try {
    const collection = await getCollectionById(collection_id)
    if (collection.owner_id !== owner_id) {
      throw new CustomError('Owner does not own collection', 403, {
        context: '_ensureOwnerOwnsCollection'
      })
    }
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to ensure owner owns collection'

    if (error instanceof CustomError) {
      throw error
    }

    throw new CustomError(message, statusCode, {
      context: '_ensureOwnerOwnsCollection',
      error
    })
  }
}

/**
 * Check if owner owns collection
 *
 * @param {number} owner_id The owner id
 * @param {number} collection_id The collection id
 * @returns {Promise<boolean>} True if owner owns collection, false otherwise
 * @throws {CustomError} If unable to check if owner owns collection
 *
 */
const _ownerOwnsCollection = async (
  owner_id: number,
  collection_id: number
): Promise<boolean> => {
  try {
    const collection = await getCollectionById(collection_id)
    if (collection.owner_id !== owner_id) {
      return false
    } else {
      return true
    }
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to check if owner owns collection'

    if (error instanceof CustomError) {
      throw error
    }

    throw new CustomError(message, statusCode, {
      context: '_ownerOwnsCollection',
      error
    })
  }
}

/**
 * Ensures that the owner owns item
 *
 * @param {number} owner_id The owner id
 * @param {number} item_id The item id
 * @throws {CustomError} If owner does not own item
 *
 */
const _ensureOwnerOwnsItem = async (owner_id: number, item_id: number) => {
  try {
    const item_instance = await getItemById(item_id)
    return _ensureOwnerOwnsCollection(owner_id, item_instance.collection_id)
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to ensure owner owns Item'

    if (error instanceof CustomError) {
      throw error
    }

    throw new CustomError(message, statusCode, {
      context: '_ensureOwnerOwnsItem',
      error
    })
  }
}

/**
 * Check if owner owns item
 *
 * @param {number} owner_id The owner id
 * @param {number} item_id The item id
 * @returns {Promise<boolean>} True if owner owns item, false otherwise
 *
 */
const _ownerOwnsItem = async (
  owner_id: number,
  item_id: number
): Promise<boolean> => {
  try {
    const item_instance = await getItemById(item_id)
    return _ownerOwnsCollection(owner_id, item_instance.collection_id)
  } catch (error) {
    return false
  }
}

/**
 * Validate that the owner owns item
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} If unable to validate owner owns item
 *
 */
const validateOwnerOwnsItem = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const { item_id } = req.query

    await _ensureOwnerOwnsItem(owner_id, Number(item_id))

    return next()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to validate owner owns item'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'validateOwnerOwnsItem',
        error
      })
    )
  }
}

/**
 * Validate that the owner owns collection
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} If unable to validate owner owns collection
 *
 */
const validateOwnerOwnsCollection = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const { collection_id } = req.body
    await _ensureOwnerOwnsCollection(owner_id, collection_id)
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to validate owner owns collection'

    if (error instanceof CustomError) {
      next(error)
    }

    next(
      new CustomError(message, statusCode, {
        context: 'validateOwnerOwnsCollection',
        error
      })
    )
  }
}

export {
  _ensureOwnerOwnsCollection,
  _ownerOwnsCollection,
  validateOwnerOwnsCollection,
  _ensureOwnerOwnsItem,
  _ownerOwnsItem,
  validateOwnerOwnsItem
}
