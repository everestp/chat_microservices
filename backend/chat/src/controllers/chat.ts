import axios from "axios";
import { TryCatch } from "../config/TryCatch.js";
import { AuthenticateRequest } from "../middleware/isAuth.js";
import { Chat } from "../models/Chat.js";
import { Messages } from "../models/Messages.js";
import { setCommentRange } from "typescript";


export const createNewChat = TryCatch(
       async(req:AuthenticateRequest ,res)=>{
             const userId = req.user?._id;
             const {otherUserId} = req.body;

             if(!otherUserId){
              res.status(400).json({
                     message:"Other UserId is required"
              })
              return;
             }
        const existingChat = await Chat.findOne({
              users :{$all :[userId ,otherUserId],$size :2}
        })
        if(existingChat){
              res.json({
                     message:"chat already exiists",
                     chatId : existingChat._id,
              })
              return
        }

        const newChat = await Chat.create({
               users :[userId , otherUserId]
        })
          res.status(201).json({
              message :"New Chat created",
               chatId :newChat._id,
          })
       }
)

export const getAllChats = TryCatch(
  async (req: AuthenticateRequest, res) => {

    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({
        message: "UserId missing",
      });
    }

    // get chats
    const chats = await Chat.find({
      users: userId,
    }).sort({ updatedAt: -1 });

    const chatWithUserData = await Promise.all(
      chats.map(async (chat) => {

        // find other user
        const otherUserId = chat.users.find(
          (id) => id.toString() !== userId.toString()
        );

        // unseen messages
        const unseenCount = await Messages.countDocuments({
          chatId: chat._id,
          sender: { $ne: userId },
          seen: false,
        });

        try {
          const { data } = await axios.get(
            `${process.env.USER_SERVICE}/${otherUserId}`
          );

          return {
            user: data,
            chat: {
              ...chat.toObject(),
              latestMessage: chat.latestMessage || null,
              unseenCount,
            },
          };

        } catch (error) {
          console.log("User service error:", error);

          return {
            user: {
              _id: otherUserId,
              name: "Unknown User",
            },
            chat: {
              ...chat.toObject(),
              latestMessage: chat.latestMessage || null,
              unseenCount,
            },
          };
        }
      })
    );

    res.json({
      chats: chatWithUserData,
    });
  }
);


export const sendMessage = TryCatch(async(req:AuthenticateRequest ,res )=>{
       const senderId = req.user?._id;
       const {chatId , text}= req.body;
       const imageFile = req.file;
       if(!senderId){
              res.status(401).json({
              message:"unauthorized",
              })
              return;
       }
          if(!chatId){
              res.status(400).json({
              message:"ChatId required",
              })
              return;
       }
             if(!text  &&  !imageFile){
              res.status(400).json({
              message:"Either text or image is required",
              })
              return;
       }
const chat = await Chat.findById(chatId);
if(!chat){
       res.status(404).json({
              message:"Chat not found",
              })
              return; 
}
const isUserInChat = chat.users.some(
       (userId)=>userId.toString() === senderId.toString()
)
  if(!isUserInChat){
              res.status(401).json({
              message:"your are not a participant of this chat",
              })
              return;
       }
       const otherUserId = chat.users.find(
             (userId)=>userId.toString() !== senderId.toString()
       )
        if(!otherUserId){
              res.status(401).json({
              message:"No other user",
              })
              return;
       }
       //TODO :Socket Setup
       let messageData : any = {
              chatId :chatId,
              sender:senderId,
              seen :false,
              seenAt:undefined

       }

       if(imageFile){
              messageData.image = {
                     url:imageFile.path,
                     publicId :imageFile.filename,
              };
              messageData.messageType = "image";
              messageData.text = text || ""
       } else{
              messageData.text = text;
               messageData.messageType = "text"
       }

       const message = new Messages(messageData)
       const saveMessage = await message.save();
       const latestMessageText = imageFile? "📷 Images":text
       await Chat.findByIdAndUpdate(chatId ,{
              latestMessage :{
                     text :latestMessageText,
                     sender:senderId
              },
              updateAt:new Date()
       },{new :true})

       //emit to scoket
       res.status(201).json({
              message:saveMessage,
              senderId :senderId
       })

})
