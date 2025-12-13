"use client";

import { FC, useEffect, useMemo, useState, useCallback } from "react";
import type { KycApplication } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";
import { DataTable } from "@/components/data-table";
import LucideIcon from "@/components/LucideIcon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// --- Fake Data ---
const FAKE_APPS: any[] = [
  {
    id: "KYC-1001",
    createdAt: "2024-06-01T09:00:00Z",
    updatedAt: "2024-06-01T09:00:00Z",
    status: "submitted",
    personal: {
      firstName: "Sipho",
      lastName: "Nkosi",
      dob: "1980-01-01",
      nationalIdType: "ID",
      nationalIdNumber: "8001015009087",
      phone: "0721234567",
      email: "sipho.nkosi@k2an.co.za",
    },
    address: {
      line1: "123 Vilakazi St",
      city: "Johannesburg",
      country: "South Africa",
    },
    documents: [
      {
        id: "DOC-1",
        type: "id_front",
        name: "id_front.jpg",
        mimeType: "image/jpeg",
        size: 123456,
        url: "#",
      },
      {
        id: "DOC-2",
        type: "selfie",
        name: "selfie.jpg",
        mimeType: "image/jpeg",
        size: 234567,
        url: "#",
      },
    ],
  },
  {
    id: "KYC-1002",
    createdAt: "2024-06-02T10:00:00Z",
    updatedAt: "2024-06-02T10:00:00Z",
    status: "draft",
    personal: {
      firstName: "Wanjiku",
      lastName: "Mwangi",
      dob: "1992-05-10",
      nationalIdType: "ID",
      nationalIdNumber: "23456789",
      phone: "0712345678",
      email: "wanjiku.mwangi@k2an.co.ke",
    },
    address: {
      line1: "456 Kenyatta Ave",
      city: "Nairobi",
      country: "Kenya",
    },
    documents: [
      {
        id: "DOC-3",
        type: "id_front",
        name: "id_front.jpg",
        mimeType: "image/jpeg",
        size: 123456,
        url: "#",
      },
    ],
  },
  {
    id: "KYC-1003",
    createdAt: "2024-06-03T11:00:00Z",
    updatedAt: "2024-06-03T11:00:00Z",
    status: "approved",
    personal: {
      firstName: "Thabo",
      lastName: "Mokoena",
      dob: "1990-02-02",
      nationalIdType: "Passport",
      nationalIdNumber: "A12345678",
      phone: "0739876543",
      email: "thabo.mokoena@k2an.co.za",
    },
    address: {
      line1: "789 Florida Rd",
      city: "Durban",
      country: "South Africa",
    },
    documents: [
      {
        id: "DOC-4",
        type: "passport",
        name: "passport.pdf",
        mimeType: "application/pdf",
        size: 345678,
        url: "#",
      },
      {
        id: "DOC-5",
        type: "selfie",
        name: "selfie.jpg",
        mimeType: "image/jpeg",
        size: 234567,
        url: "#",
      },
    ],
  },
];

