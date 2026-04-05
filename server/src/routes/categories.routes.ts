import { Router } from 'express'
import { authorization } from '../middlewares/parseAuthorization'
import {
  createCategoryController,
  getCategoryController,
  updateCategoriesController,
  deleteCategoryController,
} from '../controllers/categories.controller'

const router = Router()

router.post('/', authorization, createCategoryController)

router.get('/', authorization, getCategoryController)

router.patch('/:id', authorization, updateCategoriesController)

router.delete('/:id', authorization, deleteCategoryController)

export default router
