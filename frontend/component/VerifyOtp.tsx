"use client";

import { ArrowRight, ChevronLeft, Loader, Lock } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useAppData, user_service } from "@/context/AppContext";
import Loading from "./Loading";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const { isAuth, setisAuth, setUser, loading: userLoading,fetchChats,fetchUsers } = useAppData();

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otpLoading, setOtpLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  /* ---------------- PROTECT PAGE ---------------- */

  useEffect(() => {
    if (!email) router.replace("/login");
  }, [email, router]);

  useEffect(() => {
    if (!userLoading && isAuth) {
      router.replace("/chat");
    }
  }, [isAuth, userLoading, router]);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- INPUT CHANGE ---------------- */

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ---------------- BACKSPACE ---------------- */

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ---------------- PASTE ---------------- */

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (digits.length === 6) {
      setOtp(digits.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  /* ---------------- VERIFY OTP ---------------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      setOtpLoading(true);

      const { data } = await axios.post(
        `${user_service}/api/v1/verify`,
        {
          email,
          otp: otpString,
        }
      );

      toast.success(data.message);

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      setUser(data.user);
      setisAuth(true);
      fetchChats()
      fetchUsers()
      

      router.replace("/chat");
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Verification failed"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      const { data } = await axios.post(
        `${user_service}/api/v1/login`,
        { email }
      );

      toast.success(data.message);
      setTimer(60);
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (userLoading) return <Loading />;
if(isAuth) redirect("/chat")
  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-8 mb-6">

          <button
            className="absolute top-4 left-4 text-gray-300 hover:text-white"
            onClick={() => router.push("/login")}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
            <Lock size={40} className="text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">
            Verify Your Email
          </h1>

          <p className="text-gray-300 text-lg">
            We sent a 6-digit code to
          </p>

          <p className="text-blue-400 font-medium">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) =>
                  handleInputChange(index, e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-white text-xl bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 outline-none"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="text-center text-gray-400">
            {timer > 0 ? (
              `Resend OTP in ${timer}s`
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-blue-500 underline hover:text-blue-300"
              >
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={otpLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {otpLoading ? (
              <div className="flex justify-center gap-2">
                <span>Verifying...</span>
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <div className="flex justify-center gap-2">
                <span>Verify</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;