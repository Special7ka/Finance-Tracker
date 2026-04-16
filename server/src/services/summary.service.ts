import { Prisma } from '@prisma/client'
import { getPrisma } from '../db/prisma'
import { GetSummaryValidated, SummaryByCategoryItem } from '../types/summary'


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

export const getSummaryByCategory = async (userId: string): Promise<SummaryByCategoryItem[]> => {
  const prisma = getPrisma()
  const where: Prisma.TransactionWhereInput = {
    userId: userId,
    type: 'EXPENSE',
  }

  const userTransactionsByCategory = await prisma.transaction.groupBy({
    by: ['categoryId'],
    _sum: {
      amount: true,
    },
    where,
  })

  const userCategory = await prisma.category.findMany({where:{
    userId:userId,
  }})

  const mapCategory:Record<string,string> = {}

  userCategory.forEach((category) =>{
    mapCategory[category.id] = category.name
  })
  

  return userTransactionsByCategory.map((item) => {
    const name = item.categoryId !== null ? mapCategory[item.categoryId] ?? "Unknown" : "Uncategorized"

    return {
      categoryId: item.categoryId,
      amount: item._sum.amount ?? 0,
      name: name,
    }
  })
}
