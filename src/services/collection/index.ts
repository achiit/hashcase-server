import { NextFunction, Request, Response } from 'express'

import {
  createCollection,
  getCollectionById,
  getCollectionsByOwnerId,
  getAllCollections,
  updateCollectionById,
  deleteCollectionById
} from '../../controllers/collection'
import { getOwnerById } from '../../controllers/owner'
import { OwnerRequest } from '../../types/expressTypes'
import { CustomError } from '../../utils/errors_factory'

/**
 * Add a collection
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The collection instance
 * @throws {CustomError} If unable to create collection
 *
 */
const addCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { collection } = req.body

    const [collection_instance] = await createCollection(collection)

    return res.json({ collection_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create collection'
    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'addCollection', error })
    )
  }
}

/**
 * Edit a collection
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The collection instance
 * @throws {CustomError} If unable to edit collection
 *
 */
const editCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { collection } = req.body

    const collection_instance = await updateCollectionById(
      collection.id,
      collection
    )

    return res.json({ collection_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to edit collection'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'editCollection', error })
    )
  }
}

/**
 * Delete a collection
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The collection instance
 *
 * @throws {CustomError} If unable to delete collection
 *
 */
const deleteCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { collection_id } = req.query

    const collection_instance = await deleteCollectionById(
      Number(collection_id)
    )

    return res.json({ collection_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete collection'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'deleteCollection',
        error
      })
    )
  }
}

/**
 * Get a collection of an owner
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The collection instance
 * @throws {CustomError} If unable to get collection of owner
 *
 */
const getCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { collection_id } = req.query

    const collection_instance = await getCollectionById(Number(collection_id))

    return res.status(200).json({ collection_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get collection of owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getCollection',
        error
      })
    )
  }
}

/**
 * Get all collections
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns All collections
 * @throws {CustomError} If unable to get all collections
 *
 */
const getCollections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const collections = await getAllCollections()
    return res.status(200).json({ collections })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get all collections'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getAllCollections',
        error
      })
    )
  }
}

/**
 * Get collections of an owner
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The collections of an owner
 * @throws {CustomError} If unable to get collections of owner
 *
 */
const getCollectionsOfOwner = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)

    const collections = await getCollectionsByOwnerId(owner_id)

    return res.status(200).json({ collections })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get collections of owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getCollectionsOfOwner',
        error
      })
    )
  }
}

/**
 * Get owner of a collection
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The owner of the collection by collection id
 * @throws {CustomError} If unable to get owner of the collection
 *
 */
const getOwnerByCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const collection_id = Number(req.query.collection_id)
    const collection_instance = await getCollectionById(collection_id)
    const owner_instance = await getOwnerById(collection_instance?.owner_id)
    return res.status(200).json({ owner_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get  owner of collection'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getOwnerByCollection',
        error
      })
    )
  }
}

export {
  addCollection,
  editCollection,
  deleteCollection,
  getCollection,
  getCollections,
  getCollectionsOfOwner,
  getOwnerByCollection
}