// --- Columns for DataTable ---
const columns = [
  { header: "ID", accessorKey: "id" },
  { header: "Status", accessorKey: "status" },
  {
    header: "Name",
    accessorKey: "personal",
    cell: ({ row }: any) =>
      `${row.original.personal.firstName} ${row.original.personal.lastName}`,
  },
  {
    header: "Email",
    accessorKey: "personal.email",
    cell: ({ row }: any) => row.original.personal.email,
  },
  {
    header: "Phone",
    accessorKey: "personal.phone",
    cell: ({ row }: any) => row.original.personal.phone,
  },
  {
    header: "Country",
    accessorKey: "address.country",
    cell: ({ row }: any) => row.original.address.country,
  },
  {
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ row }: any) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    header: "Updated",
    accessorKey: "updatedAt",
    cell: ({ row }: any) =>
      new Date(row.original.updatedAt).toLocaleDateString(),
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
          <DropdownMenuItem onClick={() => row.original.onView?.(row.original)}>
            <LucideIcon name="Eye" size={16} className="mr-2" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => row.original.onEdit?.(row.original)}>
            <LucideIcon name="Pen" size={16} className="mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert("Approve Application")}>
            <LucideIcon name="CheckCircle" size={16} className="mr-2" /> Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert("Reject Application")}>
            <LucideIcon name="XCircle" size={16} className="mr-2" /> Reject
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert("Download Documents")}>
            <LucideIcon name="Download" size={16} className="mr-2" /> Download
            Docs
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert("Delete Application")}>
            <LucideIcon name="Trash" size={16} className="mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const Applications: FC = () => {
  // Use fake data for demo
  const [apps, setApps] = useState<KycApplication[]>(FAKE_APPS);

  // View/Edit modal state
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    app: KycApplication | null;
  }>({
    open: false,
    app: null,
  });
  const [editModal, setEditModal] = useState<{
    open: boolean;
    app: KycApplication | null;
  }>({
    open: false,
    app: null,
  });

  const handleView = useCallback(
    (app: KycApplication) => setViewModal({ open: true, app }),
    []
  );
  const handleEdit = useCallback(
    (app: KycApplication) => setEditModal({ open: true, app }),
    []
  );
  const closeView = () => setViewModal({ open: false, app: null });
  const closeEdit = () => setEditModal({ open: false, app: null });

  // Attach handlers to each row
  const appsArray = apps.map((a) => ({
    ...a,
    onView: handleView,
    onEdit: handleEdit,
  }));

  const subtitle = useMemo(
    () =>
      apps.length ? `${apps.length} application(s)` : "No applications yet",
    [apps]
  );

  return (
    <div className="space-y-4">
      <Breadcrumb
        title="KYC Applications"
        description="View all KYC applications"
        homePath="/kyc/applications"
      />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">KYC Applications</h1>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
      <DataTable
        columns={columns as any}
        data={appsArray}
        title="KYC Applications"
        filters="personal.email"
      />

      {/* View Modal */}
      <Dialog open={viewModal.open} onOpenChange={closeView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>KYC Application Details</DialogTitle>
            <DialogDescription>
              View all details for application {viewModal.app?.id}
            </DialogDescription>
          </DialogHeader>
          {viewModal.app && (
            <div className="space-y-2 text-sm">
              <div>
                <b>Status:</b> {viewModal.app.status}
              </div>
              <div>
                <b>Created:</b>{" "}
                {new Date(viewModal.app.createdAt).toLocaleString()}
              </div>
              <div>
                <b>Updated:</b>{" "}
                {new Date(viewModal.app.updatedAt).toLocaleString()}
              </div>
              <div>
                <b>Personal Info:</b>
                <div className="ml-4">
                  <div>
                    <b>Name:</b> {viewModal.app.personal.firstName}{" "}
                    {viewModal.app.personal.lastName}
                  </div>
                  <div>
                    <b>Date of Birth:</b> {viewModal.app.personal.dob}
                  </div>
                  <div>
                    <b>ID Type:</b> {viewModal.app.personal.nationalIdType}
                  </div>
                  <div>
                    <b>ID Number:</b> {viewModal.app.personal.nationalIdNumber}
                  </div>
                  <div>
                    <b>Phone:</b> {viewModal.app.personal.phone}
                  </div>
                  <div>
                    <b>Email:</b> {viewModal.app.personal.email}
                  </div>
                </div>
              </div>
              <div>
                <b>Address:</b>
                <div className="ml-4">
                  <div>
                    <b>Line 1:</b> {viewModal.app.address.line1}
                  </div>
                  <div>
                    <b>City:</b> {viewModal.app.address.city}
                  </div>
                  <div>
                    <b>Country:</b> {viewModal.app.address.country}
                  </div>
                </div>
              </div>
              <div>
                <b>Documents:</b>
                <ul className="ml-4 list-disc">
                  {viewModal.app.documents.map((doc) => (
                    <li key={doc.id}>
                      <b>{doc.type}:</b> {doc.name} ({doc.mimeType},{" "}
                      {Math.round(doc.size / 1024)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
            <DialogTitle>Edit KYC Application</DialogTitle>
            <DialogDescription>
              Edit details for application {editModal.app?.id}
            </DialogDescription>
          </DialogHeader>
          {editModal.app && (
            <form
              className="space-y-2 grid grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                closeEdit();
              }}
            >
              <div>
                <label className="block text-xs">First Name</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.app.personal.firstName}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Last Name</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.app.personal.lastName}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Email</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.app.personal.email}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Phone</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.app.personal.phone}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">ID Type</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.app.personal.nationalIdType}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">ID Number</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.app.personal.nationalIdNumber}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Date of Birth</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.app.personal.dob}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Address</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={`${editModal.app.address.line1}, ${editModal.app.address.city}, ${editModal.app.address.country}`}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Status</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.app.status}
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
    </div>
  );
};

export default Applications;
