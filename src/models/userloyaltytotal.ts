import { DataTypes, Model } from 'sequelize'

import sequelize from '../utils/db/sequelize'

class UserLoyaltyTotal extends Model {
  public user_id!: number
  public owner_id!: number
  public total_points!: number
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

UserLoyaltyTotal.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    total_points: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'user_loyalty_totals',
    timestamps: true, // Enable timestamps
    underscored: true // Use snake_case for column names
  }
)

export { UserLoyaltyTotal }
