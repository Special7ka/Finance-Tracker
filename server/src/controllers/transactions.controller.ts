import { Request, Response, NextFunction } from 'express'
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from '../services/transactions.service'
import {
  validateCreateTransaction,
  validateGetTransaction,
  validateUpdateTransaction,
} from '../utils/transaction.validator'

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = (req as any).userId

  try {
    const { amount, type, occurredAt, categoryId } = validateCreateTransaction(
      req.body,
    )
    const transaction = await createTransaction(
      userId,
      type,
      occurredAt,
      amount,
      categoryId,
    )
    return res.status(201).json({ transaction })
  } catch (e) {
    return next(e)
  }
}

export const getTransactionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = (req as any).userId

  try {
    const filters = validateGetTransaction(req.query)
    const transactions = await getTransactions(userId, filters)
    return res.status(200).json({ transactions })
  } catch (e) {
    return next(e)
  }
}

export const updateTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = (req as any).userId
  const { id: transactionId } = req.params as { id: string }

  try {
    const data = validateUpdateTransaction(req.body)
    const transaction = await updateTransaction(userId, transactionId, data)
    return res.status(200).json({ transaction })
  } catch (e) {
    return next(e)
  }
}

export const deleteTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: transactionId } = req.params as { id: string }
  const userId = (req as any).userId

  try {
    await deleteTransaction(userId, transactionId)
    return res.status(204).send()
  } catch (e) {
    return next(e)
  }
}
