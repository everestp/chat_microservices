
import { monitoring } from "googleapis/build/src/apis/monitoring/index.js";
import mongoose ,{Document,Schema} from "mongoose";
export  interface IChat extends Document{
 users :string[];
 latestMessage :{
  text:string,
  sender :string;
 }
 createdAt :Date;
 updateAt:Date
}

const  schema :Schema<IChat> = new Schema({
    users: [{type :String , required :true}],
    latestMessage :{
          text:String,
          sender:String
    }
},{timestamps :true})



export const Chat = mongoose.model<IChat>("Chat",schema)