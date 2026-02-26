import express from  "express"
import isAuth from "../middleware/isAuth.js";
import { createNewChat, getAllChats, sendMessage } from "../controllers/chat.js";
import { upload } from "../middleware/multer.js";


const chatRouter  = express.Router()
chatRouter.post("/chat/new",isAuth, createNewChat)
chatRouter.get("/chat/all",isAuth, getAllChats)
chatRouter.post("/message",isAuth , upload.single("image"), sendMessage)



export  default chatRouter;