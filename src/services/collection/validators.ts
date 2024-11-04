import { CollectionAttributes } from '../../types/modelTypes'
import { CustomError } from '../../utils/errors_factory'

/**
 * Remove sensitive fields from collection
 *
 * @param {CollectionAttributes} collection The collection
 * @returns The safe collection
 * @throws {CustomError} If unable to extract safe collection
 *
 */
const _safeCollection = (collection: CollectionAttributes & { id: number }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priority, ...rest } = collection
    return rest
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to extract safe collection'

    throw new CustomError(message, statusCode, {
      context: '_safeCollection',
      error
    })
  }
}

export { _safeCollection }
