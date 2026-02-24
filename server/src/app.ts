import express from "express";
import { notFound } from "./middlewares/notFound";

const app = express()

app.use(express.json())

app.get("/health", (req,res) => { 
    res.json( {status:"ok"})
})

app.use(notFound) 

export default app