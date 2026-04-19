import { Prisma } from '@prisma/client'
import { getPrisma } from '../db/prisma'
import { GetSummaryValidated, SummaryByCategoryItem } from '../types/summary'
import { TransactionType } from '@prisma/client'

export const getSummary = async (
  userId: string,
  filters: GetSummaryValidated,
) => {
  const prisma = getPrisma()

  const where: Prisma.TransactionWhereInput = {
    userId: userId,
  }

  const dateFilter: Prisma.DateTimeFilter = {}

  if (filters.from !== undefined) {
    dateFilter.gte = filters.from
  }
  if (filters.to !== undefined) {
    dateFilter.lte = filters.to
  }
  if (dateFilter.lte !== undefined || dateFilter.gte !== undefined) {
    where.occurredAt = dateFilter
  }

  const userTransactions = await prisma.transaction.findMany({ where })

  let income = 0,
    expense = 0

  userTransactions.forEach((transaction) => {
    if (transaction.type === 'INCOME') {
      income += transaction.amount
    } else if (transaction.type === 'EXPENSE') {
      expense += transaction.amount
    }
  })

  const balance = income - expense

  return { expense, income, balance }
}

export const getSummaryByCategory = async (
  userId: string,
  filters: GetSummaryValidated,
): Promise<SummaryByCategoryItem[]> => {
  const prisma = getPrisma()
  const where: Prisma.TransactionWhereInput = {
    userId: userId,
    type: filters.type ?? 'EXPENSE',
  }

  const userTransactionsByCategory = await prisma.transaction.groupBy({
    by: ['categoryId'],
    _sum: {
      amount: true,
    },
    where,
  })

  let total = 0

  userTransactionsByCategory.forEach((category) => {
    total += category._sum.amount ?? 0
  })

  const userCategory = await prisma.category.findMany({
    where: {
      userId: userId,
    },
  })

  const mapCategory: Record<string, string> = {}

  userCategory.forEach((category) => {
    mapCategory[category.id] = category.name
  })

  return userTransactionsByCategory.map((item) => {
    const name =
      item.categoryId !== null
        ? (mapCategory[item.categoryId] ?? 'Unknown')
        : 'Uncategorized'
    const amount = item._sum.amount ?? 0

    return {
      categoryId: item.categoryId,
      amount: amount,
      name: name,
      percentage: total ? (amount * 100) / total : 0,
    }
  })
}
