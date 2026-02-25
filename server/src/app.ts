import express from "express";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import  debug  from "./routes/debug"

const app = express()

app.use(express.json())
app.use(debug)

app.get("/health", (req,res) => { 
    res.json( {status:"ok"})
})

app.use(notFound) 
app.use(errorHandler)

export default app