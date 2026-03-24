import { getPrisma } from '../db/prisma'
import { TransactionType } from '@prisma/client'

export async function createTransaction(
  userId: string,
  type: TransactionType,
  occurredAt: Date,
  amount: number,
  categoryId?: string,
) {
  const prisma = getPrisma()

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (userId !== category?.userId) {
      throw new Error('Category not found')
    }
  }

  const newTransaction = await prisma.transaction.create({
    data: {
      userId: userId,
      type: type,
      occurredAt: occurredAt,
      categoryId: categoryId,
      amount: amount,
    },
  })

  return newTransaction
}

export async function getTransactions(
  userId: string,
  query: { type?: TransactionType; categoryId?: string },
) {
  const prisma = getPrisma()
  let where: { userId: string; type?: TransactionType; categoryId?: string } = {
    userId: userId,
  }

  if (query.type) {
    where.type = query.type
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
  data: any,
) {
  const prisma = getPrisma()

  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
  })
  if (data.categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    })
    if (category?.userId !== userId) {
      throw new Error('Category not found')
    }
  }

  if (!transaction || transaction.userId !== userId) {
    throw new Error('Transaction not found')
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
    throw new Error('Transaction not found')
  }
}
