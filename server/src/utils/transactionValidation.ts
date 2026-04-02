import { TransactionType } from '@prisma/client'
import { BadRequestError } from '../errors'

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

interface GetTransactionValidated {
  type?: TransactionType
  categoryId?: string
  from?: Date
  to?: Date
}

const getFirstQueryValue = (value: unknown) => {
  return Array.isArray(value) ? value[0] : value
}

export function validateCreateTransaction(
  body: unknown,
): CreateTransactionValidated {
  if (typeof body !== 'object' || body === null) {
    throw new BadRequestError('Invalid body')
  }
  const data = body as {
    amount: unknown
    type: unknown
    occurredAt: unknown
    categoryId?: unknown
  }

  const { amount, type, occurredAt, categoryId } = data

  if (typeof amount !== 'number' || amount <= 0) {
    throw new BadRequestError('Invalid amount')
  }

  if (typeof type !== 'string' || (type !== 'INCOME' && type !== 'EXPENSE')) {
    throw new BadRequestError('Invalid type')
  }

  if (typeof occurredAt !== 'string' || occurredAt.trim() === '') {
    throw new BadRequestError('Invalid occurredAt')
  }

  const occurredDate = new Date(occurredAt)

  if (Number.isNaN(occurredDate.getTime())) {
    throw new BadRequestError('Invalid occurredAt')
  }

  if (categoryId !== undefined) {
    if (typeof categoryId !== 'string' || categoryId.trim() === '') {
      throw new BadRequestError('Invalid categoryId')
    }
  }

  return {
    amount,
    type,
    occurredAt: occurredDate,
    categoryId,
  }
}

export function validateGetTransaction(
  query: unknown,
): GetTransactionValidated {
  const data: GetTransactionValidated = {}

  if (typeof query !== 'object' || query === null) {
    throw new BadRequestError('Invalid query')
  }

  const q = query as {
    type?: unknown
    categoryId?: unknown
    from?: unknown
    to?: unknown
  }

  const type = getFirstQueryValue(q.type)
  const categoryId = getFirstQueryValue(q.categoryId)
  const from = getFirstQueryValue(q.from)
  const to = getFirstQueryValue(q.to)

  if (type !== undefined) {
    if (typeof type !== 'string' || (type !== 'INCOME' && type !== 'EXPENSE')) {
      throw new BadRequestError('Invalid type')
    }
    data.type = type
  }

  if (categoryId !== undefined) {
    if (typeof categoryId !== 'string' || categoryId.trim() === '') {
      throw new BadRequestError('Invalid categoryId')
    }
    data.categoryId = categoryId
  }

  if (from !== undefined) {
    if (typeof from !== 'string' || from.trim() === '') {
      throw new BadRequestError('Invalid from')
    }

    const fromDate = new Date(from)

    if (Number.isNaN(fromDate.getTime())) {
      throw new BadRequestError('Invalid from')
    }

    data.from = fromDate
  }

  if (to !== undefined) {
    if (typeof to !== 'string' || to.trim() === '') {
      throw new BadRequestError('Invalid to')
    }

    const toDate = new Date(to)

    if (Number.isNaN(toDate.getTime())) {
      throw new BadRequestError('Invalid to')
    }

    data.to = toDate
  }

  return data
}

export function validateUpdateTransaction(
  body: unknown,
): UpdateTransactionValidated {
  if (typeof body !== 'object' || body === null) {
    throw new BadRequestError('Invalid body')
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
      throw new BadRequestError('Invalid amount')
    }
    data.amount = amount
  }

  if (type !== undefined) {
    if (typeof type !== 'string' || (type !== 'INCOME' && type !== 'EXPENSE')) {
      throw new BadRequestError('Invalid type')
    }
    data.type = type
  }

  if (occurredAt !== undefined) {
    if (typeof occurredAt !== 'string' || occurredAt.trim() === '') {
      throw new BadRequestError('Invalid occurredAt')
    }

    const occurredDate = new Date(occurredAt)

    if (Number.isNaN(occurredDate.getTime())) {
      throw new BadRequestError('Invalid occurredAt')
    }

    data.occurredAt = occurredDate
  }

  if (categoryId !== undefined) {
    if (typeof categoryId !== 'string' || categoryId.trim() === '') {
      throw new BadRequestError('Invalid categoryId')
    }
    data.categoryId = categoryId
  }

  if (Object.keys(data).length === 0) {
    throw new BadRequestError('Invalid data')
  }

  return data
}
