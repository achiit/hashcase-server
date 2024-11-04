/* eslint-disable import/no-internal-modules */
import items_data_1 from '../library/sample_data/items_data_1.json'
import sequelize, { Item } from '../models'
import { ItemAttributes } from '../types/modelTypes'

const create_data = async () => {
  await sequelize.authenticate()
  await sequelize.sync()
  await Item.bulkCreate(items_data_1.itemsData as ItemAttributes[])
  await sequelize.close()
  process.exit()
}

await create_data()
