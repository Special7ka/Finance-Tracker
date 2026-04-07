import { BadRequestError } from '../errors'
import {
  CreateCategoryValidated,
  UpdateCategoryValidated,
} from '../types/categories'

export const validateCreateCategory = (
  body: unknown,
): CreateCategoryValidated => {
  if (typeof body !== 'object' || body == null) {
    throw new BadRequestError('Invalid body')
  }
  const { name } = body as Record<string, unknown>

  if (typeof name !== 'string' || name.trim() === '') {
    throw new BadRequestError('Invalid name')
  }
  return { name }
}

export const validateUpdateCategory = (
  body: unknown,
): UpdateCategoryValidated => {
  if (typeof body !== 'object' || body == null) {
    throw new BadRequestError('Invalid body')
  }

  const { name } = body as Record<string, unknown>
  const data = {} as UpdateCategoryValidated

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new BadRequestError('Invalid name')
    }
    data.name = name
  }

  if (Object.keys(data).length === 0) {
    throw new BadRequestError('Invalid data')
  }

  return data
}
