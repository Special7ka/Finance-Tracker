import request  from "supertest";
import app from "../src/app";
import { DEFAULT_CATEGORIES } from "../src/constants/defaultCategories";

    describe("Categories",()=>{
        it("GET /categories without token returns 401",async ()=>{
            const res = await request(app).get("/categories")

            expect(res.status).toBe(401)
            expect(res.body.error).toBeDefined()
        })
        it("GET /categories returns 200 and returns default categories after register", async()=>{
            const email = "test@test"
            const password = "testpass"

            const token  = (await request(app).post("/auth/register").send({email,password})).body.token

            const res = await request(app).get("/categories").set("Authorization", "Bearer " + token)
            const responseNames = res.body.map((c: any) => c.name).sort()
            const defaultNames = DEFAULT_CATEGORIES.map((c: any) => c.name).sort()
            

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBeGreaterThan(0)
            expect(responseNames).toEqual(defaultNames)
        })
        it("POST /categories returns 201  + created category",async()=>{
            const email = "test@test"
            const password = "testpass"

            const token = (await request(app).post("/auth/register").send({email,password})).body.token

            const res = await request(app).post("/categories").set("Authorization","Bearer " + token ).send({name: "Travel"})

            expect(res.status).toBe(201)
            expect(res.body.category.id).toBeDefined()
            expect(res.body.category.name).toBe("Travel")

        })
        it("POST /categories with invalid body 400", async()=>{
             const email = "test@test"
            const password = "testpass"

            const token = (await request(app).post("/auth/register").send({email,password})).body.token

            const res = await request(app).post("/categories").set("Authorization","Bearer " + token ).send({name: 123})

            expect(res.status).toBe(400)
            expect(res.body.error).toBe("invalid name")
        })

})