import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MOCK_OTP = '123456'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, otp } = body

  if (otp === MOCK_OTP) {
    const cookieStore = await cookies()
    cookieStore.set('isEmailVerified', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    
    return NextResponse.json({ success: true, message: 'Email verified successfully' })
  } else {
    return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 })
  }
}

