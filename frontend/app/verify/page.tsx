"use client"
import { ArrowRight, ChevronLeft, Loader, Lock } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie'

const VerifyOTP = () => {
  const [loading ,setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(["","","","","",""])
  const [error, setError] = useState<string>("")
  const [resendLoading, setResendLoading] = useState<boolean>(false)
  const [timer, setTimer] = useState(60)
  const inputRefs = useRef<Array<HTMLInputElement>>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email:string = searchParams.get("email") || ""
  // Timer countdown
  useEffect(()=>{
    if(timer > 0){
      const interval = setInterval(()=>{
        setTimer(prev => prev - 1);
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  // Input change
  const handleInputChange = (index:number, value:string) => {
    if(value.length > 1) return;
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    if(value && index < 5){
      inputRefs.current[index + 1]?.focus();
    }
  }

  // Backspace handling
  const handleKeyDown = (index:number, e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Backspace" && !otp[index] && index > 0){
      inputRefs.current[index - 1]?.focus();
    }
  }

  // Paste handling
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0,6);
    if (digits.length === 6){
      const newOtp = digits.split("")
      setOtp(newOtp)
      inputRefs.current[5]?.focus();
    }
  }

  // Submit OTP
  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const otpString = otp.join("");
    if(otpString.length !== 6) {
      setError("Please enter all 6 digit")
  return
    }

    setError("")
    setLoading(true)
try {
  const {data}=  await axios.post(`http://localhost:5001/api/v1/verify`,{
    email,
    otp:otpString
  })
  alert(data.message)
  Cookies.set("token",data.token,{
    expires: 15,
    secure :false,
    path: "/"

  });
  setOtp(["","","","","",""])
  inputRefs.current[0]?.focus()
 
} catch (error:any) {
  setError(error.respose.data.message)
} finally{
  setLoading(false)
}
  
  }

  const handleResendOtp = async ()=>{
    setResendLoading(true);
    setError("")
    try {
      const {data}= await axios.post(`http://localhost:5001/api/v1/login`,{
email
      })
      alert(data.message)
      setTimer(60)
    } catch (error : any) {
      setError(error.respose.data.message)
    } finally{
      setResendLoading(false)
    }
      
  }

  return (
     <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
       <div className='max-w-md w-full'>
        <div className='bg-gray-800 border border-gray-700 rounded-lg p-8 mb-6'>
            <button className='absolute top-10 left-0 p-2 text-gray-300 hover:text-white'
            onClick={()=>router.push("/login")}
            >
              <ChevronLeft className='w-6 h-6'/>
              
              </button>
          <div className='mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6'>

            <Lock size={40} className='text-white'/>
          </div>
          <h1 className='text-4xl font-bold text-white mb-3'>
            Verify Your Email
          </h1>
          <p className='text-gray-300 text-lg'>We have sent a 6-digit code to</p>
          <p className='text-blue-400 font-medium'>{email}</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex gap-2 justify-center'>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el: HTMLInputElement)=>{
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className='w-12 h-12 text-center text-white text-xl bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500'
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className='text-center text-gray-400 disabled:opacity-50'>
            {timer > 0 ? `Resend OTP in ${timer}s` : <button type="button" className='text-blue-500 underline hover:text-blue-300 disabled:opacity-50 cursor-pointer ' disabled={resendLoading} onClick={handleResendOtp}>Resend OTP</button>}
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={loading}
          >
            {loading ? (
              <div className='flex items-center justify-center gap-2'>
                <span>Verifying OTP ...</span>
                <Loader className='w-5 h-5'/>
              </div>
            ) : (
              <div className='flex items-center justify-center gap-2'>
                <span>Verify</span>
                <ArrowRight className='w-5 h-5'/>
              </div>
            )}
          </button>
        </form>
       </div>
    </div>
  )
}

export default VerifyOTP