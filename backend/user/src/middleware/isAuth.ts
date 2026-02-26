import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User } from "../models/User.js";


export interface AuthenticateRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    //  Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    //  Attach user to request
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};