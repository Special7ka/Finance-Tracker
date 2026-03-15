import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let message = 'Internal server error'
  console.error(err)
  if (err instanceof Error) console.error(err.stack)
  res.status(500).json({ error: message })
}
