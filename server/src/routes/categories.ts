import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { authorization } from "../middlewares/parseAuthorization";
import { getCategoriesByUserId } from "../services/categories.service";

const router = Router();

router.get("/",authorization, verifyJWT, async(req, res) =>{
    const userId = (req as any).userId
    const categories = await  getCategoriesByUserId(userId)
    res.json(categories)
})

export default router