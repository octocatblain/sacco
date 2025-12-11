// import Button from "@/components/Button";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
// components
import { DataTable } from "@/components/data-table";
import Spinner from "@/components/Spinner";
import LucideIcon from "@/components/LucideIcon";
import Breadcrumb from "@/components/Breadcrumb";
// types
import { CustomerProps } from "@/types";

const columns: ColumnDef<CustomerProps>[] = [
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
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "last_name",
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
        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-400 text-slate-600">
          <Link to={`/customers/edit/${row.original.id}`}>
            <LucideIcon name="Pen" size={17} />
          </Link>
        </div>
      );
    },
  },
];

// Fake data for customers
const FAKE_CUSTOMERS: CustomerProps[] = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    middle_name: "M.",
    salutation: "Mr.",
    email: "john@example.com",
    phone_number: "0712345678",
    id_number: "12345678",
    date_of_birth: new Date("1990-01-01"),
    tax_number: "A1234567",
    country: "Kenya",
    county: "Nairobi",
    city: "Nairobi",
    po_box: 1234,
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    middle_name: "A.",
    salutation: "Ms.",
    email: "jane@example.com",
    phone_number: "0798765432",
    id_number: "87654321",
    date_of_birth: new Date("1992-05-10"),
    tax_number: "B7654321",
    country: "Kenya",
    county: "Mombasa",
    city: "Mombasa",
    po_box: 5678,
  },
];

const Customers = () => {
  const [data] = useState<CustomerProps[]>(FAKE_CUSTOMERS);
  // No loading or error states with fakedata
  return (
    <>
      <Breadcrumb
        title="Customers"
        description="Browse and manage members"
        homePath="/"
      />
      <DataTable
        title="Customers"
        route="/customers/edit"
        btnTitle="Create Customer"
        data={data}
        columns={columns}
        filters="email"
      />
    </>
  );
};

export default Customers;
