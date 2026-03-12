import { getPrisma } from "../db/prisma";
import { TransactionType } from "@prisma/client";

export async function createTransaction(userId:string,type: TransactionType,occurredAt: Date, categoryId:string, amount: number) {
    const prisma = getPrisma()
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