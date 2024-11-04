import { describe, it, expect, beforeAll } from 'bun:test'
import request from 'supertest'

import app from '../../app'
import { ChainType, Standard } from '../../enums'

const owner = {
  email: 'owner@test.com',
  password: 'password'
}

const collection = {
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
const badge = {
  id: 7,
  title: 'Test Badge',
  description: 'A test badge',
  image_url: 'https://example.com/badge.png',
  points: 50,
  character_string: 'BADGE7'
}
let token = ''

beforeAll(async () => {
  const res0 = await request(app).post('/auth/admin/login').send({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  })
  token = res0.body.token
})

describe('Test Owner Routes', () => {
  it('should create owner', async () => {
    const res = await request(app)
      .post('/admin/owner/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        owner: owner
      })
    expect(res.status).toBe(200)
    expect(res.body.owner_instance).toBeDefined()
    expect(res.body.owner_instance.email).toBe(owner.email)
    collection.owner_id = res.body.owner_instance.id
  })

  it('should edit owner', async () => {
    const res = await request(app)
      .post('/admin/owner/edit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        owner: {
          ...owner,
          email: 'newowner@test.com',
          password: 'newpassword',
          id: collection.owner_id
        }
      })
    expect(res.status).toBe(200)
    expect(res.body.owner_instance).toBeDefined()
    expect(res.body.owner_instance.email).toBe('newowner@test.com')
  })
})

describe('Test Collection Routes', () => {
  it('should create collection', async () => {
    const res = await request(app)
      .post('/admin/collection/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        collection: collection
      })
    expect(res.status).toBe(200)
    expect(res.body.collection_instance).toBeDefined()
    expect(res.body.collection_instance.name).toBe(collection.name)
    item.collection_id = res.body.collection_instance.id
  })

  it('should edit collection', async () => {
    const res = await request(app)
      .post('/admin/collection/edit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        collection: {
          ...collection,
          name: 'New Sandbox',
          id: item.collection_id
        }
      })
    expect(res.status).toBe(200)
    expect(res.body.collection_instance).toBeDefined()
    expect(res.body.collection_instance.name).toBe('New Sandbox')
  })
})
describe('Test Badges Routes', () => {
  it('should create badge', async () => {
    const res = await request(app)
      .post('/admin/badge/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        badge: badge
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('badge_instance')
    expect(res.body.badge_instance.character_string).toBe(
      badge.character_string
    )
    badge.id = res.body.badge_instance.id
  })

  it('should edit badge', async () => {
    const res = await request(app)
      .post('/admin/badge/edit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        badge: {
          ...badge,
          title: 'updated badge name',
          id: badge.id
        }
      })
    expect(res.status).toBe(200)
    expect(res.body.badge_instance).toBeDefined()
    expect(res.body.badge_instance.title).toBe('updated badge name')
  })
})
//yaha hai edited wla
describe('Test Item Routes', () => {
  it('should create item', async () => {
    const res = await request(app)
      .post('/admin/item/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        item: item
      })
    expect(res.status).toBe(200)
    expect(res.body.item_instance).toBeDefined()
    expect(res.body.item_instance.name).toBe(item.name)
    item.item_id = res.body.item_instance.id
  })

  it('should edit item', async () => {
    const res = await request(app)
      .post('/admin/item/edit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        item: {
          ...item,
          name: 'New Apefest Sandbox Avatar',
          id: item.item_id
        }
      })
    expect(res.status).toBe(200)
    expect(res.body.item_instance).toBeDefined()
    expect(res.body.item_instance.name).toBe('New Apefest Sandbox Avatar')
  })
})

describe('Confirm creations', () => {
  it('should fetch all items', async () => {
    const res = await request(app)
      .get('/admin/items')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.items).toBeDefined()
    expect(res.body.items.length).toBe(1)
  })

  it('should fetch all collections', async () => {
    const res = await request(app)
      .get('/admin/collections')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.collections).toBeDefined()
    expect(res.body.collections.length).toBe(1)
  })

  it('should fetch all owners', async () => {
    const res = await request(app)
      .get('/admin/owners')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.owners).toBeDefined()
    expect(res.body.owners.length).toBe(1)
  })
  it('should fetch all badges', async () => {
    const res = await request(app)
      .get('/admin/badges')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.badges).toBeDefined()
    expect(res.body.badges.length).toBe(1)
  })
})

describe('Test Deletions', () => {
  it('should delete item', async () => {
    const res = await request(app)
      .delete('/admin/item/delete')
      .set('Authorization', `Bearer ${token}`)
      .query({
        item_id: item.item_id
      })
    expect(res.status).toBe(200)
  })

  it('should delete collection', async () => {
    const res = await request(app)
      .delete('/admin/collection/delete')
      .set('Authorization', `Bearer ${token}`)
      .query({
        collection_id: item.collection_id
      })
    expect(res.status).toBe(200)
  })

  it('should delete owner', async () => {
    const res = await request(app)
      .delete('/admin/owner/delete')
      .set('Authorization', `Bearer ${token}`)
      .query({
        owner_id: collection.owner_id
      })
    expect(res.status).toBe(200)
  })
  it('should delete badge', async () => {
    const res = await request(app)
      .delete('/admin/badge/delete')
      .set('Authorization', `Bearer ${token}`)
      .query({
        badge_id: badge.id
      })
    expect(res.status).toBe(200)
  })
})

describe('Confirm deletions', () => {
  it('should fetch empty array of all items', async () => {
    const res = await request(app)
      .get('/admin/items')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.items).toBeDefined()
    expect(res.body.items.length).toBe(0)
  })

  it('should fetch empty array of all collections', async () => {
    const res = await request(app)
      .get('/admin/collections')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.collections).toBeDefined()
    expect(res.body.collections.length).toBe(0)
  })

  it('should fetch empty array of all owners', async () => {
    const res = await request(app)
      .get('/admin/owners')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.owners).toBeDefined()
    expect(res.body.owners.length).toBe(0)
  })
  it('should fetch empty array of all badges', async () => {
    const res = await request(app)
      .get('/admin/badges')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.badges).toBeDefined()
    expect(res.body.badges.length).toBe(0)
  })
})
