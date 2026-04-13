import { getPrisma } from '../db/prisma'
import { Prisma, PrismaClient, TransactionType } from '@prisma/client'
import { NotFoundError } from '../errors'
import {
  GetTransactionValidated,
  UpdateTransactionValidated,
  CreateTransactionValidated,
} from '../types/transactions'

export async function createTransaction(
  userId: string,
  data: CreateTransactionValidated,
) {
  const prisma = getPrisma()

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    })

    if (userId !== category?.userId) {
      throw new NotFoundError('Category not found')
    }
  }

  const newTransaction = await prisma.transaction.create({
    data: {
      userId: userId,
      type: data.type,
      occurredAt: data.occurredAt,
      categoryId: data.categoryId,
      amount: data.amount,
    },
  })

  return newTransaction
}

export async function getTransactions(
  userId: string,
  query: GetTransactionValidated,
) {
  const prisma = getPrisma()
  const where: Prisma.TransactionWhereInput = {
    userId: userId,
  }

  const dateFilter: Prisma.DateTimeFilter = {}

  if (query.from !== undefined) {
    dateFilter.gte = query.from
  }
  if (query.to !== undefined) {
    dateFilter.lte = query.to
  }

  if (query.type !== undefined) {
    where.type = query.type
  }

  if (query.from !== undefined || query.to !== undefined) {
    where.occurredAt = dateFilter
  }

  if (query.categoryId !== undefined) {
    where.categoryId = query.categoryId
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: {
      occurredAt: 'desc',
    },
  })

  return transactions
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: UpdateTransactionValidated,
) {
  const prisma = getPrisma()

  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
  })

  if (!transaction || transaction.userId !== userId) {
    throw new NotFoundError('Transaction not found')
  }

  if (data.categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    })
    if (category?.userId !== userId) {
      throw new NotFoundError('Category not found')
    }
  }

  const newTransaction = await prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: data,
  })

  return newTransaction
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const prisma = getPrisma()

  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      userId: userId,
      id: transactionId,
    },
  })

  if (existingTransaction) {
    await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    })
    return
  } else {
    throw new NotFoundError('Transaction not found')
  }
}
