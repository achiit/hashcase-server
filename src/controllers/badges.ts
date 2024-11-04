import Badge from '../models/badges'
import { BadgeAttributes } from '../types/modelTypes'
import { CustomError } from '../utils/errors_factory'

const getBadgeByCharacterString = async (characterString: string) => {
  const badge = await Badge.findOne({
    where: { character_string: characterString }
  })

  if (!badge) {
    throw new CustomError('Badge not found', 404, {
      context: 'getBadgeByCharacterString'
    })
  }

  return badge
}
/**
 * Creates a new badge
 *
 * @param {BadgeAttributes} details The details of the badge to create
 * @returns {Promise<[Badge, boolean]>} The badge instance and a boolean indicating if it was created
 * @throws {CustomError} If the badge cannot be created
 *
 */
const createBadge = async (
  details: BadgeAttributes
): Promise<[Badge, boolean]> => {
  try {
    const [badge, created] = await Badge.findOrCreate({
      where: {
        title: details.title
      },
      defaults: details
    })
    return [badge, created]
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to create badge'

    throw new CustomError(message, statusCode, {
      context: 'createBadge',
      error
    })
  }
}

/**
 * Retrieve all badges
 *
 * @returns {Promise<Badge[]>} The badge instances
 *
 */
const getAllBadges = async (): Promise<Badge[]> => {
  return Badge.findAll()
}

/**
 * Retrieve a badge by its unique id
 *
 * @param {number} id The unique id of the badge to retrieve
 * @param {boolean} [fail=false] If true, the function will throw an error if the badge is not found.
 * Use this to indicate that the badge is required and should exist.
 * @returns {Promise<Badge|null>} The badge instance, or null if not found
 * @throws {CustomError} If the badge is required and not found
 *
 */
const getBadgeById = async <T extends boolean = true>(
  id: number,
  fail: T = true as T
): Promise<T extends true ? Badge : Badge | null> => {
  const badge = await Badge.findByPk(id)
  if (fail && !badge) {
    throw new CustomError('Badge not found', 404, {
      context: 'getBadgeById'
    })
  }
  return badge as T extends true ? Badge : Badge | null
}

/**
 * Update a badge
 *
 * @param {Badge} badge_instance The badge instance to update
 * @param {Partial<BadgeAttributes>} details The details to update
 * @returns {Promise<Badge>} The updated badge instance
 * @throws {CustomError} If the badge cannot be updated
 *
 */
const _updateBadgeInstance = async (
  badge_instance: Badge,
  details: Partial<BadgeAttributes>
): Promise<Badge> => {
  try {
    return await badge_instance.update(details)
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to update badge'

    throw new CustomError(message, statusCode, {
      context: '_updateBadgeInstance',
      error
    })
  }
}

/**
 * Update a badge by its unique id
 *
 * @param {number} id The unique id of the badge to update
 * @param {Partial<BadgeAttributes>} details The details to update
 * @returns {Promise<Badge>} The updated badge instance
 *
 */
const updateBadgeById = async (
  id: number,
  details: Partial<BadgeAttributes>
): Promise<Badge> => {
  return _updateBadgeInstance(await getBadgeById(id, true), details)
}

/**
 * Delete a badge
 *
 * @param {Badge} badge_instance The badge instance to delete
 * @returns {Promise<void>}
 * @throws {CustomError} If the badge cannot be deleted
 *
 */
const _deleteBadgeInstance = async (badge_instance: Badge): Promise<void> => {
  try {
    await badge_instance.destroy()
  } catch (error) {
    const statusCode = 500
    const message = 'Failed to delete badge'

    throw new CustomError(message, statusCode, {
      context: '_deleteBadgeInstance',
      error
    })
  }
}

/**
 * Delete a badge by its unique id
 *
 * @param {number} id The unique id of the badge to delete
 * @returns {Promise<void>}
 *
 */
const deleteBadgeById = async (id: number): Promise<void> => {
  return _deleteBadgeInstance(await getBadgeById(id))
}

export {
  createBadge,
  getAllBadges,
  getBadgeById,
  updateBadgeById,
  deleteBadgeById,
  getBadgeByCharacterString
}
