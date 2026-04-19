import request from 'supertest'
import app from '../src/app'
import { registerAndGetToken } from './helpers/register'
import { createAndGetTransaction } from './helpers/transactions'
import { createAndGetCategory } from './helpers/categories'
import { SummaryByCategoryItem } from '../src/types/summary'

describe('Summary', () => {
  it('GET /summary without filters returns 200 and summary statement', async () => {
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

  it('GET /summary without token returns 401', async () => {
    const res = await request(app).get('/summary')
    expect(res.status).toBe(401)
  })

  it('GET /summary with from and to filters returns transactions within range', async () => {
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

  it('GET /summary returns only current users transactions', async () => {
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

  it('GET /summary return zero with no transactions', async () => {
    const token = await registerAndGetToken()

    const res = await request(app)
      .get('/summary')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(200)
    expect(res.body.income).toBe(0)
    expect(res.body.expense).toBe(0)
    expect(res.body.balance).toBe(0)
  })
  it('GET /summary/by-category returns expenses grouped by category', async () => {
    const token = await registerAndGetToken()

    const travelCategory = await createAndGetCategory(token, { name: 'travel' })
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

  it('GET /summary/by-category without expense transactions', async () => {
    const token = await registerAndGetToken()

    const res = await request(app)
      .get('/summary/by-category')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('GET /summary/by-category with income filter returns income grouped by category', async () => {
    const token = await registerAndGetToken()
    const travelCategory = await createAndGetCategory(token, { name: 'travel' })

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

  it('GET /summary/by-category with invalid type query returns 400', async () => {
    const token = await registerAndGetToken()
    const res = await request(app)
      .get('/summary/by-category?type=ERROR')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(400)
  })

  it('GET /summary/by-category with one category returns 200 and correct percentage', async () => {
    const token = await registerAndGetToken()

    const travelCategory = await createAndGetCategory(token, { name: 'travel' })

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
