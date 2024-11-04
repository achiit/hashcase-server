import { describe, it, expect, beforeAll } from 'bun:test'
import request from 'supertest'

import app from '../../app'
import {
  getOwnerById,
  getOwnerByEmail,
  updateOwnerById,
  updateOwnerByEmail,
  deleteOwnerById,
  deleteOwnerByEmail
} from '../../controllers/owner'

const owner = {
  email: 'owner@test.com',
  password: 'password',
  id: 0
}

let token = ''

beforeAll(async () => {
  const res0 = await request(app).post('/auth/admin/login').send({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  })
  token = res0.body.token
  const res = await request(app)
    .post('/admin/owner/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      owner: owner
    })
  owner.id = res.body.owner_instance.id
})

describe('Owner Service', () => {
  it('retrieves an owner by id', async () => {
    const foundOwner = await getOwnerById(owner.id)
    expect(foundOwner).not.toBeNull()
    expect(foundOwner?.email).toBe(owner.email)
  })

  it('retrieves an owner by email', async () => {
    const foundOwner = await getOwnerByEmail(owner.email)
    expect(foundOwner).not.toBeNull()
    expect(foundOwner?.id).toBe(owner.id)
  })

  it('updates an owner by id', async () => {
    const newEmail = 'updates@test.com'
    const updatedOwner = await updateOwnerById(owner.id, {
      email: newEmail
    })
    expect(updatedOwner.email).toBe(newEmail)
    owner.email = updatedOwner.email
  })

  it('updates an owner by email', async () => {
    const newEmail = 'updated@test.com'
    const updatedOwner = await updateOwnerByEmail(owner.email, {
      email: newEmail
    })
    expect(updatedOwner.email).toBe(newEmail)
  })

  it('deletes an owner by id', async () => {
    await deleteOwnerById(owner.id)
    const foundOwner = await getOwnerById(owner.id, false)
    expect(foundOwner).toBeNull()
  })

  it('deletes an owner by email', async () => {
    await request(app)
      .post('/admin/owner/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        owner: owner
      })
    await deleteOwnerByEmail(owner.email)
    const foundOwner = await getOwnerByEmail(owner.email, false)
    expect(foundOwner).toBeNull()
  })
})
