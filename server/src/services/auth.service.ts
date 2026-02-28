
import { getPrisma } from "../db/prisma";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"

export async function register(email: string, password: string): Promise<string>{
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({where: {email}}) 

    if(user){
        throw new Error("User already exists")
    }

    const cryptPass = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            email: email,
            passwordHash: cryptPass,
        }
    })

    if(process.env.JWT_SECRET === undefined){
        throw new Error("JWT undefined")
    }

    const secret = process.env.JWT_SECRET

    const token =  jsonwebtoken.sign({userId: newUser.id }, secret, { expiresIn: "7d" })

    return token;
}

export async function login(email:string, password:string): Promise<string> {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({where:{email}})
    

    if(!user){
        throw new Error("Invalid credentials")
    }

    const verif = await bcrypt.compare(password, user.passwordHash)

    if(!verif ){
        throw new Error("Invalid credentials")
    }

    if(process.env.JWT_SECRET === undefined){
        throw new Error("JWT undefined")
    }
    const secret = process.env.JWT_SECRET
    const token = jsonwebtoken.sign({userId: user.id }, secret, { expiresIn: "7d" })

    return token
}