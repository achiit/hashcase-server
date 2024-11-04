import { Paymaster } from '../models'
import { PaymasterAttributes } from '../types/modelTypes'
import { CustomError } from '../utils/errors_factory'

/**
 * Creates a new paymaster
 *
 * @param {PaymasterAttributes} details The details of the paymaster to create
 * @returns {Promise<Paymaster>} The paymaster instance
 * @throws {CustomError} If the paymaster cannot be created
 *
 */
const createPaymaster = async (
  details: PaymasterAttributes
): Promise<Paymaster> => {
  try {
    const [paymaster] = await Paymaster.findOrCreate({
      where: {
        type: details.type,
        owner_id: details.owner_id,
        chain_type: details.chain_type,
        chain_id: details.chain_id,
        contract_address: details.contract_address
      },
      defaults: details
    })
    return paymaster
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create paymaster'

    throw new CustomError(message, statusCode, {
      context: 'createPaymaster',
      error
    })
  }
}

/**
 * Retrieve a paymaster by its unique id
 *
 * @param {number} id The unique id of the paymaster to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the paymaster is not found.
 * Use this to indicate that the paymaster is required and should exist.
 * @returns {Promise<Paymaster|null>} The paymaster instance, or null if not found
 * @throws {CustomError} If the paymaster is required and not found
 *
 */
const getPaymasterById = async <T extends boolean = true>(
  id: number,
  fail: T = true as T
): Promise<T extends true ? Paymaster : Paymaster | null> => {
  const paymaster_instance = await Paymaster.findByPk(id)
  if (fail && !paymaster_instance) {
    throw new CustomError('Paymaster not found', 404, {
      context: 'getPaymasterById'
    })
  }
  return paymaster_instance as T extends true ? Paymaster : Paymaster | null
}

/**
 * Retrieve all paymasters owned by an owner
 *
 * @param {number} owner_id The unique id of the owner of the paymasters to retrieve
 * @returns {Promise<Paymaster[]>} The paymaster instances
 *
 */
const getPaymastersByOwnerId = async (
  owner_id: number
): Promise<Paymaster[]> => {
  const paymasters = await Paymaster.findAll({ where: { owner_id } })
  return paymasters
}

/**
 * Updates an existing paymaster
 *
 * @param {Paymaster} paymaster_instance The paymaster instance to update
 * @param {PaymasterAttributes} details The details of the paymaster to update
 * @returns {Promise<Paymaster>} The updated paymaster instance
 * @throws {CustomError} If the paymaster cannot be updated
 *
 */
const _updatePaymasterInstance = async (
  paymaster_instance: Paymaster,
  details: PaymasterAttributes
): Promise<Paymaster> => {
  try {
    const updated_paymaster = await paymaster_instance.update(details)
    return updated_paymaster
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to update paymaster'

    throw new CustomError(message, statusCode, {
      context: '_updatePaymasterInstance',
      error
    })
  }
}

/**
 * Updates an existing paymaster
 *
 * @param {number} id The unique id of the paymaster to update
 * @param {PaymasterAttributes} details The details of the paymaster to update
 * @returns {Promise<Paymaster>} The updated paymaster instance
 *
 */
const updatePaymasterById = async (
  id: number,
  details: PaymasterAttributes
): Promise<Paymaster> => {
  return _updatePaymasterInstance(await getPaymasterById(id, true), details)
}

/**
 * Deletes a paymaster instance
 *
 * @param {Paymaster} paymaster_instance The paymaster instance to delete
 * @returns {Promise<void>}
 * @throws {CustomError} If the paymaster cannot be deleted
 *
 */
const _deletePaymasterInstance = async (
  paymaster_instance: Paymaster
): Promise<void> => {
  try {
    await paymaster_instance.destroy()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete paymaster'

    throw new CustomError(message, statusCode, {
      context: '_deletePaymasterInstance',
      error
    })
  }
}

/**
 * Deletes a paymaster by its unique id
 *
 * @param {number} id The unique id of the paymaster to delete
 * @returns {Promise<void>}
 *
 */
const deletePaymasterById = async (id: number): Promise<void> => {
  _deletePaymasterInstance(await getPaymasterById(id, true))
}

export {
  createPaymaster,
  getPaymasterById,
  getPaymastersByOwnerId,
  updatePaymasterById,
  deletePaymasterById
}
