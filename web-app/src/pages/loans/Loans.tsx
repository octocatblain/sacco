import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

import { useState } from "react";
// componnts
import Spinner from "@/components/Spinner";
import { DataTable } from "@/components/data-table";
import LucideIcon from "@/components/LucideIcon";
// types
import { LoanProps } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";

const columns: ColumnDef<LoanProps>[] = [
  {
    header: "Customer ID",
    cell: ({ row }) => {
      return (
        <div>
          <Link to={`/loans/view/${row.original.loan_id}`}>
            {row.original.account}
          </Link>
        </div>
      );
    },
  },
  {
    header: "Loan Type",
    accessorKey: "loan_type",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Balance",
    accessorKey: "loan_balance",
  },
  {
    header: "Status",
    accessorKey: "loan_status",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <Link to={`/loans/edit/${row.original.loan_id}`}>
            <LucideIcon name="Pen" size={18} />{" "}
          </Link>
        </div>
      );
    },
  },
];

// Fake data for loans
const FAKE_LOANS: LoanProps[] = [
  {
    loan_id: "L-001",
    account: "AC-001",
    loan_type: "personal",
    amount: 10000,
    loan_balance: 5000,
    loan_status: "active",
  },
  {
    loan_id: "L-002",
    account: "AC-002",
    loan_type: "business",
    amount: 20000,
    loan_balance: 12000,
    loan_status: "closed",
  },
];

const Loans = () => {
  const [data] = useState<LoanProps[]>(FAKE_LOANS);
  // No loading or error states with fakedata
  const loansArray: LoanProps[] = data;
  const totals = {
    count: loansArray.length,
    totalAmount: loansArray.reduce(
      (a, d: any) => a + (Number(d?.amount) || 0),
      0
    ),
    totalBalance: loansArray.reduce(
      (a, d: any) => a + (Number(d?.loan_balance) || 0),
      0
    ),
  };

  return (
    <div className="space-y-3">
      <Breadcrumb
        title="Loans"
        description="Manage loan applications and statuses"
        homePath="/loans"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total loans</div>
          <div className="text-lg font-semibold">{totals.count}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total amount</div>
          <div className="text-lg font-semibold">
            {totals.totalAmount.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total balance</div>
          <div className="text-lg font-semibold">
            {totals.totalBalance.toLocaleString()}
          </div>
        </div>
      </div>
      <DataTable
        title="Loans"
        btnTitle="Apply Loan"
        route="/loans/edit"
        columns={columns}
        data={loansArray}
        filters="loan_type"
      />
    </div>
  );
};

export default Loans;
