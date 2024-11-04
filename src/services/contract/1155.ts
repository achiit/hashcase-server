import { PaymasterMode } from '@biconomy/account'
import { ethers } from 'ethers'

import { CollectionAttributes } from '../../types/modelTypes'
import logger from '../../utils/logger'
import { getContract, getSmartWallet } from '../../utils/providers'

const gasOptions = {
  gasPrice: ethers.parseUnits('1000', 'gwei'),
  gasLimit: 100000
}

const _mint1155 = async (
  collection_instance: CollectionAttributes & { id: number },
  to_address: string,
  token_id: number,
  amount: number
) => {
  const contract = getContract(collection_instance)
  const tx = await contract.mint(to_address, token_id, amount, {
    ...gasOptions
  })
  const receipt = await tx.wait()
  return receipt
}

const _transfer1155 = async (
  collection_instance: CollectionAttributes & { id: number },
  from_address: string,
  to_address: string,
  token_id: number,
  amount: number
) => {
  logger.debug(
    'Transferring NFT',
    collection_instance.id,
    token_id,
    from_address,
    to_address,
    amount
  )
  const smartWallet = await getSmartWallet(collection_instance)
  const contract = getContract(collection_instance)

  const populatedTransaction =
    await contract.safeTransferFrom.populateTransaction(
      await smartWallet.getAccountAddress(),
      to_address,
      token_id,
      amount,
      '0x'
    )

  const tx = {
    data: populatedTransaction.data,
    to: collection_instance.contract_address
  }

  logger.debug('Building User Op', tx)
  const userOp = await smartWallet.buildUserOp([tx], {
    paymasterServiceData: {
      mode: PaymasterMode.SPONSORED
    }
  })

  const userOpResponse = await smartWallet.sendUserOp(userOp)

  logger.debug('UserOp response', userOpResponse)
  const { transactionHash } = await userOpResponse.waitForTxHash()
  logger.debug('Transaction Hash', transactionHash)
  const userOpReceipt = await userOpResponse.wait()
  if (userOpReceipt.success == 'true') {
    return {
      hash: transactionHash
    }
  } else {
    throw new Error('Transfer failed')
  }
}

const mintToAdmin1155 = async (
  collection_instance: CollectionAttributes & { id: number },
  token_id: number,
  amount: number
) => {
  return _mint1155(
    collection_instance,
    process.env.HASHCASE_PUBLIC_KEY!,
    token_id,
    amount
  )
}

const transferToUser1155 = async (
  collection_instance: CollectionAttributes & { id: number },
  user_address: string,
  token_id: number,
  amount: number = 1
) => {
  return _transfer1155(
    collection_instance,
    process.env.HASHCASE_PUBLIC_KEY!,
    user_address,
    token_id,
    amount
  )
}

const setTokenURI1155 = async (
  collection_instance: CollectionAttributes & { id: number },
  token_id: number,
  token_uri: string
) => {
  const contract = getContract(collection_instance)
  const tx = await contract.setTokenUri(token_id, token_uri)
  const receipt = await tx.wait()
  return receipt
}

const getBalanceOf = async (
  user_address: string,
  collection_instance: CollectionAttributes & { id: number },
  token_id: number
) => {
  const contract = getContract(collection_instance)
  return contract.balanceOf(user_address, token_id)
}

export { mintToAdmin1155, transferToUser1155, setTokenURI1155, getBalanceOf }
