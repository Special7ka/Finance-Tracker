import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors'

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message })
  }

  return res.status(500).json({ error: 'Internal server error' })
}
