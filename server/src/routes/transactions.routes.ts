import { Router } from 'express'
import { authorization } from '../middlewares/parseAuthorization'
import {
  createTransactionController,
  getTransactionsController,
  updateTransactionController,
  deleteTransactionController,
} from '../controllers/transactions.controller'

const router = Router()

router.post('/', authorization, createTransactionController)

router.get('/', authorization, getTransactionsController)

router.patch('/:id', authorization, updateTransactionController)

router.delete('/:id', authorization, deleteTransactionController)

export default router
