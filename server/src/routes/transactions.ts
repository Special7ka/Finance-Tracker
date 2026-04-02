import { Router } from 'express'
import { verifyJWT } from '../middlewares/verifyJWT'
import { authorization } from '../middlewares/parseAuthorization'
import {
  createTransactionController,
  getTransactionsController,
  updateTransactionController,
  deleteTransactionController,
} from '../controllers/transactions.controller'

const router = Router()

router.post('/', authorization, verifyJWT, createTransactionController)

router.get('/', authorization, verifyJWT, getTransactionsController)

router.patch('/:id', authorization, verifyJWT, updateTransactionController)

router.delete('/:id', authorization, verifyJWT, deleteTransactionController)

export default router
