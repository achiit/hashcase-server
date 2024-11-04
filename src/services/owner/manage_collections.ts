import { NextFunction, Response } from 'express'

import { OwnerRequest } from '../../types/expressTypes'
import { CustomError } from '../../utils/errors_factory'
import { _safeCollection } from '../collection/validators'

import { _ensureOwnerOwnsCollection } from './validators'

/**
 * Prepare owner add collection
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The collection instance
 * @throws {CustomError} If unable to prepare owner to add collection
 *
 */
const prepareOwnerAddCollection = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const { collection } = req.body

    collection.owner_id = owner_id

    req.body.collection = _safeCollection(collection)

    next()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to prepare owner add collection'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'prepareOwnerAddCollection',
        error
      })
    )
  }
}

/**
 * Prepare owner edit collection
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The collection instance
 * @throws {CustomError} If unable to prepare owner to edit collection
 *
 */
const prepareOwnerEditCollection = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const { collection } = req.body

    await _ensureOwnerOwnsCollection(owner_id, collection.id)
    collection.owner_id = owner_id

    req.body.collection = _safeCollection(collection)

    next()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to prepare owner edit collection'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'prepareOwnerEditCollection',
        error
      })
    )
  }
}

export { prepareOwnerAddCollection, prepareOwnerEditCollection }
