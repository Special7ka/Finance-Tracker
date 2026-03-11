import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { authorization } from "../middlewares/parseAuthorization";
import { getCategoriesByUserId, updateCategory, createCategory, deleteCategory } from "../services/categories.service";
import { json } from "node:stream/consumers";
import { error } from "node:console";



const router = Router();

router.post("/", authorization, verifyJWT, async(req, res) =>{
    const userId = (req as any).userId;
    const name = req.body.name

    if(!name || typeof(name) !== "string" || name.trim() ===""){
        res.status(400).json({error: "invalid name"})
        return
    }
    try{
        const newCategory = await createCategory(userId,name)
        return  res.status(201).json({message:"successfully created", category: newCategory})
    }catch(e){
        if(e instanceof Error){
            res.status(500).json({error: e.message})
            return
        }
    }
})

router.get("/",authorization, verifyJWT, async(req, res) =>{
    const userId = (req as any).userId
    const categories = await  getCategoriesByUserId(userId)
    res.json(categories)
})

router.patch("/:id",authorization,verifyJWT, async(req, res) =>{
    const userId = (req as any).userId
    const categoryID = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const name = req.body.name

    if(!name || typeof(name) !== "string" || name.trim() === ""  ){
        return res.status(400).json({error:"invalid name"})
    }

    try{
    const newCategory  = await updateCategory(userId, categoryID, name)
    return  res.status(200).json({message: "successfully updated", category: newCategory})

    }catch(e){
        if(e instanceof Error){
            if(e.message === "Category not found"){
                return res.status(404).json({error: "Category not found"})
            }

            return res.status(500).json({error: "Internal server error"})
        }
    }
})
router.delete("/:id", authorization,verifyJWT, async(req, res)=>{
    const userId = (req as any).userId 
    const categoryID = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id

    try{
        await deleteCategory(userId,categoryID)
        return res.status(204).send()
    }catch(e){
        if(e instanceof(Error)){
            res.status(404).json({error:"Category not found"})
            return
        }
    }
})
export default router