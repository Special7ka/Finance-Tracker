import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

let prisma: PrismaClient | null = null

export function getPrisma() {
  if (prisma) return prisma
  let url = process.env.DATABASE_URL

  if (process.env.NODE_ENV === 'test') {
    url = process.env.DATABASE_URL_TEST
  }
  console.log('Using DB:', url)

  if (!url) {
    throw new Error(
      'DATABASE URL is missing. Check your .env and dotenv loading.',
    )
  }

  const adapter = new PrismaPg({ connectionString: url })

  prisma = new PrismaClient({ adapter })

  return prisma
}
