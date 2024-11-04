import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

import { CustomError } from '../utils/errors_factory'

/**
 * Middleware to validate request with schema
 *
 * @param {ZodSchema} schema The schema to validate the request with
 * @returns void
 * @throws {CustomError} If the request is invalid
 *
 */
const validateRequestWithSchema = (schema: ZodSchema) => {
  /**
   * Validate request with schema
   *
   * @param {Request} req The request object
   * @param {Response} res The response object
   * @param {NextFunction} next The next function
   * @returns void
   * @throws {CustomError} If the request is invalid
   *
   */
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = schema.safeParse(req)
      if (!validationResult.success) {
        throw new CustomError('Validation Error', 403, {
          info: validationResult.error,
          context: 'validateRequestWithSchema'
        })
      }
      return next()
    } catch (error) {
      const statusCode = 500
      const message = 'Failed to validate request'

      if (error instanceof CustomError) {
        return next(error)
      }

      return next(
        new CustomError(message, statusCode, {
          context: 'validateRequestWithSchema',
          error
        })
      )
    }
  }
}

/**
 * Parse a schema
 *
 * @param {ZodSchema} schema The schema to parse the object with
 * @param {object} obj The object to parse
 * @returns {T} The parsed object
 * @throws {CustomError} If the object is invalid
 *
 */

const parseSchema = <T>(schema: ZodSchema<T>, obj: object): T => {
  try {
    const validationResult = schema.safeParse(obj)
    if (validationResult.success) {
      return validationResult.data as T
    }
    throw new CustomError('Validation Error', 403, {
      info: validationResult.error,
      context: 'parseSchema'
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to parse schema'
    if (error instanceof CustomError) {
      throw error
    }
    throw new CustomError(message, statusCode, {
      context: 'parseSchema',
      error
    })
  }
}

export { parseSchema }
export default validateRequestWithSchema
