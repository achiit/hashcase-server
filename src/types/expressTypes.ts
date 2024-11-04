import { Request } from 'express'

type UserRequest = Request & {
  query: {
    user_id: string
  }
}

type OwnerRequest = Request & {
  query: {
    owner_id: string
  }
}

export { UserRequest, OwnerRequest }
