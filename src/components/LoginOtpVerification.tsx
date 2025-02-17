// components/LoginOtpVerification.tsx
'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoginResponse } from '@/contexts/AuthContext'

// OTP validation schema
const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" })
})

// Type for OTP form values
type OtpFormValues = z.infer<typeof otpSchema>

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"
// Props interface for OTP Verification
interface LoginOtpVerificationProps {
  email: string;
  onVerificationSuccess: (data: LoginResponse) => void;
  onBack: () => void;
}

export const LoginOtpVerification: React.FC<LoginOtpVerificationProps> = ({
  email,
  onVerificationSuccess,
  onBack
}) => {

 {
  // Error state
  const [error, setError] = useState<string | null>(null)
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Resend OTP state
  const [canResendOtp, setCanResendOtp] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(60)

  // React Hook Form initialization
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  })

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResendOtp) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to resend OTP')
      }

      // Reset resend OTP countdown
      startResendCountdown()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Start resend OTP countdown
  const startResendCountdown = () => {
    setCanResendOtp(false)
    setResendCountdown(60)

    const countdownInterval = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setCanResendOtp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // OTP verification submission handler
  const onSubmit = async (data: OtpFormValues) => {
    // Reset previous errors
    setError(null)
    setIsLoading(true)

    try {
      // Send OTP verification request
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: data.otp }),
      })

      // Handle response
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'OTP verification failed')
      }

      const loginData: LoginResponse = await response.json()

      // Trigger verification success callback
      onVerificationSuccess(loginData)
    } catch (err) {
      // Handle errors
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      // Reset loading state
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">OTP Verification</CardTitle>
        <CardDescription>Enter the 6-digit OTP sent to {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter 6-digit OTP" 
                      maxLength={6}
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <Button 
            variant="link" 
            type="button"
            onClick={handleResendOtp}
            disabled={!canResendOtp || isLoading}
          >
            Resend OTP
          </Button>
          {!canResendOtp && (
            <span className="text-sm text-gray-500">
              (Resend in {resendCountdown}s)
            </span>
          )}
        </div>
        {onBack && (
          <Button 
            variant="outline" 
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="w-full mt-2"
          >
            Back to Login
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
}
