import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize'

import { ChainType, PaymasterType } from '../enums'
import { PaymasterAttributes } from '../types/modelTypes'
import sequelize from '../utils/db/sequelize'

class Paymaster
  extends Model<InferAttributes<Paymaster>, InferCreationAttributes<Paymaster>>
  implements PaymasterAttributes
{
  declare id: CreationOptional<number>
  declare type: PaymasterType
  declare owner_id: number
  declare chain_type?: ChainType
  declare chain_id?: number
  declare contract_address?: string
}

Paymaster.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM(...Object.values(PaymasterType)),
      allowNull: false
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chain_type: {
      type: DataTypes.ENUM(...Object.values(ChainType))
    },
    chain_id: {
      type: DataTypes.INTEGER
    },
    contract_address: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    modelName: 'Paymaster',
    tableName: 'paymasters',
    indexes: [
      {
        name: 'unique_contract',
        unique: true,
        fields: ['chain_type', 'chain_id', 'contract_address']
      }
    ]
  }
)

export default Paymaster
