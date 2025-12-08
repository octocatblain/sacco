import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useDataFetch } from "@/hooks/useDataFetch";
import Spinner from "@/components/Spinner";
import { DataTable } from "@/components/data-table";
import LucideIcon from "@/components/LucideIcon";
import { LoanProps } from "@/types";

const columns: ColumnDef<LoanProps>[] = [
  {
    header: "Customer ID",
    cell: ({ row }) => (
      <Link to={`/loans/view/${row.original.loan_id}`} className="text-blue-600 hover:underline">
        {row.original.account}
      </Link>
    ),
  },
  { header: "Loan Type", accessorKey: "loan_type" },
  { header: "Amount", accessorKey: "amount" },
  { header: "Balance", accessorKey: "loan_balance" },
  { header: "Status", accessorKey: "loan_status" },
  {
    header: "Guarantor",
    accessorKey: "guarantor",
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link to={`/loans/edit/${row.original.loan_id}`}>
          <LucideIcon name="Pen" size={18} />
        </Link>
        <Link to={`/loans/view/${row.original.loan_id}`}>
          <LucideIcon name="Eye" size={18} className="text-blue-600"/>
        </Link>
      </div>
    ),
  },
];

const Loans = () => {
  const { data, loading, error } = useDataFetch<LoanProps>("loans");

  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center">
        Error: {error.message}
      </div>
    );

  return (
    <DataTable
      title="Loans"
      btnTitle="Apply Loan"
      route="/loans/edit"
      data={data}
      columns={columns}
      filters="account"
      exportable
    />
  );
};

export default Loans;
