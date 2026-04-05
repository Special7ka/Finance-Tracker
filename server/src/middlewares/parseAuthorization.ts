import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../errors'
import jwt from 'jsonwebtoken'

interface AuthPayload {
  userId: string
}

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
  const JWT = process.env.JWT_SECRET as string

  try {
    const decoded = jwt.verify(token, JWT) as AuthPayload

    req.userId = decoded.userId
    next()
  } catch (e) {
    throw new UnauthorizedError('Unauthorized')
  }
}
