import { Router } from 'express'
import { verifyJWT } from '../middlewares/verifyJWT'
import { authorization } from '../middlewares/parseAuthorization'
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactions.service'
import {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateGetTransaction,
} from '../utils/transactionValidation'

const router = Router()

router.post('/', authorization, verifyJWT, async (req, res, next) => {
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
    next(e)
  }
})

router.get('/', authorization, verifyJWT, async (req, res, next) => {
  const userId = (req as any).userId

  try {
    const filters = validateGetTransaction(req.query)
    const transactions = await getTransactions(userId, filters)
    return res.status(200).json({ transactions })
  } catch (e) {
    next(e)
  }
})



router.patch('/:id', authorization, verifyJWT, async (req, res, next) => {
  const userId = (req as any).userId
  const { id: transactionId } = req.params as { id: string }

  try {
    const data = validateUpdateTransaction(req.body)
    const transaction = await updateTransaction(userId, transactionId, data)
    return res.status(200).json({ transaction })
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', authorization, verifyJWT, async (req, res, next) => {
  const transactionId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id
  const userId = (req as any).userId

  try {
    await deleteTransaction(userId, transactionId)
    return res.status(204).send()
  } catch (e) {
    next(e)
  }
})

export default router
