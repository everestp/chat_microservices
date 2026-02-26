import { configDotenv } from 'dotenv'
import express from 'express'
import connectDB from './config/db.js'
import chatRouter from './routes/chat.js'

configDotenv()
connectDB()
const app = express()
app.use(express.json)
app.use("/api/v1",chatRouter)
const port = process.env.PORT;

app.listen(port ,()=>{
console.log("Server is running on port :",port)
})