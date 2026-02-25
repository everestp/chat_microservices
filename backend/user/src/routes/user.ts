import express from 'express'
import { getAllUser, getAUser, loginUser, myProfile, updateName, verifyUser } from '../controllers/user.js';
import { IsAuth } from '../middleware/isAuth.js';

const userRouter = express.Router()
userRouter.post("/login",loginUser)
userRouter.post("/verify",verifyUser)
userRouter.get("/me",IsAuth ,myProfile)
userRouter.get("/user/all",IsAuth,getAllUser);
userRouter.get("/user:id",IsAuth , getAUser)
userRouter.post("/update/user",IsAuth ,updateName)


export default userRouter;