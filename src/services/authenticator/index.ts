import { NextFunction, Request, Response } from 'express'

import { getOwnerByEmail } from '../../controllers/owner'
import { createUser } from '../../controllers/user'
import { compare } from '../../utils/bcrypt'
import { CustomError } from '../../utils/errors_factory'
import { magic } from '../../utils/providers'

import { craftSigningPrompt, verifyToken } from './ethSigner'
import { verifyFuelToken } from './fuelSigner'
import {
  signedAdminToken,
  signedOwnerToken,
  signedUserToken
} from './jwtSigner'

/**
 * Generates a signing prompt for the user to sign with their wallet
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns A signing prompt for the user to sign with their wallet
 *
 */
const generateWalletSignPrompt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, token } = craftSigningPrompt()
    return res.status(200).json({ message, token })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to generate signing prompt'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'generateWalletSignPrompt',
        error
      })
    )
  }
}

/**
 * Processes the login request from the user's wallet.
 * Verifies the signature and creates a new user if necessary.
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The user's token and instance
 *
 */
const processWalletLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    verifyToken(req.body.signature, req.body.address, req.body.token)

    const [user_instance] = await createUser({
      eth_wallet_address: req.body.address
    })

    const token = signedUserToken(user_instance.id)
    return res.status(200).json({
      token,
      user_instance
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to process wallet login'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'processWalletLogin',
        error
      })
    )
  }
}

/**
 * Processes the login request from the user's magic link.
 * Gets the user's metadata from magic and creates a new user if necessary.
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The user's token and instance
 *
 */
const processMagicLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { didToken } = req.body
    const { publicAddress, email } =
      await magic.users.getMetadataByToken(didToken)

    const [user_instance] = await createUser({
      eth_wallet_address: publicAddress!,
      email: email!
    })

    const token = signedUserToken(user_instance.id)
    return res.status(200).json({
      token,
      user_instance
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to process magic login'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'processMagicLogin',
        error
      })
    )
  }
}

/**
 * Processes the login request from the owner's email and password.
 * Creates a new owner if necessary.
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The owner's token and instance
 *
 */
const processOwnerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    const owner_instance = await getOwnerByEmail(email)
    await compare(password, owner_instance.password_hash)

    const token = signedOwnerToken(owner_instance.id)
    return res.status(200).json({
      token,
      owner_instance
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to process owner login'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'processOwnerLogin',
        error
      })
    )
  }
}

/**
 * Processes the login request from the admin's email and password.
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The admin's token and instance
 *
 */
const processAdminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    if (email !== process.env.ADMIN_EMAIL!) {
      throw new CustomError('Invalid email', 400)
    }
    if (password !== process.env.ADMIN_PASSWORD!) {
      throw new CustomError('Invalid password', 400)
    }

    const token = signedAdminToken()
    return res.status(200).json({
      token
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to process admin login'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'processAdminLogin',
        error
      })
    )
  }
}

/**
 * Processes the login request from user's fuel wallet.
 * Verifies the signature and creates a new user if necessary.
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns The user's token and instance
 *
 */
const processFuelWalletLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    verifyFuelToken(req.body.signature, req.body.address, req.body.token)

    const [user_instance] = await createUser({
      fuel_wallet_address: req.body.address
    })

    const token = signedUserToken(user_instance.id)
    return res.status(200).json({
      token,
      user_instance
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to process fuel wallet login'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'processFuelWalletLogin',
        error
      })
    )
  }
}

const processParticeWalletLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [user_instance] = await createUser({
      eth_wallet_address: req.body.address
    })

    const token = signedUserToken(user_instance.id)
    return res.status(200).json({
      token,
      user_instance
    })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to process wallet login'

    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'processWalletLogin',
        error
      })
    )
  }
}

export {
  generateWalletSignPrompt,
  processWalletLogin,
  processMagicLogin,
  processOwnerLogin,
  processAdminLogin,
  processFuelWalletLogin,
  processParticeWalletLogin
}
