import { describe, it, expect } from 'bun:test'

import env_vars from '../library/env_vars'

/**
 * This is a simple test to check if the testing environment is working
 * It also checks if all environment variables are set
 */

describe('Hello Tests', () => {
  it('initializes testing', () => {
    expect(true).toBe(true)
  })
})

describe('Test if all environment variables are set', () => {
  it('checks if all environment variables are set', () => {
    env_vars.forEach(variable => {
      expect(process.env[variable]).toBeDefined()
    })
  })
})
