import { ethers } from 'ethers'

import { getCollectionById } from '../controllers/collection'
import logger from '../utils/logger'
import { getContract } from '../utils/providers'

const gasOptions = {
  gasPrice: ethers.parseUnits('1000', 'gwei'),
  gasLimit: 100000
}

const mint1155 = async (
  collection_id: number,
  to_address: string,
  token_id: number,
  amount: number
) => {
  const collection_instance = await getCollectionById(collection_id)
  const contract = getContract(collection_instance)
  const tx = await contract.mint(to_address, token_id, amount, {
    ...gasOptions
  })
  logger.debug('Mining 1155', tx.hash)
  const receipt = await tx.wait()
  logger.debug('Minted 1155', receipt)
}

//* change the parameters of mint1155 as per the requirements
mint1155(6, '0xDb8F34eb2304d18A60c53D19cD18D6274935daEE', 1, 500)
