import express from 'express'
import { getAllUser, getAUser, loginUser, myProfile, updateName, verifyUser } from '../controllers/user.js';
import { isAuth } from '../middleware/isAuth.js';

const userRouter = express.Router()
userRouter.post("/login",loginUser)
userRouter.post("/verify",verifyUser)
userRouter.get("/me",isAuth ,myProfile)
userRouter.get("/user/all",isAuth,getAllUser);
userRouter.get("/user:id",isAuth , getAUser)
userRouter.post("/update/user",isAuth ,updateName)


export default userRouter;