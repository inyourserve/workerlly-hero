import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // In a real application, you would verify the session or JWT here
  // For this example, we'll just check if the Authorization header is present
  const authHeader = request.headers.get('Authorization')

  if (authHeader) {
    // Mock user data - in a real app, you'd fetch this from your database
    return NextResponse.json({ 
      isAuthenticated: true, 
      user: { id: '1', email: 'admin@example.com', role: 'admin' } 
    })
  } else {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 })
  }
}

