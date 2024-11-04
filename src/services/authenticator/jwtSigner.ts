import jwt from 'jsonwebtoken'

import { TokenType } from '../../enums'
import { SignedToken } from '../../types/tokensTypes'
import { CustomError } from '../../utils/errors_factory'

/**
 * Signs an auth token for a user
 *
 * @param id the id of the user
 * @returns a signed token
 *
 */

const signedUserToken = (id: number) => {
  try {
    const tokenData: SignedToken = {
      type: TokenType.USER,
      id
    }
    return jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: '30m'
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to sign user token'

    throw new CustomError(message, statusCode, {
      context: 'signedUserToken',
      error
    })
  }
}

/**
 * Signs an auth token for an owner
 *
 * @param id the id of the owner
 * @returns a signed token
 *
 */

const signedOwnerToken = (id: number) => {
  try {
    const tokenData: SignedToken = {
      type: TokenType.OWNER,
      id
    }
    return jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: '30m'
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to sign owner token'

    throw new CustomError(message, statusCode, {
      context: 'signedOwnerToken',
      error
    })
  }
}

/**
 * Signs an auth token for admin
 *
 * @returns a signed token
 *
 */

const signedAdminToken = () => {
  try {
    const tokenData: Partial<SignedToken> = {
      type: TokenType.ADMIN
    }
    return jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: '30m'
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to sign admin token'

    throw new CustomError(message, statusCode, {
      context: 'signedAdminToken',
      error
    })
  }
}

export { signedUserToken, signedOwnerToken, signedAdminToken }
