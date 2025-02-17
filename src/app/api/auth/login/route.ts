import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  // Mock authentication - replace with your actual authentication logic
  if (email === 'admin@example.com' && password === 'password') {
    const cookieStore = await cookies()
    cookieStore.set('isAuthenticated', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    
    return NextResponse.json({ success: true, user: { email } })
  } else {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
  }
}

