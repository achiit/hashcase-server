import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize'

import { ChainType, Standard } from '../enums'
import { CollectionAttributes } from '../types/modelTypes'
import sequelize from '../utils/db/sequelize'

class Collection
  extends Model<
    InferAttributes<Collection>,
    InferCreationAttributes<Collection>
  >
  implements CollectionAttributes
{
  declare id: CreationOptional<number>
  declare name: string
  declare description?: string
  declare image_uri?: string
  declare chain_type: ChainType
  declare chain_id: number
  declare contract_address: string
  declare standard: Standard
  declare owner_id: number
  declare paymaster_id?: number
  declare priority?: number
  declare attributes?: string
}

Collection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    image_uri: {
      type: DataTypes.STRING
    },
    chain_type: {
      type: DataTypes.ENUM(...Object.values(ChainType)),
      allowNull: false,
      defaultValue: ChainType.ETHEREUM
    },
    chain_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contract_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    standard: {
      type: DataTypes.ENUM(...Object.values(Standard)),
      allowNull: false
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymaster_id: {
      type: DataTypes.INTEGER
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    attributes: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    modelName: 'Collection',
    tableName: 'collections',
    indexes: [
      {
        name: 'unique_contract',
        unique: true,
        fields: ['chain_type', 'chain_id', 'contract_address']
      }
    ]
  }
)

export default Collection
