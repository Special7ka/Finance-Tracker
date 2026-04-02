import { Router } from 'express'
import { verifyJWT } from '../middlewares/verifyJWT'
import { authorization } from '../middlewares/parseAuthorization'
import {
  createCategoryController,
  getCategoryController,
  updateCategoriesController,
  deleteCategoryController,
} from '../controllers/categories.controller'

const router = Router()

router.post('/', authorization, verifyJWT, createCategoryController)

router.get('/', authorization, verifyJWT, getCategoryController)

router.patch('/:id', authorization, verifyJWT, updateCategoriesController)

router.delete('/:id', authorization, verifyJWT, deleteCategoryController)

export default router
