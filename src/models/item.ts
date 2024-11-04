import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize'

import { ItemStatus, ItemType } from '../enums'
import { ItemAttributes } from '../types/modelTypes'
import sequelize from '../utils/db/sequelize'

class Item
  extends Model<InferAttributes<Item>, InferCreationAttributes<Item>>
  implements ItemAttributes
{
  declare id: CreationOptional<number>
  declare name: string
  declare description?: string
  declare image_uri?: string
  declare collection_id: number
  declare token_id: number
  declare type?: ItemType
  declare status?: ItemStatus
  declare priority?: number
  declare attributes?: string
}

Item.init(
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
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ItemType)),
      allowNull: false,
      defaultValue: ItemType.BUYANDCLAIM
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ItemStatus)),
      allowNull: false,
      defaultValue: ItemStatus.ACTIVE
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
    modelName: 'Item',
    tableName: 'items',
    indexes: [
      {
        name: 'unique_token',
        unique: true,
        fields: ['collection_id', 'token_id']
      }
    ]
  }
)

export default Item
