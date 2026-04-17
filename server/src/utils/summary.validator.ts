import { GetSummaryValidated } from '../types/summary'
import { BadRequestError } from '../errors'
import { validateAndParseDate } from './date.validator'
import { TransactionType } from '@prisma/client'

export const validateGetSummary = (query: unknown): GetSummaryValidated => {
  const data: GetSummaryValidated = {}

  if (typeof query !== 'object' || query === null) {
    throw new BadRequestError('Invalid query')
  }

  const q = query as {
    from?: unknown
    to?: unknown
    type?: unknown
  }

  const to = q.to
  const from = q.from
  const type = q.type

  if (to !== undefined) {
    data.to = validateAndParseDate(to, 'to')
  }

  if (from !== undefined) {
    data.from = validateAndParseDate(from, 'from')
  }

  if (data.to !== undefined && data.from !== undefined && data.to < data.from) {
    throw new BadRequestError('Invalid date range')
  }

  if (type !== undefined) {
    if (typeof type !== 'string' || (type !== 'INCOME' && type !== 'EXPENSE')) {
      throw new BadRequestError('Invalid type')
    }
    data.type = type
  }

  return data
}
