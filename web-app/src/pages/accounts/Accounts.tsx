import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AccountProps } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";
import { DataTable } from "@/components/data-table";
import LucideIcon from "@/components/LucideIcon";

// Fake data for accounts
const FAKE_ACCOUNTS: AccountProps[] = [
  {
    account_number: 1001,
    customer: 1,
    account_type: "Savings",
    balance: 5000,
    status: "Active",
    date_opened: new Date("2023-01-01"),
  },
  {
    account_number: 1002,
    customer: 2,
    account_type: "Current",
    balance: 12000,
    status: "Active",
    date_opened: new Date("2023-02-01"),
  },
];

const columns: ColumnDef<AccountProps>[] = [
  {
    accessorKey: "account_number",
    header: "Account Number",
    cell: ({ row }) => (
      <div>
        <Link to={`/accounts/view/${row.original.account_number}`}>
          {row.original.account_number}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer ID",
  },
  {
    accessorKey: "account_type",
    header: "Account Type",
  },
  {
    accessorKey: "balance",
    header: "Balance",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    header: "Edit",
    cell: ({ row }) => (
      <div>
        <Link to={`/accounts/edit/${row.original.account_number}`}>
          <LucideIcon name="Pen" size={18} />
        </Link>
      </div>
    ),
  },
];
const Accounts = () => {
  const [data] = useState<AccountProps[]>(FAKE_ACCOUNTS);
  return (
    <>
      <Breadcrumb
        title="Accounts"
        description="View and manage member accounts"
        homePath="/"
      />
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
