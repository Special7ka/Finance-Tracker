import { Router } from 'express'
import { authorization } from '../middlewares/parseAuthorization'
import { getPrisma } from '../db/prisma'
import { NotFoundError } from '../errors'

const router = Router()

router.get('/', authorization, async (req, res) => {
  const userId = req.userId
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
