import { ChainType } from '../../enums'
import { CollectionAttributes } from '../../types/modelTypes'
import logger from '../../utils/logger'
import { getContract, getFuelContract } from '../../utils/providers'

const _mint721 = async (
  collection_instance: CollectionAttributes & { id: number },
  to_address: string,
  amount: number,
  metadata: string
) => {
  switch (collection_instance.chain_type) {
    case ChainType.FUEL: {
      const contract = await getFuelContract(collection_instance)
      const receipt = await contract.functions
        .mint(
          {
            Address: {
              value: to_address
            }
          },
          metadata
        )
        .call()
      return {
        transactionHash: receipt.transactionId
      }
    }
    default: {
      const contract = getContract(collection_instance)
      const receipt = await contract.mint(to_address, metadata)
      logger.debug('Minted NFT', collection_instance.id, amount)
      return receipt
    }
  }
}

const MintToUser721 = async (
  collection_instance: CollectionAttributes & { id: number },
  user_address: string,
  amount: number = 1,
  metadata: string
) => {
  return _mint721(collection_instance, user_address, amount, metadata)
}

const getTokenURI721 = async (
  collection_instance: CollectionAttributes & { id: number },
  token_id: number
) => {
  const contract = getContract(collection_instance)
  return contract.uri(token_id)
}

export { MintToUser721, getTokenURI721 }
