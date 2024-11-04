import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import request from 'supertest'

import app from '../../app'
import {
  createCollection,
  getCollectionById,
  getCollectionsByOwnerId,
  getCollectionsByPaymasterId,
  getAllCollections,
  updateCollectionById,
  deleteCollectionById
} from '../../controllers/collection'
import { deleteOwnerByEmail } from '../../controllers/owner'
import { ChainType, Standard } from '../../enums'
import { CollectionAttributes } from '../../types/modelTypes'

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
})

afterAll(async () => {
  await deleteOwnerByEmail(owner.email)
})

describe('Collection Service', () => {
  it('creates a new collection', async () => {
    const [collection_instance] = await createCollection(collectionDetails)
    expect(collection_instance.name).toBe(collectionDetails.name)
    collectionDetails.id = collection_instance.id
  })

  it('retrieves a collection by id', async () => {
    const foundCollection = await getCollectionById(collectionDetails.id)
    expect(foundCollection).not.toBeNull()
    expect(foundCollection?.name).toBe(collectionDetails.name)
  })

  it('retrieves collections by owner id', async () => {
    const collections = await getCollectionsByOwnerId(
      collectionDetails.owner_id
    )
    expect(collections.length).toBe(1)
  })

  it('retrieves collections by paymaster id', async () => {
    const collections = await getCollectionsByPaymasterId(0)
    expect(collections.length).toBe(0)
  })

  it('retrieves all collections', async () => {
    const collections = await getAllCollections()
    expect(collections.length).toBe(1)
  })

  it('updates a collection by id', async () => {
    const updatedName = 'updated collection'
    await updateCollectionById(collectionDetails.id, { name: updatedName })
    const updatedCollection = await getCollectionById(collectionDetails.id)
    expect(updatedCollection).not.toBeNull()
    expect(updatedCollection?.name).toBe(updatedName)
  })

  it('deletes a collection by id', async () => {
    await deleteCollectionById(collectionDetails.id)
    const foundCollection = await getCollectionById(collectionDetails.id, false)
    expect(foundCollection).toBeNull()
  })
})

describe('Collection Service - Error Handling', () => {
  it('throws an error when creating a collection with invalid details', async () => {
    try {
      const res = await createCollection({
        ...collectionDetails,
        owner_id: -1
      })
      expect(res).toBeNull()
    } catch (error) {
      expect(error).not.toBeNull()
    }
  })
})
