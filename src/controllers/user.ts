import { User } from '../models'
import { UserAttributes } from '../types/modelTypes'
import { CustomError } from '../utils/errors_factory'

/**
 * Create a new user or retrieve an existing user
 *
 * @param {UserAttributes} details The details of the user to create
 * @returns {Promise<[User, boolean]>} The user instance
 * @throws {CustomError} If the user could not be created
 *
 */
const createUser = async (
  details: UserAttributes
): Promise<[User, boolean]> => {
  try {
    const { loyalty, ...userDetails } = details
    console.log(details)
    void loyalty
    const res = await User.findOrCreate({
      where: userDetails,
      defaults: userDetails
    })
    return res
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create user'
    console.log(error)
    throw new CustomError(message, statusCode, {
      context: 'createUser',
      error
    })
  }
}

/**
 * Retrieve a user by their unique id
 *
 * @param {number} id The unique id of the user to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the user is not found.
 * Use this to indicate that the user is required and should exist.
 * @returns {Promise<User|null>} The user instance, or null if not found
 * @throws {CustomError} If the user is required and not found
 *
 */
const getUserById = async <T extends boolean = true>(
  id: number,
  fail: T = true as T
): Promise<T extends true ? User : User | null> => {
  const user_instance = await User.findByPk(id)
  if (fail && !user_instance) {
    throw new CustomError('User not found', 404, { context: 'getUserById' })
  }
  if (user_instance) {
    delete user_instance.loyalty
    delete user_instance.private_key
  }
  return user_instance as T extends true ? User : User | null
}

/**
 * Retrieve a user by their email
 *
 * @param {string} email The email of the user to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the user is not found.
 * Use this to indicate that the user is required and should exist.
 * @returns {Promise<User|null>} The user instance, or null if not found
 * @throws {CustomError} If the user is required and not found
 *
 */
const getUserByEmail = async <T extends boolean = true>(
  email: string,
  fail: T = true as T
): Promise<T extends true ? User : User | null> => {
  const user_instance = await User.findOne({ where: { email } })
  if (fail && !user_instance) {
    throw new CustomError('User not found', 404, { context: 'getUserByEmail' })
  }
  if (user_instance) {
    delete user_instance.loyalty
    delete user_instance.private_key
  }
  return user_instance as T extends true ? User : User | null
}

/**
 * Retrieve a user by their Ethereum wallet address
 *
 * @param {string} eth_wallet_address The Ethereum wallet address of the user to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the user is not found.
 * Use this to indicate that the user is required and should exist.
 * @returns {Promise<User|null>} The user instance, or null if not found
 * @throws {CustomError} If the user is required and not found
 *
 */
const getUserByETHWalletAddress = async <T extends boolean = true>(
  eth_wallet_address: string,
  fail: T = true as T
): Promise<T extends true ? User : User | null> => {
  const user_instance = await User.findOne({ where: { eth_wallet_address } })
  if (fail && !user_instance) {
    throw new CustomError('User not found', 404, {
      context: 'getUserByETHWalletAddress'
    })
  }
  if (user_instance) {
    delete user_instance.loyalty
    delete user_instance.private_key
  }
  return user_instance as T extends true ? User : User | null
}

/**
 * Retrieve a user by their FVM wallet address
 *
 * @param {string} fvm_wallet_address The FVM wallet address of the user to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the user is not found.
 * Use this to indicate that the user is required and should exist.
 * @returns {Promise<User|null>} The user instance, or null if not found
 * @throws {CustomError} If the user is required and not found
 *
 */
const getUserByFVMWalletAddress = async <T extends boolean = true>(
  fvm_wallet_address: string,
  fail: T = true as T
): Promise<T extends true ? User : User | null> => {
  const user_instance = await User.findOne({ where: { fvm_wallet_address } })
  if (fail && !user_instance) {
    throw new CustomError('User not found', 404, {
      context: 'getUserByFVMWalletAddress'
    })
  }
  if (user_instance) {
    delete user_instance.loyalty
    delete user_instance.private_key
  }
  return user_instance as T extends true ? User : User | null
}

