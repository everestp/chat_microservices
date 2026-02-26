import { configDotenv } from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import { createClient } from "redis";
import userRouter from "./routes/user.js";
import connectRabbitMQ from "./config/rabbitmq.js";
import cors from "cors"
configDotenv();

connectDB();
  connectRabbitMQ();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect()
  .then(() => console.log("Connected to Redis"))
  .catch(() => console.log("Failed to connect Redis"));

const app = express();
app.use(cors()); // allow all origins
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/v1", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});