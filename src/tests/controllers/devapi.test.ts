import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import request from 'supertest'

import app from '../../app'
import {
  createDevAPI,
  getDevAPIById,
  getDevAPIByKey,
  getDevAPIKeysByOwnerId,
  updateDevAPIById,
  updateDevAPIByKey,
  deleteDevAPIById,
  deleteDevAPIByKey
} from '../../controllers/devapi'
import { deleteOwnerByEmail } from '../../controllers/owner'

const owner = {
  email: 'owner@test.com',
  password: 'password',
  id: 0
}

const devapi = {
  id: 0,
  owner_id: 0,
  api_key: 'test-api-key'
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
  owner.id = res.body.owner_instance.id
  devapi.owner_id = owner.id
})

afterAll(async () => {
  await deleteOwnerByEmail(owner.email)
})

describe('DevAPI Service', () => {
  it('creates a dev api key', async () => {
    const [devapi_instance] = await createDevAPI(devapi)
    expect(devapi_instance).not.toBeNull()
    expect(devapi.owner_id).toBe(owner.id)
    devapi.id = devapi_instance.id
  })

  it('retrieves a dev api key by id', async () => {
    const foundDevAPI = await getDevAPIById(devapi.id)
    expect(foundDevAPI).not.toBeNull()
    expect(foundDevAPI?.api_key).toBe(devapi.api_key)
  })

  it('retrieves a dev api key by api key', async () => {
    const foundDevAPI = await getDevAPIByKey(devapi.api_key)
    expect(foundDevAPI).not.toBeNull()
    expect(foundDevAPI.id).toBe(devapi.id)
  })

  it('retrieves dev api keys by owner id', async () => {
    const foundDevAPIKeys = await getDevAPIKeysByOwnerId(owner.id)
    expect(foundDevAPIKeys).not.toBeNull()
    expect(foundDevAPIKeys.length).toBe(2)
  })

  it('updates a dev api key by id', async () => {
    const devapi_instance = await updateDevAPIById(devapi.id, {
      api_key: 'updated'
    })
    expect(devapi_instance).not.toBeNull()
    expect(devapi_instance.api_key).toBe('updated')
    devapi.api_key = 'updated'
  })

  it('updates a dev api key by api key', async () => {
    const devapi_instance = await updateDevAPIByKey(devapi.api_key, {
      api_key: 'updated again'
    })
    expect(devapi_instance).not.toBeNull()
    expect(devapi_instance.api_key).toBe('updated again')
    devapi.api_key = 'updated again'
  })

  it('deletes a dev api key by id', async () => {
    await deleteDevAPIById(devapi.id)
    const foundDevAPI = await getDevAPIById(devapi.id, false)
    expect(foundDevAPI).toBeNull()
  })

  it('deletes a dev api key by api key', async () => {
    const [devapi_instance] = await createDevAPI(devapi)
    await deleteDevAPIByKey(devapi_instance.api_key)
    const foundDevAPI = await getDevAPIByKey(devapi.api_key, false)
    expect(foundDevAPI).toBeNull()
  })
})
