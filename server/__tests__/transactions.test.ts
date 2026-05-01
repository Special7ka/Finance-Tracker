import request from 'supertest'
import app from '../src/app'
import { registerAndGetToken } from './helpers/register'
import {
  createAndGetCategory,
  getFirstUserCategory,
} from './helpers/categories'
import { createAndGetTransaction } from './helpers/transactions'
import { Transaction } from '@prisma/client'
import { randomUUID } from 'crypto'

describe('Transactions', () => {
  describe('POST /transactions', () => {
    it('should create transaction and return 201', async () => {
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

    it('should return 401 without token', async () => {
      const res = await request(app).post('/transactions').send({})

      expect(res.status).toBe(401)
      expect(res.body.error).toBeDefined()
    })

    it('should return 400 for invalid body', async () => {
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
  })

  describe('GET /transactions', () => {
    describe('base list', () => {
      it('should return 200 and transaction list', async () => {
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

    describe('auth', () => {
      it('should return 401 for invalid token', async () => {
        const invalidToken = 'Invalid'

        const res = await request(app)
          .get('/transactions')
          .set('Authorization', 'Bearer ' + invalidToken)

        expect(res.status).toBe(401)
      })

      it('should return 401 without token', async () => {
        const res = await request(app).get('/transactions')

        expect(res.status).toBe(401)
      })

      it('should return empty array with another users token', async () => {
        const token = await registerAndGetToken()
        const token2 = await registerAndGetToken()

        const tx1 = await createAndGetTransaction(token, { type: 'INCOME' })

        const res = await request(app)
          .get('/transactions?type=INCOME')
          .set('Authorization', 'Bearer ' + token2)

        expect(res.status).toBe(200)
        expect(res.body.transactions).toEqual([])
        expect(
          res.body.transactions.find((t: any) => t.id === tx1.id),
        ).toBeUndefined()
      })
    })

    describe('type filter', () => {
      it('should return 400 for invalid type filter', async () => {
        const token = await registerAndGetToken()
        const errorParam = 'Error'

        const res = await request(app)
          .get('/transactions?type=' + errorParam)
          .set('Authorization', 'Bearer ' + token)

        expect(res.status).toBe(400)
        expect(res.body.error).toEqual('Invalid type')
      })

      it('should return 200 and filtered with type filter', async () => {
        const token = await registerAndGetToken()

        const createdCategoryTx = await createAndGetTransaction(token, {
          type: 'INCOME',
        })
        const res = await request(app)
          .get('/transactions?type=INCOME')
          .set('Authorization', 'Bearer ' + token)

        const tx = res.body.transactions.find(
          (t: any) => t.id === createdCategoryTx.id,
        )

        expect(res.status).toBe(200)
        expect(res.body.transactions).toHaveLength(1)

        expect(tx).toBeDefined()
        expect(tx.type).toBe('INCOME')
        expect(tx.amount).toBe(createdCategoryTx.amount)
      })

      it('should return empty array without INCOME transactions', async () => {
        const token = await registerAndGetToken()

        const res = await request(app)
          .get('/transactions?type=INCOME')
          .set('Authorization', 'Bearer ' + token)

        expect(res.status).toBe(200)
        expect(res.body.transactions).toEqual([])
      })
    })

    describe('category filter', () => {
      it('should return 200 and filtered transactions with categoryId filter', async () => {
        const token = await registerAndGetToken()

        const uniqueCategory = await createAndGetCategory(token, {
          name: 'unique category',
        })
        const otherCategory = await createAndGetCategory(token, {
          name: 'other category',
        })

        const createdIncomeTx = await createAndGetTransaction(token, {
          categoryId: uniqueCategory.categoryId,
        })

        await createAndGetTransaction(token, {
          categoryId: otherCategory.categoryId,
        })

        const res = await request(app)
          .get('/transactions?categoryId=' + createdIncomeTx.categoryId)
          .set('Authorization', 'Bearer ' + token)

        expect(res.status).toBe(200)
        expect(res.body.transactions).toHaveLength(1)

        expect(res.body.transactions[0]).toMatchObject({
          id: createdIncomeTx.id,
          categoryId: createdIncomeTx.categoryId,
          amount: createdIncomeTx.amount,
        })
      })
    })

    describe('date filters', () => {
      it('should return transactions within date range', async () => {
        const token = await registerAndGetToken()

        const date1 = '2024-01-01T00:00:00.000Z'
        const date2 = '2024-01-15T00:00:00.000Z'
        const date3 = '2024-02-01T00:00:00.000Z'

        await createAndGetTransaction(token, { occurredAt: date1, amount: 10 })
        const tx2 = await createAndGetTransaction(token, {
          occurredAt: date2,
          amount: 20,
        })
        await createAndGetTransaction(token, { occurredAt: date3, amount: 30 })

        const res = await request(app)
          .get('/transactions?from=2024-01-15&to=2024-01-20')
          .set('Authorization', 'Bearer ' + token)

        expect(res.status).toBe(200)
        expect(res.body.transactions.length).toBe(1)
        expect(res.body.transactions[0].id).toEqual(tx2.id)
      })

      it('should return transactions after from date', async () => {
        const token = await registerAndGetToken()

        const date1 = '2024-01-01T00:00:00.000Z'
        const date2 = '2024-01-15T00:00:00.000Z'
        const date3 = '2024-02-01T00:00:00.000Z'

        await createAndGetTransaction(token, { occurredAt: date1, amount: 10 })
        await createAndGetTransaction(token, { occurredAt: date2, amount: 40 })

        const tx3 = await createAndGetTransaction(token, {
          occurredAt: date3,
          amount: 30,
        })

        const res = await request(app)
          .get('/transactions?from=2024-01-16')
          .set('Authorization', 'Bearer ' + token)

        expect(res.status).toBe(200)
        expect(res.body.transactions.length).toBe(1)
        expect(res.body.transactions[0].id).toEqual(tx3.id)
      })

      it('should return transactions before to date', async () => {
        const token = await registerAndGetToken()

        const date1 = '2024-01-01T00:00:00.000Z'
        const date2 = '2024-01-15T00:00:00.000Z'
        const date3 = '2024-02-01T00:00:00.000Z'

        const tx1 = await createAndGetTransaction(token, {
          occurredAt: date1,
          amount: 10,
        })
        await createAndGetTransaction(token, {
          occurredAt: date2,
          amount: 20,
        })
        await createAndGetTransaction(token, { occurredAt: date3, amount: 30 })

        const res = await request(app)
          .get('/transactions?to=2024-01-14')
          .set('Authorization', 'Bearer ' + token)

        expect(res.status).toBe(200)
        expect(res.body.transactions.length).toBe(1)
        expect(res.body.transactions[0].id).toEqual(tx1.id)
      })
    })
  })

  describe('PATCH /transactions/:id', () => {
    it('should return 200 and updated transactions', async () => {
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

    it('should return 400 for empty body', async () => {
      const token = await registerAndGetToken()
      const createdTx = await createAndGetTransaction(token)
      const newBody = {}

      const res = await request(app)
        .patch('/transactions/' + createdTx.id)
        .set('Authorization', 'Bearer ' + token)
        .send(newBody)

      expect(res.status).toBe(400)
      expect(res.body).toEqual({ error: 'Invalid data' })
    })

    it('should return 400 for invalid data', async () => {
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
      expect(res.body).toEqual({ error: 'Invalid amount' })
    })

    it('should return 401 without valid token', async () => {
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

    it('should return 404 when transaction does not exist', async () => {
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
  })

  describe('DELETE /transactions/:id', () => {
    it('should delete transaction and return 204', async () => {
      const token = await registerAndGetToken()
      const createdTx = await createAndGetTransaction(token)

      const res = await request(app)
        .delete('/transactions/' + createdTx.id)
        .set('Authorization', 'Bearer ' + token)
      const existCheck = await request(app)
        .get('/transactions')
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(204)
      expect(
        existCheck.body.transactions.find((tx: any) => tx.id === createdTx.id),
      ).toBe(undefined)
    })

    it('should return 404 for invalid transaction id', async () => {
      const token = await registerAndGetToken()

      const res = await request(app)
        .delete('/transactions/' + randomUUID())
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(404)
    })

    it('should return 404 when deleting another users transaction', async () => {
      const token = await registerAndGetToken()
      const token2 = await registerAndGetToken()
      const createdTx = await createAndGetTransaction(token)

      const res = await request(app)
        .delete('/transactions/' + createdTx.id)
        .set('Authorization', 'Bearer ' + token2)

      expect(res.status).toBe(404)
    })
  })
})
