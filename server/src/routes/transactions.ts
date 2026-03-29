import { Router } from 'express'
import { verifyJWT } from '../middlewares/verifyJWT'
import { authorization } from '../middlewares/parseAuthorization'
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactions.service'
import { TransactionType } from '@prisma/client'
import {
  validateCreateTransaction,
  validateUpdateTransaction,
} from '../utils/transactionValidation'

const router = Router()

router.post('/', authorization, verifyJWT, async (req, res) => {
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
    if (e instanceof Error) {
      if (e.message === 'Category not found') {
        return res.status(404).json({ error: e.message })
      }
      if (
        e.message === 'invalid amount' ||
        e.message === 'invalid body' ||
        e.message === 'invalid type' ||
        e.message === 'invalid occurredAt' ||
        e.message === 'invalid categoryId'
      ) {
        return res.status(400).json({ error: e.message })
      }
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/', authorization, verifyJWT, async (req, res) => {
  const userId = (req as any).userId

  const rawType = Array.isArray(req.query.type)
    ? req.query.type[0]
    : req.query.type
  let type: TransactionType | undefined

  if (rawType !== undefined) {
    if (rawType !== 'INCOME' && rawType !== 'EXPENSE') {
      return res.status(400).json({ error: 'Invalid type' })
    }
    type = rawType as TransactionType
  }

  const categoryId = Array.isArray(req.query.categoryId)
    ? req.query.categoryId[0]
    : req.query.categoryId

  if (categoryId !== undefined) {
    if (typeof categoryId !== 'string' || categoryId.trim() === '') {
      return res.status(400).json({ error: 'Invalid categoryId' })
    }
  }

  const rawFrom = Array.isArray(req.query.from)
    ? req.query.from[0]
    : req.query.from
  let from: Date | undefined

  if (rawFrom !== undefined) {
    if (typeof rawFrom !== 'string' || rawFrom.trim() === '') {
      return res.status(400).json({ error: 'Invalid from' })
    }
    from = new Date(rawFrom)
    if (Number.isNaN(from.getTime())) {
      return res.status(400).json({ error: 'Invalid from' })
    }
  }

  const rawTo = Array.isArray(req.query.to) ? req.query.to[0] : req.query.to
  let to: Date | undefined

  if (rawTo !== undefined) {
    if (typeof rawTo !== 'string' || rawTo.trim() === '') {
      return res.status(400).json({ error: 'Invalid to' })
    }
    to = new Date(rawTo)
    if (Number.isNaN(to.getTime())) {
      return res.status(400).json({ error: 'Invalid from' })
    }
  }

  const transactions = await getTransactions(userId, {
    type,
    categoryId,
    from,
    to,
  })

  return res.status(200).json({ transactions })
})

router.patch('/:id', authorization, verifyJWT, async (req, res) => {
  const userId = (req as any).userId
  const transactionId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id

  try {
    const data = validateUpdateTransaction(req.body)
    const transaction = await updateTransaction(userId, transactionId, data)
    return res.status(200).json({ transaction })
  } catch (e) {
    if (e instanceof Error) {
      if (
        e.message === 'Transaction not found' ||
        e.message === 'Category not found'
      ) {
        res.status(404).json({ error: e.message })
        return
      }
      if (
        e.message === 'invalid amount' ||
        e.message === 'invalid body' ||
        e.message === 'invalid type' ||
        e.message === 'invalid occurredAt' ||
        e.message === 'invalid categoryId' ||
        e.message === 'invalid data'
      ) {
        return res.status(400).json({ error: e.message })
      }
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', authorization, verifyJWT, async (req, res) => {
  const transactionId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id
  const userId = (req as any).userId

  try {
    await deleteTransaction(userId, transactionId)
    return res.status(204).send()
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Transaction not found') {
        res.status(404).json({ error: 'Transaction not found' })
        return
      }
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
