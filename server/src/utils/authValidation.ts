import { BadRequestError } from "../errors"

interface UserCredentials{
    email: string,
    password: string
}

const extractCredentials = (body:unknown) =>{
    if(typeof body !== "object" || body == null){
        throw new BadRequestError("Invalid body")
    }
    
    const {email, password} = body as Record<string, unknown>

    if(typeof email !== "string" || email.trim() === ""){
        throw new BadRequestError("Invalid email")
    }

    if(typeof password !== "string" || password.trim() === ""){
        throw new BadRequestError("Invalid password")
    }

    return {email, password}
}

export const validateRegistrationBody = (body:unknown) : UserCredentials =>{

    const {email,password} = extractCredentials(body)

    if(!email.includes("@")){
        throw new BadRequestError("Email must contain @")
    }
    
    if(password.length < 6){
        throw new BadRequestError("Password must be at least 6 charachters")
    }

    return {email,password}
}


export const validateLoginBody = (body:unknown): UserCredentials =>{

  const {email,password} = extractCredentials(body)

    return {email,password}
}
