import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import request from 'supertest'

import app from '../../app'
import { createCollection } from '../../controllers/collection'
import { createItem } from '../../controllers/item'
import { deleteOwnerById } from '../../controllers/owner'
import { createUser, deleteUserById } from '../../controllers/user'
import { ChainType, Standard } from '../../enums'
import { signedUserToken } from '../../services/authenticator/jwtSigner'

const user = {
  user_id: 0,
  email: 'user@test.com',
  eth_wallet_address: '0x66A6E5e6C48aa15661C72047dec2f2f9E2137f99',
  token: ''
}

const owner = {
  email: 'owner@test.com',
  password: 'password'
}

const collection = {
  collection_id: 0,
  name: 'Sandbox',
  chain_type: ChainType.ETHEREUM,
  chain_id: 137,
  contract_address: '0x4Fc7556B9Da50278be434e4b3cb016d08Ff4a707',
  standard: Standard.ERC1155,
  owner_id: 2
}

const item = {
  item_id: 0,
  name: 'Apefest Sandbox Avatar',
  description:
    "A limited edition collectible powered by HashCase for all the attendees of 'Sandbox Creator Day', at ApeFest HK 2023. Each holder will be airdropped a Sandbox avatar that they can use in the metaverse.",
  image_uri:
    'https://hash-collect.s3.ap-south-1.amazonaws.com/images/APE+NFT_small.png',
  collection_id: 100,
  token_id: 1
}

beforeAll(async () => {
  const [user_instance] = await createUser({
    email: user.email,
    eth_wallet_address: user.eth_wallet_address
  })
  user.user_id = user_instance.id
  user.token = signedUserToken(user.user_id)

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
  collection.owner_id = res.body.owner_instance.id

  const [collection_instance] = await createCollection(collection)
  collection.collection_id = collection_instance.id
  item.collection_id = collection_instance.id

  const [item_instance] = await createItem(item)
  item.item_id = item_instance.id
})

afterAll(async () => {
  await deleteUserById(user.user_id)
  await deleteOwnerById(collection.owner_id)
})

describe('Platform Routes', () => {
  it('should get a collection', async () => {
    const res = await request(app)
      .get('/platform/collection')
      .set('Authorization', `Bearer ${user.token}`)
      .query({ collection_id: collection.collection_id })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('collection_instance')
    expect(res.body.collection_instance).toHaveProperty('name', collection.name)
  })

  it('should get all collections', async () => {
    const res = await request(app)
      .get('/platform/collections')
      .set('Authorization', `Bearer ${user.token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('collections')
    expect(res.body.collections).toHaveLength(1)
  })

  it('should get collections of owner', async () => {
    const res = await request(app)
      .get('/platform/collections/byowner')
      .set('Authorization', `Bearer ${user.token}`)
      .query({ owner_id: collection.owner_id })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('collections')
    expect(res.body.collections).toHaveLength(1)
  })

  it('should get an item', async () => {
    const res = await request(app)
      .get('/platform/item')
      .set('Authorization', `Bearer ${user.token}`)
      .query({ item_id: item.item_id })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('item_instance')
    expect(res.body.item_instance).toHaveProperty('name', item.name)
  })

  it('should get item of collection name and token id', async () => {
    const res = await request(app)
      .get('/platform/item/by-collection-name-and-token-id')
      .set('Authorization', `Bearer ${user.token}`)
      .query({ collection_name: collection.name, token_id: item.token_id })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('item_instance')
    expect(res.body.item_instance).toHaveProperty('name', item.name)
  })

  it('should get items of collection', async () => {
    const res = await request(app)
      .get('/platform/items/bycollection')
      .set('Authorization', `Bearer ${user.token}`)
      .query({ collection_id: collection.collection_id })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
    expect(res.body.items).toHaveLength(1)
  })

  it('should get items of owner', async () => {
    const res = await request(app)
      .get('/platform/items/byowner')
      .set('Authorization', `Bearer ${user.token}`)
      .query({ owner_id: collection.owner_id })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
    expect(res.body.items).toHaveLength(1)
  })

  it('should get owner of collection', async () => {
    const res = await request(app)
      .get('/platform/owner-by-collection')
      .set('Authorization', `Bearer ${user.token}`)
      .query({ collection_id: collection.collection_id })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('owner_instance')
    expect(res.body.owner_instance).toHaveProperty('email', owner.email)
  })
})
