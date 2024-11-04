import sequelize from '../utils/db/sequelize'

import Collection from './collection'
import DevAPI from './devapi'
import Item from './item'
import Loyalty from './loyalty'
import NFT from './nft'
import Owner from './owner'
import Paymaster from './paymaster'
import User from './user'
import { UserLoyaltyTotal } from './userloyaltytotal'

const defineAssociations = () => {
  //* Collection - Item
  Collection.hasMany(Item, {
    foreignKey: 'collection_id',
    as: 'items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  Item.belongsTo(Collection, {
    foreignKey: 'collection_id',
    as: 'collection'
  })

  //* Collection - Owner
  Owner.hasMany(Collection, {
    foreignKey: 'owner_id',
    as: 'collections',
    onDelete: 'CASCADE'
  })
  Collection.belongsTo(Owner, {
    foreignKey: 'owner_id',
    as: 'owner'
  })

  //* Collection - Paymaster
  Paymaster.hasMany(Collection, {
    foreignKey: 'paymaster_id',
    as: 'collections',
    onDelete: 'SET NULL'
  })
  Collection.belongsTo(Paymaster, {
    foreignKey: 'paymaster_id',
    as: 'paymaster'
  })

  //* Owner - Paymaster
  Owner.hasMany(Paymaster, {
    foreignKey: 'owner_id',
    as: 'paymasters',
    onDelete: 'CASCADE'
  })
  Paymaster.belongsTo(Owner, {
    foreignKey: 'owner_id',
    as: 'owner'
  })

  //* Owner - DevAPI
  Owner.hasMany(DevAPI, {
    foreignKey: 'owner_id',
    as: 'dev_apis',
    onDelete: 'CASCADE'
  })
  DevAPI.belongsTo(Owner, {
    foreignKey: 'owner_id',
    as: 'owner'
  })

  //* Owner - Loyalty
  Owner.hasMany(Loyalty, {
    foreignKey: 'owner_id',
    as: 'loyalties',
    onDelete: 'CASCADE'
  })
  Loyalty.belongsTo(Owner, {
    foreignKey: 'owner_id',
    as: 'owner'
  })

  //* Item - NFT
  Item.hasMany(NFT, {
    foreignKey: 'item_id',
    as: 'nfts',
    onDelete: 'CASCADE'
  })
  NFT.belongsTo(Item, {
    foreignKey: 'item_id',
    as: 'item'
  })

  //* User - NFT
  User.hasMany(NFT, {
    foreignKey: 'user_id',
    as: 'nfts',
    onDelete: 'CASCADE'
  })
  NFT.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  })
}

defineAssociations()

export {
  Collection,
  Item,
  User,
  NFT,
  Paymaster,
  Owner,
  DevAPI,
  Loyalty,
  UserLoyaltyTotal // Export the new model
}
export default sequelize
