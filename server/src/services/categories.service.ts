import { getPrisma } from "../db/prisma";


export async function getCategoriesByUserId(userId: string) {
    const prisma = getPrisma();
    const userCategories = await prisma.category.findMany({
        where:{userId}
    });

    return userCategories;
}