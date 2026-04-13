import request from 'supertest'
import app from '../src/app'
import { DEFAULT_CATEGORIES } from '../src/constants/defaultCategories'
import { registerAndGetToken } from './helpers/register'
import { getFirstUserCategory } from './helpers/categories'
import { asyncWrapProviders } from 'async_hooks'
import { error } from 'console'

describe('Categories', () => {
  it('GET /categories without token returns 401', async () => {
    const res = await request(app).get('/categories')

    expect(res.status).toBe(401)
    expect(res.body.error).toBeDefined()
  })
  it('GET /categories returns 200 and returns default categories after register', async () => {
    const token = await registerAndGetToken()

    const res = await request(app)
      .get('/categories')
      .set('Authorization', 'Bearer ' + token)
    const responseNames = res.body.map((c: any) => c.name).sort()
    const defaultNames = DEFAULT_CATEGORIES.map((c: any) => c.name).sort()

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
    expect(responseNames).toEqual(defaultNames)
  })
  it('POST /categories returns 201  + created category', async () => {
    const token = await registerAndGetToken()

    const res = await request(app)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Travel' })

    expect(res.status).toBe(201)
    expect(res.body.category.id).toBeDefined()
    expect(res.body.category.name).toBe('travel')
  })
  it('POST /categories with invalid body 400', async () => {
    const token = await registerAndGetToken()

    const res = await request(app)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 123 })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid name')
  })
  it('POST /categories with duplicate name returns 409', async () => {
    const token = await registerAndGetToken()
    const sameName = 'travel'

    await request(app)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: sameName })

    const res = await request(app)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: sameName })

    expect(res.status).toBe(409)
    expect(res.body.error).toBe('Category already exists')
  })
  it('PATCH /categories/:id returns 200 + updated category', async () => {
    const token = await registerAndGetToken()
    const categoryId = await getFirstUserCategory(token)

    const newName = 'Travel'

    const res = await request(app)
      .patch('/categories/' + categoryId)
      .set('Authorization', 'Bearer ' + token)
      .send({ name: newName })

    expect(res.status).toBe(200)
    expect(res.body.category.name).toBe(newName.toLocaleLowerCase())
  })
  it('PATCH /categories/:id invalid body returns 400', async () => {
    const token = await registerAndGetToken()
    const categoryId = await getFirstUserCategory(token)

    const res = await request(app)
      .patch('/categories/' + categoryId)
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 123 })

    expect(res.status).toBe(400)
  })
  it('PATCH /categories/:id` not owned category returns 404', async () => {
    const token = await registerAndGetToken()
    const token2 = await registerAndGetToken()

    const categoryId = await getFirstUserCategory(token)

    const res = await request(app)
      .patch('/categories/' + categoryId)
      .set('Authorization', 'Bearer ' + token2)
      .send({ name: 'Sigma' })

    expect(res.status).toBe(404)
  })
  it('DELETE /categories/:id returns 204', async () => {
    const token = await registerAndGetToken()
    const categoryId = await getFirstUserCategory(token)

    const res = await request(app)
      .delete('/categories/' + categoryId)
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(204)
  })
})
