import request from "supertest"
import app from "../src/app"
import { getPrisma }  from "../src/db/prisma"

describe("Transactions",()=>{
    it("POST /transactions create new transaction and return 201 ", async ()=>{
        const email = "test@test"
        const password = "testpass"
        const type = "EXPENSE"
        const occurredAt = new Date().toISOString()
        const amount = 100

        const token = (await request(app).post("/auth/register").send({email,password})).body.token 

        const categories = (await request(app).get("/categories").set("Authorization","Bearer " + token)).body
        const categoryId = categories[0].id

        const res = await request(app).post("/transactions").send({categoryId,amount,occurredAt,type}).set("Authorization","Bearer " + token)

        expect(res.status).toBe(201)
        expect(res.body.transaction.amount).toBe(amount)
        expect(res.body.transaction.type).toBe(type)
        expect(res.body.transaction.occurredAt).toBe(occurredAt)
        expect(res.body.transaction.id).toBeDefined()
    })
    it("POST /transactions without token returns 401", async()=>{

        const res = await request(app).post("/transactions").send({})

        expect(res.status).toBe(401)
        expect(res.body.error).toBeDefined()
    })
    it("POST /transactions with invalid body returns 400", async()=>{
        const email = "test@test"
        const password = "testpass"
        const type = "EXPENSE"
        const occurredAt = new Date().toISOString()
        const amount = -100

        const token = (await request(app).post("/auth/register").send({email,password})).body.token 

        const categories = (await request(app).get("/categories").set("Authorization","Bearer " + token)).body
        const categoryId = categories[0].id

        const res = await request(app).post("/transactions").send({categoryId,amount,occurredAt,type}).set("Authorization","Bearer " + token)

        expect(res.status).toBe(400)
        expect(res.body.error).toBeDefined()
    })
})

        // userId:userId,
        // type:type,
        // occurredAt:occurredAt,
        // categoryId:categoryId,
        // amount:amount