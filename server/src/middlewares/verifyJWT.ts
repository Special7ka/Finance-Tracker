import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
console.log("VERIFY JWT FILE:", __filename);

interface AuthPayload {
  userId: number
}

export const verufJWT = (req: Request, res: Response, next: NextFunction) => { 

    const token = (req as any).token
    if(!token){
        res.status(401).json({message:"Unauthorized"})
        return
    }   
    const JWT = process.env.JWT_SECRET as string

    try {
        const decoded = jwt.verify(token, JWT) as AuthPayload;
        console.log(decoded);
        (req as any).userId = decoded.userId;
        next()
        return
    }catch(e){
        res.status(401).json({message:"Unauthorized"})
        return 
    } 
}