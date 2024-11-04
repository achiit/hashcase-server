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
  owner_id: 0
}

const mantleCollection = {
  collection_id: 0,
  name: 'Mantle Collection',
  chain_type: ChainType.ETHEREUM,
  chain_id: 5001,
  contract_address: '0x8f5097d4E92dDa9F1E02c6F4D1B049618edce6Cd',
  standard: Standard.ERC721,
  owner_id: 0
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
  mantleCollection.owner_id = res.body.owner_instance.id

  const [collection_instance] = await createCollection(collection)
  collection.collection_id = collection_instance.id
  item.collection_id = collection_instance.id

  const [item_instance] = await createItem(item)
  item.item_id = item_instance.id

  const [mantle_collection_instance] = await createCollection(mantleCollection)
  mantleCollection.collection_id = mantle_collection_instance.id
})

afterAll(async () => {
  await deleteUserById(user.user_id)
  await deleteOwnerById(collection.owner_id)
})

describe('Test User Routes', () => {
  it('should be able to get user info', async () => {
    const res = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${user.token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('user_instance')
    expect(res.body.user_instance).toHaveProperty('email', user.email)
  })

  it('should be able to get user nfts', async () => {
    const res = await request(app)
      .get('/user/nfts')
      .set('Authorization', `Bearer ${user.token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('nfts')
  })
})

describe('Test User Claim NFT', () => {
  process.env.CONTRACT &&
    it('should be able to claim an NFT', async () => {
      const res = await request(app)
        .post('/user/claim')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ item_id: item.item_id })
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('message', 'NFT claimed successfully')
      expect(res.body).toHaveProperty('receipt')
    })

  // it('should not be able to claim an NFT with invalid item_id', async () => {
  //   const res = await request(app)
  //     .post('/user/claim')
  //     .set('Authorization', `Bearer ${user.token}`)
  //     .send({ item_id: 100 })
  //   expect(res.status).toBe(404)
  // })

  // process.env.CONTRACT &&
  //   it('handles failure to claim NFT', async () => {
  //     const res = await request(app)
  //       .post('/user/claim')
  //       .set('Authorization', `Bearer ${user.token}`)
  //       .send({ item_id: item.item_id, amount: 1000000000 })
  //     expect(res.status).toBe(500)
  //   })
})

describe('Test Mantle Minting', () => {
  process.env.CONTRACT &&
    it('should be able to mint an NFT', async () => {
      const res = await request(app)
        .post('/user/mint')
        .query({ collection_id: mantleCollection.collection_id })
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          name: 'test-name'
        })
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('message', 'NFT minted successfully')
      expect(res.body).toHaveProperty('receipt')
    })
})
