import { Router } from 'express'
import { verifyJWT } from '../middlewares/verifyJWT'
import { authorization } from '../middlewares/parseAuthorization'
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactions.service'
import { json } from 'node:stream/consumers'

const router = Router()

router.post('/', authorization, verifyJWT, async (req, res) => {
  const userId = (req as any).userId
  const { amount, type, occurredAt, categoryId } = req.body
  const occurredDate = new Date(occurredAt)

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'invalid amount' })
  }
  if (
    !type ||
    typeof type !== 'string' ||
    (type !== 'INCOME' && type !== 'EXPENSE') ||
    type.trim() === ''
  ) {
    return res.status(400).json({ error: 'invalid type' })
  }
  if (Number.isNaN(occurredDate.getTime())) {
    return res.status(400).json({ error: 'invalid occurredAt' })
  }
  if (categoryId) {
    if (typeof categoryId !== 'string' || categoryId.trim() === '') {
      return res.status(400).json({ error: 'invalid category id' })
    }
  }

  try {
    const transaction = await createTransaction(
      userId,
      type,
      occurredDate,
      amount,
      categoryId,
    )
    return res.status(201).json({ transaction })
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Category not found') {
        return res.status(404).json({ error: e.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
    return
  }
})

router.get('/', authorization, verifyJWT, async (req, res) => {
  const userId = (req as any).userId
  const transactions = await getTransactions(userId)

  return res.status(200).json({ transactions })
})

router.patch('/:id', authorization, verifyJWT, async (req, res) => {
  const userId = (req as any).userId
  const { amount, type, occurredAt, categoryId } = req.body
  const transactionId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id

  const data: any = {}

  if (amount !== undefined) {
    if (amount < 1) {
      res.status(400).json({ error: 'invalid amount' })
      return
    }
    data.amount = amount
  }
  if (type !== undefined) {
    if (type !== 'INCOME' && type !== 'EXPENSE') {
      res.status(400).json({ error: 'invalid type' })
      return
    }
    data.type = type
  }
  if (occurredAt !== undefined) {
    const occurredDate = new Date(occurredAt)
    if (Number.isNaN(occurredDate.getTime())) {
      res.status(400).json({ error: 'invalid occurredAt' })
      return
    }
    data.occurredAt = occurredDate
  }
  if (categoryId !== undefined) {
    if (categoryId === '') {
      res.status(400).json({ error: 'invalid categoryId' })
      return
    }
    data.categoryId = categoryId
  }

  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: 'invalid data' })
    return
  }

  try {
    const transaction = await updateTransaction(userId, transactionId, data)
    return res.status(200).json({ transaction })
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Transaction not found') {
        res.status(404).json({ error: 'Transaction not found' })
        return
      }
      if (e.message === 'Category not found') {
        res.status(404).json({ error: 'Category not found' })
        return
      }
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', authorization, verifyJWT, async (req, res) => {})

export default router
