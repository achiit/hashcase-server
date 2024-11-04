/* eslint-disable no-console */
import {
  getCollectionById,
  getAllCollections
} from '../../controllers/collection'
import { ChainType, Standard } from '../../enums'
import { CollectionAttributes } from '../../types/modelTypes'
import logger from '../../utils/logger'
import { deleteSocketContract, getSocketContract } from '../../utils/providers'
import { handle1155Transfer, handle721Transfer } from '../nft/callbacks'

const listen1155 = async (
  collection_instance: CollectionAttributes & { id: number }
) => {
  const contract = getSocketContract(collection_instance)
  contract.on('TransferSingle', (operator, from, to, id, value) => {
    const token_id = Number(id)
    const amount = Number(value)
    handle1155Transfer(
      operator,
      from,
      to,
      token_id,
      amount,
      collection_instance
    )
  })
}

const listen721 = async (
  collection_instance: CollectionAttributes & { id: number }
) => {
  const contract = getSocketContract(collection_instance)
  contract.on('TransferSingle', (operator, from, to, id, value) => {
    const token_id = Number(id)
    const amount = Number(value)
    handle721Transfer(operator, from, to, token_id, amount, collection_instance)
  })
}

const listen = async (collection_id: number) => {
  try {
    const collection_instance = await getCollectionById(collection_id)
    if (collection_instance.chain_type === ChainType.FUEL) {
      return
    }
    if (collection_instance.standard === Standard.ERC1155) {
      await listen1155(collection_instance)
    } else {
      await listen721(collection_instance)
    }
  } catch (error) {
    logger.error('Failed to listen', collection_id)
    console.log(error)
  }
}

const listenAll = async () => {
  const collections = await getAllCollections()
  await Promise.all(collections.map(collection => listen(collection.id)))
}

const removeListener = async (collection_id: number) => {
  try {
    deleteSocketContract(collection_id)
  } catch (error) {
    logger.error('Failed to remove listeners', error)
  }
}

const resetListener = async (collection_id: number) => {
  await removeListener(collection_id)
  await listen(collection_id)
}

const refreshListeners = async () => {
  logger.info('Refreshing listeners')
  const collections = await getAllCollections()
  await Promise.all(collections.map(collection => resetListener(collection.id)))
  // setTimeout(refreshListeners, 300000)
}

export { resetListener, removeListener, listenAll, refreshListeners }
