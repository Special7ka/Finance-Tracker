import { Router } from "express";
import { authorization } from "../middlewares/parseAuthorization";
import { verufJWT } from "../middlewares/verifyJWT";
import { getPrisma } from "../db/prisma"
 
const router = Router()

router.get("/",authorization,verufJWT, async(req,res) =>{

    const userId = (req as any).userId;
    const prisma = getPrisma();

    const userInfo = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            email: true
        }
    })

    if (!userInfo){
        res.status(404).json({message: "User not found"})
        return
    }
    return res.status(200).json(userInfo)
})

export default router;