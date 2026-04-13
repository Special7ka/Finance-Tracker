import { Request, Response, NextFunction } from 'express'
import { getSummary } from '../services/summary.service'

export const getSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId!

  try {
    const userStatement  = await getSummary(userId)
    return res.status(200).json(userStatement)
  } catch(e){
    next(e)
  }
}
