import crypto from 'crypto'

import { NextFunction, Response } from 'express'

import { createDevAPI, getDevAPIKeysByOwnerId } from '../../controllers/devapi'
import { getOwnerById } from '../../controllers/owner'
import { OwnerRequest } from '../../types/expressTypes'
import { CustomError } from '../../utils/errors_factory'

/**
 * Add dev api
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The owner instance and api key
 * @throws {CustomError} If unable to add dev api
 *
 */
const addDevApi = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const api_key = _generateApiKey()

    await createDevAPI({
      api_key,
      owner_id
    })

    const owner_instance = await getOwnerById(owner_id)

    return res.status(200).json({ owner_instance, api_key })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create dev api key'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, { context: 'addDevApi', error })
    )
  }
}

/**
 * Get API keys of owner
 *
 * @param {OwnerRequest} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The api keys
 * @throws {CustomError} If unable to get dev api keys
 *
 */
const getAPIKeysOfOwner = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const api_keys = (await getDevAPIKeysByOwnerId(owner_id)).map(
      api => api.api_key
    )
    return res.json({ api_keys })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to get dev api keys'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'getAPIKeysOfOwner',
        error
      })
    )
  }
}

/**
 * Generate api key
 *
 * @returns The api key
 *
 */
const _generateApiKey = () => {
  const key = crypto.randomBytes(16).toString('hex').toLowerCase().slice(0, 16)
  return key
}

export { addDevApi, getAPIKeysOfOwner }
