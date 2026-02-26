"use client";

import React, { Suspense } from "react";
import VerifyOTP from "@/component/VerifyOtp";
import Loading from "@/component/Loading";

const VerifyPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyOTP />
    </Suspense>
  );
};

export default VerifyPage;