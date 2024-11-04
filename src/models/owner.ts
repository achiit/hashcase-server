import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize'

import { OwnerAttributes } from '../types/modelTypes'
import sequelize from '../utils/db/sequelize'

class Owner
  extends Model<InferAttributes<Owner>, InferCreationAttributes<Owner>>
  implements OwnerAttributes
{
  declare id: CreationOptional<number>
  declare name?: string
  declare email: string
  declare password_hash: string
  declare company_name?: string
}

Owner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    company_name: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    modelName: 'Owner',
    tableName: 'owners'
  }
)

export default Owner
