import request from 'supertest'
import app from '../src/app'

describe('API', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })

  it('GET /unknown return 404', async () => {
    const res = await request(app).get('/unknown')
    expect(res.status).toBe(404)
    expect(res.body.error).toEqual('Not found')
  })
})
