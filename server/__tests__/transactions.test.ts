import request from 'supertest'
import app from '../src/app'
import { registerAndGetToken } from './helpers/register'
import { getFirstUserCategory } from './helpers/categories'
import { createAndGetTransaction } from './helpers/transactions'
import { Transaction } from '@prisma/client'
import { randomUUID } from 'crypto'

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
  it('PATCH /transactions/:id return 200 and updated transactions', async () => {
    const token = await registerAndGetToken()
    const createdTx = await createAndGetTransaction(token)
    const newBody = {
      amount: 50,
    }

    const res = await request(app)
      .patch('/transactions/' + createdTx.id)
      .set('Authorization', 'Bearer ' + token)
      .send(newBody)

    const updatedTxList = await request(app)
      .get('/transactions')
      .set('Authorization', 'Bearer ' + token)

    const updatedTx = updatedTxList.body.transactions.find(
      (tx: Transaction) => tx.id === createdTx.id,
    )

    if (!updatedTx) {
      throw new Error('Updated transaction not found')
    }

    expect(res.status).toBe(200)
    expect(res.body.transaction.amount).toBe(50)
    expect(updatedTx.amount).toBe(50)
  })
  it('PATCH /transactions/:id with empty body returns 400', async () => {
    const token = await registerAndGetToken()
    const createdTx = await createAndGetTransaction(token)
    const newBody = {}

    const res = await request(app)
      .patch('/transactions/' + createdTx.id)
      .set('Authorization', 'Bearer ' + token)
      .send(newBody)

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'invalid data' })
  })
  it('PATCH /transactions/:id with invalid data returns 400', async () => {
    const token = await registerAndGetToken()
    const createdTx = await createAndGetTransaction(token)
    const newBody = {
      amount: -50,
    }

    const res = await request(app)
      .patch('/transactions/' + createdTx.id)
      .set('Authorization', 'Bearer ' + token)
      .send(newBody)

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'invalid amount' })
  })
  it('PATCH /transactions/:id without invalit token returns 401', async () => {
    const token = await registerAndGetToken()
    const createdTx = await createAndGetTransaction(token)
    const newBody = {
      amount: 100,
    }

    const res = await request(app)
      .patch('/transactions/' + createdTx.id)
      .send(newBody)

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: 'Unauthorized' })
  })
  it('PATCH /transactions/:id returns 404 when transaction does not exist', async () => {
    const token = await registerAndGetToken()
    const newBody = {
      amount: 100,
    }

    const res = await request(app)
      .patch('/transactions/' + '100')
      .set('Authorization', 'Bearer ' + token)
      .send(newBody)

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: 'Transaction not found' })
  })
  it('DELETE /transactions/:id return 204 and delete transactions', async () => {
    const token = await registerAndGetToken()
    const createdTx = await createAndGetTransaction(token)

    const res = await request(app)
      .delete('/transactions/' + createdTx.id)
      .set('Authorization', 'Bearer ' + token)
    const exicstCheck = await request(app)
      .get('/transactions')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(204)
    expect(
      exicstCheck.body.transactions.find((tx: any) => tx.id === createdTx.id),
    ).toBe(undefined)
  })

  it('DELETE /transactions/:id with invalid transaction id return 404', async () => {
    const token = await registerAndGetToken()

    const res = await request(app)
      .delete('/transactions/' + randomUUID())
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(404)
  })

  it('DELETE /transactions/:id with invalid userId', async () => {
    const token = await registerAndGetToken()
    const token2 = await registerAndGetToken()
    const createdTx = await createAndGetTransaction(token)

    const res = await request(app)
      .delete('/transactions/' + createdTx.id)
      .set('Authorization', 'Bearer ' + token2)

    expect(res.status).toBe(404)
  })
})
