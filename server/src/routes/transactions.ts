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
  validateGetTransaction,
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

  try {
    const filters = validateGetTransaction(req.query)
    const transactions = await getTransactions(userId, filters)
    return res.status(200).json({ transactions })
  } catch (e) {
    if (e instanceof Error) {
      if (
        e.message === 'invalid type' ||
        e.message === 'invalid categoryId' ||
        e.message === 'invalid from' ||
        e.message === 'invalid to' ||
        e.message === 'invalid query'
      ) {
        return res.status(400).json({ error: e.message })
      }
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/:id', authorization, verifyJWT, async (req, res) => {
  const userId = (req as any).userId
  const { id: transactionId } = req.params as { id: string }

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
