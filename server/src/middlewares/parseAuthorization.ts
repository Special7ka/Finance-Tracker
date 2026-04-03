import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../errors'

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeaders = req.headers.authorization

  if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
    throw new UnauthorizedError('Unauthorized')
  }

  const token = authHeaders.split(' ')[1]
  if (!token) {
    throw new UnauthorizedError('Unauthorized')
  }
  ;(req as any).token = token

  next()

  return
}
