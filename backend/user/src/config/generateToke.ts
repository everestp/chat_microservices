import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"

configDotenv()

const JWT_SECRET = process.env.JWT_SECRET as string;


export const  generateToken =  (user:any)=>{
  return jwt.sign({user},JWT_SECRET, {expiresIn :"15d"})
}


