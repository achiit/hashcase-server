import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize'

import { LoyaltyAttributes } from '../types/modelTypes'
import sequelize from '../utils/db/sequelize'

class Loyalty
  extends Model<InferAttributes<Loyalty>, InferCreationAttributes<Loyalty>>
  implements LoyaltyAttributes
{
  declare id: CreationOptional<number>
  declare owner_id: number
  declare code: string
  declare value: number
  declare type: string
}

Loyalty.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Loyalty',
    tableName: 'loyalties',
    indexes: [
      {
        name: 'unique_code',
        unique: true,
        fields: ['owner_id', 'code', 'type']
      }
    ]
  }
)

export default Loyalty
