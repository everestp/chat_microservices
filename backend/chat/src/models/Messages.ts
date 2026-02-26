

import mongoose, { Types ,Document ,Schema }  from "mongoose";


export interface IMessage extends Document {
    chatId:Types.ObjectId;
    sender:string;
    text? :string;
    images?: {
        url :string;
        publicId :string
    };
     messageType :"text" | "images";
     seen:boolean;
     seenAt:Date;
     createdAt :Date;
     updatedAt: Date;
}


const schema =  new Schema<IMessage>({
    chatId :{
        type :Schema.Types.ObjectId,
        ref:"Chat",
        required :true,
    },
  sender :{
    type:String,
    required:true
  },
  text :String,
  images:{
    url:String,
    publicId :String
  },
  messageType :{
    type:String,
    enum :["text","images"],
    default:"text"
  },
  seen :{
    type: Boolean,
    default :false,
  },
  seenAt :{
    type: Date,
    default :null,
  }
},{timestamps :true})

export const Messages = mongoose.model<IMessage>("Messages", schema)