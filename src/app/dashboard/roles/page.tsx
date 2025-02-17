"use client"

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordian"
import { useToast } from "@/components/ui/use-toast"
import { Role, fetchRoles, createRole, updateRole, deleteRole } from '@/api/roleApi'

// Define the available resources and their actions
const AVAILABLE_RESOURCES = {
  dashboard: ['read'],
  users: ['create', 'read', 'update', 'delete'],
  jobs: ['create', 'read', 'update', 'delete'],
  workers: ['create', 'read', 'update', 'delete'],
  providers: ['create', 'read', 'update', 'delete'],
  categories: ['create', 'read', 'update', 'delete'],
  cities: ['create', 'read', 'update', 'delete'],
  rates: ['create', 'read', 'update', 'delete'],
  faqs: ['create', 'read', 'update', 'delete'],
  roles: ['create', 'read', 'update', 'delete'],
  settings: ['read', 'update']
}

interface Permission {
  resource: string
  actions: string[]
}

interface RoleFormData {
  name: string
  description: string
  permissions: Permission[]
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissions: []
  })
  const { toast } = useToast()

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setIsLoading(true)
      const data = await fetchRoles()
      setRoles(data)
    } catch (error) {
      console.error('Failed to load roles:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load roles"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionChange = (resource: string, action: string, isChecked: boolean) => {
    setFormData(prev => {
      const newPermissions = [...prev.permissions]
      const resourcePermission = newPermissions.find(p => p.resource === resource)

      if (isChecked) {
        if (resourcePermission) {
          resourcePermission.actions = [...new Set([...resourcePermission.actions, action])]
        } else {
          newPermissions.push({ resource, actions: [action] })
        }
      } else {
        if (resourcePermission) {
          resourcePermission.actions = resourcePermission.actions.filter(a => a !== action)
          if (resourcePermission.actions.length === 0) {
            return {
              ...prev,
              permissions: newPermissions.filter(p => p.resource !== resource)
            }
          }
        }
      }

      return { ...prev, permissions: newPermissions }
    })
  }

  const isActionChecked = (resource: string, action: string): boolean => {
    const permission = formData.permissions.find(p => p.resource === resource)
    return permission ? permission.actions.includes(action) : false
  }

  const handleAdd = async () => {
    try {
      await createRole(formData)
      setIsAddDialogOpen(false)
      setFormData({ name: '', description: '', permissions: [] })
      loadRoles()
      toast({
        title: "Success",
        description: "Role created successfully"
      })
    } catch (error) {
      console.error('Failed to create role:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create role"
      })
    }
  }

  const handleEdit = async () => {
    if (!selectedRole) return
    
    try {
      await updateRole(selectedRole._id, formData)
      setIsEditDialogOpen(false)
      setSelectedRole(null)
      setFormData({ name: '', description: '', permissions: [] })
      loadRoles()
      toast({
        title: "Success",
        description: "Role updated successfully"
      })
    } catch (error) {
      console.error('Failed to update role:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role"
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedRole) return
    
    try {
      await deleteRole(selectedRole._id)
      setIsDeleteDialogOpen(false)
      setSelectedRole(null)
      loadRoles()
      toast({
        title: "Success",
        description: "Role deleted successfully"
      })
    } catch (error) {
      console.error('Failed to delete role:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete role"
      })
    }
  }

  const openEditDialog = (role: Role) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role)
    setIsDeleteDialogOpen(true)
  }

  const renderPermissionsForm = () => (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Permissions</h3>
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(AVAILABLE_RESOURCES).map(([resource, actions]) => (
          <AccordionItem key={resource} value={resource}>
            <AccordionTrigger className="capitalize">
              {resource} Management
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 p-4">
                {actions.map(action => (
                  <div key={`${resource}-${action}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${resource}-${action}`}
                      checked={isActionChecked(resource, action)}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(resource, action, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`${resource}-${action}`}
                      className="text-sm font-medium capitalize"
                    >
                      {action}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Role Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Role name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Role description"
                  />
                </div>
                {renderPermissionsForm()}
              </div>
              <DialogFooter className="mt-4">
                <Button onClick={handleAdd}>Add Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow key="loading-row">
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow key="empty-row">
                  <TableCell colSpan={4} className="text-center">No roles found</TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role._id}>
                    <TableCell>{role._id}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(role)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(role)}
                          disabled={role.name === 'super_admin'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Role name"
                    disabled={selectedRole?.name === 'super_admin'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Role description"
                  />
                </div>
                {selectedRole?.name !== 'super_admin' && renderPermissionsForm()}
              </div>
              <DialogFooter className="mt-4">
                <Button onClick={handleEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Role</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the role "{selectedRole?.name}"? 
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
