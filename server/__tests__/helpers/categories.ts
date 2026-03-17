import request from 'supertest'
import app from '../../src/app'

export const getFirstUserCategory = async (token: string) => {
  const categories = (
    await request(app)
      .get('/categories')
      .set('Authorization', 'Bearer ' + token)
  ).body

  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error('No categories found for user')
  }

  return categories[0].id
}
