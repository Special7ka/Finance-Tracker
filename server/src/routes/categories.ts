import { Router } from 'express'
import { verifyJWT } from '../middlewares/verifyJWT'
import { authorization } from '../middlewares/parseAuthorization'
import {
  getCategoriesByUserId,
  updateCategory,
  createCategory,
  deleteCategory,
} from '../services/categories.service'

const router = Router()

router.post('/', authorization, verifyJWT, async (req, res, next) => {
  const userId = (req as any).userId
  const name = req.body.name

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'invalid name' })
  }
  try {
    const newCategory = await createCategory(userId, name)
    return res
      .status(201)
      .json({ message: 'successfully created', category: newCategory })
  } catch (e) {
    return next(e)
  }
})

router.get('/', authorization, verifyJWT, async (req, res,next) => {
  const userId = (req as any).userId
  try{
    const categories = await getCategoriesByUserId(userId)
    return res.json(categories)
  }catch(e){
    return next(e)
  }

})

router.patch('/:id', authorization, verifyJWT, async (req, res, next) => {
  const userId = (req as any).userId
  const categoryID = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id
  const name = req.body.name

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'invalid name' })
  }

  try {
    const newCategory = await updateCategory(userId, categoryID, name)
    return res
      .status(200)
      .json({ message: 'successfully updated', category: newCategory })
  } catch (e) {
     return next(e)
    }
  })

router.delete('/:id', authorization, verifyJWT, async (req, res, next) => {
  const userId = (req as any).userId
  const categoryID = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id

  try {
    await deleteCategory(userId, categoryID)
    return res.status(204).send()
  } catch (e) {
    return next(e)
  }
})
export default router
