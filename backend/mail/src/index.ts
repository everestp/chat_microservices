import express from "express";
import { configDotenv } from "dotenv";
import startSendOtpConsumer from "./consumer.js";

configDotenv();

const app = express();
const port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await startSendOtpConsumer();

    app.listen(port, () => {
      console.log(`🚀 Mail Service running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();