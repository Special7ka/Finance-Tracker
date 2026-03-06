import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { authorization } from "../middlewares/parseAuthorization";

const router = Router();

router.get("/",authorization, verifyJWT, async(req, res) =>{
    res.json([])
})

export default router