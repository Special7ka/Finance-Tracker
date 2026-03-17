import request from 'supertest'
import app from '../../src/app'
import { getFirstUserCategory } from './categories'

export const createAndGetTransaction = async (
  token: string,
  {
    amount = 100,
    type = 'EXPENSE',
    occurredAt = new Date().toISOString(),
    categoryId,
  }: {
    amount?: number
    type?: 'EXPENSE' | 'INCOME'
    occurredAt?: string
    categoryId?: string
  } = {},
) => {
  categoryId = categoryId ?? (await getFirstUserCategory(token))

  const sendTx = await request(app)
    .post('/transactions')
    .send({ categoryId, amount, occurredAt, type })
    .set('Authorization', 'Bearer ' + token)

  return sendTx.body.transaction
}
