import request from 'supertest'
import app from '../src/app'
import { registerAndGetToken } from './helpers/register'
import { getFirstUserCategory } from './helpers/categories'
import { createAndGetTransaction } from './helpers/transactions'

describe('Transactions', () => {
  it('POST /transactions create new transaction and return 201 ', async () => {
    const type = 'EXPENSE'
    const occurredAt = new Date().toISOString()
    const amount = 100

    const token = await registerAndGetToken()
    const categoryId = await getFirstUserCategory(token)

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
    const categoryId = await getFirstUserCategory(token)

    const res = await request(app)
      .post('/transactions')
      .send({ categoryId, amount, occurredAt, type })
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  it('GET /transactions returns 200 and transaction list', async () => {
    const token = await registerAndGetToken()
    const createdTx = await createAndGetTransaction(token)

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
