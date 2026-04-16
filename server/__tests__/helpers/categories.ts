import request from 'supertest'
import app from '../../src/app'

type CreateCategoryInput = {
  name: string
}

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

export const createAndGetCategory = async (token:string,data:CreateCategoryInput)=>{
  const newCategory = await request(app).post("/categories").send(data).set('Authorization', 'Bearer ' + token)
  const id = newCategory.body.category.id
  const name = newCategory.body.category.name
  console.log(newCategory.body)

  return {categoryId:id,name}
}