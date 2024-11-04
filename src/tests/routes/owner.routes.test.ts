import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import request from 'supertest'

import app from '../../app'
import { deleteOwnerByEmail } from '../../controllers/owner'
import { ChainType, Standard } from '../../enums'

const owner1 = {
  email: 'owner1@test.com',
  password: 'password',
  token: '',
  id: 0
}

const owner2 = {
  email: 'owner2@test.com',
  password: 'password',
  token: '',
  id: 0
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
  item_id: 0,
  name: 'Apefest Sandbox Avatar',
  description:
    "A limited edition collectible powered by HashCase for all the attendees of 'Sandbox Creator Day', at ApeFest HK 2023. Each holder will be airdropped a Sandbox avatar that they can use in the metaverse.",
  image_uri:
    'https://hash-collect.s3.ap-south-1.amazonaws.com/images/APE+NFT_small.png',
  collection_id: 100,
  token_id: 1
}

const loyalty = {
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
  owner2.id = res2.body.owner_instance.id

  collection.owner_id = owner1.id

  loyalty.owner_id = owner1.id
})

afterAll(async () => {
  await deleteOwnerByEmail(owner1.email)
  await deleteOwnerByEmail(owner2.email)
})

describe('Test Owner Login', () => {
  it('should be able to login', async () => {
    await Promise.all(
      [owner1, owner2].map(async owner => {
        const res = await request(app).post('/auth/owner/login').send(owner)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('owner_instance')
        expect(res.body.owner_instance).toHaveProperty('email', owner.email)
        owner.token = res.body.token
      })
    )
  })
})

describe('Test Owner API Keys', () => {
  it('should be able to get API keys', async () => {
    const res = await request(app)
      .get('/owner/apikeys')
      .set('Authorization', `Bearer ${owner1.token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('api_keys')
    expect(res.body.api_keys).toHaveLength(1)
  })
})

describe('Test Owner Collection', () => {
  it('should be able to create a collection', async () => {
    const res = await request(app)
      .post('/owner/collection/create')
      .set('Authorization', `Bearer ${owner1.token}`)
      .send({ collection: collection })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('collection_instance')
    expect(res.body.collection_instance).toHaveProperty('name', 'Collection 1')
    collection.id = res.body.collection_instance.id
    collection.owner_id = res.body.collection_instance.owner_id
    item.collection_id = res.body.collection_instance.id
  })

  it('should be able to edit a collection', async () => {
    const res = await request(app)
      .post('/owner/collection/edit')
      .set('Authorization', `Bearer ${owner1.token}`)
      .send({
        collection: {
          id: collection.id,
          name: 'Collection 1 Edited'
        }
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('collection_instance')
    expect(res.body.collection_instance).toHaveProperty(
      'name',
      'Collection 1 Edited'
    )
  })

  it('should not be able to edit sensitive fields of a collection', async () => {
    const res = await request(app)
      .post('/owner/collection/edit')
      .set('Authorization', `Bearer ${owner1.token}`)
      .send({
        collection: {
          id: collection.id,
          owner_id: 100
        }
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('collection_instance')
    expect(res.body.collection_instance).toHaveProperty(
      'owner_id',
      collection.owner_id
    )
  })

  it('should not be able to edit collection of another owner', async () => {
    const res = await request(app)
      .post('/owner/collection/edit')
      .set('Authorization', `Bearer ${owner2.token}`)
      .send({
        collection: {
          id: collection.id,
          name: 'Collection 1 Edited'
        }
      })
    expect(res.status).toBe(403)
  })
})

describe('Test Owner Item', () => {
  it('should be able to create an item', async () => {
    const res = await request(app)
      .post('/owner/item/create')
      .set('Authorization', `Bearer ${owner1.token}`)
      .send({ item })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('item_instance')
    expect(res.body.item_instance).toHaveProperty('name', item.name)
    item.item_id = res.body.item_instance.id
  })

  it('should be able to edit an item', async () => {
    const res = await request(app)
      .post('/owner/item/edit')
      .set('Authorization', `Bearer ${owner1.token}`)
      .send({
        item: {
          id: item.item_id,
          name: 'Apefest Sandbox Avatar Edited'
        }
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('item_instance')
    expect(res.body.item_instance).toHaveProperty(
      'name',
      'Apefest Sandbox Avatar Edited'
    )
  })

  it('should not be able to edit sensitive fields of an item', async () => {
    const res = await request(app)
      .post('/owner/item/edit')
      .set('Authorization', `Bearer ${owner1.token}`)
      .send({
        item: {
          id: item.item_id,
          collection_id: 100
        }
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('item_instance')
    expect(res.body.item_instance).toHaveProperty(
      'collection_id',
      item.collection_id
    )
  })

  it('should not be able to edit item of another owner', async () => {
    const res = await request(app)
      .post('/owner/item/edit')
      .set('Authorization', `Bearer ${owner2.token}`)
      .send({
        item: {
          id: item.item_id,
          name: 'Apefest Sandbox Avatar Edited'
        }
      })
    expect(res.status).toBe(403)
  })
})

describe('Test Owner Loyalty', () => {
  it('should be able to create a loyalty', async () => {
    const res = await request(app)
      .post('/owner/loyalty/create')
      .set('Authorization', `Bearer ${owner1.token}`)
      .send({ loyalty })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('loyalty_instance')
    expect(res.body.loyalty_instance).toHaveProperty('code', loyalty.code)
  })

  it('should be able to edit a loyalty', async () => {
    const res = await request(app)
      .post('/owner/loyalty/edit')
      .set('Authorization', `Bearer ${owner1.token}`)
      .send({
        loyalty: {
          code: loyalty.code,
          value: 200
        },
        code: loyalty.code
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('loyalty_instance')
    expect(res.body.loyalty_instance).toHaveProperty('value', 200)
  })

  it('should not be able to edit sensitive fields of a loyalty', async () => {
    const res = await request(app)
      .post('/owner/loyalty/edit')
      .set('Authorization', `Bearer ${owner1.token}`)
      .send({
        loyalty: {
          code: loyalty.code,
          owner_id: 100
        },
        code: loyalty.code
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('loyalty_instance')
    expect(res.body.loyalty_instance).toHaveProperty('owner_id', owner1.id)
  })

  it('should not be able to edit loyalty of another owner', async () => {
    const res = await request(app)
      .post('/owner/loyalty/edit')
      .set('Authorization', `Bearer ${owner2.token}`)
      .send({
        loyalty: {
          code: loyalty.code,
          value: 200
        },
        code: loyalty.code
      })
    expect(res.status).toBe(404)
  })
})
