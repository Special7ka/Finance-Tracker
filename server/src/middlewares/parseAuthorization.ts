import { Request, Response, NextFunction } from "express";

export const authorization = (req: Request,res: Response, next: NextFunction) =>{
    
    const authHeaders = req.headers.authorization;
    

    if (!authHeaders || !authHeaders.startsWith("Bearer ")){
        res.status(401).json({message:"need authorization"})
        return
    }

    const token = authHeaders.split(" ")[1] 
    if(!token){
        res.status(401).json({message:"need authorization"})
        return
    }
    (req as any).token = token;

    next();
    
    return;
} 