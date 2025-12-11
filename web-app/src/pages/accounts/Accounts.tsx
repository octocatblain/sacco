import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useState } from "react";

// types
import { AccountProps } from "@/types";
import Breadcrumb from "@/components/Breadcrumb"; // Added Breadcrumb import
// components
import { DataTable } from "@/components/data-table";
import LucideIcon from "@/components/LucideIcon";
import Spinner from "@/components/Spinner";

const columns: ColumnDef<AccountProps>[] = [
  {
    accessorKey: "account_number",
    header: "Account Number",
    cell: ({ row }) => {
      return (
        <div>
          <Link to={`/accounts/view/${row.original.account_number}`}>
        // Fake data for accounts
        const FAKE_ACCOUNTS: AccountProps[] = [
          {
            account_number: "AC-001",
            customer: 1,
            account_type: "savings",
            balance: 5000,
            status: "active",
          },
          {
            account_number: "AC-002",
            customer: 2,
            account_type: "current",
            balance: 12000,
            status: "inactive",
          },
        ];

        const [data] = useState<AccountProps[]>(FAKE_ACCOUNTS);
        const loading = false;
        const error = null;
    },
        // No loading or error states with fakedata
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    header: "Edit",
    cell: ({ row }) => {
      return (
        <div>
          <Link to={`/accounts/edit/${row.original.account_number}`}>
            <LucideIcon name="Pen" size={18} />{" "}
          </Link>
        </div>
      );
    },
  },
];
const Accounts = () => {
  // Use the correct API endpoint to avoid 404s
  const { data, loading, error } = useDataFetch<AccountProps>(
    "api/customers/accounts/"
  );
  // Show loading indicator when loading
  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );

  // handling error
  if (error)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        Error : {error.message}
      </div>
    );
  return (
    <>
      <Breadcrumb
        title="Accounts"
        description="View and manage member accounts"
        homePath="/"
      />{" "}
      <DataTable
        title="Accounts"
        route="/accounts/edit"
        btnTitle="Create Account"
        data={data}
        columns={columns}
        filters="account_number"
      />
    </>
  );
};

export default Accounts;
