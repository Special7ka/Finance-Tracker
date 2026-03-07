import { getPrisma } from "../db/prisma";


export async function getCategoriesByUserId(userId: string) {
    const prisma = getPrisma();
    const userCategories = await prisma.category.findMany({
        where:{userId}
    });

    return userCategories;
}

export async function updateCategory(userId: string, categoryID: string, newName: string){
    const prisma = getPrisma();

    const userCategory = await prisma.category.findFirst({
        where:{id: categoryID, userId: userId}
    })
    if(!userCategory){
        throw new Error("Category not found")
    }
    if(userCategory?.name === newName){
        return userCategory;
    }
    

    const exists = await prisma.category.findFirst({
        where:{
            userId:userId,
            name: newName,
            NOT: {id:categoryID}
        }
    })
    if(exists){
        throw new Error("Category already exist")
    }

    const newCategory =  await prisma.category.update({where:{id:categoryID}, data:{name: newName}})

    return newCategory;
}