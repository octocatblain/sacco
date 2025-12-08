import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

import { useDataFetch } from "@/hooks/useDataFetch";
// componnts
import Spinner from "@/components/Spinner";
import { DataTable } from "@/components/data-table";
import LucideIcon from "@/components/LucideIcon";
// types
import { LoanProps } from "@/types";

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

const Loans = () => {
  const { data, loading, error } = useDataFetch<LoanProps>("loans");
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
  const totals = {
    count: Array.isArray(data) ? data.length : 0,
    totalAmount: Array.isArray(data)
      ? data.reduce((a, d: any) => a + (Number(d.amount) || 0), 0)
      : 0,
    totalBalance: Array.isArray(data)
      ? data.reduce((a, d: any) => a + (Number(d.loan_balance) || 0), 0)
      : 0,
  };

  return (
    <div className="space-y-3">
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
        data={data}
        filters="account"
      />
    </div>
  );
};

export default Loans;
