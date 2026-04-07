import { getPrisma } from '../db/prisma'
import { ConflictError, NotFoundError } from '../errors'
import {
  CreateCategoryValidated,
  UpdateCategoryValidated,
} from '../types/categories'

const normalizedName = (name: string): string => {
  return name.trim().toLowerCase()
}

export async function createCategory(
  userId: string,
  body: CreateCategoryValidated,
) {
  const prisma = getPrisma()
  const normalizeName = normalizedName(body.name)

  const duplicateCategory = await prisma.category.findFirst({
    where: {
      userId: userId,
      name: normalizeName,
    },
  })
  if (duplicateCategory) {
    throw new ConflictError('Category already exists')
  }
  const newCategory = await prisma.category.create({
    data: {
      userId: userId,
      name: normalizeName,
    },
  })

  return newCategory
}

export async function getCategoriesByUserId(userId: string) {
  const prisma = getPrisma()
  const userCategories = await prisma.category.findMany({
    where: { userId },
  })

  return userCategories
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  body: UpdateCategoryValidated,
) {
  const prisma = getPrisma()

  const userCategory = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  })

  if (!userCategory) {
    throw new NotFoundError('Category not found')
  }

  const updateData: UpdateCategoryValidated = {}

  if (body.name !== undefined) {
    const normalizedNewName = normalizedName(body.name)

    if (userCategory.name === normalizedNewName) {
      return userCategory
    }

    const exists = await prisma.category.findFirst({
      where: {
        userId,
        name: normalizedNewName,
        NOT: { id: categoryId },
      },
    })

    if (exists) {
      throw new ConflictError('Category already exists')
    }

    updateData.name = normalizedNewName
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: updateData,
  })
}

export async function deleteCategory(userId: string, categoryId: string) {
  const prisma = getPrisma()
  const existingCategory = await prisma.category.findFirst({
    where: {
      userId: userId,
      id: categoryId,
    },
  })

  if (existingCategory) {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    })
    return
  } else {
    throw new NotFoundError('Category not found')
  }
}
