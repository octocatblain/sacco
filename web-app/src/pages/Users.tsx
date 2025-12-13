import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
// components
import { DataTable } from "@/components/data-table";
import Spinner from "@/components/Spinner";
import Breadcrumb from "@/components/Breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LucideIcon from "@/components/LucideIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
// types
import { UserProps } from "@/types";

import ProfilePlaceholder from "@/assets/profile-placeholder.png";

// table columns
const columns: ColumnDef<UserProps>[] = [
  {
    header: "Image",
    accessorKey: "profile.profile_image",
    cell: ({ row }) => {
      return (
        <img
          src={
            row.original.profile.profile_image
              ? row.original.profile.profile_image.toString()
              : ProfilePlaceholder
          }
          alt={row.original.username}
          className="w-10 h-10 rounded-full"
        />
      );
    },
  },
  {
    header: "User Name",
    accessorKey: "username",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Role",
    accessorKey: "profile.role_display",
  },
  {
    header: "Actions",
    cell: ({ row }: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="p-0 rounded-full">
            <LucideIcon name="Pen" size={17} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => alert(`View user ${row.original.username}`)}
          >
            <LucideIcon name="Eye" size={16} className="mr-2" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => alert(`Edit user ${row.original.username}`)}
          >
            <LucideIcon name="Pen" size={16} className="mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => alert(`Reset password for ${row.original.username}`)}
          >
            <LucideIcon name="Key" size={16} className="mr-2" /> Reset Password
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => alert(`Deactivate user ${row.original.username}`)}
          >
            <LucideIcon name="UserX" size={16} className="mr-2" /> Deactivate
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => alert(`Delete user ${row.original.username}`)}
          >
            <LucideIcon name="Trash" size={16} className="mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// Fake data for users
const FAKE_USERS: any[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@k2an.com",
    profile: {
      profile_image: "https://randomuser.me/api/portraits/men/21.jpg",
      role_display: "Admin",
    },
  },
  {
    id: 2,
    username: "jane",
    email: "jane@k2an.com",
    profile: {
      profile_image: "https://randomuser.me/api/portraits/women/22.jpg",
      role_display: "User",
    },
  },
  {
    id: 3,
    username: "lerato.manager",
    email: "lerato.manager@k2an.com",
    profile: {
      profile_image: "https://randomuser.me/api/portraits/women/23.jpg",
      role_display: "Manager",
    },
  },
  {
    id: 4,
    username: "kamau.finance",
    email: "kamau.finance@k2an.com",
    profile: {
      profile_image: "https://randomuser.me/api/portraits/men/24.jpg",
      role_display: "Finance Officer",
    },
  },
  {
    id: 5,
    username: "sipho.loan",
    email: "sipho.loan@k2an.com",
    profile: {
      profile_image: "https://randomuser.me/api/portraits/men/25.jpg",
      role_display: "Loan Officer",
    },
  },
  {
    id: 6,
    username: "mary.operations",
    email: "mary.operations@k2an.com",
    profile: {
      profile_image: "https://randomuser.me/api/portraits/women/26.jpg",
      role_display: "Operation Manager",
    },
  },
  {
    id: 7,
    username: "john.accountant",
    email: "john.accountant@k2an.com",
    profile: {
      profile_image: "https://randomuser.me/api/portraits/men/27.jpg",
      role_display: "Accountant",
    },
  },
];

