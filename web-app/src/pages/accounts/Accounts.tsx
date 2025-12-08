import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useDataFetch } from "@/hooks/useDataFetch";
import { AccountProps } from "@/types";
import { DataTable } from "@/components/data-table";
import LucideIcon from "@/components/LucideIcon";
import Spinner from "@/components/Spinner";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<AccountProps>[] = [
  {
    accessorKey: "account_number",
    header: "Account Number",
    cell: ({ row }) => (
      <Link to={`/accounts/view/${row.original.account_number}`} className="text-blue-600 hover:underline font-medium">
        {row.original.account_number}
      </Link>
    ),
  },
  {
    accessorKey: "customer_name",
    header: "Member Name",
    cell: ({ row }) => row.original.customer_name || "N/A",
  },
  {
    accessorKey: "account_type",
    header: "Product",
    cell: ({ row }) => {
      const badges: Record<string, string> = {
        Savings: "bg-green-100 text-green-800",
        Voluntary: "bg-cyan-100 text-cyan-800",
        Fixed: "bg-purple-100 text-purple-800",
        Retirement: "bg-orange-100 text-orange-800",
        Joint: "bg-pink-100 text-pink-800",
        Corporate: "bg-gray-100 text-gray-800",
      };
      return <Badge className={badges[row.original.account_type] || "bg-gray-100"}>{row.original.account_type}</Badge>;
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => formatCurrency(row.original.balance),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const colors: Record<string, string> = {
        Active: "text-green-600 bg-green-50",
        Dormant: "text-yellow-600 bg-yellow-50",
        Suspended: "text-orange-600 bg-orange-50",
        Closed: "text-red-600 bg-red-50",
      };
      return <Badge className={colors[row.original.status] || "bg-gray-100"}>{row.original.status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-3">
        <Link to={`/accounts/view/${row.original.account_number}`}>
          <LucideIcon name="Eye" size={18} className="text-blue-600" />
        </Link>
        <Link to={`/accounts/edit/${row.original.account_number}`}>
          <LucideIcon name="Pen" size={18} className="text-gray-600" />
        </Link>
        <Link to={`/loans/apply?account=${row.original.account_number}`}>
          <LucideIcon name="DollarSign" size={18} className="text-green-600" />
        </Link>
      </div>
    ),
  },
];

const Accounts = () => {
  const { data, loading, error } = useDataFetch<AccountProps[]>("accounts");

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Member Accounts</h1>
          <p className="text-muted-foreground">
            Multi-product savings • Fixed • Voluntary • Retirement • Corporate
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/members/onboard" className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700">
            Digital Onboarding
          </Link>
          <Link to="/accounts/edit" className="border px-5 py-2.5 rounded-lg hover:bg-gray-50">
            Create Account
          </Link>
        </div>
      </div>

      <DataTable
        title="All Accounts"
        data={data ? data.flat() : []}
        columns={columns}
        filters="account_number,customer_name,account_type"
        searchable
        exportable
      />
    </div>
  );
};

export default Accounts;
