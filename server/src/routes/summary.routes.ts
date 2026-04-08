import { Router } from 'express'
import { authorization } from '../middlewares/parseAuthorization'
import { getSummaryController } from '../controllers/summary.controller'

const router = Router()

router.get('/', authorization, getSummaryController)

export default router
