import { Request, Response, NextFunction } from 'express'
import { getSummary } from '../services/summary.service'
import { validateGetSummary } from '../utils/summary.validator'
import { getSummaryByCategory } from '../services/summary.service'

export const getSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId!

  try {
    const filters = validateGetSummary(req.query)
    const userStatement = await getSummary(userId, filters)
    return res.status(200).json(userStatement)
  } catch (e) {
    return next(e)
  }
}

export const getSummaryByCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId!

  try {
    const filters = validateGetSummary(req.query)
    const userStatementByCategory = await getSummaryByCategory(userId, filters)
    return res.status(200).json(userStatementByCategory)
  } catch (e) {
    return next(e)
  }
}
