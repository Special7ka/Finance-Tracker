import request from 'supertest'
import app from '../../src/app'

export const registerAndGetToken = async () => {
  const email = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`
  const password = 'testpass'

  const newUser = await request(app)
    .post('/auth/register')
    .send({ email, password })

  const token = newUser.body.token

  return token
}
