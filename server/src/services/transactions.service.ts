import { getPrisma } from "../db/prisma";
import { TransactionType } from "@prisma/client";

export async function createTransaction(userId:string,type: TransactionType,occurredAt: Date,amount: number, categoryId?:string, ) {
    const prisma = getPrisma()
    

    if(categoryId){
        const category = await prisma.category.findUnique({where:{
        id:categoryId
        }})

        if(userId !==category?.userId){
            throw new Error("category not found")
        }
    }
    
    const newTransaction = await prisma.transaction.create({data:{
        userId:userId,
        type:type,
        occurredAt:occurredAt,
        categoryId:categoryId,
        amount:amount
    }})

    return newTransaction;
}
export async function getTransactions(userId:string,categoryId:string ) {
    const prisma = getPrisma()
}
export async function updateTransaction(userId:string,transactionId:string) {
    const prisma = getPrisma()
}
export async function deleteTransaction(userId:string,transactionId:string) {
    const prisma = getPrisma()
}