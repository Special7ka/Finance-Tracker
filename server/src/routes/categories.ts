import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { authorization } from "../middlewares/parseAuthorization";
import { getCategoriesByUserId, updateCategory } from "../services/categories.service";

const router = Router();

router.get("/",authorization, verifyJWT, async(req, res) =>{
    const userId = (req as any).userId
    const categories = await  getCategoriesByUserId(userId)
    res.json(categories)
})

router.patch("/:id",authorization,verifyJWT, async(req, res) =>{
    const userId = (req as any).userId
    const categoryID = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const name = req.body.name

    if(!name || name.trim() === ""  ){
        return res.status(400).json({error:"invalid name"})
    }

    const newCategory  = await updateCategory(userId, categoryID, name)
    
    return  res.status(200).json({message: "successfully updated", category: newCategory})
})

export default router