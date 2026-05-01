import request from 'supertest'
import app from '../src/app'
import { registerAndGetToken } from './helpers/register'
import { createAndGetTransaction } from './helpers/transactions'
import { createAndGetCategory } from './helpers/categories'
import { SummaryByCategoryItem } from '../src/types/summary'

describe('Summary', () => {
  describe('GET /summary', () => {
    it('should return 200 and summary statement without filters', async () => {
      const token = await registerAndGetToken()
      await createAndGetTransaction(token, { amount: 100, type: 'INCOME' })
      await createAndGetTransaction(token, { amount: 40, type: 'EXPENSE' })

      const res = await request(app)
        .get('/summary')
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(200)
      expect(res.body.income).toBe(100)
      expect(res.body.expense).toBe(40)
      expect(res.body.balance).toBe(60)
    })

    it('should return 401 without token', async () => {
      const res = await request(app).get('/summary')
      expect(res.status).toBe(401)
    })

    it('should return transactions within range from and to filters', async () => {
      const token = await registerAndGetToken()
      await createAndGetTransaction(token, {
        amount: 100,
        type: 'INCOME',
        occurredAt: '2025-09-01T00:00:00Z',
      })
      await createAndGetTransaction(token, {
        amount: 20,
        type: 'EXPENSE',
        occurredAt: '2025-10-01T00:00:00Z',
      })
      await createAndGetTransaction(token, {
        amount: 30,
        type: 'INCOME',
        occurredAt: '2025-11-01T00:00:00Z',
      })
      await createAndGetTransaction(token, {
        amount: 40,
        type: 'EXPENSE',
        occurredAt: '2025-12-01T00:00:00Z',
      })

      const res = await request(app)
        .get('/summary?from=2025-10-01T00:00:00Z&to=2025-11-01T00:00:00Z')
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(200)
      expect(res.body.income).toBe(30)
      expect(res.body.expense).toBe(20)
      expect(res.body.balance).toBe(10)
    })

    it('should return only current users transactions', async () => {
      const token = await registerAndGetToken()
      const token2 = await registerAndGetToken()

      await createAndGetTransaction(token, { amount: 100, type: 'INCOME' })
      await createAndGetTransaction(token2, { amount: 50, type: 'EXPENSE' })

      const res = await request(app)
        .get('/summary')
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(200)
      expect(res.body.income).toBe(100)
      expect(res.body.expense).toBe(0)
      expect(res.body.balance).toBe(100)
    })

    it('should return zero with no transactions', async () => {
      const token = await registerAndGetToken()

      const res = await request(app)
        .get('/summary')
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(200)
      expect(res.body.income).toBe(0)
      expect(res.body.expense).toBe(0)
      expect(res.body.balance).toBe(0)
    })
  })

  describe('GET /summary/by-category', () => {
    it('should return expenses grouped by category', async () => {
      const token = await registerAndGetToken()

      const travelCategory = await createAndGetCategory(token, {
        name: 'travel',
      })
      const sportCategory = await createAndGetCategory(token, { name: 'sport' })

      await createAndGetTransaction(token, {
        amount: 20,
        categoryId: travelCategory.categoryId,
        type: 'EXPENSE',
      })
      await createAndGetTransaction(token, {
        amount: 5,
        categoryId: travelCategory.categoryId,
        type: 'EXPENSE',
      })

      await createAndGetTransaction(token, {
        amount: 100,
        categoryId: sportCategory.categoryId,
        type: 'EXPENSE',
      })

      const res = await request(app)
        .get('/summary/by-category')
        .set('Authorization', 'Bearer ' + token)

      const body = res.body as SummaryByCategoryItem[]

      expect(res.status).toBe(200)

      const travel = body.find((category) => category.name === 'travel')
      const sport = body.find((category) => category.name === 'sport')

      expect(body.length).toBe(2)

      expect(travel).toBeDefined()
      expect(sport).toBeDefined()

      expect(travel!.amount).toBe(25)
      expect(sport!.amount).toBe(100)

      expect(travel!.percentage).toBe(20)
      expect(sport!.percentage).toBe(80)
    })

    it('should return empty body without expense transactions', async () => {
      const token = await registerAndGetToken()

      const res = await request(app)
        .get('/summary/by-category')
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('should return income grouped by category with income filter', async () => {
      const token = await registerAndGetToken()
      const travelCategory = await createAndGetCategory(token, {
        name: 'travel',
      })

      await createAndGetTransaction(token, {
        amount: 20,
        categoryId: travelCategory.categoryId,
        type: 'EXPENSE',
      })

      await createAndGetTransaction(token, {
        amount: 35,
        categoryId: travelCategory.categoryId,
        type: 'INCOME',
      })

      const res = await request(app)
        .get('/summary/by-category?type=INCOME')
        .set('Authorization', 'Bearer ' + token)
      const body = res.body as SummaryByCategoryItem[]

      expect(res.status).toBe(200)

      const travel = body.find((category) => category.name === 'travel')

      expect(body.length).toBe(1)
      expect(travel).toBeDefined()
      expect(travel!.amount).toBe(35)
    })

    it('should return 400 with invalid type query', async () => {
      const token = await registerAndGetToken()
      const res = await request(app)
        .get('/summary/by-category?type=ERROR')
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(400)
    })

    it('should return 200 and correct percentage with one category', async () => {
      const token = await registerAndGetToken()

      const travelCategory = await createAndGetCategory(token, {
        name: 'travel',
      })

      await createAndGetTransaction(token, {
        amount: 20,
        categoryId: travelCategory.categoryId,
        type: 'EXPENSE',
      })

      const res = await request(app)
        .get('/summary/by-category')
        .set('Authorization', 'Bearer ' + token)

      const body = res.body as SummaryByCategoryItem[]

      expect(res.status).toBe(200)

      const travel = body.find((category) => category.name === 'travel')

      expect(body.length).toBe(1)
      expect(travel).toBeDefined()
      expect(travel!.amount).toBe(20)
      expect(travel!.percentage).toBe(100)
    })
  })
})
