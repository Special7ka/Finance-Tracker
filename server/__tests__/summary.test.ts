import request from 'supertest'
import app from '../src/app'
import { registerAndGetToken } from './helpers/register'
import { createAndGetTransaction } from './helpers/transactions'
import { authorization } from '../src/middlewares/parseAuthorization'

describe("Summary", () =>{
    it("GET /summary without filters returns 200 and summary statement", async ()=>{
        const token = await registerAndGetToken()
        await createAndGetTransaction(token,{amount:100,type:"INCOME"})
        await createAndGetTransaction(token,{amount:40, type:"EXPENSE"})

        const res = await request(app).get("/summary").set('Authorization', 'Bearer ' + token)

        expect(res.status).toBe(200)
        expect(res.body.income).toBe(100)
        expect(res.body.expense).toBe(40)
        expect(res.body.balance).toBe(60)
    })

    it("GET /summary without token returns 401", async () => {
        const res = await request(app).get("/summary")
        expect(res.status).toBe(401)
  })
})
