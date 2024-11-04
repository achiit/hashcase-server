import crypto from 'crypto'

import { ethers } from 'ethers'
import jwt from 'jsonwebtoken'

import { CustomError } from '../../utils/errors_factory'

/** Base display message */
const DISPLAY_MESSAGE =
  'Hey, Sign this message to prove you have access to this wallet, this is your token '

/** Expiration time for the token (5 mins) */
const EXPIRATION_TIME = 1000 * 60 * 5

/**
 * Generates a signing prompt for the user to sign with their wallet
 *
 * @returns A signing prompt for the user to sign with their wallet and a token
 * @throws {CustomError} If unable to craft signing prompt
 *
 */
const craftSigningPrompt = () => {
  try {
    const secret = crypto.randomBytes(32).toString('hex')
    const message = DISPLAY_MESSAGE + secret

    const token = jwt.sign({ message }, process.env.JWT_SECRET!, {
      expiresIn: EXPIRATION_TIME
    })

    return { message, token }
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to craft signing prompt'

    throw new CustomError(message, statusCode, {
      context: 'craftSigningPrompt',
      error
    })
  }
}

/**
 * Verifies the signature of the token
 *
 * @param signature The signature to verify
 * @param address Address claiming to have signed the token
 * @param token The token containing the message
 * @throws {CustomError} If unable to verify token or if the address does not match
 *
 */
const verifyToken = (signature: string, address: string, token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
    const recoveredAddress = ethers.verifyMessage(decoded.message, signature)
    if (recoveredAddress !== address) {
      throw new CustomError('Address does not match', 401, {
        context: 'verifyToken'
      })
    }
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to verify token'

    if (error instanceof CustomError) {
      throw error
    }

    throw new CustomError(message, statusCode, {
      context: 'verifyToken',
      error
    })
  }
}

export { craftSigningPrompt, verifyToken }
