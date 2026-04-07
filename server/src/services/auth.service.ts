import { getPrisma } from '../db/prisma'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import { DEFAULT_CATEGORIES } from '../constants/defaultCategories'
import { UnauthorizedError, ConflictError } from '../errors'
import { UserCredentials } from '../types/auth'

export async function register(data: UserCredentials): Promise<string> {
  const prisma = getPrisma()
  const user = await prisma.user.findUnique({ where: { email: data.email } })
  const userCategories = new Array()
  const cryptPass = await bcrypt.hash(data.password, 10)

  if (user) {
    throw new ConflictError('User already exists')
  }

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: cryptPass,
    },
  })

  if (process.env.JWT_SECRET === undefined) {
    throw new UnauthorizedError('JWT undefined')
  }

  for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
    userCategories[i] = { name: DEFAULT_CATEGORIES[i].name, userId: newUser.id }
  }

  await prisma.category.createMany({
    data: userCategories,
  })

  const secret = process.env.JWT_SECRET
  const token = jsonwebtoken.sign({ userId: newUser.id }, secret, {
    expiresIn: '7d',
  })

  return token
}

export async function login(data: UserCredentials): Promise<string> {
  const prisma = getPrisma()
  const user = await prisma.user.findUnique({ where: { email: data.email } })

  if (!user) {
    throw new UnauthorizedError('Invalid credentials')
  }

  const verif = await bcrypt.compare(data.password, user.passwordHash)

  if (!verif) {
    throw new UnauthorizedError('Invalid credentials')
  }

  if (process.env.JWT_SECRET === undefined) {
    throw new UnauthorizedError('JWT undefined')
  }
  const secret = process.env.JWT_SECRET
  const token = jsonwebtoken.sign({ userId: user.id }, secret, {
    expiresIn: '7d',
  })

  return token
}