const Users = () => {
  const [data] = useState<UserProps[]>(FAKE_USERS);

  // Modal state
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    user: UserProps | null;
  }>({
    open: false,
    user: null,
  });
  const [editModal, setEditModal] = useState<{
    open: boolean;
    user: UserProps | null;
  }>({
    open: false,
    user: null,
  });
  const [resetModal, setResetModal] = useState<{
    open: boolean;
    user: UserProps | null;
  }>({
    open: false,
    user: null,
  });
  const [deactivateModal, setDeactivateModal] = useState<{
    open: boolean;
    user: UserProps | null;
  }>({
    open: false,
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    user: UserProps | null;
  }>({
    open: false,
    user: null,
  });

  const handleView = (user: UserProps) => setViewModal({ open: true, user });
  const handleEdit = (user: UserProps) => setEditModal({ open: true, user });
  const handleReset = (user: UserProps) => setResetModal({ open: true, user });
  const handleDeactivate = (user: UserProps) =>
    setDeactivateModal({ open: true, user });
  const handleDelete = (user: UserProps) =>
    setDeleteModal({ open: true, user });

  const closeView = () => setViewModal({ open: false, user: null });
  const closeEdit = () => setEditModal({ open: false, user: null });
  const closeReset = () => setResetModal({ open: false, user: null });
  const closeDeactivate = () => setDeactivateModal({ open: false, user: null });
  const closeDelete = () => setDeleteModal({ open: false, user: null });

  // Attach handlers to each row
  const usersArray = data.map((u) => ({
    ...u,
    onView: handleView,
    onEdit: handleEdit,
    onReset: handleReset,
    onDeactivate: handleDeactivate,
    onDelete: handleDelete,
  }));

  // Update columns to use handlers
  const columnsWithActions: ColumnDef<UserProps>[] = [
    ...columns.slice(0, 4),
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="p-0 rounded-full">
              <LucideIcon name="Pen" size={17} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => row.original.onView?.(row.original)}
            >
              <LucideIcon name="Eye" size={16} className="mr-2" /> View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => row.original.onEdit?.(row.original)}
            >
              <LucideIcon name="Pen" size={16} className="mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => row.original.onReset?.(row.original)}
            >
              <LucideIcon name="Key" size={16} className="mr-2" /> Reset
              Password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => row.original.onDeactivate?.(row.original)}
            >
              <LucideIcon name="UserX" size={16} className="mr-2" /> Deactivate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => row.original.onDelete?.(row.original)}
            >
              <LucideIcon name="Trash" size={16} className="mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        title="Users"
        description="Manage system user accounts"
        homePath="/"
      />
      <DataTable
        title="Users"
        route="/users/create"
        btnTitle="Create User"
        data={usersArray}
        columns={columnsWithActions}
        filters="username"
      />

      {/* View Modal */}
      <Dialog open={viewModal.open} onOpenChange={closeView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View details for user {viewModal.user?.username}
            </DialogDescription>
          </DialogHeader>
          {viewModal.user && (
            <form className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={
                    viewModal.user.profile.profile_image
                      ? viewModal.user.profile.profile_image.toString()
                      : ProfilePlaceholder
                  }
                  alt={viewModal.user.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div>
                <label className="block text-xs">Username</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={viewModal.user.username}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Email</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={viewModal.user.email}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Role</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={viewModal.user.profile.role_display}
                  readOnly
                />
              </div>
            </form>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModal.open} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit details for user {editModal.user?.username}
            </DialogDescription>
          </DialogHeader>
          {editModal.user && (
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                closeEdit();
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={
                    editModal.user.profile.profile_image
                      ? editModal.user.profile.profile_image.toString()
                      : ProfilePlaceholder
                  }
                  alt={editModal.user.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div>
                <label className="block text-xs">Username</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.user.username}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Email</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.user.email}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Role</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.user.profile.role_display}
                  readOnly
                />
              </div>
              <DialogFooter>
                <Button type="submit" variant="default">
                  Save
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={resetModal.open} onOpenChange={closeReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for user {resetModal.user?.username}
            </DialogDescription>
          </DialogHeader>
          {resetModal.user && (
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Password reset for ${resetModal.user?.username}`);
                closeReset();
              }}
            >
              <div>
                <label className="block text-xs">New Password</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  type="password"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Confirm Password</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  type="password"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" variant="default">
                  Reset
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Deactivate Modal */}
      <Dialog open={deactivateModal.open} onOpenChange={closeDeactivate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate user{" "}
              {deactivateModal.user?.username}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                alert(`User ${deactivateModal.user?.username} deactivated`);
                closeDeactivate();
              }}
            >
              Deactivate
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModal.open} onOpenChange={closeDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user {deleteModal.user?.username}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                alert(`User ${deleteModal.user?.username} deleted`);
                closeDelete();
              }}
            >
              Delete
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Users;
