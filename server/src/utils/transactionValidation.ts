import { TransactionType } from '@prisma/client'

interface CreateTransactionValidated {
  amount: number
  type: TransactionType
  occurredAt: Date
  categoryId?: string
}

interface UpdateTransactionValidated {
  amount?: number
  type?: TransactionType
  occurredAt?: Date
  categoryId?: string
}

export function validateCreateTransaction(
  body: unknown,
): CreateTransactionValidated {
  if (typeof body !== 'object' || body === null) {
    throw new Error('invalid body')
  }
  const data = body as {
    amount: unknown
    type: unknown
    occurredAt: unknown
    categoryId?: unknown
  }

  const { amount, type, occurredAt, categoryId } = data

  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('invalid amount')
  }

  if (typeof type !== 'string' || (type !== 'INCOME' && type !== 'EXPENSE')) {
    throw new Error('invalid type')
  }

  if (typeof occurredAt !== 'string' || occurredAt.trim() === '') {
    throw new Error('invalid occurredAt')
  }

  const occurredDate = new Date(occurredAt)

  if (Number.isNaN(occurredDate.getTime())) {
    throw new Error('invalid occurredAt')
  }

  if (categoryId !== undefined) {
    if (typeof categoryId !== 'string' || categoryId.trim() === '') {
      throw new Error('invalid categoryId')
    }
  }

  return {
    amount,
    type,
    occurredAt: occurredDate,
    categoryId,
  }
}

export function validateUpdateTransaction(
  body: unknown,
): UpdateTransactionValidated {
  if (typeof body !== 'object' || body === null) {
    throw new Error('invalid body')
  }

  const rawData = body as {
    amount?: unknown
    type?: unknown
    occurredAt?: unknown
    categoryId?: unknown
  }

  const { amount, type, occurredAt, categoryId } = rawData

  const data = {} as UpdateTransactionValidated

  if (amount !== undefined) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('invalid amount')
    }
    data.amount = amount
  }

  if (type !== undefined) {
    if (typeof type !== 'string' || (type !== 'INCOME' && type !== 'EXPENSE')) {
      throw new Error('invalid type')
    }
    data.type = type
  }

  if (occurredAt !== undefined) {
    if (typeof occurredAt !== 'string' || occurredAt.trim() === '') {
      throw new Error('invalid occurredAt')
    }

    const occurredDate = new Date(occurredAt)

    if (Number.isNaN(occurredDate.getTime())) {
      throw new Error('invalid occurredAt')
    }

    data.occurredAt = occurredDate
  }

  if (categoryId !== undefined) {
    if (typeof categoryId !== 'string' || categoryId.trim() === '') {
      throw new Error('invalid categoryId')
    }
    data.categoryId = categoryId
  }

  if (Object.keys(data).length === 0) {
    throw new Error('invalid data')
  }

  return data
}
