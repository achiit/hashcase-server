import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize'

import { NFTAttributes } from '../types/modelTypes'
import sequelize from '../utils/db/sequelize'

class NFT
  extends Model<InferAttributes<NFT>, InferCreationAttributes<NFT>>
  implements NFTAttributes
{
  declare id: CreationOptional<number>
  declare user_id: number
  declare item_id: number
  declare amount: number
}
NFT.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'NFT',
    tableName: 'nfts',
    indexes: [
      {
        name: 'unique_user_item',
        unique: true,
        fields: ['user_id', 'item_id']
      }
    ]
  }
)

export default NFT
