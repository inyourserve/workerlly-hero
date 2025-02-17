// app/dashboard/users/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fetchUsers, toggleUserBlock } from '@/api/userApi'
import { User, UserFilters } from '@/types/user'
import { useRouter } from 'next/navigation'

const ITEMS_PER_PAGE = 10

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: undefined,
    status: undefined,
    skip: 0,
    limit: ITEMS_PER_PAGE,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    loadUsers()
  }, [filters])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetchUsers(filters)
      setUsers(response.users)
      setTotalUsers(response.total)
      setCurrentPage(response.currentPage)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setError('Failed to load users. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setCurrentPage(1)
    setFilters(prev => ({
      ...prev,
      search: value,
      skip: 0,
    }))
  }

  const handleRoleFilter = (value: string | undefined) => {
    setCurrentPage(1)
    setFilters(prev => ({
      ...prev,
      role: value === 'all' ? undefined : value,
      skip: 0,
    }))
  }

  const handleStatusFilter = (value: string | undefined) => {
    setCurrentPage(1)
    setFilters(prev => ({
      ...prev,
      status: value === 'true' ? true : value === 'false' ? false : undefined,
      skip: 0,
    }))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setFilters(prev => ({
      ...prev,
      skip: (page - 1) * ITEMS_PER_PAGE,
    }))
  }

  const handleViewProfile = (userId: string) => {
    router.push(`/dashboard/users/${userId}`)
  }

  const handleToggleBlock = async (user: User) => {
    setSelectedUser(user)
    setShowBlockDialog(true)
  }
  
  const confirmBlockAction = async () => {
    if (!selectedUser) return
  
    try {
      const result = await toggleUserBlock(selectedUser._id)
      if (result.success) {
        // Reload the users list to reflect the changes
        await loadUsers()
      }
    } catch (error) {
      console.error('Failed to update user block status:', error)
      setError('Failed to update user block status. Please try again later.')
    } finally {
      setShowBlockDialog(false)
      setSelectedUser(null)
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatMobile = (mobile: string) => {
    const number = mobile.slice(-10)
    const countryCode = mobile.slice(0, -10)
    return `+${countryCode} ${number}`
  }

  const generatePaginationNumbers = () => {
    const pages: number[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push(-1)
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push(-1)
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by mobile number..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.role || 'all'} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="seeker">Seeker</SelectItem>
                <SelectItem value="provider">Provider</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status !== undefined ? filters.status.toString() : 'all'}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Online</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No users found. {filters.search && "Try clearing your search filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{formatMobile(user.mobile)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="secondary" className="capitalize">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status ? "success" : "destructive"}
                          className="capitalize"
                        >
                          {user.status ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDateTime(user.created_at)}</TableCell>
                      <TableCell>
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleViewProfile(user._id)}
    >
      <Eye className="h-4 w-4 mr-1" />
      View
    </Button>
    <Button
      variant={user.is_user_blocked ? "default" : "destructive"}
      size="sm"
      onClick={() => handleToggleBlock(user)}
    >
      {user.is_user_blocked ? 'Unblock' : 'Block'}
    </Button>
  </div>
</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalUsers > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <p className="text-sm text-gray-500">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)} of {totalUsers} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {generatePaginationNumbers().map((pageNumber, index) =>
                    pageNumber === -1 ? (
                      <span key={`ellipsis-${index}`} className="px-2">...</span>
                    ) : (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
<AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        {selectedUser?.is_user_blocked ? 'Unblock User' : 'Block User'}
      </AlertDialogTitle>
      <AlertDialogDescription>
        {selectedUser?.is_user_blocked ? (
          <>
            Are you sure you want to unblock this user? 
            This will restore their access to the platform and allow them to use all features.
          </>
        ) : (
          <>
            Are you sure you want to block this user? 
            This will prevent them from accessing the platform and using any features.
          </>
        )}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={confirmBlockAction}
        className={selectedUser?.is_user_blocked ? 'bg-primary hover:bg-primary/90' : 'bg-destructive hover:bg-destructive/90'}
      >
        {selectedUser?.is_user_blocked ? 'Unblock' : 'Block'}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
