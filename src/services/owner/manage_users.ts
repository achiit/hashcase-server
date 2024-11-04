import CryptoJS from 'crypto-js'
import { ethers } from 'ethers'
import { NextFunction, Response } from 'express'

import { getUsersByOwnerId } from '../../controllers/owner'
import { createUser } from '../../controllers/user'
import { OwnerRequest, UserRequest } from '../../types/expressTypes'
import { CustomError } from '../../utils/errors_factory'

const createOwnerUser = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const identifier: string = req.body.identifier
    const email: string | undefined = req.body.email

    const [eth_wallet_address, private_key] = createPrivateWallet()

    // Create a user object with required fields
    const userCreateData: {
      eth_wallet_address: string
      owner_id: number
      identifier: string
      private_key: string
      email?: string
    } = {
      eth_wallet_address,
      owner_id,
      identifier,
      private_key
    }

    if (email) {
      userCreateData.email = email
    }

    const [user_instance] = await createUser(userCreateData)
    return res.status(200).json({ user: user_instance })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create owner user'
    if (error instanceof CustomError) {
      return next(error)
    }

    return next(
      new CustomError(message, statusCode, {
        context: 'createOwnerUser',
        error
      })
    )
  }
}

export const getOwnerUsers = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner_id = Number(req.query.owner_id)
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20

    if (!owner_id) {
      return res.status(400).json({ message: 'Owner ID is required.' })
    }

    const users = await getUsersByOwnerId(owner_id, page, limit)

    return res.status(200).json({
      users: users.rows,
      totalCount: users.count,
      currentPage: page,
      totalPages: Math.ceil(users.count / limit)
    })
  } catch (error) {
    console.error('Error fetching owner users:', error)
    if (error instanceof CustomError) {
      return next(error)
    }
    return next(
      new CustomError('Failed to fetch owner users', 500, {
        context: 'getOwnerUsers',
        error
      })
    )
  }
}

const createPrivateWallet = () => {
  const wallet = ethers.Wallet.createRandom()
  const private_key = wallet.privateKey
  const public_key = wallet.address
  const encrypted_private_key = CryptoJS.AES.encrypt(
    private_key,
    process.env.PRIVATE_KEY_ENCRYPTION_SECRET
  ).toString()
  return [public_key, encrypted_private_key]
}

export { createOwnerUser }
