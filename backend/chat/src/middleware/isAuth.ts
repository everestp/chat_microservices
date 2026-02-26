
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User.js";

interface IUser extends Document  {
    _id : string;
    name :string;
    email:string;
}

export interface AuthenticateRequest extends Request{
    user? :IUser | null;
}

export const isAuth = async(req:AuthenticateRequest , res: Response , next:NextFunction): Promise<void> =>{
    try {
          const authHeader = req.headers.authorization;

    //  Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please Login",
      });
      return;
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    
    //  Verify token
    const decodedValue = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if(!decodedValue || !decodedValue.user){
        res.status(401).json({
            message :"Invalid Token"
        })

        return
    }

    //  Attach user to request
    req.user= decodedValue.user;

    next();
    } catch (error) {
          res.status(401).json({
      message: "Please Login",
    });
    }
}

export default isAuth;