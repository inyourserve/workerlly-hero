//components/OTPVerificationForm.tsx
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { LoginResponse } from "@/contexts/AuthContext"
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  otp: z
    .string()
    .length(4, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
})

type FormValues = z.infer<typeof formSchema>

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://139.59.59.53:8000/api/v1"

interface OTPVerificationFormProps {
  email: string
  mobile: string
  onVerificationSuccess: (response: LoginResponse) => void
}

export function OTPVerificationForm({ email, mobile, onVerificationSuccess }: OTPVerificationFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setError(null)
    setIsLoading(true)

    try {
      console.log('Submitting OTP verification:', {
        email,
        otp: data.otp,
      })

      const response = await fetch(`${API_BASE_URL}/admin/verify-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: data.otp,
        }),
      })

      const responseData = await response.json()
      console.log('Server response:', responseData)

      if (!response.ok) {
        throw new Error(responseData.detail || responseData.message || "OTP verification failed")
      }

      // Transform the response data to match the new LoginResponse interface
      const loginResponse: LoginResponse = {
        access_token: responseData.access_token,
        user: {
          id: responseData.user.id,
          email: responseData.user.email,
          name: responseData.user.name,
          role: {
            name: responseData.user.role.name,
            permissions: responseData.user.role.permissions.map((p: any) => ({
              resource: p.resource,
              actions: p.actions
            }))
          }
        }
      }

      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        variant: "default",
      })

      // Call the success handler with the transformed data
      onVerificationSuccess(loginResponse)
      
      // Redirect to dashboard
      router.push('/dashboard')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      console.error('OTP verification error:', err)
      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive",
      })
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">OTP Verification</CardTitle>
        <CardDescription>Enter the OTP sent to your email or mobile</CardDescription>
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
                      {...field} 
                      disabled={isLoading} 
                      maxLength={4}
                      inputMode="numeric"
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-sm text-gray-500">
          <p>OTP sent to:</p>
          <p>Email: {email}</p>
          {mobile && <p>Mobile: {mobile}</p>}
        </div>
      </CardContent>
    </Card>
  )
}