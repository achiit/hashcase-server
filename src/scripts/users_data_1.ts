/* eslint-disable import/no-internal-modules */
import users_data_1 from '../library/sample_data/users_data_1.json'
import sequelize, { User } from '../models'
import { UserAttributes } from '../types/modelTypes'

const create_data = async () => {
  await sequelize.authenticate()
  await sequelize.sync()

  const userData = users_data_1.users.map(user => {
    let address
    if (user.wallet_address) {
      address = user.wallet_address
    } else if (user.magic_wallet) {
      address = user.magic_wallet
    } else {
      return
    }
    return {
      email: user.email,
      eth_wallet_address: address
    }
  })

  for (const user of userData) {
    if (user) {
      try {
        await User.create(user as UserAttributes)
      } catch (error) {
        // console.log(error)
      }
    }
  }

  await sequelize.close()
  process.exit()
}

await create_data()
