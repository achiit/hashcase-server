import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize'

import { BadgeAttributes } from '../types/modelTypes'
import sequelize from '../utils/db/sequelize'

class Badge
  extends Model<InferAttributes<Badge>, InferCreationAttributes<Badge>>
  implements BadgeAttributes
{
  declare id: CreationOptional<number>
  declare title: string
  declare description: string
  declare image_url: string
  declare points: number
  declare character_string: string
}

Badge.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    character_string: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'Badge',
    tableName: 'badges'
  }
)

export default Badge
