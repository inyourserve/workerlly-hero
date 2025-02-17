// app/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/LoginForm'
import { LoginOtpVerification } from '@/components/LoginOtpVerification'
import { LoginResponse } from '@/contexts/AuthContext'

export default function Home() {
  const [loginStep, setLoginStep] = useState<'login' | 'otp'>('login')
  const [email, setEmail] = useState<string>('')
  const { login } = useAuth()
  const router = useRouter()

  const handleLoginSuccess = (email: string) => {
    setEmail(email)
    setLoginStep('otp')
  }

  const handleVerificationSuccess = (data: LoginResponse) => {
    // Use the login method from AuthContext
    login(data)
    
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const handleBackToLogin = () => {
    setLoginStep('login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loginStep === 'login' ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <LoginOtpVerification 
          email={email} 
          onVerificationSuccess={handleVerificationSuccess}
          onBack={handleBackToLogin}
        />
      )}
    </div>
  )
}