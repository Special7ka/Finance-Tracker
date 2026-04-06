import { getPrisma } from '../db/prisma'
import { ConflictError, NotFoundError } from '../errors'

export async function createCategory(userId: string, name: string) {
  const prisma = getPrisma()
  const duplicateCategory = await prisma.category.findFirst({
    where: {
      userId: userId,
      name: name,
    },
  })
  if (duplicateCategory) {
    throw new ConflictError('Category already exists')
  }
  const newCategory = await prisma.category.create({
    data: {
      userId: userId,
      name: name,
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

  const userCategory = await prisma.category.findFirst({
    where: { id: categoryId, userId: userId },
  })
  if (!userCategory) {
    throw new NotFoundError('Category not found')
  }
  if (userCategory?.name === newName) {
    return userCategory
  }

  const exists = await prisma.category.findFirst({
    where: {
      userId: userId,
      name: newName,
      NOT: { id: categoryId },
    },
  })
  if (exists) {
    throw new ConflictError('Category already exists')
  }

  const newCategory = await prisma.category.update({
    where: { id: categoryId },
    data: { name: newName },
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
