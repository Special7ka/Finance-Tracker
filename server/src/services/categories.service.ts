import { getPrisma } from '../db/prisma'
import { ConflictError, NotFoundError } from '../errors'

const normalizeCategoryName = (name: string): string => {
  return name.trim().toLowerCase()
}

export async function createCategory(userId: string, name: string) {
  const prisma = getPrisma()
  const normalizeName = normalizeCategoryName(name)

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
  newName: string,
) {
  const prisma = getPrisma()
  const normalizeNewName = normalizeCategoryName(newName)

  const userCategory = await prisma.category.findFirst({
    where: { id: categoryId, userId: userId },
  })
  if (!userCategory) {
    throw new NotFoundError('Category not found')
  }
  if (userCategory.name === normalizeNewName) {
    return userCategory
  }

  const exists = await prisma.category.findFirst({
    where: {
      userId: userId,
      name: normalizeNewName,
      NOT: { id: categoryId },
    },
  })
  if (exists) {
    throw new ConflictError('Category already exists')
  }

  const newCategory = await prisma.category.update({
    where: { id: categoryId },
    data: { name: normalizeNewName },
  })

  return newCategory
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
