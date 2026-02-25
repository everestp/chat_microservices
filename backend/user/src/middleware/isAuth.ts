import { NextFunction } from "express";
import { IUser } from "../models/User.js";


 export interface AuthenticateRequest extends Request {
    user? : IUser | null;
 }


 export  const IsAuth = async(req:AuthenticateRequest , res:Request , next:NextFunction): Promise<void> =>{
    try {
        const authHeader = req.headers.authorizations
        if(!authHeader || !authHeader.startWith("Bearer ")){
            res.status(401).json({
                message :"Please Login"
            })
            return ;
        }

    const tokem = authHeader.spli(" ")[1]
    const decodedValue = JsonWebTokenE 
    } catch (error) {
        
    }
 }