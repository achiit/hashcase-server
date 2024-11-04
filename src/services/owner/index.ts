import { NextFunction, Request, Response } from 'express'

import {
  createOwner,
  deleteOwnerById,
  getAllOwners,
  updateOwnerById
} from '../../controllers/owner'
import { hash } from '../../utils/bcrypt'
import { CustomError } from '../../utils/errors_factory'

/**
 * Get all owners
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 *
 * @throws {CustomError} If unable to get owners
 *
 */
const getOwners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owners = await getAllOwners()

    return res.status(200).json({ owners })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get owners'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'getOwners', error })
    )
  }
}

/**
 * Add an owner
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} If unable to create owner
 *
 */
const addOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner } = req.body
    owner.password_hash = await hash(owner.password)
    delete owner.password

    const [owner_instance, created] = await createOwner(owner)

    req.query.owner_id = owner_instance.id.toString()
    if (created) {
      return next()
    } else {
      return res.status(200).json({ owner_instance })
    }
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'addOwner', error })
    )
  }
}

/**
 * Edit an owner
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} If unable to edit owner
 *
 */
const editOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner } = req.body

    if (owner.password) {
      owner.password_hash = await hash(owner.password)
      delete owner.password
    } else {
      delete owner.password_hash
    }

    const owner_instance = await updateOwnerById(owner.id, owner)

    return res.status(200).json({ owner_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to edit owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'editOwner', error })
    )
  }
}

/**
 * Delete an owner
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @throws {CustomError} If unable to delete owner
 *
 */
const deleteOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner_id } = req.query

    const owner_instance = await deleteOwnerById(Number(owner_id))

    return res.status(200).json({ owner_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete owner'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'deleteOwner', error })
    )
  }
}

export { getOwners, addOwner, editOwner, deleteOwner }
