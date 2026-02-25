import amqp from "amqplib";
import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";

configDotenv();

const startSendOtpConsumer = async () => {
  try {
    const connection = await amqp.connect(
      `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:5672`
    );

    const channel = await connection.createChannel();
    const queueName = "send-otp";

    await channel.assertQueue(queueName, { durable: true });

    console.log("✅Mail service consumer started, listening for OTP emails");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
        const { to, subject, body } = JSON.parse(msg.content.toString());
        console.log("📩 Received OTP message for:", to,msg);

        await transporter.sendMail({
          from: `"ChatApp" <${process.env.USER}>`,
          to,
          subject,
          text: body,
        });

        console.log(`OTP mail sent to ${to}`);
        channel.ack(msg);
      } catch (error) {
        console.error("Failed to send OTP:", error);
        channel.nack(msg, false, false); // discard failed message
      }
    });
  } catch (error) {
    console.error("Failed to start RabbitMQ consumer:", error);
    // Retry after 5s
    setTimeout(startSendOtpConsumer, 5000);
  }
};

export default startSendOtpConsumer;