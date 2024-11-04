import { NextFunction, Response } from 'express'

import {
  createLoyalty,
  getLoyaltyByOwnerAndCode,
  updateLoyaltyById,
  deleteLoyaltyById
} from '../../controllers/loyalty'
import { OwnerRequest } from '../../types/expressTypes'
import { CustomError } from '../../utils/errors_factory'

/**
 * Create loyalty for given owner_id given details
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 *
 * @throws {CustomError} If unable to create loyalty
 *
 */
const addLoyalty = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const { loyalty } = req.body
    loyalty.owner_id = owner_id
    const [loyalty_instance] = await createLoyalty(loyalty)

    return res.status(200).json({ loyalty_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create loyalty'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'addLoyalty', error })
    )
  }
}

/**
 * Edit loyalty for given owner_id and code with given details
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} If unable to edit loyalty
 *
 */
const editLoyalty = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const code = req.body.code
    const { loyalty } = req.body
    loyalty.owner_id = owner_id
    const original_loyalty_instance = await getLoyaltyByOwnerAndCode(
      owner_id,
      code
    )
    const loyalty_instance = await updateLoyaltyById(
      original_loyalty_instance.id,
      loyalty
    )

    return res.status(200).json({ loyalty_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to edit loyalty'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'editLoyalty', error })
    )
  }
}

/**
 * Delete loyalty for given owner_id and code
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} If unable to delete loyalty
 *
 */
const deleteLoyalty = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const code = req.body.code
    const loyalty_instance = await getLoyaltyByOwnerAndCode(owner_id, code)
    await deleteLoyaltyById(loyalty_instance.id)

    return res.status(200).json({ message: 'Loyalty deleted' })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete loyalty'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'deleteLoyalty', error })
    )
  }
}

export { addLoyalty, editLoyalty, deleteLoyalty }
