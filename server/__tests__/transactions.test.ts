import request from 'supertest'
import app from '../src/app'
import { getPrisma } from '../src/db/prisma'
import { registerAndGetToken } from './helpers/register'
import { addAbortListener } from 'node:events'

describe('Transactions', () => {
  it('POST /transactions create new transaction and return 201 ', async () => {
    const type = 'EXPENSE'
    const occurredAt = new Date().toISOString()
    const amount = 100

    const token = await registerAndGetToken()

    const categories = (
      await request(app)
        .get('/categories')
        .set('Authorization', 'Bearer ' + token)
    ).body
    const categoryId = categories[0].id

    const res = await request(app)
      .post('/transactions')
      .send({ categoryId, amount, occurredAt, type })
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(201)
    expect(res.body.transaction.amount).toBe(amount)
    expect(res.body.transaction.type).toBe(type)
    expect(res.body.transaction.occurredAt).toBe(occurredAt)
    expect(res.body.transaction.id).toBeDefined()
  })
  it('POST /transactions without token returns 401', async () => {
    const res = await request(app).post('/transactions').send({})

    expect(res.status).toBe(401)
    expect(res.body.error).toBeDefined()
  })
  it('POST /transactions with invalid body returns 400', async () => {
    const type = 'EXPENSE'
    const occurredAt = new Date().toISOString()
    const amount = -100

    const token = await registerAndGetToken()

    const categories = (
      await request(app)
        .get('/categories')
        .set('Authorization', 'Bearer ' + token)
    ).body
    const categoryId = categories[0].id

    const res = await request(app)
      .post('/transactions')
      .send({ categoryId, amount, occurredAt, type })
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
  it('GET /transactions return 200 and transaction list', async () => {
    const type = 'EXPENSE'
    const occurredAt = new Date().toISOString()
    const amount = 100

    const token = await registerAndGetToken()

    const categories = (
      await request(app)
        .get('/categories')
        .set('Authorization', 'Bearer ' + token)
    ).body

    const categoryId = categories[0].id

    const sendTx = await request(app)
      .post('/transactions')
      .send({ categoryId, amount, occurredAt, type })
      .set('Authorization', 'Bearer ' + token)

    const createdTx = sendTx.body.transaction

    const res = await request(app)
      .get('/transactions')
      .set('Authorization', 'Bearer ' + token)

    const tx = res.body.transactions[0]

    expect(res.status).toBe(200)
    expect(res.body.transactions).toBeInstanceOf(Array)
    expect(res.body.transactions.length).toBe(1)

    expect(tx.id).toBe(createdTx.id)
    expect(tx.amount).toBe(createdTx.amount)
    expect(tx.type).toBe(createdTx.type)
  })
})
