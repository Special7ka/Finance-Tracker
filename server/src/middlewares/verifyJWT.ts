import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors'

interface AuthPayload {
  userId: string
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = (req as any).token
  if (!token) {
    throw new UnauthorizedError('Unauthorized')
  }
  const JWT = process.env.JWT_SECRET as string

  try {
    const decoded = jwt.verify(token, JWT) as AuthPayload

    ;(req as any).userId = decoded.userId
    next()
  } catch (e) {
    throw new UnauthorizedError('Unauthorized')
  }
}
