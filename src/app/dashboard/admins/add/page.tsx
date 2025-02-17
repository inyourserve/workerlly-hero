'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from 'react-query'
import { AdminForm } from '@/components/AdminForm'
import { useToast } from '@/components/ui/use-toast'
import { createAdmin, fetchRoles } from '@/api/adminApi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function AddAdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)

  // Fetch roles
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery(
    'roles',
    () => fetchRoles(),
    {
      onError: (err) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch roles')
      }
    }
  )

  // Create admin mutation
  const { mutate: addAdmin, isLoading: isCreating } = useMutation(createAdmin, {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Admin created successfully',
      })
      router.push('/dashboard/admins')
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to create admin'
      })
    }
  })

const handleSubmit = async (formData: any) => {
  console.log('Submitting form data:', formData) // Debug log
  try {
    await addAdmin({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      roleId: formData.roleId,
      status: formData.status
    })
  } catch (error) {
    console.error('Submission error:', error) // Debug log
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : 'Failed to create admin'
    })
  }
}

  if (isLoadingRoles) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Admin</h1>
        <AdminForm
          roles={roles}
          onSubmit={handleSubmit}
          isLoading={isCreating}
        />
      </div>
    </div>
  )
}
