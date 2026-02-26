"use client";

import Loading from "@/component/Loading";
import { useAppData } from "@/context/AppContext";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ChatPage = () => {
  const { loading, isAuth } = useAppData();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !isAuth) {
  //     router.push("/login");
  //   }
  // }, [loading, isAuth, router]);


 ;

  return (
    <div>
      <h1>Chat ChatPage</h1>
    </div>
  );
};

export default ChatPage;