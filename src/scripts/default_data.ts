/* eslint-disable import/no-internal-modules */
import default_data from '../library/sample_data/default_data.json'
import sequelize, { Owner, Collection, Item } from '../models'
import {
  CollectionAttributes,
  ItemAttributes,
  OwnerAttributes
} from '../types/modelTypes'

const create_data = async () => {
  await sequelize.authenticate()
  await sequelize.sync({ force: true })
  await Owner.bulkCreate(default_data.ownersData as OwnerAttributes[])
  await Collection.bulkCreate(
    default_data.collectionsData as CollectionAttributes[]
  )
  await Item.bulkCreate(default_data.itemsData as ItemAttributes[])
  await sequelize.close()
  process.exit()
}

await create_data()
