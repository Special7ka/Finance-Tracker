import request from 'supertest'
import app from '../src/app'
import { DEFAULT_CATEGORIES } from '../src/constants/defaultCategories'
import { registerAndGetToken } from './helpers/register'
import { getFirstUserCategory } from './helpers/categories'

type CategoryResponse = {
  name: string
}

describe('Categories', () => {
  describe('GET /categories', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/categories')

      expect(res.status).toBe(401)
      expect(res.body.error).toBeDefined()
    })

    it('should return 200 and returns default categories after register', async () => {
      const token = await registerAndGetToken()

      const res = await request(app)
        .get('/categories')
        .set('Authorization', 'Bearer ' + token)
      const responseNames = (res.body as CategoryResponse[])
        .map((c) => c.name)
        .sort()
      const defaultNames = DEFAULT_CATEGORIES.map((c) => c.name).sort()

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
      expect(responseNames).toEqual(defaultNames)
    })
  })

  describe('POST /categories', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).post('/categories')

      expect(res.status).toBe(401)
      expect(res.body.error).toBeDefined()
    })

    it('should return 201 + created category', async () => {
      const token = await registerAndGetToken()

      const res = await request(app)
        .post('/categories')
        .set('Authorization', 'Bearer ' + token)
        .send({ name: 'Travel' })

      expect(res.status).toBe(201)
      expect(res.body.category.id).toBeDefined()
      expect(res.body.category.name).toBe('travel')
    })
    it('should return 400 with invalid body', async () => {
      const token = await registerAndGetToken()

      const res = await request(app)
        .post('/categories')
        .set('Authorization', 'Bearer ' + token)
        .send({ name: 123 })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Invalid name')
    })
    it('should return 409 with duplicate name', async () => {
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
  })

  describe('PATCH /categories/:id', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).patch('/categories/some-id')

      expect(res.status).toBe(401)
      expect(res.body.error).toBeDefined()
    })

    it('should return 200 + updated category', async () => {
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
    it('should return 400 with invalid body', async () => {
      const token = await registerAndGetToken()
      const categoryId = await getFirstUserCategory(token)

      const res = await request(app)
        .patch('/categories/' + categoryId)
        .set('Authorization', 'Bearer ' + token)
        .send({ name: 123 })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Invalid name')
    })
    it('should return 404 with not owned category', async () => {
      const token = await registerAndGetToken()
      const token2 = await registerAndGetToken()

      const categoryId = await getFirstUserCategory(token)

      const res = await request(app)
        .patch('/categories/' + categoryId)
        .set('Authorization', 'Bearer ' + token2)
        .send({ name: 'Sigma' })

      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /categories/:id', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).delete('/categories/some-id')

      expect(res.status).toBe(401)
      expect(res.body.error).toBeDefined()
    })

    it('should return 204', async () => {
      const token = await registerAndGetToken()
      const categoryId = await getFirstUserCategory(token)

      const res = await request(app)
        .delete('/categories/' + categoryId)
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(204)
    })
  })
})
