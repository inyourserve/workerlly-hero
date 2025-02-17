'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UserDetailsProps {
  user: {
    id: string;
    email: string;
    name: string;
    mobile: string;
    roles: string[];
  } | null;
}

export function UserDetails({ user }: UserDetailsProps) {
  if (!user) {
    return <div>No user data available</div>;
  }
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Mobile:</strong> {user?.mobile}</p>
          <p><strong>Roles:</strong> {user?.roles?.join(', ')}</p>
        </div>
      </CardContent>
    </Card>
  )
}

