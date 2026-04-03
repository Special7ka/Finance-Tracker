import { Router } from 'express'
import { authorization } from '../middlewares/parseAuthorization'
import { verifyJWT } from '../middlewares/verifyJWT'
import { getPrisma } from '../db/prisma'
import { NotFoundError } from '../errors'

const router = Router()

router.get('/', authorization, verifyJWT, async (req, res) => {
  const userId = (req as any).userId
  const prisma = getPrisma()

  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
    },
  })

  if (!userInfo) {
    throw new NotFoundError('User not found')
  }
  return res.json(userInfo)
})

export default router
