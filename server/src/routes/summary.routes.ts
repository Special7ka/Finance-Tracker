import { Router } from 'express'
import { authorization } from '../middlewares/parseAuthorization'
import { getSummaryController } from '../controllers/summary.controller'
import { getSummaryByCategoryController } from '../controllers/summary.controller'

const router = Router()

router.get('/', authorization, getSummaryController)

router.get('/by-category', authorization, getSummaryByCategoryController)

export default router
