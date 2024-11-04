import { hashMessage, Signer } from 'fuels'
import jwt from 'jsonwebtoken'

import { CustomError } from '../../utils/errors_factory'
import logger from '../../utils/logger'

const verifyFuelToken = (signature: string, address: string, token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
    const recoveredAddress = Signer.recoverAddress(
      hashMessage(decoded.message),
      signature
    )
      .toB256()
      .toString()
    if (recoveredAddress !== address) {
      logger.debug('Address does not match')
      logger.debug('Recovered address:', recoveredAddress)
      logger.debug('Address:', address)
      throw new CustomError('Address does not match', 401, {
        context: 'verifyFuelToken'
      })
    }
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to verify token'

    if (error instanceof CustomError) {
      throw error
    }

    throw new CustomError(message, statusCode, {
      context: 'verifyFuelToken',
      error
    })
  }
}

export { verifyFuelToken }
