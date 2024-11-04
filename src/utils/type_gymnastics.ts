import { Response, NextFunction } from 'express'

import { OwnerRequest, UserRequest } from '../types/expressTypes'

const inferUserAndOwnerRequest = (
  req: UserRequest & OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  next()
}

export default inferUserAndOwnerRequest
