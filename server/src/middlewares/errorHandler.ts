import { Request, Response, NextFunction } from 'express'

 const badRequestErrors = [
  "invalid amount",
  "invalid type",
  "invalid occurredAt",
  "invalid body",
  "invalid query",
  "invalid categoryId",
  "invalid data",
  "invalid from",
  "invalid to"
 ]

 const notFoundErrors = [
  "Category not found",
  "Transaction not found",
 ]

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

 if(err instanceof Error){
  if (err instanceof Error) {
  console.error(err.stack)
} else {
  console.error(err)
}
    if(notFoundErrors.includes(err.message)){
    return res.status(404).json({error: err.message})
  }

  if(badRequestErrors.includes(err.message)){
    return res.status(400).json({error: err.message})
  }

 }

 return res.status(500).json({error: "Internal server error"})
}

