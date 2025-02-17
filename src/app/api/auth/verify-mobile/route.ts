import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MOCK_OTP = '123456'

export async function POST(request: Request) {
  const body = await request.json()
  const { phone, otp } = body

  if (otp === MOCK_OTP) {
    const cookieStore = await cookies()
    cookieStore.set('isPhoneVerified', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    
    return NextResponse.json({ success: true, message: 'Phone verified successfully' })
  } else {
    return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 })
  }
}

