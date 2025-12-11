import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useState } from "react";
// components
import { DataTable } from "@/components/data-table";
import Spinner from "@/components/Spinner";
import Breadcrumb from "@/components/Breadcrumb"; // Import Breadcrumb
// types
import { TransactionProps } from "@/types";

const columns: ColumnDef<TransactionProps>[] = [
  {
    header: "Customer ID",
    cell: ({ row }) => {
      return (
        <div>
          <Link to={`/customers/view/${row.original.transaction_id}`}>
            {row.original.transaction_id}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "transaction_type",
    header: "Transaction Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "transaction_date",
    header: "Transaction Date",
  },
];

// Fake data for transactions
const FAKE_TRANSACTIONS: TransactionProps[] = [
  {
    transaction_id: "T-001",
    account: "AC-001",
    transaction_type: "deposit",
    amount: 1000,
    transaction_date: "2025-12-01",
  },
  {
    transaction_id: "T-002",
    account: "AC-002",
    transaction_type: "withdrawal",
    amount: 500,
    transaction_date: "2025-12-02",
  },
];

const Transactions = () => {
  const [data] = useState<TransactionProps[]>(FAKE_TRANSACTIONS);
  // No loading or error states with fakedata
  return (
    <>
      <Breadcrumb
        title="Transactions"
        description="Browse and audit transaction history"
        homePath="/"
      />{" "}
      {/* Breadcrumb component */}
      <DataTable
        title="Transactions"
        route="/transactions/edit"
        btnTitle="Create Transaction"
        data={data}
        columns={columns}
        filters="account"
      />
    </>
  );
};

export default Transactions;
