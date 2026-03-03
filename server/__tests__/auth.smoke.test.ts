import request from "supertest"
import app from "../src/app"
import { exec } from "node:child_process"

describe("Auth smoke", ()=>{
    it("Register smoke", async ()=>{
        let email = "test@test"
        let password = "testtest"
        
        const res = await request(app)
                            .post("/auth/register")
                            .send({email,password});

        expect(res.status).toBe(201)
        expect(typeof res.body.token).toBe("string")
        expect(res.body.token.length).toBeGreaterThan(0)
    }),
    it("Login test", async()=>{
        const email = "test@test"
        const password = "testtest"
        await request(app).post("/auth/register").send({email, password})

        const res = await request(app).post("/auth/login").send({email,password})

        expect(res.status).toBe(200)
        expect(typeof res.body.token).toBe("string")
        expect(res.body.token.length).toBeGreaterThan(0)
    }),
    it("/me test", async()=>{
        const email = "test@test";
        const password = "testtest";
        await request(app).post("/auth/register").send({email, password})

        const token = (await request(app).post("/auth/login").send({email,password})).body.token;

        const res = await request(app).get("/me").set("Authorization", "Bearer " + token)

        expect(res.status).toBe(200);
        expect(res.body.email).toBe(email)
        expect(res.body.id.length).toBeGreaterThan(0)
        expect(typeof res.body.id).toBe("string")
    })
})