"use client";

import { ArrowRight, Loader, Mail } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppData, user_service } from "@/context/AppContext";
import Loading from "@/component/Loading";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { isAuth, loading: userLoading } = useAppData();

  useEffect(() => {
    if (!userLoading && isAuth) {
      router.replace("/chat");
    }
  }, [userLoading, isAuth, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/login`,
        { email: email.trim() }
      );

      toast.success(data.message);

      router.push(`/verify?email=${email}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading) return <Loading />;
  if(isAuth) return  redirect("/chat")
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-lg p-8">

        <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
          <Mail size={40} className="text-white" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-3">
          Welcome to Chat App
        </h1>

        <p className="text-gray-300 text-lg mb-6">
          Enter your email to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            required
            className="w-full px-4 py-4 bg-gray-700 border-gray-600 rounded-lg text-white"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <span>Sending OTP...</span>
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Send verification code</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;