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
    email: "john@example.com",
    phone_number: "0712345678",
    id_number: "12345678",
    salutation: "Mr.",
    middle_name: "M.",
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    phone_number: "0798765432",
    id_number: "87654321",
    salutation: "Ms.",
    middle_name: "A.",
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
