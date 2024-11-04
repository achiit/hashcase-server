import {
  ChainType,
  ItemStatus,
  ItemType,
  PaymasterType,
  Standard
} from '../enums'

type UserAttributes = {
  email?: string
  eth_wallet_address?: string
  fvm_wallet_address?: string
  fuel_wallet_address?: string
  loyalty?: string
  identifier?: string
  private_key?: string
  owner_id?: number
  badges?: string
}

type CollectionAttributes = {
  name: string
  description?: string
  image_uri?: string
  chain_type: ChainType
  chain_id: number
  contract_address: string
  standard: Standard
  owner_id: number
  paymaster_id?: number
  priority?: number
  attributes?: string
}

type ItemAttributes = {
  name: string
  description?: string
  image_uri?: string
  collection_id: number
  token_id: number
  type?: ItemType
  status?: ItemStatus
  priority?: number
  attributes?: string
}

type OwnerAttributes = {
  name?: string
  email: string
  password_hash: string
  company_name?: string
}

type LoyaltyAttributes = {
  owner_id: number
  code: string
  value: number
  type: string
}

type PaymasterAttributes = {
  type: PaymasterType
  owner_id: number
  chain_type?: ChainType
  chain_id?: number
  contract_address?: string
}

type NFTAttributes = {
  user_id: number
  item_id: number
  amount: number
}

type DevAPIAttributes = {
  api_key: string
  owner_id: number
  analytics?: string
  attributes?: string
}
type BadgeAttributes = {
  title: string
  description: string
  image_url: string
  points: number
  character_string: string
}

type StreakAttributes = {
  user_id: number
  streak: number
  last_check_in: Date
  owner_id: number
}

type UserLoyaltyObject = {
  code: string
  value: number
}

export type {
  UserAttributes,
  CollectionAttributes,
  ItemAttributes,
  OwnerAttributes,
  LoyaltyAttributes,
  PaymasterAttributes,
  NFTAttributes,
  DevAPIAttributes,
  UserLoyaltyObject,
  BadgeAttributes,
  StreakAttributes
}