/**
 * Retrieve a user by their unique id, including their loyalty data
 *
 * @param {number} id The unique id of the user to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the user is not found.
 * Use this to indicate that the user is required and should exist.
 * @returns {Promise<User|null>} The user instance, or null if not found
 * @throws {CustomError} If the user is required and not found
 *
 */
const getUserByIdWithLoyalty = async <T extends boolean = true>(
  id: number,
  fail: T = true as T
): Promise<T extends true ? User : User | null> => {
  const user_instance = await User.findByPk(id)
  if (fail && !user_instance) {
    throw new CustomError('User not found', 404, { context: 'getUserById' })
  }
  if (user_instance) {
    delete user_instance.private_key
  }
  return user_instance as T extends true ? User : User | null
}

/**
 * Retrieve a user by their owner_id and identifier
 *
 * @param {number} owner_id The owner_id of the user to retrieve
 * @param {string} identifier The identifier of the user to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the user is not found.
 * Use this to indicate that the user is required and should exist.
 * @returns {Promise<User|null>} The user instance, or null if not found
 * @throws {CustomError} If the user is required and not found
 *
 */

const getUserByOwnerIdentifier = async <T extends boolean = true>(
  owner_id: number,
  identifier: string,
  fail: T = true as T
): Promise<T extends true ? User : User | null> => {
  const user_instance = await User.findOne({ where: { owner_id, identifier } })
  if (fail && !user_instance) {
    throw new CustomError('User not found', 404, {
      context: 'getUserByOwnerIdentifier'
    })
  }
  if (user_instance) {
    delete user_instance.loyalty
    delete user_instance.private_key
  }
  return user_instance as T extends true ? User : User | null
}

/**
 * Update a user instance
 *
 * @param user_instance user instance that needs to be updated
 * @param {Partial<UserAttributes>} details details to update
 * @returns {Promise<User>} The updated user instance
 * @throws {CustomError} If the user could not be updated
 *
 */
const _updateUserInstance = async (
  user_instance: User,
  details: Partial<UserAttributes>
): Promise<User> => {
  try {
    return await user_instance.update(details)
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to update user'

    throw new CustomError(message, statusCode, {
      context: '_updateUserInstance',
      error
    })
  }
}

/**
 * Update a user by their unique id
 *
 * @param {number} id The unique id of the user to update
 * @param {Partial<UserAttributes>} details The details to update
 * @returns {Promise<User>} The updated user instance
 *
 */
const updateUserById = async (
  id: number,
  details: Partial<UserAttributes>
): Promise<User> => {
  return _updateUserInstance(await getUserById(id), details)
}

/**
 * Update a user by their email
 *
 * @param {string} email The email of the user to update
 * @param {Partial<UserAttributes>} details The details to update
 * @returns {Promise<User>} The updated user instance
 *
 */
const updateUserByEmail = async (
  email: string,
  details: Partial<UserAttributes>
): Promise<User> => {
  return _updateUserInstance(await getUserByEmail(email, true), details)
}

/**
 * Delete a user instance
 *
 * @param user_instance user instance that needs to be deleted
 * @returns {Promise<void>}
 * @throws {CustomError} If the user could not be deleted
 *
 */
const _deleteUserInstance = async (user_instance: User): Promise<void> => {
  try {
    await user_instance.destroy()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete user'

    throw new CustomError(message, statusCode, {
      context: '_deleteUserInstance',
      error
    })
  }
}

/**
 * Delete a user by their unique id
 *
 * @param {number} id The unique id of the user to delete
 * @returns {Promise<void>}
 *
 */
const deleteUserById = async (id: number): Promise<void> => {
  return _deleteUserInstance(await getUserById(id))
}

/**
 * Delete a user by their email
 *
 * @param {string} email The email of the user to delete
 * @returns {Promise<void>}
 *
 */
const deleteUserByEmail = async (email: string): Promise<void> => {
  return _deleteUserInstance(await getUserByEmail(email))
}

export {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByETHWalletAddress,
  getUserByFVMWalletAddress,
  getUserByIdWithLoyalty,
  getUserByOwnerIdentifier,
  updateUserById,
  updateUserByEmail,
  deleteUserById,
  deleteUserByEmail
}
