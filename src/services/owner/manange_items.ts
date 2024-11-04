import { NextFunction, Response } from 'express'

import { getItemById } from '../../controllers/item'
import { OwnerRequest } from '../../types/expressTypes'
import { CustomError } from '../../utils/errors_factory'
import { _safeItem } from '../item/validators'

import { _ensureOwnerOwnsCollection } from './validators'

/**
 * Prepare owner add item
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The item instance
 * @throws {CustomError} If unable to prepare owner to add item
 *
 */
const prepareOwnerAddItem = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const { item } = req.body

    await _ensureOwnerOwnsCollection(owner_id, item.collection_id)

    req.body.item = _safeItem(item)

    next()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to prepare owner add item'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'prepareOwnerAddItem',
        error
      })
    )
  }
}

/**
 * Prepare owner edit item
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The item instance
 * @throws {CustomError} If unable to prepare owner to edit item
 *
 */
const prepareOwnerEditItem = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const { item } = req.body

    const { collection_id, token_id } = await getItemById(item.id)
    await _ensureOwnerOwnsCollection(owner_id, collection_id)

    item.collection_id = collection_id
    item.token_id = token_id
    req.body.item = _safeItem(item)

    next()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to prepare owner edit item'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'prepareOwnerEditItem',
        error
      })
    )
  }
}

export { prepareOwnerAddItem, prepareOwnerEditItem }
