/* eslint-disable import/no-internal-modules */
import { getCollectionById } from '../controllers/collection'
import { Standard } from '../enums'
import sequelize, { User, Item, Collection } from '../models'
import { getBalanceOf } from '../services/contract/1155'

const index = async () => {
  await sequelize.authenticate()
  await sequelize.sync()

  const collectionToAvoid = [4, 16, 17]

  const users = await User.findAll()
  const items = (await Item.findAll()).filter(
    (item: Item) => !collectionToAvoid.includes(item.collection_id)
  )

  const getBalance = async (
    user: User,
    item: Item,
    collection_instance: Collection
  ) => {
    try {
      const balance = await getBalanceOf(
        user.eth_wallet_address!,
        collection_instance,
        item.token_id
      )
      if (balance > 0) {
        console.log(
          `User: ${user.eth_wallet_address} owns ${balance} of item: ${item.token_id}`
        )
      } else {
        console.log(
          `User: ${user.eth_wallet_address} does not own item: ${item.token_id}`
        )
      }
    } catch (error) {
      console.log('Error: ', item.id)
    }
  }

  const promises = []
  for (const user of users) {
    console.log(user.dataValues)
    for (const item of items) {
      console.log(item.id)
      const collection_instance = await getCollectionById(item.collection_id)
      if (!user.eth_wallet_address) {
        break
      } else if (collection_instance.standard === Standard.ERC721) {
        continue
      }
      promises.push(getBalance(user, item, collection_instance))
    }
  }

  await Promise.all(promises)

  await sequelize.close()
  process.exit()
}

await index()
