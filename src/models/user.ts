import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize'

import { UserAttributes } from '../types/modelTypes'
import sequelize from '../utils/db/sequelize'

class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserAttributes
{
  declare id: CreationOptional<number>
  declare email?: string
  declare eth_wallet_address?: string
  declare fvm_wallet_address?: string
  declare fuel_wallet_address?: string
  declare loyalty?: string
  declare identifier?: string
  declare private_key?: string
  declare badges: string
  declare owner_id?: number
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    eth_wallet_address: {
      type: DataTypes.STRING,
      unique: true
    },
    fvm_wallet_address: {
      type: DataTypes.STRING,
      unique: true
    },
    fuel_wallet_address: {
      type: DataTypes.STRING,
      unique: true
    },
    loyalty: {
      type: DataTypes.STRING
    },
    identifier: {
      type: DataTypes.STRING
    },
    private_key: {
      type: DataTypes.STRING,
      unique: true
    },
    owner_id: {
      type: DataTypes.INTEGER
    },
    badges: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]'
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    indexes: [
      {
        name: 'unique_owner_identifier',
        unique: true,
        fields: ['owner_id', 'identifier']
      }
    ]
  }
)

export default User
