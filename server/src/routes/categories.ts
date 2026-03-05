import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";

const router = Router();

router.get("/", verifyJWT, async(req, res) =>{
    res.json([])
})

export default router