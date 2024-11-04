import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'

import { DevAPIAttributes } from '../types/modelTypes'
import sequelize from '../utils/db/sequelize'

class DevAPI
  extends Model<InferAttributes<DevAPI>, InferCreationAttributes<DevAPI>>
  implements DevAPIAttributes
{
  declare id: CreationOptional<number>
  declare api_key: string
  declare owner_id: number
  declare analytics?: string | undefined
  declare attributes?: string | undefined
}

DevAPI.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    api_key: {
      type: DataTypes.STRING,
      unique: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    analytics: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attributes: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'DevAPI',
    tableName: 'dev_apis'
  }
)

export default DevAPI
