import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Admin } from '@/api/adminApi';

interface AdminTableProps {
  admins: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (id: string) => void;
  onResetPassword: (id: string) => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({ admins, onEdit, onDelete, onResetPassword }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell className="font-medium">{admin.name}</TableCell>
            <TableCell>{admin.email}</TableCell>
            <TableCell>{admin.mobile}</TableCell>
            <TableCell>
            {admin.roleId}
            </TableCell>
            <TableCell>{admin.status ? 'Active' : 'Inactive'}</TableCell>
            <TableCell>{admin.last_login ? new Date(admin.last_login).toLocaleString() : 'Never'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(admin)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => onResetPassword(admin.id)}>
                  <Lock className="mr-2 h-4 w-4" /> Reset Password
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(admin.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

