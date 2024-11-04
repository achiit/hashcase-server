import { describe, it, expect } from 'bun:test'

import {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByEmail,
  getUserByETHWalletAddress,
  getUserByFVMWalletAddress,
  updateUserByEmail,
  deleteUserByEmail
} from '../../controllers/user'

describe('User Service', () => {
  const userDetails = {
    email: 'user@test.com',
    eth_wallet_address: '0x...',
    fvm_wallet_address: 'fvm...'
  }
  let id: number
  it('creates a new user', async () => {
    const [user_instance] = await createUser(userDetails)
    expect(user_instance.email).toBe(userDetails.email)
    id = user_instance.id
  })

  it('retrieves a user by id', async () => {
    const foundUser = await getUserById(id)
    expect(foundUser).not.toBeNull()
    expect(foundUser?.email).toBe(userDetails.email)
  })

  it('retrieves a user by email', async () => {
    const foundUser = await getUserByEmail(userDetails.email)
    expect(foundUser).not.toBeNull()
    expect(foundUser?.email).toBe(userDetails.email)
  })

  it('retrieves a user by Ethereum wallet address', async () => {
    const foundUser = await getUserByETHWalletAddress(
      userDetails.eth_wallet_address
    )
    expect(foundUser).not.toBeNull()
    expect(foundUser?.eth_wallet_address).toBe(userDetails.eth_wallet_address)
  })

  it('retrieves a user by FVM wallet address', async () => {
    const foundUser = await getUserByFVMWalletAddress(
      userDetails.fvm_wallet_address
    )
    expect(foundUser).not.toBeNull()
    expect(foundUser?.fvm_wallet_address).toBe(userDetails.fvm_wallet_address)
  })

  it('updates a user by id', async () => {
    const updatedEmail = 'updatesUser@test.com'
    await updateUserById(id, { email: updatedEmail })
    const updatedUser = await getUserById(id)
    expect(updatedUser).not.toBeNull()
    expect(updatedUser?.email).toBe(updatedEmail)
    userDetails.email = updatedEmail
  })

  it('updates a user by email', async () => {
    const updatedEmail = 'updatedUser@test.com'
    await updateUserByEmail(userDetails.email, { email: updatedEmail })
    const updatedUser = await getUserById(id)
    expect(updatedUser).not.toBeNull()
    expect(updatedUser?.email).toBe(updatedEmail)
  })

  it('deletes a user by id', async () => {
    await deleteUserById(id)
    const foundUser = await getUserById(id, false)
    expect(foundUser).toBeNull()
  })

  it('deletes a user by email', async () => {
    const [user_instance] = await createUser(userDetails)
    await deleteUserByEmail(userDetails.email)
    const foundUser = await getUserById(user_instance.id, false)
    expect(foundUser).toBeNull()
  })
})
