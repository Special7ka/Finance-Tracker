import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { authorization } from "../middlewares/parseAuthorization";
import { getTransactions,createTransaction,updateTransaction,deleteTransaction } from "../services/transactions.service";
import { json } from "node:stream/consumers";

const router = Router()

router.post("/",authorization,verifyJWT,async(req,res)=>{
    const userId = (req as any).userId
    const amount = req.body.amount
    const occurredAt = req.body.occurredAt
    const occurredDate = new Date(occurredAt)
    const categoryId = req.body.categoryId
    const type = req.body.type

    if(!amount || typeof(amount) !== "number" || amount <= 0 ){
        return res.status(400).json({error: "invalid amount"})
    }
    if(
        !type || 
        typeof(type) !== "string" || 
        (type !== "INCOME"  && type !== "EXPENSE")|| 
        type.trim() === ""
    )
    {
        return res.status(400).json({error: "invalid type"})
    }
    if(Number.isNaN(occurredDate.getTime()) ){
        return res.status(400).json({error: "invalid occurredAt"})
    }
    if(categoryId){
        if(typeof(categoryId) !== "string" || categoryId.trim() === ""){
            return res.status(400).json({error: "invalid category id"})
        }
    }

    try{
        const transaction = await createTransaction(userId,type,occurredDate,amount,categoryId)
        return res.status(201).json({transaction})
    }catch(e){
        if(e instanceof Error){
            if(e.message === "Category not found"){
                return res.status(404).json({error: e.message})
            }
            return res.status(500).json({error: "Internal server error"})
        }
        return
    }
})
router.get("/",authorization,verifyJWT,async(req,res)=>{
    
})
router.patch("/:id",authorization,verifyJWT,async(req,res)=>{
    
})
router.delete("/:id",authorization,verifyJWT,async(req,res)=>{
    
})

export default router