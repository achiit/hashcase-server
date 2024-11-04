import { NextFunction, Response } from 'express'
import { QueryTypes, Transaction } from 'sequelize'

import { OwnerRequest, UserRequest } from '../../types/expressTypes'
import sequelize from '../../utils/db/sequelize' // Update this path if necessary
import { CustomError } from '../../utils/errors_factory'

enum LeaderboardPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

interface LeaderboardEntry {
  user_id: number
  total_points: number
  rank: number
}

const getLeaderboard = async (
  ownerId: number,
  startDate: Date,
  endDate: Date,
  limit: number = 100,
  offset: number = 0
): Promise<LeaderboardEntry[]> => {
  let transaction: Transaction | undefined

  try {
    transaction = await sequelize.transaction()

    // Step 1: Get total points for each user
    const totalPointsQuery = `
      SELECT 
        user_id, 
        SUM(points) AS total_points
      FROM loyalty_transactions
      WHERE owner_id = :ownerId
        AND created_at BETWEEN :startDate AND :endDate
        AND status = 'success'
      GROUP BY user_id
      ORDER BY total_points DESC
      LIMIT :limit OFFSET :offset
    `

    const totalPointsResults = await sequelize.query(totalPointsQuery, {
      replacements: { ownerId, startDate, endDate, limit, offset },
      type: QueryTypes.SELECT,
      transaction
    })

    // Step 2: Calculate rankings
    const leaderboard = totalPointsResults.map(
      (result: any, index: number) => ({
        user_id: result.user_id,
        total_points: result.total_points,
        rank: index + 1 + offset
      })
    )

    await transaction.commit()
    return leaderboard as LeaderboardEntry[]
  } catch (error) {
    if (transaction) await transaction.rollback()
    console.error('Error executing leaderboard query:', error)
    throw new CustomError('Database query failed', 500, {
      context: 'getLeaderboard',
      error
    })
  }
}
const getDatesForPeriod = (
  period: LeaderboardPeriod
): { startDate: string; endDate: string } => {
  const endDate = new Date()
  let startDate = new Date(endDate)

  switch (period) {
    case LeaderboardPeriod.DAILY:
      startDate.setDate(endDate.getDate() - 1)
      break
    case LeaderboardPeriod.WEEKLY:
      startDate.setDate(endDate.getDate() - 7)
      break
    case LeaderboardPeriod.MONTHLY:
      startDate.setMonth(endDate.getMonth() - 1)
      break
    default:
      throw new CustomError('Invalid period specified', 400, {
        context: 'getDatesForPeriod',
        period
      })
  }

  return {
    startDate: startDate.toISOString().slice(0, 19).replace('T', ' '),
    endDate: endDate.toISOString().slice(0, 19).replace('T', ' ')
  }
}

const getLeaderboardData = async (
  req: OwnerRequest & UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = Number(req.query.owner_id)
    const period = req.query.period as LeaderboardPeriod
    const limit = Number(req.query.limit) || 100
    const offset = Number(req.query.offset) || 0

    if (!ownerId || !period) {
      return res
        .status(400)
        .json({ message: 'Owner ID and period are required.' })
    }

    const { startDate, endDate } = getDatesForPeriod(period)
    const leaderboard = await getLeaderboard(
      ownerId,
      new Date(startDate),
      new Date(endDate),
      limit,
      offset
    )

    res.status(200).json({ leaderboard })
  } catch (error) {
    console.error('Error retrieving leaderboard:', error)
    if (error instanceof CustomError) {
      return next(error)
    }
    return next(
      new CustomError('Failed to retrieve leaderboard', 500, {
        context: 'getLeaderboardData',
        error
      })
    )
  }
}

export { getLeaderboardData }
