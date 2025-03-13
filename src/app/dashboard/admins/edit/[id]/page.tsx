'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { fetchRoles, updateAdmin } from '@/api/adminApi'
import Cookies from "js-cookie"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  roleId: z.string().min(1, 'Please select a role'),
  status: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

// Define our own fetch admin function since the import isn't working
const fetchAdminById = async (id: string) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"
  const token = Cookies.get("authToken")
  
  try {
    const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to fetch admin details")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching admin details:", error)
    throw error
  }
}

export default function EditAdminPage() {
  const router = useRouter()
  const params = useParams() || {}
  const adminId = typeof params.id === 'string' ? params.id : ''
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: '',
      status: true,
    },
  })

  // Fetch roles for select dropdown
  const { data: roles } = useQuery('roles', fetchRoles)

  // Fetch admin details
  const { data: admin, isLoading: adminLoading } = useQuery(
    ['admin', adminId],
    () => fetchAdminById(adminId),
    {
      enabled: !!adminId,
      onSuccess: (data) => {
        // Reset form with fetched data
        form.reset({
          name: data.name,
          email: data.email,
          roleId: data.roleId,
          status: data.status,
        })
        setIsLoading(false)
      },
      onError: (error) => {
        console.error("Error in fetchAdmin query:", error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch admin details',
        })
        router.push('/dashboard/admins')
      }
    }
  )

  // Redirect if no valid ID
  if (!adminId) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'No admin ID provided',
    })
    router.push('/dashboard/admins')
    return null
  }

  // Update mutation
  const updateMutation = useMutation(
    (values: Partial<FormValues>) => updateAdmin(adminId, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admins'])
        toast({
          title: 'Success',
          description: 'Admin updated successfully',
        })
        router.push('/dashboard/admins')
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error?.message || 'Failed to update admin',
        })
      },
    }
  )

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate(values)
  }

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard/admins')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Admin</CardTitle>
          <CardDescription>Update admin user details</CardDescription>
        </CardHeader>

        {(isLoading || adminLoading) ? (
          <CardContent className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Email Address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {admin && (
                  <div className="space-y-2">
                    <FormLabel>Mobile Number</FormLabel>
                    <Input value={admin.mobile} disabled />
                    <p className="text-sm text-muted-foreground">
                      Mobile number cannot be edited for security reasons.
                    </p>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles?.map((role) => (
                            <SelectItem key={role._id} value={role._id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Account Status
                        </FormLabel>
                        <FormDescription>
                          {field.value ? 'Active' : 'Inactive'}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/admins')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isLoading}>
                  {updateMutation.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  )
}
