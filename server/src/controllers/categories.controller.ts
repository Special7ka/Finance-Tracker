import { Request, Response, NextFunction } from 'express'
import {
  createCategory,
  getCategoriesByUserId,
  updateCategory,
  deleteCategory,
} from '../services/categories.service'
import { BadRequestError } from '../errors'
import {
  validateCreateCategory,
  validateUpdateCategory,
} from '../utils/categories.validator'

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId!

  try {
    const data = validateCreateCategory(req.body)
    const newCategory = await createCategory(userId, data)
    return res
      .status(201)
      .json({ message: 'successfully created', category: newCategory })
  } catch (e) {
    return next(e)
  }
}

export const getCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId!
  try {
    const categories = await getCategoriesByUserId(userId)
    return res.json(categories)
  } catch (e) {
    return next(e)
  }
}

export const updateCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId!
  const { id: categoryID } = req.params as { id: string }

  try {
    const data = validateUpdateCategory(req.body)
    const newCategory = await updateCategory(userId, categoryID, data)
    return res
      .status(200)
      .json({ message: 'successfully updated', category: newCategory })
  } catch (e) {
    return next(e)
  }
}

export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId!
  const { id: categoryID } = req.params as { id: string }

  try {
    await deleteCategory(userId, categoryID)
    return res.status(204).send()
  } catch (e) {
    return next(e)
  }
}
