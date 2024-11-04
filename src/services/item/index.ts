import { NextFunction, Request, Response } from 'express'

import {
  getCollectionByName,
  getCollectionsByOwnerId
} from '../../controllers/collection'
import {
  createItem,
  deleteItemById,
  getAllItems,
  getItemByCollectionAndTokenId,
  getItemById,
  getItemsByCollectionId,
  updateItemById
} from '../../controllers/item'
import { OwnerRequest } from '../../types/expressTypes'
import { CustomError } from '../../utils/errors_factory'

/**
 * Get all items
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The items
 *
 * @throws {CustomError} If unable to get items
 *
 */
const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await getAllItems()

    return res.status(200).json({ items })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get items'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'getItems', error })
    )
  }
}

/**
 * Add an item
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The item instance
 *
 */
const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item } = req.body

    const [item_instance] = await createItem(item)

    return res.json({ item_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create item'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'addItem', error })
    )
  }
}

/**
 * Edit an item
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The item instance
 *
 */
const editItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item } = req.body

    const item_instance = await updateItemById(item.id, item)

    return res.json({ item_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to edit item'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'editItem', error })
    )
  }
}

/**
 * Delete an item
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The item instance
 *
 * @throws {CustomError} if unable to delete item
 */
const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item_id } = req.query

    const item_instance = await deleteItemById(Number(item_id))

    return res.json({ item_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete item'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'deleteItem', error })
    )
  }
}

/**
 * Get an item by id
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The item instance
 *
 */
const getItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item_id } = req.query

    const item_instance = await getItemById(Number(item_id))

    return res.status(200).json({ item_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get item of a given id'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getItem',
        error
      })
    )
  }
}

const getItemOfCollectionNameAndTokenId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { collection_name, token_id } = req.query

    const collection_instance = await getCollectionByName(
      collection_name as string
    )
    const item_instance = await getItemByCollectionAndTokenId(
      collection_instance.id,
      Number(token_id)
    )

    return res.status(200).json({ item_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get item of a given collection name and token id'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getItemOfCollectionNameAndTokenId',
        error
      })
    )
  }
}

/**
 * Get items of a given collection
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to get items
 *
 */
const getItemsOfCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { collection_id } = req.query
    const items = await getItemsByCollectionId(Number(collection_id))
    return res.status(200).json({ items })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get items of a given collection'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getItemsOfCollection',
        error
      })
    )
  }
}

/**
 * Get items of collections owned by a given owner
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} if unable to get items
 *
 */
const getItemsOfOwner = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)

    const collections = await getCollectionsByOwnerId(owner_id)
    const itemList = await Promise.all(
      collections.map(async collection_instance => {
        const current_items = await getItemsByCollectionId(
          collection_instance.id
        )
        return current_items
      })
    )

    const items = itemList.flat()
    return res.status(200).json({ items })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get items of owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getItemsOfOwner',
        error
      })
    )
  }
}

export {
  getItems,
  addItem,
  editItem,
  deleteItem,
  getItem,
  getItemOfCollectionNameAndTokenId,
  getItemsOfCollection,
  getItemsOfOwner
}
