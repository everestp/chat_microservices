import { configDotenv } from 'dotenv';
import express from 'express'
import connectDB from './config/db.js';
import {createClient} from "redis"
configDotenv()
connectDB()

export const redisClient =  createClient({
    url:process.env.REDIS_URL,
});
redisClient.connect()
.then(()=> console.log("Connected to redis"))
.catch(()=>console.log("connected to redis"))
const app = express();
const port = process.env.PORT;
app.listen(port , ()=>{
    console.log("Server is running")
})
