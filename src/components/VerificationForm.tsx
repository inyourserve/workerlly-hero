'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VerificationForm() {
  const [emailOtp, setEmailOtp] = useState('')
  const [mobileOtp, setMobileOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Verify email OTP
      const emailResponse = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, otp: emailOtp }),
      })

      const emailData = await emailResponse.json()

      if (!emailData.success) {
        setError('Invalid email OTP')
        setIsLoading(false)
        return
      }

      // Verify mobile OTP
      const mobileResponse = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, otp: mobileOtp }),
      })

      const mobileData = await mobileResponse.json()

      if (!mobileData.success) {
        setError('Invalid mobile OTP')
        setIsLoading(false)
        return
      }

      // Both verifications successful
      localStorage.setItem('isVerified', 'true')
      router.push('/admin/dashboard')
    } catch (error) {
      setError('An error occurred. Please try again.')
    }

    setIsLoading(false)
  }

  const sendOtp = async (type: 'email' | 'mobile') => {
    // In a real application, this would trigger an API call to send an OTP
    alert(`OTP sent to your ${type}. For this demo, use: 123456`)
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Two-Factor Authentication</h2>
        <p className="mt-2 text-center text-sm text-gray-600 mb-6">
          Please verify your email and mobile number
        </p>
        <form onSubmit={handleVerification} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email-otp" className="block text-sm font-medium text-gray-700">
                Email OTP
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  id="email-otp"
                  type="text"
                  required
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Email OTP"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => sendOtp('email')}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  Send OTP
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="mobile-otp" className="block text-sm font-medium text-gray-700">
                Mobile OTP
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  id="mobile-otp"
                  type="text"
                  required
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Mobile OTP"
                  value={mobileOtp}
                  onChange={(e) => setMobileOtp(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => sendOtp('mobile')}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  Send OTP
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

