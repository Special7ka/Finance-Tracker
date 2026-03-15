import request  from "supertest";
import app from "../../src/app";

export const registerAndGetToken =  async ()=>{
    const email = "test@test"
    const password = "testpass"

    const newUser = await request(app).post("/auth/register").send({email,password})

    const token = newUser.body.token 

    return token;
}