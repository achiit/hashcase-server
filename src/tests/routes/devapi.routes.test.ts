import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import request from 'supertest'

import app from '../../app'
import { createCollection } from '../../controllers/collection'
import { createItem } from '../../controllers/item'
import { createLoyalty } from '../../controllers/loyalty'
import { deleteOwnerByEmail } from '../../controllers/owner'
import { ChainType, Standard } from '../../enums'

const owner1 = {
  email: 'owner1@test.com',
  password: 'password',
  token: '',
  id: 0,
  api_key: ''
}

const owner2 = {
  email: 'owner2@test.com',
  password: 'password',
  token: '',
  id: 0,
  api_key: ''
}

const collection = {
  name: 'Collection 1',
  chain_type: ChainType.ETHEREUM,
  chain_id: 1,
  contract_address: '0x4Fc7556B9Da50278be434e4b3cb016d08Ff4a707',
  standard: Standard.ERC721,
  id: 0,
  owner_id: 5
}

const item = {
  id: 0,
  name: 'Apefest Sandbox Avatar',
  description:
    "A limited edition collectible powered by HashCase for all the attendees of 'Sandbox Creator Day', at ApeFest HK 2023. Each holder will be airdropped a Sandbox avatar that they can use in the metaverse.",
  image_uri:
    'https://hash-collect.s3.ap-south-1.amazonaws.com/images/APE+NFT_small.png',
  collection_id: 100,
  token_id: 1
}

const loyalty = {
  id: 0,
  owner_id: 0,
  code: 'LOYALTY1',
  value: 100,
  type: 'FIXED'
}

beforeAll(async () => {
  const res0 = await request(app).post('/auth/admin/login').send({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  })
  const token = res0.body.token

  const res1 = await request(app)
    .post('/admin/owner/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      owner: owner1
    })
  const res2 = await request(app)
    .post('/admin/owner/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      owner: owner2
    })

  owner1.id = res1.body.owner_instance.id
  owner1.api_key = res1.body.api_key
  owner2.id = res2.body.owner_instance.id
  owner2.api_key = res2.body.api_key

  collection.owner_id = owner1.id
  const [collection_instance] = await createCollection(collection)
  collection.id = collection_instance.id
  item.collection_id = collection_instance.id

  const [item_instance] = await createItem(item)
  item.id = item_instance.id

  loyalty.owner_id = owner1.id
  const [loyalty_instance] = await createLoyalty(loyalty)
  loyalty.id = loyalty_instance.id
})

afterAll(async () => {
  await deleteOwnerByEmail(owner1.email)
  await deleteOwnerByEmail(owner2.email)
})

describe('Calling Dev API Routes', () => {
  it('should be able to successfully call devapi', async () => {
    const res = await request(app).get('/dev').set('x-api-key', owner1.api_key)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Successfully called devapi')
  })

  it('should not be able to call devapi without api key', async () => {
    const res = await request(app).get('/dev')
    expect(res.status).toBe(401)
  })
})

describe('Calling Dev API Collections Routes', () => {
  it('should be able to successfully call devapi collections', async () => {
    const res = await request(app)
      .get('/dev/collections')
      .set('x-api-key', owner1.api_key)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('collections')
    expect(res.body.collections).toHaveLength(1)
  })
})

describe('Calling Dev API Items Routes', () => {
  it('should be able to successfully call devapi items', async () => {
    const res = await request(app)
      .get('/dev/items')
      .set('x-api-key', owner1.api_key)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
    expect(res.body.items).toHaveLength(1)
  })
})
