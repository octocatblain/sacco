// import Button from "@/components/Button";
import { useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
// components
import { DataTable } from "@/components/data-table";
import Spinner from "@/components/Spinner";
import LucideIcon from "@/components/LucideIcon";
import Breadcrumb from "@/components/Breadcrumb";
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
// types
import { CustomerProps } from "@/types";

const columns: ColumnDef<
  CustomerProps & {
    onView?: (c: CustomerProps) => void;
    onEdit?: (c: CustomerProps) => void;
  }
>[] = [
  {
    accessorKey: "id",
    header: "Customer ID",
    cell: ({ row }) => {
      return (
        <div>
          <Link to={`/customers/view/${row.original.id}`}>
            {row.original.id}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "profile_pic",
    header: "Profile",
    cell: ({ row }: any) => (
      <img
        src={row.original.profile_pic}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover"
      />
    ),
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  { accessorKey: "phone_number", header: "Phone Number" },
  {
    accessorKey: "id_number",
    header: "ID Number",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="p-0 rounded-full">
              <LucideIcon name="Pen" size={17} />{" "}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => row.original.onView?.(row.original)}
            >
              <LucideIcon name="Eye" size={16} className="mr-2" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => row.original.onEdit?.(row.original)}
            >
              <LucideIcon name="Pen" size={16} className="mr-2" /> Edit Customer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Send Email")}>
              <LucideIcon name="Mail" size={16} className="mr-2" /> Send Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Call Customer")}>
              <LucideIcon name="Phone" size={16} className="mr-2" /> Call
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Deactivate Customer")}>
              <LucideIcon name="UserX" size={16} className="mr-2" /> Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Expanded fake data with more customers and random profile pictures
const FAKE_CUSTOMERS: (CustomerProps & { profile_pic: string })[] = [
  {
    id: 1,
    first_name: "Sipho",
    last_name: "Nkosi",
    middle_name: "T.",
    salutation: "Mr.",
    email: "sipho.nkosi@k2an.co.za",
    phone_number: "0721234567",
    id_number: "8001015009087",
    date_of_birth: new Date("1980-01-01"),
    tax_number: "SA1234567",
    country: "South Africa",
    county: "Gauteng",
    city: "Johannesburg",
    po_box: 1001,
    profile_pic: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: 2,
    first_name: "Wanjiku",
    last_name: "Mwangi",
    middle_name: "N.",
    salutation: "Ms.",
    email: "wanjiku.mwangi@k2an.co.ke",
    phone_number: "0712345678",
    id_number: "23456789",
    date_of_birth: new Date("1992-05-10"),
    tax_number: "KE2345678",
    country: "Kenya",
    county: "Nairobi",
    city: "Nairobi",
    po_box: 2345,
    profile_pic: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: 3,
    first_name: "Thabo",
    last_name: "Mokoena",
    middle_name: "L.",
    salutation: "Mr.",
    email: "thabo.mokoena@k2an.co.za",
    phone_number: "0739876543",
    id_number: "9002026009088",
    date_of_birth: new Date("1990-02-02"),
    tax_number: "SA3456789",
    country: "South Africa",
    county: "KwaZulu-Natal",
    city: "Durban",
    po_box: 3003,
    profile_pic: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    id: 4,
    first_name: "Achieng",
    last_name: "Odhiambo",
    middle_name: "A.",
    salutation: "Mrs.",
    email: "achieng.odhiambo@k2an.co.ke",
    phone_number: "0723456789",
    id_number: "34567890",
    date_of_birth: new Date("1988-07-20"),
    tax_number: "KE3456789",
    country: "Kenya",
    county: "Kisumu",
    city: "Kisumu",
    po_box: 4004,
    profile_pic: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    id: 5,
    first_name: "Lerato",
    last_name: "Pule",
    middle_name: "M.",
    salutation: "Ms.",
    email: "lerato.pule@k2an.co.za",
    phone_number: "0741234567",
    id_number: "9203037009089",
    date_of_birth: new Date("1992-03-03"),
    tax_number: "SA4567890",
    country: "South Africa",
    county: "Western Cape",
    city: "Cape Town",
    po_box: 5005,
    profile_pic: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    id: 6,
    first_name: "Kamau",
    last_name: "Njoroge",
    middle_name: "K.",
    salutation: "Mr.",
    email: "kamau.njoroge@k2an.co.ke",
    phone_number: "0700111222",
    id_number: "45678901",
    date_of_birth: new Date("1985-09-12"),
    tax_number: "KE4567890",
    country: "Kenya",
    county: "Kiambu",
    city: "Thika",
    po_box: 6006,
    profile_pic: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    id: 7,
    first_name: "Zanele",
    last_name: "Dlamini",
    middle_name: "P.",
    salutation: "Mrs.",
    email: "zanele.dlamini@k2an.co.za",
    phone_number: "0765432109",
    id_number: "8504048009090",
    date_of_birth: new Date("1985-04-04"),
    tax_number: "SA5678901",
    country: "South Africa",
    county: "Eastern Cape",
    city: "Port Elizabeth",
    po_box: 7007,
    profile_pic: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    id: 8,
    first_name: "Otieno",
    last_name: "Omondi",
    middle_name: "Q.",
    salutation: "Mr.",
    email: "otieno.omondi@k2an.co.ke",
    phone_number: "0798765432",
    id_number: "56789012",
    date_of_birth: new Date("1987-06-30"),
    tax_number: "KE5678901",
    country: "Kenya",
    county: "Siaya",
    city: "Bondo",
    po_box: 8008,
    profile_pic: "https://randomuser.me/api/portraits/men/18.jpg",
  },
  {
    id: 9,
    first_name: "Naledi",
    last_name: "Molefe",
    middle_name: "R.",
    salutation: "Ms.",
    email: "naledi.molefe@k2an.co.za",
    phone_number: "0781234567",
    id_number: "9505059009091",
    date_of_birth: new Date("1995-05-05"),
    tax_number: "SA6789012",
    country: "South Africa",
    county: "Free State",
    city: "Bloemfontein",
    po_box: 9009,
    profile_pic: "https://randomuser.me/api/portraits/women/19.jpg",
  },
  {
    id: 10,
    first_name: "Mutiso",
    last_name: "Muthama",
    middle_name: "S.",
    salutation: "Mr.",
    email: "mutiso.muthama@k2an.co.ke",
    phone_number: "0722333444",
    id_number: "67890123",
    date_of_birth: new Date("1989-10-10"),
    tax_number: "KE6789012",
    country: "Kenya",
    county: "Machakos",
    city: "Machakos",
    po_box: 1010,
    profile_pic: "https://randomuser.me/api/portraits/men/20.jpg",
  },
];

const Customers = () => {
  const [data, setData] = useState(FAKE_CUSTOMERS);
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    customer: CustomerProps | null;
  }>({ open: false, customer: null });
  const [editModal, setEditModal] = useState<{
    open: boolean;
    customer: CustomerProps | null;
  }>({ open: false, customer: null });

  const handleView = useCallback((customer: CustomerProps) => {
    setViewModal({ open: true, customer });
  }, []);
  const handleEdit = useCallback((customer: CustomerProps) => {
    setEditModal({ open: true, customer });
  }, []);
  const closeView = () => setViewModal({ open: false, customer: null });
  const closeEdit = () => setEditModal({ open: false, customer: null });

  // Attach handlers to each row
  const customersArray = data.map((c) => ({
    ...c,
    onView: handleView,
    onEdit: handleEdit,
  }));

  // --- Analytics ---
  const total = data.length;
  const kenyan = data.filter((c) => c.country === "Kenya").length;
  const sa = data.filter((c) => c.country === "South Africa").length;
  const avgAge =
    Math.round(
      (data.reduce((sum, c) => {
        const dob =
          c.date_of_birth instanceof Date
            ? c.date_of_birth
            : new Date(c.date_of_birth);
        const age = Math.floor(
          (Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000)
        );
        return sum + age;
      }, 0) /
        Math.max(data.length, 1)) *
        10
    ) / 10;

  return (
    <>
      <Breadcrumb
        title="Customers"
        description="Browse and manage members"
        homePath="/"
      />
      {/* Analytics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total Customers</div>
          <div className="text-lg font-semibold">{total}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Kenyans</div>
          <div className="text-lg font-semibold">{kenyan}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">South Africans</div>
          <div className="text-lg font-semibold">{sa}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Average Age</div>
          <div className="text-lg font-semibold">{avgAge} yrs</div>
        </div>
      </div>
      <DataTable
        title="Customers"
        route="/customers/edit"
        btnTitle="Create Customer"
        data={customersArray}
        columns={columns}
        filters="email"
      />

      {/* View Modal */}
      <Dialog open={viewModal.open} onOpenChange={closeView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View details for customer {viewModal.customer?.id}
            </DialogDescription>
          </DialogHeader>
          {viewModal.customer && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={(viewModal.customer as any).profile_pic}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <b>
                    {viewModal.customer.salutation}{" "}
                    {viewModal.customer.first_name}{" "}
                    {viewModal.customer.last_name}
                  </b>
                  <div className="text-xs text-slate-500">
                    {viewModal.customer.email}
                  </div>
                </div>
              </div>
              <div>
                <b>Phone:</b> {viewModal.customer.phone_number}
              </div>
              <div>
                <b>ID Number:</b> {viewModal.customer.id_number}
              </div>
              <div>
                <b>Tax Number:</b> {viewModal.customer.tax_number}
              </div>
              <div>
                <b>Location:</b> {viewModal.customer.city},{" "}
                {viewModal.customer.county}, {viewModal.customer.country}
              </div>
              <div>
                <b>PO Box:</b> {viewModal.customer.po_box}
              </div>
              <div>
                <b>Date of Birth:</b>{" "}
                {viewModal.customer.date_of_birth.toLocaleDateString()}
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
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Edit details for customer {editModal.customer?.id}
            </DialogDescription>
          </DialogHeader>
          {editModal.customer && (
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                closeEdit();
              }}
            >
              <div>
                <label className="block text-xs">First Name</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.customer.first_name}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Last Name</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.customer.last_name}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Email</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.customer.email}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Phone</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.customer.phone_number}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">ID Number</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.customer.id_number}
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
    </>
  );
};

export default Customers;
