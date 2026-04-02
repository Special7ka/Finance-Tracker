import { Request, Response, NextFunction } from 'express'
import { register, login } from '../services/auth.service'
import {
  validateRegistrationBody,
  validateLoginBody,
} from '../utils/auth.validators'

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = validateRegistrationBody(req.body)
    const token = await register(email, password)

    return res.status(201).json({ token })
  } catch (e) {
    return next(e)
  }
}

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = validateLoginBody(req.body)
    const token = await login(email, password)

    return res.status(200).json({ token })
  } catch (e) {
    return next(e)
  }
}
