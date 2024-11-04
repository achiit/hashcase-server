import { DataTypes, Model } from 'sequelize'

import sequelize from '../utils/db/sequelize'

class LoyaltyTransaction extends Model {
  public id!: number
  public user_id!: number
  public owner_id!: number
  public code!: string
  public points!: number
  public type!: string
  public status!: string
  public readonly created_at!: Date
}

LoyaltyTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    points: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['success', 'failed']]
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'loyalty_transactions',
    timestamps: false // If you want automatic timestamp management
  }
)

export default LoyaltyTransaction
