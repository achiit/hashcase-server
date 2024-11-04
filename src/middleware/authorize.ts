import { Request, Response, NextFunction } from 'express'
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError
} from 'jsonwebtoken'

import { getDevAPIByKey } from '../controllers/devapi'
import { getOwnerById } from '../controllers/owner'
import { getUserByOwnerIdentifier } from '../controllers/user'
import { TokenType } from '../enums'
import { CustomError } from '../utils/errors_factory'

/**
 * Get auth token from request
 *
 * @param {Request} req The request object
 * @returns Decoded token
 * @throws CustomError
 * @throws TokenExpiredError
 * @throws JsonWebTokenError
 *
 */
const getAuthToken = (req: Request) => {
  const bearerToken = req.headers.authorization
  if (!bearerToken) {
    throw new CustomError('Auth Token Not Found', 401, {
      context: 'getAuthToken'
    })
  }

  const token = bearerToken.split(' ')[1]
  if (!token) {
    throw new CustomError('Incorrect Auth Token Format', 401, {
      context: 'getAuthToken'
    })
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
  return decoded
}

const getDevAPIKey = async (req: Request) => {
  const api_key = req.headers['x-api-key'] as string
  if (!api_key) {
    throw new CustomError('API Key Not Found', 401, {
      context: 'getDevAPIKey'
    })
  }
  const devapi_instance = await getDevAPIByKey(api_key)
  return devapi_instance
}

/**
 * Middleware to authorize user
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns void
 * @throws CustomError
 *
 */
const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decoded = getAuthToken(req)
    if (decoded.type !== TokenType.USER || !decoded.id) {
      if (decoded.type === TokenType.OWNER) {
        const identifier = req.query.identifier?.toString()
        if (!identifier || identifier === undefined) {
          throw new CustomError('Invalid identifier', 401, {
            context: 'authorizeUser'
          })
        }
        const owner_id = decoded.id.toString()
        const user_instance = await getUserByOwnerIdentifier(
          owner_id,
          identifier
        )
        req.query.user_id = user_instance.id.toString()
        return next()
      } else {
        throw new CustomError('Invalid token', 401, {
          context: 'authorizeUser'
        })
      }
    }
    req.query.user_id = decoded.id.toString()
    return next()
  } catch (error: unknown) {
    let statusCode = 500
    let message = 'Failed to authorize user'

    if (error instanceof CustomError) {
      return next(error)
    } else if (error instanceof TokenExpiredError) {
      statusCode = 401
      message = 'Token expired'
    } else if (error instanceof JsonWebTokenError) {
      statusCode = 401
      message = 'Invalid token'
    }

    return next(
      new CustomError(message, statusCode, { context: 'authorizeUser', error })
    )
  }
}

/**
 * Middleware to authorize owner
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns void
 * @throws CustomError
 *
 */
const authorizeOwner = (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = getAuthToken(req)
    if (decoded.type !== TokenType.OWNER || !decoded.id) {
      throw new CustomError('Invalid token', 401, { context: 'authorizeOwner' })
    }

    req.query.owner_id = decoded.id.toString()
    return next()
  } catch (error: unknown) {
    let statusCode = 500
    let message = 'Failed to authorize owner'

    if (error instanceof CustomError) {
      return next(error)
    } else if (error instanceof TokenExpiredError) {
      statusCode = 401
      message = 'Token expired'
    } else if (error instanceof JsonWebTokenError) {
      statusCode = 401
      message = 'Invalid token'
    }

    return next(
      new CustomError(message, statusCode, { context: 'authorizeOwner', error })
    )
  }
}

const authorizeDevAPI = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const devapi_instance = await getDevAPIKey(req)
    const owner_instance = await getOwnerById(devapi_instance.owner_id)
    req.query.devapi_id = devapi_instance.id.toString()
    req.query.owner_id = owner_instance.id.toString()
    next()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to authorize dev api key'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'authorizeDevAPI',
        error
      })
    )
  }
}

/**
 * Middleware to authorize admin
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns void
 * @throws CustomError
 *
 */
const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = getAuthToken(req)
    if (decoded.type !== TokenType.ADMIN) {
      throw new CustomError('Invalid token', 401, { context: 'authorizeAdmin' })
    }
    return next()
  } catch (error: unknown) {
    let statusCode = 500
    let message = 'Failed to authorize admin'

    if (error instanceof CustomError) {
      return next(error)
    } else if (error instanceof TokenExpiredError) {
      statusCode = 401
      message = 'Token expired'
    } else if (error instanceof JsonWebTokenError) {
      statusCode = 401
      message = 'Invalid token'
    }

    return next(
      new CustomError(message, statusCode, { context: 'authorizeAdmin', error })
    )
  }
}

export { authorizeUser, authorizeOwner, authorizeDevAPI, authorizeAdmin }
