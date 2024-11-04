import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import request from 'supertest'

import app from '../../app'
import { createCollection } from '../../controllers/collection'
import { createItem } from '../../controllers/item'
import {
  createNFT,
  getNFTById,
  getNFTByUserIdAndItemId,
  getNFTsByUserId,
  updateNFTById,
  updateNFTByUserIdAndItemId,
  deleteNFTById,
  deleteNFTByUserIdAndItemId
} from '../../controllers/nft'
import { deleteOwnerByEmail } from '../../controllers/owner'
import { createUser, deleteUserByEmail } from '../../controllers/user'
import { ChainType, Standard } from '../../enums'
import { CollectionAttributes, ItemAttributes } from '../../types/modelTypes'

const owner = {
  email: 'owner@test.com',
  password: 'password'
}

const collectionDetails: CollectionAttributes & { id: number } = {
  name: 'test collection',
  description: 'test description',
  chain_type: ChainType.ETHEREUM,
  chain_id: 1,
  contract_address: '0x4Fc7556B9Da50278be434e4b3cb016d08Ff4a707',
  standard: Standard.ERC1155,
  owner_id: 0,
  id: 0
}

const itemDetails: ItemAttributes & { id: number } = {
  name: 'test item',
  description: 'test description',
  collection_id: 0,
  token_id: 1,
  id: 0
}

const userDetails = {
  id: 0,
  email: 'user@test.com'
}

const nftDetails = {
  user_id: 0,
  item_id: 0,
  amount: 1,
  id: 0
}

beforeAll(async () => {
  const res0 = await request(app).post('/auth/admin/login').send({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  })
  const token = res0.body.token
  const res = await request(app)
    .post('/admin/owner/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      owner: owner
    })
  collectionDetails.owner_id = res.body.owner_instance.id
  const [collection_instance] = await createCollection(collectionDetails)
  collectionDetails.id = collection_instance.id
  itemDetails.collection_id = collectionDetails.id
  const [item_instance] = await createItem(itemDetails)
  itemDetails.id = item_instance.id
  nftDetails.item_id = itemDetails.id
  const [user_instance] = await createUser(userDetails)
  userDetails.id = user_instance.id
  nftDetails.user_id = user_instance.id
})

afterAll(async () => {
  await deleteOwnerByEmail(owner.email)
  await deleteUserByEmail(userDetails.email)
})

describe('NFT Service', () => {
  it('creates a new NFT', async () => {
    const [nft_instance] = await createNFT(nftDetails)
    expect(nft_instance).not.toBeNull()
    nftDetails.id = nft_instance.id
  })

  it('retrieves an NFT by id', async () => {
    const foundNFT = await getNFTById(nftDetails.id)
    expect(foundNFT).not.toBeNull()
    expect(foundNFT?.id).toBe(nftDetails.id)
  })

  it('retrieves an NFT by user id and item id', async () => {
    const foundNFT = await getNFTByUserIdAndItemId(
      nftDetails.user_id,
      nftDetails.item_id
    )
    expect(foundNFT).not.toBeNull()
    expect(foundNFT.id).toBe(nftDetails.id)
  })

  it('retrieves NFTs by user id', async () => {
    const nfts = await getNFTsByUserId(nftDetails.user_id)
    expect(nfts.length).toBe(1)
    expect(nfts[0].id).toBe(nftDetails.id)
  })

  it('updates an NFT by id', async () => {
    const newAmount = 2
    const updatedNFT = await updateNFTById(nftDetails.id, {
      amount: newAmount
    })
    expect(updatedNFT.amount).toBe(newAmount)
    nftDetails.amount = newAmount
  })

  it('updates an NFT by user id and item id', async () => {
    const newAmount = 3
    const updatedNFT = await updateNFTByUserIdAndItemId(
      nftDetails.user_id,
      nftDetails.item_id,
      {
        amount: newAmount
      }
    )
    expect(updatedNFT.amount).toBe(newAmount)
    nftDetails.amount = newAmount
  })

  it('deletes an NFT by id', async () => {
    await deleteNFTById(nftDetails.id)
    const foundNFT = await getNFTById(nftDetails.id, false)
    expect(foundNFT).toBeNull()
  })

  it('deletes an NFT by user id and item id', async () => {
    await createNFT(nftDetails)
    await deleteNFTByUserIdAndItemId(nftDetails.user_id, nftDetails.item_id)
    const foundNFT = await getNFTByUserIdAndItemId(
      nftDetails.user_id,
      nftDetails.item_id,
      false
    )
    expect(foundNFT).toBeNull()
  })
})
