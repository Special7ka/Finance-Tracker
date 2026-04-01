import { Router } from 'express'
import { register, login } from '../services/auth.service'

const router = Router()

router.post('/register', async (req, res, next) => {
  const { email, password } = req.body

  if (
    typeof email !== 'string' ||
    email.trim() === '' ||
    !email.includes('@')
  ) {
    res.status(400).json({ error: 'Invalid email' })
    return
  }

  if (typeof password !== 'string') {
    res.status(400).json({ error: 'Invalid password' })
    return
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' })
    return
  }

  try {
    const token = await register(email, password)
    
    return res.status(201).json({ token })
  } catch (e) {
    return next(e)
  }
})

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    email.trim() === '' ||
    password.trim() === ''
  ) {
    return res.status(400).json({ error: 'Invalid login or password' })
  }

  try {
    const token = await login(email, password)
    
    return res.status(200).json({ token })
  } catch (e) {
    return next(e)
  }
})

export default router
