import { Router } from "express";
import { register, login } from "../services/auth.service";

const router = Router();

router.post("/register",async (req,res,next) =>{
    const { email, password } = req.body;

    if(typeof email !== "string" || email.trim() === "" || !email.includes("@")){
        res.status(400).json("Неверно задана почта")
        return;
    }

    if( typeof password !== "string" ) {
        res.status(400).json("Неверный тип пароля")
        return;
    }  

    if( password.length < 6){
        res.status(400).json("Неверная длина пароля")
        return;
    }

    try{
    
    const token  = await register(email,password)
    
    res.status(201).json({token})
    return;
    
    } catch(e){
        if(e instanceof Error){
            if(e.message === "User already exists"){
            res.status(409).json({error: e.message})
            return
            }
            return next(e)
        }
    }
})

    router.post("/login", async (req, res, next ) =>{
        
        const {email, password} = req.body;

        if(typeof email !== "string" ||  typeof password !== "string"|| email.trim() === "" || password.trim() === ""  ){
            res.status(400).json({message:"bad login or password"})
            return
        }

        try{
            const token =  await login(email,password)
            res.status(200).json({token})
            return
        }catch(e){
            if(e instanceof Error){
                if(e.message === "Invalid credentials"){
                    res.status(401).json({message:"Invalid credentials"})
                    return
                }
                return next(e)
            }
        }
    })

export default router;