import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import request from 'supertest'

import app from '../../app'
import { createCollection } from '../../controllers/collection'
import {
  createItem,
  getItemById,
  getItemByCollectionAndTokenId,
  getItemsByCollectionId,
  updateItemById,
  updateItemByCollectionAndTokenId,
  deleteItemById,
  deleteItemByCollectionAndTokenId
} from '../../controllers/item'
import { deleteOwnerByEmail } from '../../controllers/owner'
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
})

afterAll(async () => {
  await deleteOwnerByEmail(owner.email)
})

describe('Item Service', () => {
  it('creates a new item', async () => {
    const [item_instance] = await createItem(itemDetails)
    expect(item_instance.name).toBe(itemDetails.name)
    itemDetails.id = item_instance.id
  })

  it('retrieves an item by id', async () => {
    const foundItem = await getItemById(itemDetails.id)
    expect(foundItem).not.toBeNull()
    expect(foundItem?.name).toBe(itemDetails.name)
  })

  it('retrieves an item by collection and token id', async () => {
    const foundItem = await getItemByCollectionAndTokenId(
      collectionDetails.id,
      itemDetails.token_id
    )
    expect(foundItem).not.toBeNull()
    expect(foundItem?.name).toBe(itemDetails.name)
  })

  it('retrieves items by collection id', async () => {
    const items = await getItemsByCollectionId(collectionDetails.id)
    expect(items.length).toBe(1)
    expect(items[0].name).toBe(itemDetails.name)
  })

  it('updates an item by id', async () => {
    const newName = 'updated item by id'
    const updatedItem = await updateItemById(itemDetails.id, {
      name: newName
    })
    expect(updatedItem.name).toBe(newName)
  })

  it('updates an item by collection and token id', async () => {
    const newName = 'updated item by collection and token id'
    const updatedItem = await updateItemByCollectionAndTokenId(
      collectionDetails.id,
      itemDetails.token_id,
      {
        name: newName
      }
    )
    expect(updatedItem.name).toBe(newName)
  })

  it('deletes an item by id', async () => {
    await deleteItemById(itemDetails.id)
    const foundItem = await getItemById(itemDetails.id, false)
    expect(foundItem).toBeNull()
  })

  it('deletes an item by collection and token id', async () => {
    await createItem(itemDetails)
    await deleteItemByCollectionAndTokenId(
      collectionDetails.id,
      itemDetails.token_id
    )
    const foundItem = await getItemByCollectionAndTokenId(
      collectionDetails.id,
      itemDetails.token_id,
      false
    )
    expect(foundItem).toBeNull()
  })
})
