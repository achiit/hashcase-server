import { ItemAttributes } from '../../types/modelTypes'
import { CustomError } from '../../utils/errors_factory'

/**
 * Remove sensitive fields from item
 *
 * @param {ItemAttributes} item The item
 * @returns The safe item
 * @throws {CustomError} If unable to extract safe item
 *
 */
const _safeItem = (item: ItemAttributes) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, priority, ...rest } = item as ItemAttributes & {
      id: number
    }
    return rest
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to extract safe item'

    throw new CustomError(message, statusCode, {
      context: '_safeItem',
      error
    })
  }
}

export { _safeItem }
