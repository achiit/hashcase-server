import { NextFunction, Request, Response } from 'express'

import {
  createBadge,
  deleteBadgeById,
  getAllBadges,
  getBadgeById,
  updateBadgeById
} from '../../controllers/badges'
import { CustomError } from '../../utils/errors_factory'

/**
 * Get all badges
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The badges
 *
 * @throws {CustomError} If unable to get badges
 *
 */
const getBadges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const badges = await getAllBadges()

    return res.status(200).json({ badges })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get badges'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'getBadges', error })
    )
  }
}

/**
 * Add a badge
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The badge instance
 *
 */
const addBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { badge } = req.body

    const [badge_instance] = await createBadge(badge)

    return res.json({ badge_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create badge'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'addBadge', error })
    )
  }
}

/**
 * Edit a badge
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The badge instance
 *
 */
const editBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { badge } = req.body

    const badge_instance = await updateBadgeById(badge.id, badge)

    return res.json({ badge_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to edit badge'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'editBadge', error })
    )
  }
}

/**
 * Delete a badge
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The badge instance
 *
 * @throws {CustomError} if unable to delete badge
 */
const deleteBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { badge_id } = req.query

    const badge_instance = await deleteBadgeById(Number(badge_id))

    return res.json({ badge_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete badge'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'deleteBadge', error })
    )
  }
}

/**
 * Get a badge by id
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The badge instance
 *
 */
const getBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { badge_id } = req.query

    const badge_instance = await getBadgeById(Number(badge_id))

    return res.status(200).json({ badge_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get badge of a given id'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getBadge',
        error
      })
    )
  }
}

export { getBadges, addBadge, editBadge, deleteBadge, getBadge }
