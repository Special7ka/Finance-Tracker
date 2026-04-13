import { getPrisma } from "../db/prisma";

export const getSummary = async (userId:string) =>{
    const prisma = getPrisma()

    const userTransactions = await prisma.transaction.findMany({where:{
        userId:userId,
    }})

    let income = 0, expense = 0, balance = 0

    userTransactions.forEach(transaction => {
        if(transaction.type === "INCOME"){
            income += transaction.amount
        } else
        if(transaction.type === "EXPENSE"){
            expense += transaction.amount
        }
    });

    balance = income - expense

    return {expense,income, balance}
}