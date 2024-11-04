import { Model, DataTypes } from 'sequelize'

import sequelize from '../utils/db/sequelize'

class Streaks extends Model {}

Streaks.init(
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
    streak_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    last_check_in: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Streaks',
    tableName: 'streaks',
    timestamps: false // Adjust according to whether you're using createdAt & updatedAt
  }
)

export default Streaks
