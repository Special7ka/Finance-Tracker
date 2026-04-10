import { GetSummaryValidated } from "../types/summary"
import { BadRequestError } from "../errors"


export const validateGetSummary =  (query:unknown):GetSummaryValidated =>{ 
    const data: GetSummaryValidated = {}

    if(typeof query !== "object" || query === null){
        throw new BadRequestError("Invalid query")
    }

       
    const q = query as {
        from?: unknown,
        to?:unknown
    }

    const to = q.to
    let toDate:Date | undefined = undefined;

    if(to !== undefined){
        if(typeof to !== "string" || to.trim() === ""){
            throw new BadRequestError("Invalid to")
        }

         toDate = new Date(to)

        if(Number.isNaN(toDate.getTime())){
            throw new BadRequestError("Invalid to")
        }

        data.to = toDate
    }

    const from = q.from
    let fromDate:Date | undefined = undefined

    if(from !== undefined){
        if(typeof from !== "string" || from.trim() === ""){
            throw new BadRequestError("Invalid from")
        }

         fromDate = new Date(from)

        if(Number.isNaN(fromDate.getTime())){
            throw new BadRequestError("Invalid from")
        }

        data.from = fromDate
    }

    if(toDate !== undefined && fromDate !== undefined && toDate < fromDate ){
        throw new BadRequestError("Invalid date range")
    }

    return data
}