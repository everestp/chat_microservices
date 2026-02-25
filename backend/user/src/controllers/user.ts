import crypto from "crypto";
import { publishToQueue } from "../config/rabbitmq.js";
import { TryCatch } from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { User } from "../models/User.js";
import { generateToken } from "../config/generateToke.js";

export const loginUser = TryCatch(async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const rateLimitKey = `otp:ratelimit:${email}`;
  const rateLimit = await redisClient.get(rateLimitKey);

  if (rateLimit) {
    return res.status(429).json({
      message: "Too many requests. Please wait before requesting a new OTP.",
    });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpKey = `otp:${email}`;

  await Promise.all([
    redisClient.set(otpKey, otp, { EX: 300 }),
    redisClient.set(rateLimitKey, "true", { EX: 60 }),
  ]);

  console.log(`OTP generated for: ${email}`);

  const message = {
    to: email,
    subject: "Your OTP code",
    body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await publishToQueue("send-otp", message);
  } catch (err) {
    await redisClient.del(otpKey);
    return res.status(500).json({ message: "Failed to send OTP. Try again." });
  }

  res.status(200).json({ message: "OTP sent to your email" });
});



export const verifyUser = TryCatch(async(req  ,res)=>{
  const {email , otp:enteredOtp} = req.body

  if(!email || !enteredOtp){
    res.status(400).json({
      message:"Email and Otp Required"
    })

    return
  }
  const otpKey = `otp:${email}`
  const storedOtp = await redisClient.get(otpKey);
  if(!storedOtp || storedOtp !== enteredOtp){
    res.status(400).json({
      message:"Invalid or expired otp"
    });
    return
  }
await redisClient.del(otpKey)
let user = await User.findOne({email});
if(!user){
   const name = email.slice(0,8);
   user = await User.create({name ,email})
}
const token = generateToken(user)
res.json({
  message :"USer verified",
  user ,
  token
})

})