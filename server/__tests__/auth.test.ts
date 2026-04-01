import request from 'supertest'
import app from '../src/app'
import { getPrisma } from '../src/db/prisma'

describe('Auth smoke', () => {
  it('Register smoke', async () => {
    let email = 'test@test'
    let password = 'testtest'

    const res = await request(app)
      .post('/auth/register')
      .send({ email, password })

    expect(res.status).toBe(201)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.token.length).toBeGreaterThan(0)
  })

  it('Login smoke', async () => {
    const email = 'test@test'
    const password = 'testtest'

    await request(app).post('/auth/register').send({ email, password })

    const res = await request(app).post('/auth/login').send({ email, password })

    expect(res.status).toBe(200)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.token.length).toBeGreaterThan(0)
  })

  it('/me smoke', async () => {
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

  it('login validation returns 400 ', async () => {
    const res = await request(app).post('/auth/login').send({})
    expect(res.status).toBe(400)
  })

  it('/me without autorization returns 401', async () => {
    const res = await request(app).get('/me')
    expect(res.status).toBe(401)
  })

  it('/me with invalid token returns 401', async () => {
    const res = await request(app)
      .get('/me')
      .set('Authorization', 'Bearer invalid_token')
    expect(res.status).toBe(401)
  })

  it('login wrong password returns 401', async () => {
    const email = 'test@test'
    let password = 'testtest'

    await request(app).post('/auth/register').send({ email, password })

    password = 'wrongPassword'

    const res = await request(app).post('/auth/login').send({ email, password })

    expect(res.status).toBe(401)
  })

  it('login unknown email returns 401', async () => {
    const email = 'test@test'
    const password = 'testtest'

    const res = await request(app).post('/auth/login').send({ email, password })

    expect(res.status).toBe(401)
  })

  it('register duplicate email returns 409', async () => {
    const email = 'test@test'
    const password = 'testtest'

    await request(app).post('/auth/register').send({ email, password })

    const res = await request(app)
      .post('/auth/register')
      .send({ email, password })

    expect(res.status).toBe(409)
  })
  
  it('bad register validation returns 400', async () => {
    const res = await request(app).post('/auth/register').send({})

    expect(res.status).toBe(400)
  })

  it('bad login validation returns 400', async () => {
    const res = await request(app).post('/auth/login').send({})

    expect(res.status).toBe(400)
  })
  
  it('passwordHash in db is not the same as register password ', async () => {
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
