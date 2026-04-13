import request from 'supertest'
import app from '../src/app'
import { registerAndGetToken } from './helpers/register'
import { createAndGetTransaction } from './helpers/transactions'
import { authorization } from '../src/middlewares/parseAuthorization'
import { registerController } from '../src/controllers/auth.controller'

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
    
    it("GET /summary with from and to filters returns transactions within range", async ()=>{
        const token = await registerAndGetToken();
        await createAndGetTransaction(token,{amount:100, type:"INCOME", occurredAt:"2025-09-01T00:00:00Z"})
        await createAndGetTransaction(token,{amount:20, type:"EXPENSE", occurredAt:"2025-10-01T00:00:00Z"})
        await createAndGetTransaction(token,{amount:30, type:"INCOME", occurredAt:"2025-11-01T00:00:00Z"})
        await createAndGetTransaction(token,{amount:40, type:"EXPENSE", occurredAt:"2025-12-01T00:00:00Z"})

        const res = await request(app).get("/summary?from=2025-10-01T00:00:00Z&to=2025-11-01T00:00:00Z").set('Authorization', 'Bearer ' + token)

        expect(res.status).toBe(200)
        expect(res.body.income).toBe(30)
        expect(res.body.expense).toBe(20)
        expect(res.body.balance).toBe(10)
    })

    it("GET /summary returns only current users transactions", async ()=>{
        const token = await registerAndGetToken();
        const token2 = await registerAndGetToken();

        await createAndGetTransaction(token,{amount:100, type:"INCOME",})
        await createAndGetTransaction(token2,{amount:50, type:"EXPENSE",})

        const res = await request(app).get("/summary").set('Authorization', 'Bearer ' + token)
        
        expect(res.status).toBe(200)
        expect(res.body.income).toBe(100)
        expect(res.body.expense).toBe(0)
        expect(res.body.balance).toBe(100)
    })

    it("GET /summary return zero with no transactions", async()=>{
        const token = await registerAndGetToken()

        const res = await request(app).get("/summary").set('Authorization', 'Bearer ' + token)

        expect(res.status).toBe(200)
        expect(res.body.income).toBe(0)
        expect(res.body.expense).toBe(0)
        expect(res.body.balance).toBe(0)
    })
})
