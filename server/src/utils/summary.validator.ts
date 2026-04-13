import { GetSummaryValidated } from '../types/summary'
import { BadRequestError } from '../errors'
import { validateAndParseDate } from './date.validator'

export const validateGetSummary = (query: unknown): GetSummaryValidated => {
  const data: GetSummaryValidated = {}

  if (typeof query !== 'object' || query === null) {
    throw new BadRequestError('Invalid query')
  }

  const q = query as {
    from?: unknown
    to?: unknown
  }

  const to = q.to
  const from = q.from

  if (to !== undefined) {
    data.to = validateAndParseDate(to, 'to')
  }

  if (from !== undefined) {
    data.from = validateAndParseDate(from, 'from')
  }

  if (data.to !== undefined && data.from !== undefined && data.to < data.from) {
    throw new BadRequestError('Invalid date range')
  }

  return data
}
