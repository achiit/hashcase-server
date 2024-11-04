import { createSmartAccountClient } from '@biconomy/account'
import { Magic } from '@magic-sdk/admin'
import { Contract, ethers } from 'ethers'
import { Provider, Wallet, Contract as FuelsContract } from 'fuels'

import { ChainType, Standard } from '../enums'
import { CollectionAttributes } from '../types/modelTypes'

const getABI = (abiType: Standard) => {
  switch (abiType) {
    case Standard.ERC721:
      return require('../library/abis/NFTMINTERABI.json')
    case Standard.ERC1155:
      return require('../library/abis/ABI1155.json')
    default:
      return require('../library/abis/ABI1155.json')
  }
}

const getSigner = (chain_type: ChainType, chain_id: number) => {
  let rpc = ''
  let private_key = ''
  switch (chain_type) {
    case ChainType.ETHEREUM:
      switch (chain_id) {
        case 137: //* Polygon Mainnet
          rpc = process.env.POLYGON_RPC!
          private_key = process.env.HASHCASE_PRIVATE_KEY!
          break
        case 5001: //* Mantle Testnet
          rpc = process.env.MANTLE_TESTNET_RPC!
          private_key = process.env.MANTLE_PRIVATE_KEY!
          break
        default:
          rpc = process.env.POLYGON_RPC!
          private_key = process.env.HASHCASE_PRIVATE_KEY!
      }
      break
    case ChainType.FILECOIN: //* Filecoin Mainnet
      switch (chain_id) {
        case 314:
          rpc = process.env.FILECOIN_MAINNET_RPC!
          private_key = process.env.FILECOIN_PRIVATE_KEY!
          break
        case 314159:
          rpc = process.env.FILECOIN_TESTNET_RPC!
          private_key = process.env.FILECOIN_PRIVATE_KEY!
          break
        default:
          rpc = process.env.FILECOIN_MAINNET_RPC!
          private_key = process.env.FILECOIN_PRIVATE_KEY!
      }
      break
    default:
      rpc = process.env.POLYGON_RPC!
      private_key = process.env.HASHCASE_PRIVATE_KEY!
  }
  const provider = ethers.getDefaultProvider(rpc)
  const signer = new ethers.Wallet(private_key, provider)
  return signer
}

const getContract = (
  collection_instance: CollectionAttributes & {
    id: number
  }
) => {
  const { standard, contract_address, chain_type, chain_id } =
    collection_instance
  const abi = getABI(standard)
  const contract = new ethers.Contract(
    contract_address,
    abi,
    getSigner(chain_type, chain_id)
  )
  return contract
}

const getSmartWallet = async (
  collection_instance: CollectionAttributes & {
    id: number
  }
) => {
  const bundlerUrl =
    'https://bundler.biconomy.io/api/v2/137/dewj2189.wh1289hU-7E49-45ic-af80-gmVDofY9X'
  const { chain_type, chain_id } = collection_instance
  const signer = getSigner(chain_type, chain_id)
  const biconomySmartAccountConfig = {
    signer,
    biconomyPaymasterApiKey: process.env.BICONOMY_API,
    bundlerUrl,
    chainId: chain_id
  }
  const smartWallet = await createSmartAccountClient(biconomySmartAccountConfig)
  return smartWallet
}

const getSocket = (chain_type: ChainType, chain_id: number) => {
  let rpc = ''
  let private_key = ''
  switch (chain_type) {
    case ChainType.ETHEREUM:
      switch (chain_id) {
        case 137: //* Polygon Mainnet
          rpc = process.env.POLYGON_RPC_SOCKET!
          private_key = process.env.HASHCASE_PRIVATE_KEY!
          break
        case 5001: //* Mantle Testnet
          rpc = process.env.MANTLE_TESTNET_RPC_SOCKET!
          private_key = process.env.MANTLE_PRIVATE_KEY!
          break
        default:
          rpc = process.env.POLYGON_RPC_SOCKET!
          private_key = process.env.HASHCASE_PRIVATE_KEY!
      }
      break
    case ChainType.FILECOIN: //* Filecoin Mainnet
      switch (chain_id) {
        case 314:
          rpc = process.env.FILECOIN_MAINNET_RPC_SOCKET!
          private_key = process.env.FILECOIN_PRIVATE_KEY!
          break
        case 314159:
          rpc = process.env.FILECOIN_TESTNET_RPC_SOCKET!
          private_key = process.env.FILECOIN_PRIVATE_KEY!
          break
        default:
          rpc = process.env.FILECOIN_MAINNET_RPC_SOCKET!
          private_key = process.env.FILECOIN_PRIVATE_KEY!
      }
      break
    default:
      rpc = process.env.POLYGON_RPC_SOCKET!
      private_key = process.env.HASHCASE_PRIVATE_KEY!
  }
  const provider = ethers.getDefaultProvider(rpc)
  const signer = new ethers.Wallet(private_key, provider)
  return signer
}

const SocketInstance = new Map<number, Contract>()
const getSocketContract = (
  collection_instance: CollectionAttributes & { id: number }
) => {
  const { id, standard, contract_address, chain_type, chain_id } =
    collection_instance
  let contract = SocketInstance.get(id)
  if (!contract) {
    const abi = getABI(standard)
    contract = new ethers.Contract(
      contract_address,
      abi,
      getSocket(chain_type, chain_id)
    )
  }
  SocketInstance.set(id, contract)
  return contract
}

const deleteSocketContract = (id: number) => {
  const contract = SocketInstance.get(id)
  if (contract) {
    contract.removeAllListeners()
    SocketInstance.delete(id)
  }
}

const getFuelABI = (standard: Standard) => {
  switch (standard) {
    case Standard.ERC721:
      return require('../library/abis/Fuel721.json')
    case Standard.ERC1155:
      return require('../library/abis/Fuel1155.json')
    default:
      return require('../library/abis/Fuel1155.json')
  }
}

const getFuelSigner = async () => {
  const provider = await Provider.create(process.env.FUEL_TESTNET_RPC!)
  const wallet = Wallet.fromPrivateKey(process.env.FUEL_PRIVATE_KEY!, provider)
  return wallet
}

const getFuelContract = async (
  collection_instance: CollectionAttributes & {
    id: number
  }
) => {
  const abi = getFuelABI(collection_instance.standard)
  const contract = new FuelsContract(
    collection_instance.contract_address,
    abi,
    await getFuelSigner()
  )
  return contract
}

const magic = await Magic.init(process.env.MAGICLINK_SECRET_KEY)

export {
  getContract,
  getSmartWallet,
  getSocketContract,
  deleteSocketContract,
  getFuelContract,
  magic
}
