import { Router } from 'express'
import { register, login } from '../services/auth.service'
import { validateRegistrationBody,validateLoginBody } from '../utils/authValidation'

const router = Router()

router.post('/register', async (req, res, next) => {
  try {
    const {email, password} = validateRegistrationBody(req.body)
    const token = await register(email, password)
    
    return res.status(201).json({ token })
  } catch (e) {
    return next(e)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = validateLoginBody(req.body)
    const token = await login(email, password)
    
    return res.status(200).json({ token })
  } catch (e) {
    return next(e)
  }
})

export default router
