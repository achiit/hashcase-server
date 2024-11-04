import bcrypt from 'bcryptjs'

import { CustomError } from './errors_factory'

const saltRounds = 10

/** Hashes a password
 *
 * @param {string} password the password to hash
 * @returns {Promise<string>} the hashed password
 *
 */
const hash = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    throw new CustomError('Password hashing failed', 500, {
      context: 'hash'
    })
  }
}

/** Compares a password and a hash
 *
 * @param {string} password the password to compare
 * @param {string} hash the hash to compare to
 * @throws {CustomError} if the password is invalid
 *
 */
const compare = async (password: string, hash: string) => {
  try {
    if (!(await bcrypt.compare(password, hash)))
      throw new CustomError('Invalid password', 400, {
        context: 'compare'
      })
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to compare password'

    if (error instanceof CustomError) {
      throw error
    }

    throw new CustomError(message, statusCode, {
      context: 'compare',
      error
    })
  }
}

export { hash, compare }
