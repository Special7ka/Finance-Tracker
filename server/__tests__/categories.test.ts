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

})