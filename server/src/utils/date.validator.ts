import { BadRequestError } from '../errors'

export const validateAndParseDate = (
  rawDate: unknown,
  fieldName: string,
): Date => {
  if (typeof rawDate !== 'string' || rawDate.trim() === '') {
    throw new BadRequestError(`Invalid ${fieldName}`)
  }

  const date = new Date(rawDate)

  if (Number.isNaN(date.getTime())) {
    throw new BadRequestError(`Invalid ${fieldName}`)
  }

  return date
}
