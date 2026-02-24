import { Request, Response, NextFunction } from "express";

export  const errorHandler = (err: unknown, req:Request, res:Response, next:NextFunction ) => {

    let message = "Internal server error"

    if(err instanceof Error){
        message = err.message
    }
    res.status(500).json({error : message})
}