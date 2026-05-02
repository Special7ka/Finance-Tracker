import request from 'supertest'
import app from '../src/app'
import { getPrisma } from '../src/db/prisma'

describe('Auth', () => {
  describe('POST /auth/register', () => {
    it('should register user and return token', async () => {
      let email = 'test@test'
      let password = 'testtest'

      const res = await request(app)
        .post('/auth/register')
        .send({ email, password })

      expect(res.status).toBe(201)
      expect(typeof res.body.token).toBe('string')
      expect(res.body.token.length).toBeGreaterThan(0)
    })

    it('should return 409 with duplicate email', async () => {
      const email = 'test@test'
      const password = 'testtest'

      await request(app).post('/auth/register').send({ email, password })

      const res = await request(app)
        .post('/auth/register')
        .send({ email, password })

      expect(res.status).toBe(409)
    })

    it('should return 400 with bad register validation', async () => {
      const res = await request(app).post('/auth/register').send({})

      expect(res.status).toBe(400)
    })

    it('should store hashed password instead of plain password', async () => {
      const email = 'test@test'
      const password = 'testtest'
      const prisma = getPrisma()

      await request(app).post('/auth/register').send({ email, password })

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        throw new Error('user did not created')
      }
      expect(user.passwordHash).not.toBe(password)
    })
  })

  describe('POST /auth/login', () => {
    it('should login user and return token', async () => {
      const email = 'test@test'
      const password = 'testtest'

      await request(app).post('/auth/register').send({ email, password })

      const res = await request(app)
        .post('/auth/login')
        .send({ email, password })

      expect(res.status).toBe(200)
      expect(typeof res.body.token).toBe('string')
      expect(res.body.token.length).toBeGreaterThan(0)
    })

    it('should return 400 with invalid login body', async () => {
      const res = await request(app).post('/auth/login').send({})
      expect(res.status).toBe(400)
    })

    it('login wrong password returns 401', async () => {
      const email = 'test@test'
      let password = 'testtest'

      await request(app).post('/auth/register').send({ email, password })

      password = 'wrongPassword'

      const res = await request(app)
        .post('/auth/login')
        .send({ email, password })

      expect(res.status).toBe(401)
    })

    it('should return 401 with unknown email', async () => {
      const email = 'test@test'
      const password = 'testtest'

      const res = await request(app)
        .post('/auth/login')
        .send({ email, password })

      expect(res.status).toBe(401)
    })
  })

  describe('GET /me', () => {
    it('should return current user', async () => {
      const email = 'test@test'
      const password = 'testtest'

      await request(app).post('/auth/register').send({ email, password })

      const token = (
        await request(app).post('/auth/login').send({ email, password })
      ).body.token

      const res = await request(app)
        .get('/me')
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(200)
      expect(res.body.email).toBe(email)
      expect(res.body.id.length).toBeGreaterThan(0)
      expect(typeof res.body.id).toBe('string')
    })

    it('should return 401 without authorization', async () => {
      const res = await request(app).get('/me')
      expect(res.status).toBe(401)
    })

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/me')
        .set('Authorization', 'Bearer invalid_token')
      expect(res.status).toBe(401)
    })
  })
})
