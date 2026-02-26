import mongoose  from "mongoose";


const connectDB = async ()=>{
    const  url = process.env.MONGO_URI;

    if(!url){
        throw new  Error("MONGO_URI is not defined in env");
        
    }

    try {

         await mongoose.connect(url , {
            dbName :"Chatappmicroservices"
         })
console.log("Connect to mongodb")

    } catch (error) {
        console.error("Failed to connect to mongodb")
        process.exit(1)
    }

}

export default connectDB